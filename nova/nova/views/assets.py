from rest_framework.decorators import api_view, permission_classes
from rest_framework.exceptions import NotFound, PermissionDenied, ValidationError
from rest_framework import status
from rest_framework.response import Response
from ..permissions import IsTraderUser

from nova.models import User, TradingEquipment
from nova.serializers import AssetSerializer
from decimal import Decimal


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

        try:
            amount = Decimal(request.data['amount'])
            if amount <= 0:
                raise ValueError()
        except:
            raise ValidationError("Amount must be a positive real number")

        cash_asset = user.assets.get(tr_eq=TradingEquipment.objects.get(sym='USD_USD'))

        cash_asset.amount += amount
        cash_asset.save()

        return Response(AssetSerializer(cash_asset).data, status=status.HTTP_201_CREATED)
