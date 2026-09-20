from datetime import timedelta
from django.utils import timezone
from django.contrib.auth import get_user_model
from rest_framework.test import APITestCase
from rest_framework import status
from apps.accounts.models import (
    UserProfile,
    RewardCatalogItem,
    RewardRedemption,
    ChakraPointTransaction,
)
from apps.accounts.rewards_service import (
    award_points_and_streak,
    redeem_reward,
    seed_default_rewards,
)

User = get_user_model()


class RewardsAndStreakTestCase(APITestCase):
    def setUp(self):
        self.user = User.objects.create_user(
            email="citizen_test@wastechakra.org",
            username="citizen_test",
            password="Password123!",
            role="CITIZEN",
        )
        self.profile = UserProfile.objects.create(
            user=self.user,
            chakra_points=1000,
            streak_days=1,
            last_activity_date=timezone.localdate() - timedelta(days=1),
        )
        seed_default_rewards()
        self.reward = RewardCatalogItem.objects.first()

    def test_streak_increment_on_consecutive_day(self):
        result = award_points_and_streak(
            user=self.user,
            points=50,
            activity_type="WASTE_REPORT",
            description="Test waste report",
        )
        self.profile.refresh_from_db()
        self.assertEqual(self.profile.streak_days, 2)
        self.assertEqual(self.profile.chakra_points, 1050)
        self.assertEqual(result["streak_status"], "INCREMENTED")
        self.assertEqual(result["current_points"], 1050)

    def test_streak_maintained_on_same_day(self):
        # First activity today
        award_points_and_streak(self.user, 50, "WASTE_REPORT")
        # Second activity today
        result = award_points_and_streak(self.user, 15, "IMAGE_SCAN")
        self.profile.refresh_from_db()
        self.assertEqual(self.profile.streak_days, 2)
        self.assertEqual(self.profile.chakra_points, 1065)
        self.assertEqual(result["streak_status"], "EXTENDED")

    def test_streak_reset_on_missed_day(self):
        # Set last activity 3 days ago
        self.profile.last_activity_date = timezone.localdate() - timedelta(days=3)
        self.profile.streak_days = 15
        self.profile.save()

        result = award_points_and_streak(self.user, 50, "WASTE_REPORT")
        self.profile.refresh_from_db()
        self.assertEqual(self.profile.streak_days, 1)
        self.assertEqual(result["streak_status"], "STARTED")

    def test_redeem_reward_success(self):
        cost = self.reward.cost
        initial_points = self.profile.chakra_points
        result = redeem_reward(self.user, self.reward.id)

        self.profile.refresh_from_db()
        self.assertEqual(self.profile.chakra_points, initial_points - cost)
        self.assertTrue(result["voucher_code"].startswith("WC-ECO-"))
        self.assertTrue(RewardRedemption.objects.filter(user=self.user, voucher_code=result["voucher_code"]).exists())
        self.assertTrue(ChakraPointTransaction.objects.filter(
            user=self.user,
            transaction_type=ChakraPointTransaction.TransactionType.REDEEMED,
        ).exists())

    def test_redeem_reward_insufficient_points(self):
        self.profile.chakra_points = 10
        self.profile.save()

        with self.assertRaises(ValueError):
            redeem_reward(self.user, self.reward.id)

    def test_rewards_catalog_api(self):
        self.client.force_authenticate(user=self.user)
        response = self.client.get("/api/v1/rewards/")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn("catalog", response.data)
        self.assertIn("user", response.data)
        self.assertEqual(response.data["user"]["chakra_points"], 1000)

    def test_rewards_redeem_api(self):
        self.client.force_authenticate(user=self.user)
        response = self.client.post("/api/v1/rewards/redeem/", {"reward_id": self.reward.id})
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertIn("voucher_code", response.data)
        self.assertIn("remaining_points", response.data)

    def test_rewards_history_api(self):
        self.client.force_authenticate(user=self.user)
        award_points_and_streak(self.user, 50, "WASTE_REPORT")
        redeem_reward(self.user, self.reward.id)

        response = self.client.get("/api/v1/rewards/history/")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertGreaterEqual(len(response.data["transactions"]), 2)
        self.assertEqual(len(response.data["redemptions"]), 1)

    def test_community_events_listing(self):
        response = self.client.get("/api/v1/community/events/")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["count"], 6)
        # Check Purnia Riverbank Shoreline Cleanup
        purnia_event = next(e for e in response.data["results"] if e["id"] == "1")
        self.assertEqual(purnia_event["title"], "Purnia Riverbank Shoreline Cleanup")
        self.assertEqual(purnia_event["participants"], 64)
        self.assertEqual(purnia_event["is_joined"], False)

    def test_community_event_join(self):
        self.client.force_authenticate(user=self.user)
        # Join Purnia Riverbank event
        response = self.client.post("/api/v1/community/events/1/join/")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["participants"], 65)
        self.assertFalse(response.data["already_joined"])

        # Check that user earned +50 points and streak
        self.profile.refresh_from_db()
        self.assertEqual(self.profile.chakra_points, 1050)

        # Joining again returns already_joined=True without double counting
        repeat_resp = self.client.post("/api/v1/community/events/1/join/")
        self.assertEqual(repeat_resp.status_code, status.HTTP_200_OK)
        self.assertTrue(repeat_resp.data["already_joined"])
        self.assertEqual(repeat_resp.data["participants"], 65)
