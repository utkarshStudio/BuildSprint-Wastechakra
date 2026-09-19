from rest_framework import status, permissions
from rest_framework.views import APIView
from rest_framework.response import Response
from .models import CommunityEvent
from .serializers import CommunityEventSerializer
from .rewards_service import seed_default_events, register_for_event


class CommunityEventListView(APIView):
    """
    Lists upcoming community events (cleanups, workshops, e-waste drives).
    Publicly accessible; if authenticated, includes personalized `is_joined` status.
    """
    permission_classes = [permissions.AllowAny]

    def get(self, request):
        seed_default_events()
        category = request.query_params.get('category')
        queryset = CommunityEvent.objects.all()
        if category and category != 'All':
            queryset = queryset.filter(category__iexact=category)

        serializer = CommunityEventSerializer(queryset, many=True, context={'request': request})
        return Response({
            "count": queryset.count(),
            "results": serializer.data,
        })


class CommunityEventJoinView(APIView):
    """
    Allows a citizen (or guest) to join an event.
    Awards +50 Chakra Points & daily streak to authenticated citizens.
    """
    permission_classes = [permissions.AllowAny]

    def post(self, request, pk):
        name = request.data.get('name', '')
        phone = request.data.get('phone', '')

        user = request.user if request.user.is_authenticated else None
        success, message, result_data = register_for_event(
            event_id=pk,
            user=user,
            name=name,
            phone=phone,
        )

        if not success:
            return Response({"error": message}, status=status.HTTP_404_NOT_FOUND)

        return Response({
            "success": True,
            "message": message,
            **result_data,
        }, status=status.HTTP_200_OK)
