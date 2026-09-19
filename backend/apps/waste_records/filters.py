import django_filters
from .models import WasteRecord


class WasteRecordFilter(django_filters.FilterSet):
    final_category = django_filters.CharFilter(field_name="final_category", lookup_expr="iexact")
    start_date = django_filters.DateTimeFilter(field_name="processed_at", lookup_expr="gte")
    end_date = django_filters.DateTimeFilter(field_name="processed_at", lookup_expr="lte")

    class Meta:
        model = WasteRecord
        fields = ["final_category", "start_date", "end_date"]
