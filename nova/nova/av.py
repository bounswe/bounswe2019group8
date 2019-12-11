from datetime import datetime

import requests
from django.db.models import Q
from django.utils.timezone import make_aware, get_default_timezone
from rest_framework import status
from rest_framework.decorators import api_view, permission_classes

from nova.models import TradingEquipment, Price
from .settings import AV_URLS, ALPHAVANTAGE_KEYS
from rest_framework import permissions

from rest_framework.response import Response


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



# this should run every 5 minutes. (To make several passes in half an hour)
# Will not change equipments updated in less than 30 minutes.
@api_view(['GET'])
@permission_classes((permissions.AllowAny,))
def fill_intraday(request):
    all_eq_list = TradingEquipment.objects.filter(Q(type='forex') | Q(type='digital'))

    # CURRENT PRICE PROCESSING
    for tr_eq in all_eq_list:
        if tr_eq.sym == 'USD_USD':
            continue
        now = make_aware(datetime.now(), get_default_timezone())

        minutes = 0.0

        if tr_eq.last_updated_current is not None:
            total_seconds = (now - tr_eq.last_updated_current).total_seconds()
            minutes = (total_seconds % 3600) // 60

        if tr_eq.last_updated_current is None or minutes > 30:
            result = do_request_current(tr_eq)
            if result is not None:

                dttm = result['6. Last Refreshed'].split(' ')
                new_price_obj = Price.objects.create(
                    tr_eq=tr_eq,
                    observe_date=dttm[0],
                    observe_time=dttm[1],
                    interval='intraday',
                    indicative_value=result['5. Exchange Rate'],
                    bid_value=result['8. Bid Price'],
                    ask_value=result['9. Ask Price']
                )

                new_price_obj.save()
                tr_eq.last_updated_current = now
                tr_eq.save()
    return Response(status.HTTP_200_OK)



# Will not change equipments updated in less than 24 hours.
# It takes three passes to fill all the fx and digitals.
# We can make this function run like 3 times for one hour, then further calls in the same day wont be necessary
@api_view(['GET'])
@permission_classes((permissions.AllowAny, ))
def fill_daily(request):
    all_eq_list = TradingEquipment.objects.filter(Q(type='forex') | Q(type='digital'))

    # DAILY PRICE PROCESSING
    for tr_eq in all_eq_list:
        if tr_eq.sym == 'USD_USD':
            continue
        now = make_aware(datetime.now(), get_default_timezone())

        hours = 0.0

        if tr_eq.last_updated_daily is not None:
            total_seconds = (now - tr_eq.last_updated_daily).total_seconds()
            hours = total_seconds // 3600

        # if recently updated, continue
        if tr_eq.last_updated_daily is None or hours > 24:
            # else clear all parity instances of tr_eq, fetch data, recreate parities
            Price.objects.filter(Q(tr_eq=tr_eq) | ~Q(interval='intraday')).delete()
            result = do_request_daily(tr_eq)
            if result is not None:
                day_count = 0
                for date, rates in result.items():
                    if day_count >= 30:
                        break
                    day_count += 1
                    if tr_eq.type == 'forex':
                        new_price_open = Price.objects.create(
                            tr_eq=tr_eq,
                            observe_date=make_aware(datetime.strptime(date, '%Y-%m-%d')),
                            indicative_value=rates['1. open'],
                            interval='open'
                        )
                        new_price_high = Price.objects.create(
                            tr_eq=tr_eq,
                            observe_date=make_aware(datetime.strptime(date, '%Y-%m-%d')),
                            indicative_value=rates['2. high'],
                            interval='high'
                        )
                        new_price_low = Price.objects.create(
                            tr_eq=tr_eq,
                            observe_date=make_aware(datetime.strptime(date, '%Y-%m-%d')),
                            indicative_value=rates['3. low'],
                            interval='low'
                        )
                        new_price_close = Price.objects.create(
                            tr_eq=tr_eq,
                            observe_date=make_aware(datetime.strptime(date, '%Y-%m-%d')),
                            indicative_value=rates['4. close'],
                            interval='close'
                        )
                        new_price_open.save()
                        new_price_high.save()
                        new_price_low.save()
                        new_price_close.save()

                    elif tr_eq.type == 'digital':
                        currencies = tr_eq.sym.split('_')
                        to = currencies[1]

                        new_price_open = Price.objects.create(
                            tr_eq=tr_eq,
                            observe_date=make_aware(datetime.strptime(date, '%Y-%m-%d')),
                            indicative_value=rates['1a. open (' + to + ')'],
                        )
                        new_price_high = Price.objects.create(
                            tr_eq=tr_eq,
                            observe_date=make_aware(datetime.strptime(date, '%Y-%m-%d')),
                            indicative_value=rates['2a. high (' + to + ')'],
                        )
                        new_price_low = Price.objects.create(
                            tr_eq=tr_eq,
                            observe_date=make_aware(datetime.strptime(date, '%Y-%m-%d')),
                            indicative_value=rates['3a. low (' + to + ')'],
                        )
                        new_price_close = Price.objects.create(
                            tr_eq=tr_eq,
                            observe_date=make_aware(datetime.strptime(date, '%Y-%m-%d')),
                            indicative_value=rates['4a. close (' + to + ')'],
                        )
                        new_price_open.save()
                        new_price_high.save()
                        new_price_low.save()
                        new_price_close.save()

                tr_eq.last_updated_daily = now
                tr_eq.save()
    return Response(status.HTTP_200_OK)



"""
"""
