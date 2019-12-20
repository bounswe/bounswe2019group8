from django.core.exceptions import ValidationError
from rest_framework.exceptions import NotFound

from nova.models import TradingEquipment, Price


def parse_price(price_str):
    if price_str is None or price_str == 'N/A':
        return None
    else:
        return price_str[1:] if price_str.startswith('$') else price_str


def current_price_without_cross_validation(tr_eq_pk):
    current_price = Price.objects.filter(tr_eq=tr_eq_pk, observe_time__isnull=False) \
        .order_by('-observe_date', '-observe_time').first()

    return current_price


def current_price_with_cross_validation(symbols):
    left_sym, right_sym = symbols.split('_')

    if right_sym is None:
        raise NotFound()

    try:
        left_tr_eq = TradingEquipment.objects.get(sym__startswith=left_sym)
        right_tr_eq = TradingEquipment.objects.get(sym__startswith=right_sym)
    except TradingEquipment.DoesNotExist:
        raise NotFound()

    if right_tr_eq.type != 'forex' or left_tr_eq.type != 'forex':
        raise ValidationError('Symbols can only be forex for cross validation')

    left_current_price = current_price_without_cross_validation(left_tr_eq.pk)
    right_current_price = current_price_without_cross_validation(right_tr_eq.pk)

    cross_indicative_value = left_current_price.indicative_value / right_current_price.indicative_value

    cross_bid_value = left_current_price.bid_value / right_current_price.bid_value \
        if left_current_price.bid_value is not None and right_current_price.bid_value is not None else None

    cross_ask_value = left_current_price.ask_value / right_current_price.ask_value \
        if left_current_price.ask_value is not None and right_current_price.ask_value is not None else None

    # for some fields, left one is arbitrarily chosen
    cross_price = Price(
        observe_date=left_current_price.observe_date,
        observe_time=left_current_price.observe_time,
        tr_eq=left_tr_eq,
        indicative_value=cross_indicative_value,
        bid_value=cross_bid_value,
        ask_value=cross_ask_value,
        interval='intraday'
    )

    return cross_price
