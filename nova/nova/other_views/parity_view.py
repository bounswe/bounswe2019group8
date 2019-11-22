from rest_framework import permissions
from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.exceptions import NotFound
from rest_framework.response import Response

from ..models import TradingEquipment, Parity
from ..serializers import ParitySerializer


@api_view(['GET'])
@permission_classes((permissions.IsAuthenticated,))
def parities_coll(request, pk):
    try:
        tr_eq = TradingEquipment.objects.get(pk=pk)
    except TradingEquipment.DoesNotExist:
        raise NotFound()

    parities = Parity.objects.filter(tr_eq=tr_eq)
    serializer = ParitySerializer(parities, many=True)
    return Response(serializer.data, status.HTTP_200_OK)


@api_view(['GET'])
@permission_classes((permissions.IsAuthenticated,))
def parities_sym_coll(request, sym):
    try:
        tr_eq = TradingEquipment.objects.get(sym=sym)
    except TradingEquipment.DoesNotExist:
        raise NotFound()

    parities = Parity.objects.filter(tr_eq=tr_eq)
    serializer = ParitySerializer(parities, many=True)
    return Response(serializer.data, status.HTTP_200_OK)
