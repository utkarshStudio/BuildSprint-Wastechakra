from rest_framework import permissions, status
from rest_framework.views import APIView
from rest_framework.response import Response
from .models import RewardCatalogItem, RewardRedemption, ChakraPointTransaction
from .serializers import (
    RewardCatalogItemSerializer,
    RewardRedemptionSerializer,
    ChakraPointTransactionSerializer,
)
from .rewards_service import (
    award_points_and_streak,
    redeem_reward,
    seed_default_rewards,
)


class RewardsCatalogView(APIView):
    """
    Returns the active rewards catalog along with the requesting user's
    current Chakra points, streak days, and available eco-credits.
    """
    permission_classes = [permissions.AllowAny]

    def get(self, request):
        seed_default_rewards()
        catalog = RewardCatalogItem.objects.filter(is_active=True)
        serializer = RewardCatalogItemSerializer(catalog, many=True)

        user_info = {
            "chakra_points": 0,
            "streak_days": 0,
            "last_activity_date": None,
            "total_redemptions": 0,
        }

        if request.user and request.user.is_authenticated:
            try:
                profile = request.user.profile
                user_info["chakra_points"] = profile.chakra_points
                user_info["streak_days"] = profile.streak_days
                user_info["last_activity_date"] = profile.last_activity_date
                user_info["total_redemptions"] = RewardRedemption.objects.filter(user=request.user).count()
            except Exception:
                pass

        return Response({
            "catalog": serializer.data,
            "user": user_info,
        })


class RewardRedeemView(APIView):
    """
    Atomically redeems a catalog item for the authenticated citizen.
    Deducts points, creates a unique digital voucher code, and returns redemption details.
    """
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        reward_id = request.data.get("reward_id")
        if not reward_id:
            return Response({"error": "reward_id is required."}, status=status.HTTP_400_BAD_REQUEST)

        try:
            result = redeem_reward(request.user, reward_id)
            redemption_data = RewardRedemptionSerializer(result["redemption"]).data
            return Response({
                "message": f"Successfully redeemed '{result['reward_title']}'!",
                "redemption": redemption_data,
                "voucher_code": result["voucher_code"],
                "remaining_points": result["remaining_points"],
                "expires_at": result["expires_at"],
            }, status=status.HTTP_201_CREATED)
        except ValueError as err:
            return Response({"error": str(err)}, status=status.HTTP_400_BAD_REQUEST)
        except Exception as err:
            return Response({"error": f"Failed to redeem reward: {str(err)}"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class RewardHistoryView(APIView):
    """
    Returns the authenticated user's points ledger (transactions) and active redeemed vouchers.
    """
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        transactions = ChakraPointTransaction.objects.filter(user=request.user)[:50]
        redemptions = RewardRedemption.objects.filter(user=request.user)

        return Response({
            "transactions": ChakraPointTransactionSerializer(transactions, many=True).data,
            "redemptions": RewardRedemptionSerializer(redemptions, many=True).data,
        })
