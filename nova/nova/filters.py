import django_filters
from .models import TradingEquipment,Article

class TradingEquipmentFilter(django_filters.FilterSet):
    class Meta:
        model = TradingEquipment
        fields = ['type', 'name', ]

class ArticleFilter(django_filters.FilterSet):
    class Meta:
        model = Article
        fields = ['author', 'title']