import uuid
from datetime import datetime, timedelta
from django.utils import timezone
from django.core.management.base import BaseCommand
from django.contrib.auth import get_user_model
from apps.accounts.models import UserProfile, CollectorProfile, BusinessProfile
from apps.pickups.models import WasteReport, Pickup, WastePassport

User = get_user_model()


class Command(BaseCommand):
    help = "Seed demo data for WasteChakra"

    def handle(self, *args, **options):
        email = "admin@wastechakra.com"
        if not User.objects.filter(email=email).exists():
            user = User.objects.create_superuser(
                email=email,
                username="admin",
                password="admin12345",
                role="SUPER_ADMIN",
                first_name="Admin",
                last_name="WasteChakra",
            )
            UserProfile.objects.create(user=user, phone="+910000000000", city="Metro")
            self.stdout.write("Created super admin")

        demo_citizen = self._get_or_create_user(
            "citizen@wastechakra.com", "citizen", "Citizen", "Demo", "CITIZEN"
        )
        demo_collector = self._get_or_create_user(
            "collector@wastechakra.com", "collector", "Ravi", "Kumar", "COLLECTOR"
        )
        demo_business = self._get_or_create_user(
            "business@wastechakra.com", "business", "Business", "Demo", "BUSINESS"
        )
        demo_facility = self._get_or_create_user(
            "facility@wastechakra.com", "facility", "Facility", "Manager", "FACILITY_MANAGER"
        )

        collector_profile, _ = CollectorProfile.objects.get_or_create(user=demo_collector)
        collector_profile.vehicle_type = "VAN"
        collector_profile.vehicle_number = "WB-24-XX-1234"
        collector_profile.is_active = True
        collector_profile.save()

        citizen_profile, _ = UserProfile.objects.get_or_create(user=demo_citizen)
        citizen_profile.chakra_points = 1280
        citizen_profile.total_waste_submitted_kg = 127
        citizen_profile.total_waste_recovered_kg = 104
        citizen_profile.streak_days = 7
        citizen_profile.phone = "+919999999999"
        citizen_profile.city = "Metro"
        citizen_profile.save()

        # Seed Business Profile & realistic commercial dispatches
        self._seed_business_data(demo_business, demo_collector)

        if not WasteReport.objects.exists():
            reports = [
                {
                    "report_id": "WC-1048", "user": demo_citizen,
                    "waste_type": "MIXED", "urgency": "HIGH",
                    "estimated_quantity": "20-50", "status": "REPORTED",
                    "latitude": 12.9716, "longitude": 77.5946,
                    "address": "123 Green Street, Eco District",
                    "description": "Mixed household waste pile near entrance",
                },
                {
                    "report_id": "WC-1049", "user": demo_citizen,
                    "waste_type": "PLASTIC", "urgency": "NORMAL",
                    "estimated_quantity": "5-20", "status": "PICKUP_SCHEDULED",
                    "latitude": 12.9720, "longitude": 77.5960,
                    "address": "456 Green Street, Eco District",
                    "description": "Plastic bottles collected from community drive",
                },
                {
                    "report_id": "WC-1050", "user": demo_business,
                    "waste_type": "E_WASTE", "urgency": "URGENT",
                    "estimated_quantity": "50-100", "status": "PICKUP_SCHEDULED",
                    "latitude": 12.9750, "longitude": 77.6000,
                    "address": "Tech Park Building 4, Hardware Loop",
                    "description": "Retired computers and batteries for certified recycling",
                },
            ]
            for data in reports:
                WasteReport.objects.create(**data)
            self.stdout.write(f"Created {len(reports)} waste reports")

        if not Pickup.objects.exists():
            pickups = [
                {
                    "pickup_id": "WC-2026-000284", "user": demo_citizen,
                    "waste_type": "MIXED", "pickup_type": "HOME",
                    "status": "EN_ROUTE", "pickup_date": datetime.now().date(),
                    "time_slot": "Morning (9-12)", "latitude": 12.9716, "longitude": 77.5946,
                    "address": "123 Green Street, Eco District",
                    "collector": demo_collector,
                },
                {
                    "pickup_id": "WC-2026-000283", "user": demo_citizen,
                    "waste_type": "RECYCLABLES", "pickup_type": "HOME",
                    "status": "COMPLETED", "pickup_date": datetime.now().date() - timedelta(days=2),
                    "time_slot": "Afternoon (12-3)", "latitude": 12.9720, "longitude": 77.5960,
                    "address": "456 Green Street, Eco District",
                    "collector": demo_collector, "actual_weight_kg": 12.5,
                    "completed_at": timezone.now() - timedelta(days=2),
                },
            ]
            for data in pickups:
                Pickup.objects.create(**data)
            self.stdout.write(f"Created citizen pickups")

        if not WastePassport.objects.filter(pickup__pickup_id="WC-2026-000283").exists() and Pickup.objects.filter(pickup_id="WC-2026-000283").exists():
            WastePassport.objects.create(
                passport_id="WP-2026-000001",
                pickup=Pickup.objects.get(pickup_id="WC-2026-000283"),
                origin="RESIDENTIAL",
                input_weight_kg=12.5,
                plastic_recovered_kg=3.2,
                paper_recovered_kg=2.1,
                organic_recovered_kg=4.4,
                metal_recovered_kg=0.8,
                rdf_produced_kg=1.5,
                inert_kg=0.3,
                residual_kg=0.2,
                processing_status="COMPLETED",
                completed_at=timezone.now() - timedelta(days=1),
            )

        self.stdout.write(self.style.SUCCESS("Demo data seeded successfully"))
        self.stdout.write("Passwords (all): admin12345")
        self.stdout.write("Users: admin@wastechakra.com, citizen@wastechakra.com, collector@wastechakra.com, business@wastechakra.com, facility@wastechakra.com")

    def _seed_business_data(self, demo_business, demo_collector):
        # 1. Setup BusinessProfile
        bp, _ = BusinessProfile.objects.get_or_create(
            user=demo_business,
            defaults={
                "company_name": "GreenTech Enterprise Hub",
                "gstin": "07AAAAA1234A1Z5",
                "phone": "+91 98765 43210",
                "address": "Plot 42, Green Earth Industrial Estate, Eco-Zone 1",
                "address_line1": "Plot 42, Green Earth Industrial Estate",
                "address_line2": "Eco-Zone 1",
                "city": "Noida",
                "state": "Uttar Pradesh",
                "pincode": "201309",
                "industry_type": "CORPORATE",
                "epr_registered": True,
                "is_verified": True,
            }
        )

        # 2. Setup UserProfile stats for demo_business
        b_profile, _ = UserProfile.objects.get_or_create(user=demo_business)
        b_profile.total_waste_submitted_kg = 14850.0
        b_profile.total_waste_recovered_kg = 13220.0
        b_profile.chakra_points = 8450
        b_profile.streak_days = 14
        b_profile.phone = "+91 98765 43210"
        b_profile.city = "Noida"
        b_profile.save()

        # 3. Seed realistic commercial bulk pickups if none exist
        existing_count = Pickup.objects.filter(user=demo_business).count()
        if existing_count < 5:
            now = timezone.now()
            today = now.date()

            commercial_shipments = [
                {
                    "pickup_id": "WC-2026-B001",
                    "waste_type": "PAPER",
                    "status": "REQUESTED",
                    "pickup_date": today + timedelta(days=1),
                    "time_slot": "Morning (9-12)",
                    "estimated_quantity": "450 kg",
                    "address": "Plot 42, Gate 3 Loading Bay, Green Earth Industrial Estate, Noida",
                    "collector": None,
                },
                {
                    "pickup_id": "WC-2026-B002",
                    "waste_type": "E_WASTE",
                    "status": "ASSIGNED",
                    "pickup_date": today,
                    "time_slot": "Afternoon (12-3)",
                    "estimated_quantity": "880 kg",
                    "address": "Plot 42, Server Wing B, Green Earth Industrial Estate, Noida",
                    "collector": demo_collector,
                },
                {
                    "pickup_id": "WC-2026-B003",
                    "waste_type": "PLASTIC",
                    "status": "EN_ROUTE",
                    "pickup_date": today,
                    "time_slot": "Morning (9-12)",
                    "estimated_quantity": "620 kg",
                    "address": "Plot 42, Warehouse Dispatch Bay 1, Noida",
                    "collector": demo_collector,
                },
                {
                    "pickup_id": "WC-2026-B004",
                    "waste_type": "ORGANIC",
                    "status": "PROCESSING",
                    "pickup_date": today - timedelta(days=2),
                    "time_slot": "Morning (9-12)",
                    "estimated_quantity": "340 kg",
                    "actual_weight_kg": 355.0,
                    "address": "Plot 42, Cafeteria Service Dock, Noida",
                    "collector": demo_collector,
                },
                {
                    "pickup_id": "WC-2026-B005",
                    "waste_type": "RECYCLABLES",
                    "status": "COMPLETED",
                    "pickup_date": today - timedelta(days=7),
                    "time_slot": "Morning (9-12)",
                    "estimated_quantity": "1200 kg",
                    "actual_weight_kg": 1280.0,
                    "address": "Plot 42, Green Earth Industrial Estate, Noida",
                    "collector": demo_collector,
                    "completed_at": now - timedelta(days=7),
                    "passport": {
                        "passport_id": "WP-2026-B00001",
                        "plastic_recovered_kg": 480.0,
                        "paper_recovered_kg": 510.0,
                        "metal_recovered_kg": 190.0,
                        "rdf_produced_kg": 60.0,
                        "residual_kg": 40.0,
                    }
                },
                {
                    "pickup_id": "WC-2026-B006",
                    "waste_type": "PLASTIC",
                    "status": "COMPLETED",
                    "pickup_date": today - timedelta(days=15),
                    "time_slot": "Afternoon (12-3)",
                    "estimated_quantity": "1800 kg",
                    "actual_weight_kg": 1850.0,
                    "address": "Plot 42, Green Earth Industrial Estate, Noida",
                    "collector": demo_collector,
                    "completed_at": now - timedelta(days=15),
                    "passport": {
                        "passport_id": "WP-2026-B00002",
                        "plastic_recovered_kg": 1690.0,
                        "paper_recovered_kg": 0.0,
                        "metal_recovered_kg": 0.0,
                        "rdf_produced_kg": 110.0,
                        "residual_kg": 50.0,
                    }
                },
                {
                    "pickup_id": "WC-2026-B007",
                    "waste_type": "E_WASTE",
                    "status": "COMPLETED",
                    "pickup_date": today - timedelta(days=25),
                    "time_slot": "Morning (9-12)",
                    "estimated_quantity": "950 kg",
                    "actual_weight_kg": 965.0,
                    "address": "Plot 42, Hardware Research Wing, Noida",
                    "collector": demo_collector,
                    "completed_at": now - timedelta(days=25),
                    "passport": {
                        "passport_id": "WP-2026-B00003",
                        "plastic_recovered_kg": 240.0,
                        "paper_recovered_kg": 50.0,
                        "metal_recovered_kg": 580.0,
                        "rdf_produced_kg": 45.0,
                        "residual_kg": 50.0,
                    }
                },
                {
                    "pickup_id": "WC-2026-B008",
                    "waste_type": "PAPER",
                    "status": "COMPLETED",
                    "pickup_date": today - timedelta(days=35),
                    "time_slot": "Evening (3-6)",
                    "estimated_quantity": "2200 kg",
                    "actual_weight_kg": 2310.0,
                    "address": "Plot 42, Central Archives & Packaging Hub, Noida",
                    "collector": demo_collector,
                    "completed_at": now - timedelta(days=35),
                    "passport": {
                        "passport_id": "WP-2026-B00004",
                        "plastic_recovered_kg": 0.0,
                        "paper_recovered_kg": 2240.0,
                        "metal_recovered_kg": 0.0,
                        "rdf_produced_kg": 50.0,
                        "residual_kg": 20.0,
                    }
                },
            ]

            for s in commercial_shipments:
                pass_data = s.pop("passport", None)
                p = Pickup.objects.create(
                    user=demo_business,
                    pickup_type="BUSINESS",
                    latitude=28.5355,
                    longitude=77.3910,
                    **s,
                )
                if pass_data:
                    wp, _ = WastePassport.objects.get_or_create(pickup=p)
                    wp.passport_id = pass_data["passport_id"]
                    wp.origin = "COMMERCIAL"
                    wp.input_weight_kg = p.actual_weight_kg or 1000.0
                    wp.plastic_recovered_kg = pass_data.get("plastic_recovered_kg", 0)
                    wp.paper_recovered_kg = pass_data.get("paper_recovered_kg", 0)
                    wp.organic_recovered_kg = pass_data.get("organic_recovered_kg", 0)
                    wp.metal_recovered_kg = pass_data.get("metal_recovered_kg", 0)
                    wp.rdf_produced_kg = pass_data.get("rdf_produced_kg", 0)
                    wp.residual_kg = pass_data.get("residual_kg", 0)
                    wp.processing_status = "COMPLETED"
                    wp.completed_at = p.completed_at or now
                    wp.save()
            self.stdout.write(f"Created {len(commercial_shipments)} commercial dispatches with Waste Passports")

    def _get_or_create_user(self, email, username, first, last, role):
        user, created = User.objects.get_or_create(
            email=email,
            defaults={
                "username": username,
                "first_name": first,
                "last_name": last,
                "role": role,
            },
        )
        if created:
            user.set_password("admin12345")
            user.save()
            UserProfile.objects.create(user=user)
            self.stdout.write(f"Created {role} user: {email}")
        return user
