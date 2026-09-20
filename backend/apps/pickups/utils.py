import math
from django.contrib.auth import get_user_model
from apps.accounts.models import CollectorProfile

User = get_user_model()


def calculate_haversine_distance(lat1, lon1, lat2, lon2):
    """
    Calculate the great circle distance between two points 
    on the earth in kilometers.
    """
    if None in (lat1, lon1, lat2, lon2):
        return None
    try:
        lat1, lon1, lat2, lon2 = float(lat1), float(lon1), float(lat2), float(lon2)
    except (ValueError, TypeError):
        return None

    R = 6371.0  # Earth radius in KM

    dlat = math.radians(lat2 - lat1)
    dlon = math.radians(lon2 - lon1)
    a = (math.sin(dlat / 2.0) ** 2 +
         math.cos(math.radians(lat1)) * math.cos(math.radians(lat2)) *
         math.sin(dlon / 2.0) ** 2)
    c = 2.0 * math.atan2(math.sqrt(a), math.sqrt(1.0 - a))
    distance = R * c
    return round(distance, 2)


def find_nearest_collector(lat, lng, exclude_user_ids=None):
    """
    Finds the nearest active online collector to given coordinates.
    Returns tuple: (nearest_user, distance_km) or (None, None).
    """
    if exclude_user_ids is None:
        exclude_user_ids = []

    active_collectors = CollectorProfile.objects.filter(
        is_active=True,
        current_lat__isnull=False,
        current_lng__isnull=False,
    ).exclude(user_id__in=exclude_user_ids).select_related('user')

    if not active_collectors.exists():
        # Fallback: pick any active collector not in exclude list
        fallback = CollectorProfile.objects.filter(
            is_active=True
        ).exclude(user_id__in=exclude_user_ids).select_related('user').first()
        if fallback:
            return fallback.user, None
        return None, None

    best_collector = None
    min_dist = float('inf')

    for cp in active_collectors:
        dist = calculate_haversine_distance(lat, lng, cp.current_lat, cp.current_lng)
        if dist is not None and dist < min_dist:
            min_dist = dist
            best_collector = cp.user

    if best_collector:
        return best_collector, min_dist
    return None, None
