from decimal import Decimal
from nova.models import Price, TradingEquipment


def get_decimal_amount(data, allow_negative=False, prefix=None):
    try:
        amount = Decimal(data["amount" if prefix is None else f"{prefix}_amount"])
    except:
        return None

    if (not allow_negative) and amount < 0:
        return None

    return amount


def get_current_price(tr_eq_pk):
    try:
        tr_eq = TradingEquipment.objects.get(pk=tr_eq_pk)
    except TradingEquipment.DoesNotExist:
        return None

    if tr_eq.type == 'forex' and tr_eq.sym.split('_')[1] != 'USD':
        currency_left, current_right = tr_eq.sym.split('_')

        left_price = get_current_price(currency_left)
        right_price = get_current_price(current_right)

        if left_price is None or right_price is None or right_price == 0:
            return None

        return left_price / right_price

    else:
        try:
            return Price.objects.filter(tr_eq=tr_eq_pk, interval='intraday').order_by('-observe_date',
                                                                                      '-observe_time').first()
        except Price.DoesNotExist:
            return None
