import uuid
import random
import string
from datetime import timedelta
from django.utils import timezone
from django.db import transaction
from .models import (
    UserProfile,
    ChakraPointTransaction,
    RewardCatalogItem,
    RewardRedemption,
    CommunityEvent,
    CommunityEventRegistration,
)


STREAK_MILESTONES = {
    3: 25,    # 3-day streak -> +25 bonus points
    7: 50,    # 7-day streak -> +50 bonus points
    14: 100,  # 14-day streak -> +100 bonus points
    30: 250,  # 30-day streak -> +250 bonus points
}


def generate_voucher_code(prefix="WC-ECO"):
    chars = string.ascii_uppercase + string.digits
    suffix = "".join(random.choices(chars, k=6))
    return f"{prefix}-{suffix}"


def award_points_and_streak(user, points, activity_type, description="", reference_id=""):
    """
    Atomically awards Chakra points to the user, updates their daily streak
    according to calendar continuity, evaluates milestone bonuses,
    and logs a transaction ledger record.
    """
    if not user or not user.is_authenticated:
        return None

    with transaction.atomic():
        profile, _ = UserProfile.objects.select_for_update().get_or_create(user=user)
        today = timezone.localdate()
        last_date = profile.last_activity_date

        # 1. Calculate Streak Continuity
        bonus_points = 0
        milestone_reached = False
        streak_status = "EXTENDED"

        if last_date == today:
            # Already active today; streak maintained
            streak_status = "EXTENDED"
        elif last_date == today - timedelta(days=1):
            # Consecutive day! Increment streak
            profile.streak_days = (profile.streak_days or 0) + 1
            streak_status = "INCREMENTED"
        else:
            # First activity or missed a day; reset streak to 1
            profile.streak_days = 1
            streak_status = "STARTED"

        profile.last_activity_date = today

        # 2. Check Streak Milestone Bonus
        if streak_status == "INCREMENTED" and profile.streak_days in STREAK_MILESTONES:
            bonus_points = STREAK_MILESTONES[profile.streak_days]
            milestone_reached = True

        total_points_added = max(0, int(points)) + bonus_points

        # 3. Update Balance
        profile.chakra_points = (profile.chakra_points or 0) + total_points_added
        profile.save()

        # 4. Record Ledger Transaction
        desc = description or f"Points earned for {activity_type}"
        if bonus_points > 0:
            desc += f" (+{bonus_points} Streak Milestone Bonus!)"

        ChakraPointTransaction.objects.create(
            user=user,
            points=total_points_added,
            balance_after=profile.chakra_points,
            transaction_type=ChakraPointTransaction.TransactionType.EARNED,
            activity_type=activity_type,
            description=desc,
            reference_id=str(reference_id) if reference_id else "",
        )

        return {
            "points_awarded": points,
            "bonus_points": bonus_points,
            "total_points_added": total_points_added,
            "current_points": profile.chakra_points,
            "streak_days": profile.streak_days,
            "streak_status": streak_status,
            "milestone_reached": milestone_reached,
        }


def redeem_reward(user, reward_id):
    """
    Atomically validates user balance and stock, deducts points,
    generates a unique voucher code, creates redemption and ledger entries.
    """
    if not user or not user.is_authenticated:
        raise ValueError("User must be authenticated to redeem rewards.")

    with transaction.atomic():
        profile, _ = UserProfile.objects.select_for_update().get_or_create(user=user)
        try:
            reward = RewardCatalogItem.objects.select_for_update().get(id=reward_id, is_active=True)
        except RewardCatalogItem.DoesNotExist:
            raise ValueError("Reward not found or is currently inactive.")

        if reward.stock == 0:
            raise ValueError(f"'{reward.title}' is currently out of stock.")

        if profile.chakra_points < reward.cost:
            raise ValueError(f"Insufficient Chakra points. Required: {reward.cost}, Available: {profile.chakra_points}")

        # Deduct points
        profile.chakra_points -= reward.cost
        profile.save()

        # Decrement stock if finite
        if reward.stock > 0:
            reward.stock -= 1
            reward.save()

        # Generate unique voucher code
        voucher_code = generate_voucher_code()
        while RewardRedemption.objects.filter(voucher_code=voucher_code).exists():
            voucher_code = generate_voucher_code()

        expires_at = timezone.now() + timedelta(days=90)
        redemption = RewardRedemption.objects.create(
            user=user,
            reward=reward,
            points_spent=reward.cost,
            voucher_code=voucher_code,
            status=RewardRedemption.Status.ACTIVE,
            expires_at=expires_at,
        )

        # Log ledger entry
        ChakraPointTransaction.objects.create(
            user=user,
            points=-reward.cost,
            balance_after=profile.chakra_points,
            transaction_type=ChakraPointTransaction.TransactionType.REDEEMED,
            activity_type=ChakraPointTransaction.ActivityType.REWARD_REDEMPTION,
            description=f"Redeemed: {reward.title}",
            reference_id=str(redemption.id),
        )

        return {
            "redemption": redemption,
            "remaining_points": profile.chakra_points,
            "voucher_code": voucher_code,
            "expires_at": expires_at,
            "reward_title": reward.title,
        }


def seed_default_rewards():
    """Seeds default realistic green rewards if catalog is empty."""
    if RewardCatalogItem.objects.exists():
        return

    defaults = [
        {
            "id": "eco-voucher-50",
            "title": "₹50 Eco-Store Voucher",
            "description": "Instant digital coupon redeemable at zero-waste partner groceries and stores.",
            "cost": 500,
            "category": RewardCatalogItem.Category.VOUCHER,
            "icon": "card_giftcard",
            "stock": 100,
            "partner_name": "EcoBazaar India",
        },
        {
            "id": "plant-mangrove-tree",
            "title": "Plant a Mangrove Tree",
            "description": "We plant a verified native mangrove tree in the Sundarbans with Geo-tagging in your name.",
            "cost": 350,
            "category": RewardCatalogItem.Category.DONATION,
            "icon": "nature",
            "stock": -1,
            "partner_name": "GrowGreen Foundation",
        },
        {
            "id": "bamboo-toothbrush-kit",
            "title": "Zero-Waste Bamboo Oral Kit",
            "description": "Set of 4 compostable bamboo toothbrushes and organic neem mint paste delivered to you.",
            "cost": 650,
            "category": RewardCatalogItem.Category.MERCHANDISE,
            "icon": "eco",
            "stock": 45,
            "partner_name": "TerraPure Lifestyle",
        },
        {
            "id": "stainless-steel-bottle",
            "title": "Insulated Steel Water Flask",
            "description": "750ml high-grade food steel thermos keeping water chilled 24h, laser etched with WasteChakra logo.",
            "cost": 1100,
            "category": RewardCatalogItem.Category.MERCHANDISE,
            "icon": "water_drop",
            "stock": 25,
            "partner_name": "WasteChakra Gear",
        },
        {
            "id": "home-compost-starter-kit",
            "title": "Smart Home Compost Starter Kit",
            "description": "Aerated kitchen countertop bokashi bin with 1kg microorganism compost inoculant.",
            "cost": 1500,
            "category": RewardCatalogItem.Category.MERCHANDISE,
            "icon": "recycling",
            "stock": 18,
            "partner_name": "SoilCycle Labs",
        },
        {
            "id": "circular-economy-workshop",
            "title": "Circular Design Masterclass Pass",
            "description": "Live VIP virtual workshop pass with green architects on zero-landfill urban living.",
            "cost": 800,
            "category": RewardCatalogItem.Category.EXPERIENCE,
            "icon": "school",
            "stock": 50,
            "partner_name": "WasteChakra Academy",
        },
    ]

    for d in defaults:
        RewardCatalogItem.objects.create(**d)


def seed_default_events():
    """Seeds the 6 initial community events if table is empty."""
    if CommunityEvent.objects.exists():
        return

    default_events = [
        {
            "id": "1",
            "title": "Purnia Riverbank Shoreline Cleanup",
            "category": "Cleanup",
            "location": "Saura River Ghat, Purnia",
            "date": "Next Saturday · 7:00 AM - 10:00 AM",
            "participants": 64,
            "target_kg": 450,
            "waste_recovered_kg": 120,
            "description": "Clearing plastic packaging and debris along the ghat. Safety gloves, bags, and tea provided.",
            "reward_points": 50,
            "status": CommunityEvent.Status.OPEN,
        },
        {
            "id": "2",
            "title": "Mega E-Waste & Battery Drop-off Drive",
            "category": "Collection",
            "location": "City Center Market, Main Square",
            "date": "This Sunday · 9:00 AM - 4:00 PM",
            "participants": 112,
            "target_kg": 800,
            "waste_recovered_kg": 340,
            "description": "Bring old chargers, dead laptops, televisions, and batteries. Instant scrap payout & e-waste cert.",
            "reward_points": 50,
            "status": CommunityEvent.Status.OPEN,
        },
        {
            "id": "3",
            "title": "Zero-Odor Home Composting Workshop",
            "category": "Workshops",
            "location": "Botanical Garden Community Hall",
            "date": "Sep 20, 2026 · 11:00 AM - 1:00 PM",
            "participants": 48,
            "target_kg": 120,
            "waste_recovered_kg": 0,
            "description": "Hands-on training on converting kitchen food scraps into black-gold soil fertilizer in balconies.",
            "reward_points": 30,
            "status": CommunityEvent.Status.OPEN,
        },
        {
            "id": "4",
            "title": "Ward 14 Residential Plastic-Free Drive",
            "category": "Cleanup",
            "location": "Green Valley Colony Park",
            "date": "Sep 27, 2026 · 8:00 AM - 11:00 AM",
            "participants": 75,
            "target_kg": 350,
            "waste_recovered_kg": 90,
            "description": "Community door-to-door awareness walk and single-use plastic collection with school students.",
            "reward_points": 50,
            "status": CommunityEvent.Status.OPEN,
        },
        {
            "id": "5",
            "title": "Old Clothes & Textile Upcycling Drive",
            "category": "Collection",
            "location": "Civic Center Auditorium",
            "date": "Oct 04, 2026 · 10:00 AM - 5:00 PM",
            "participants": 89,
            "target_kg": 620,
            "waste_recovered_kg": 210,
            "description": "Donate unwearable worn-out clothes for industrial shredding into acoustic insulation & mattress felt.",
            "reward_points": 50,
            "status": CommunityEvent.Status.OPEN,
        },
        {
            "id": "6",
            "title": "School Green Champions Segregation Fair",
            "category": "Workshops",
            "location": "DAV Public School Campus",
            "date": "Oct 11, 2026 · 9:30 AM - 1:30 PM",
            "participants": 140,
            "target_kg": 200,
            "waste_recovered_kg": 0,
            "description": "Fun interactive games teaching children how to sort wet, dry, and domestic hazardous waste.",
            "reward_points": 40,
            "status": CommunityEvent.Status.OPEN,
        },
    ]

    for ev in default_events:
        CommunityEvent.objects.create(**ev)


def register_for_event(event_id, user=None, name="", phone=""):
    """
    Registers a user (or guest) for a community event,
    increments participant count, and awards Chakra points and streak to registered citizens.
    """
    from django.db.models import F

    seed_default_events()

    try:
        event = CommunityEvent.objects.get(id=event_id)
    except CommunityEvent.DoesNotExist:
        return False, "Event not found", None

    with transaction.atomic():
        if user and user.is_authenticated:
            existing = CommunityEventRegistration.objects.filter(event=event, user=user).first()
            if existing:
                return True, "Already joined this event", {
                    "event_id": event.id,
                    "participants": event.participants,
                    "already_joined": True,
                }

            CommunityEventRegistration.objects.create(
                event=event,
                user=user,
                name=name or user.get_full_name() or user.email,
                phone=phone or getattr(user, 'phone_number', ''),
            )
        else:
            # Guest registration
            CommunityEventRegistration.objects.create(
                event=event,
                user=None,
                name=name or "Guest Volunteer",
                phone=phone or "",
            )

        # Increment participant count
        event.participants = F('participants') + 1
        event.save(update_fields=['participants'])
        event.refresh_from_db()

        # Award points & streak if authenticated
        reward_info = None
        if user and user.is_authenticated:
            reward_info = award_points_and_streak(
                user=user,
                points=event.reward_points or 50,
                activity_type=ChakraPointTransaction.ActivityType.COMMUNITY_CLEANUP,
                description=f"Registered for community event: {event.title}",
                reference_id=str(event.id),
            )

    return True, "Successfully registered for event!", {
        "event_id": event.id,
        "title": event.title,
        "participants": event.participants,
        "already_joined": False,
        "reward_info": reward_info,
    }
