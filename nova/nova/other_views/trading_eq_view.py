
from rest_framework import permissions
from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.exceptions import NotFound
from rest_framework.response import Response

from ..models import TradingEquipment
from ..serializers import TradingEquipmentSerializer

# TRADING EQUIPMENTS ARE READ ONLY. THEY ARE CREATED AFTER EXTERNAL API REQUESTS

@api_view(['GET'])
@permission_classes((permissions.AllowAny, ))
def trading_eq_coll(request):
    trading_eqs = TradingEquipment.objects.all()
    serializer = TradingEquipmentSerializer(trading_eqs, many=True)
    return Response(serializer.data, status=status.HTTP_200_OK)


@api_view(['GET'])
@permission_classes((permissions.AllowAny, ))
def trading_eq_res(request, pk):
    try:
        trading_eq = TradingEquipment.objects.get(pk = pk)
    except TradingEquipment.DoesNotExist:
        raise NotFound()

    serializer = TradingEquipmentSerializer(trading_eq, request.data, partial=True)
    if(not serializer.is_valid()):
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    return Response(serializer.data)


