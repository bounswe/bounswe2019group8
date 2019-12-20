from django.db.models import Q
from rest_framework import permissions
from rest_framework.decorators import api_view, permission_classes
from rest_framework.exceptions import NotFound
from rest_framework.response import Response

from nova.models import TradingEquipment, Price
from nova.serializers import PriceSerializer
from nova.utils.functions import current_price_without_cross_validation, current_price_with_cross_validation


# trading_equipments/<tr_eq_sym>/prices/daily
@api_view(['GET'])
@permission_classes((permissions.AllowAny,))
def daily_prices_coll(request, tr_eq_sym):
    # no cross validations
    try:
        trading_equipment = TradingEquipment.objects.get(sym=tr_eq_sym)
    except TradingEquipment.DoesNotExist:
        raise NotFound()

    daily_prices = Price.objects.filter(
        Q(tr_eq=trading_equipment.pk) &
        (Q(interval='open') |
         Q(interval='close') |
         Q(interval='high') |
         Q(interval='low'))
    )

    serializer = PriceSerializer(daily_prices, many=True)

    return Response(serializer.data)


# trading_equipments/<tr_eq_sym>/prices/intradaily
@api_view(['GET'])
@permission_classes([permissions.AllowAny, ])
def intradaily_prices_coll(request, tr_eq_sym):
    # no cross validations
    try:
        trading_equipment = TradingEquipment.objects.get(sym=tr_eq_sym)
    except TradingEquipment.DoesNotExist:
        raise NotFound()

    intradaily_prices = Price.objects.filter(
        Q(tr_eq=trading_equipment.pk) &
        Q(interval='intraday')
    )

    serializer = PriceSerializer(intradaily_prices, many=True)

    return Response(serializer.data)


# trading_equipments/<tr_eq_sym>/prices/current
@api_view(['GET'])
@permission_classes([permissions.AllowAny, ])
def current_price_res(request, tr_eq_sym):
    # cross validations can be needed
    try:
        trading_equipment = TradingEquipment.objects.get(sym=tr_eq_sym)
        current_price = current_price_without_cross_validation(trading_equipment.pk)
    except TradingEquipment.DoesNotExist:
        current_price = current_price_with_cross_validation(tr_eq_sym)

    if current_price is None:
        raise NotFound()

    serializer = PriceSerializer(current_price)

    return Response(serializer.data)
