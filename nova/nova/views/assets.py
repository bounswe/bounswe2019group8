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
    elif request.method == 'POST':
        if not ({'sell_tr_eq_sym', 'buy_tr_eq_sym'} <= request.data.keys()) or len(
                {'sell_amount', 'buy_amount'} & request.data.keys()) != 1:
            raise ValidationError("Missing or too many purchase parameters")

        try:
            sell_tr_eq = TradingEquipment.objects.get(sym=request.data['sell_tr_eq_sym'])
            buy_tr_eq = TradingEquipment.objects.get(sym=request.data['buy_tr_eq_sym'])
        except TradingEquipment.DoesNotExist:
            raise NotFound("One of the referenced equipments does not actually exist")

        try:
            sell_asset = user.assets.get(tr_eq=sell_tr_eq)
        except:
            raise NotFound("Asset to be sold does not exist")

        try:
            buy_asset = user.assets.get(tr_eq=buy_tr_eq)
        except:
            buy_asset = Asset.objects.create(owner=user, amount=0,
                                             tr_eq=buy_tr_eq)

        forex_count = (sell_tr_eq.type == 'forex') + (buy_tr_eq.type == 'forex')
        usd_count = (sell_tr_eq.sym == 'USD_USD') + (buy_tr_eq.sym == 'USD_USD')

        if forex_count < 2 and usd_count == 0:
            raise ValidationError("Trade equipments other than forexes can only be traded with USD")

        sell_eq_price = get_current_price(sell_tr_eq.pk)
        buy_eq_price = get_current_price(buy_tr_eq.pk)

        if sell_eq_price is None or buy_eq_price is None \
                or sell_eq_price == 0 or buy_eq_price == 0:
            raise NotFound("Currently, the item is not available for selling or buying")

        buy_amount = get_decimal_amount(request.data, prefix='buy')
        sell_amount = get_decimal_amount(request.data, prefix='sell')

        if sell_amount is not None:
            buy_amount = sell_amount * sell_eq_price.indicative_value / buy_eq_price.indicative_value
        elif buy_amount is not None:
            sell_amount = buy_amount * buy_eq_price.indicative_value / sell_eq_price.indicative_value
        else:
            raise ValidationError("Valid amounts must be supplied")

        if sell_amount > sell_asset.amount:
            raise ValidationError("User does not have enough assets")

        sell_asset.amount -= sell_amount
        buy_asset.amount += buy_amount

        sell_asset.save()
        buy_asset.save()

        return Response({
            "sell_price": PriceSerializer(sell_eq_price).data,
            "buy_price": PriceSerializer(buy_eq_price).data,
            "sold_asset_current": AssetSerializer(sell_asset).data,
            "bought_asset_current": AssetSerializer(buy_asset).data,
        })
