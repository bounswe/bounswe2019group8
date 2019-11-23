from datetime import datetime

import kronos
import requests
from django.utils.timezone import make_aware, get_default_timezone

from nova.models import TradingEquipment, Parity, CurrentPrice
from .settings import AV_URLS, ALPHAVANTAGE_KEYS


def do_request_daily(tr_eq):
    currencies = tr_eq.sym.split('_')
    from_sym = currencies[0]
    to_sym = currencies[1]

    func = ''
    return_key = ''
    from_param = ''
    to_param = ''

    if tr_eq.type == 'forex':
        func = 'FX_DAILY'
        return_key = 'Time Series FX (Daily)'
        from_param = '&from_symbol='
        to_param = '&to_symbol='

    elif tr_eq.type == 'digital':
        func = 'DIGITAL_CURRENCY_DAILY'
        return_key = 'Time Series (Digital Currency Daily)'
        from_param = '&symbol='
        to_param = '&market='

    request_str = AV_URLS['api'] + '=' + func + from_param + from_sym + to_param + to_sym + '&apikey='
    for key in ALPHAVANTAGE_KEYS:

        response_formatted = requests.get((request_str + key)).json()
        # frequent request
        if 'Note' in response_formatted:
            continue
        # wrong command
        elif 'Error Message' in response_formatted:
            return
        else:
            return response_formatted[return_key]
    return

def do_request_current(tr_eq):
    currencies = tr_eq.sym.split('_')
    from_sym = currencies[0]
    to_sym = currencies[1]

    func = 'CURRENCY_EXCHANGE_RATE'
    from_param = '&from_currency='
    to_param = '&to_currency='

    request_str = AV_URLS['api'] + '=' + func + from_param + from_sym + to_param + to_sym + '&apikey='
    for key in ALPHAVANTAGE_KEYS:

        response_formatted = requests.get((request_str + key)).json()
        # frequent request
        if 'Note' in response_formatted:
            continue
        # wrong command
        elif 'Error Message' in response_formatted:
            return
        else:
            return response_formatted['Realtime Currency Exchange Rate']
    return


@kronos.register('*/30 * * * *')
def fill_parities():
    eq_list = TradingEquipment.objects.all()
    for tr_eq in eq_list:
        now = make_aware(datetime.now(), get_default_timezone())

        # CURRENT PRICE PROCESSING

        minutes = 0.0

        if tr_eq.last_updated_current is not None:
            total_seconds = (now - tr_eq.last_updated_current).total_seconds()
            minutes = (total_seconds % 3600) // 60

        if tr_eq.last_updated_current is None or minutes > 60:

            CurrentPrice.objects.filter(tr_eq=tr_eq).delete()
            result = do_request_current(tr_eq)
            if result is not None:
                current_price_obj = CurrentPrice.objects.create(
                    tr_eq=tr_eq,
                    observed_at=now,
                    exchange_rate=result['5. Exchange Rate'],
                    bid_price=result['8. Bid Price'],
                    ask_price=result['9. Ask Price']
                )
                current_price_obj.save()
                tr_eq.last_updated_current = now
                tr_eq.save()

        # DAILY PRICES PROCESSING

        hours = 0.0

        if tr_eq.last_updated_daily is not None:
            total_seconds = (now - tr_eq.last_updated_daily).total_seconds()
            hours = total_seconds // 3600


        # if recently updated, continue
        if tr_eq.last_updated_daily is None or hours > 24:
            # else clear all parity instances of tr_eq, fetch data, recreate parities
            Parity.objects.filter(tr_eq=tr_eq, interval_category='daily').delete()
            result = do_request_daily(tr_eq)
            if result is not None:
                day_count = 0
                for date, rates in result.items():
                    if day_count >= 30:
                        break
                    day_count += 1
                    if tr_eq.type == 'forex':
                        parity_obj = Parity.objects.create(
                            tr_eq=tr_eq,
                            observed_at=make_aware(datetime.strptime(date, '%Y-%m-%d')),
                            open=rates['1. open'],
                            high=rates['2. high'],
                            low=rates['3. low'],
                            close=rates['4. close']
                        )
                        parity_obj.save()

                    elif tr_eq.type == 'digital':
                        currencies = tr_eq.sym.split('_')
                        to = currencies[1]
                        parity_obj = Parity.objects.create(
                            tr_eq=tr_eq,
                            observed_at=make_aware(datetime.strptime(date, '%Y-%m-%d')),
                            open=rates['1a. open (' + to + ')'],
                            high=rates['2a. high (' + to + ')'],
                            low=rates['3a. low (' + to + ')'],
                            close=rates['4a. close (' + to + ')'],
                        )
                        parity_obj.save()
                tr_eq.last_updated_daily = now
                tr_eq.save()
    return
