from nova.permissions import IsGetOrIsAdmin
from rest_framework.viewsets import ModelViewSet
from nova.models import TradingEquipment
from nova.serializers import TradingEquipmentSerializer
from nova.filters import TradingEquipmentFilter


class TradingEquipmentViewSet(ModelViewSet):
    queryset = TradingEquipment.objects.all()
    serializer_class = TradingEquipmentSerializer
    permission_classes = [IsGetOrIsAdmin]
    filterset_class = TradingEquipmentFilter


