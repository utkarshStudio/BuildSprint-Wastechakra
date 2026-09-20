from django.urls import path
from .views import RegisterView, LoginView, ProfileView, RefreshTokenView
from .rewards_views import RewardsCatalogView, RewardRedeemView, RewardHistoryView
from .community_views import CommunityEventListView, CommunityEventJoinView

urlpatterns = [
    path('auth/register/', RegisterView.as_view(), name='register'),
    path('auth/login/', LoginView.as_view(), name='login'),
    path('auth/refresh/', RefreshTokenView.as_view(), name='token-refresh'),
    path('auth/profile/', ProfileView.as_view(), name='profile'),
    path('rewards/', RewardsCatalogView.as_view(), name='rewards-catalog'),
    path('rewards/redeem/', RewardRedeemView.as_view(), name='rewards-redeem'),
    path('rewards/history/', RewardHistoryView.as_view(), name='rewards-history'),
    path('community/events/', CommunityEventListView.as_view(), name='community-events'),
    path('community/events/<str:pk>/join/', CommunityEventJoinView.as_view(), name='community-event-join'),
]
