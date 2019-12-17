from rest_framework.decorators import api_view, permission_classes
from rest_framework.exceptions import NotFound, PermissionDenied, ValidationError
from rest_framework import status
from rest_framework.response import Response
from ..permissions import IsTraderUser

from nova.models import User, TradingEquipment, Price, Asset
from nova.serializers import AssetSerializer, PriceSerializer
from nova.utils.numeric import get_decimal_amount, get_current_price


# users/<user_pk>/cash
@api_view(['POST'])
@permission_classes((IsTraderUser,))
def cash_coll(request, user_pk):
    try:
        user = User.objects.get(pk=user_pk)
    except User.DoesNotExist:
        raise NotFound()

    if request.method == 'POST':
        if request.user.pk != user_pk:
            raise PermissionDenied()

        amount = get_decimal_amount(request.data)

        if amount is None:
            raise ValidationError("Amount must be a positive real number")

        cash_asset = user.assets.get(tr_eq=TradingEquipment.objects.get(sym='USD_USD'))

        cash_asset.amount += amount
        cash_asset.save()

        return Response(AssetSerializer(cash_asset).data, status=status.HTTP_201_CREATED)
@api_view(['POST', 'GET'])
@permission_classes((IsTraderUser,))
def assets_coll(request, user_pk):
    try:
        user = User.objects.get(pk=user_pk)
    except User.DoesNotExist:
        raise NotFound()

    if request.user.pk != user_pk:
        raise PermissionDenied()

    if request.method == 'GET':
        return Response(AssetSerializer(user.assets, many=True).data, status=status.HTTP_200_OK)
