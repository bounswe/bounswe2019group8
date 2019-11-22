from datetime import datetime

import kronos
import requests
from django.utils.timezone import make_aware

from nova.models import TradingEquipment, Parity
from .settings import AV_URLS, ALPHAVANTAGE_KEYS


def do_request(tr_eq):
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
            print(request_str)
            print(response_formatted)
            return
        else:
            return response_formatted[return_key]
    return


@kronos.register('*/30 * * * *')
def fill_parities():
    eq_list = TradingEquipment.objects.all()
    for tr_eq in eq_list:
        # if recently updated, continue
        print("TR_EQ_NAME = " + tr_eq.sym)
        if tr_eq.last_updated is None or (datetime.now().date() - tr_eq.last_updated).days > 1:
            print("NEEDS AND UPDATE")
            # else clear all parity instances of tr_eq, fetch data, recreate parities
            Parity.objects.filter(tr_eq=tr_eq).delete()
            result = do_request(tr_eq)
            if result is not None:
                print(result)
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
                tr_eq.last_updated = datetime.now()
                tr_eq.save()
    return
