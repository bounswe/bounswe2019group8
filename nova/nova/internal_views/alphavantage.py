import requests
from dateutil.relativedelta import relativedelta
from django.db.models import Q
from django.utils.datetime_safe import date
from rest_framework import permissions
from rest_framework.decorators import api_view, permission_classes
from rest_framework.exceptions import PermissionDenied
from rest_framework.response import Response

from nova.models import TradingEquipment, Price
from nova.settings import AV_URLS, ALPHAVANTAGE_KEYS, CRON_JOB_KEY


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

    key = ALPHAVANTAGE_KEYS[0]
    response_formatted = requests.get((request_str + key)).json()

    # frequent request
    if 'Note' in response_formatted:
        ALPHAVANTAGE_KEYS.append(ALPHAVANTAGE_KEYS.pop(0))
        return do_request_daily(tr_eq)
    # wrong command
    elif 'Error Message' in response_formatted:
        return None
    else:
        return response_formatted[return_key]


def do_request_current(tr_eq):
    currencies = tr_eq.sym.split('_')
    from_sym = currencies[0]
    to_sym = currencies[1]

    func = 'CURRENCY_EXCHANGE_RATE'
    from_param = '&from_currency='
    to_param = '&to_currency='

    request_str = AV_URLS['api'] + '=' + func + from_param + from_sym + to_param + to_sym + '&apikey='

    key = ALPHAVANTAGE_KEYS[0]
    response_formatted = requests.get((request_str + key)).json()

    # frequent request
    if 'Note' in response_formatted:
        ALPHAVANTAGE_KEYS.append(ALPHAVANTAGE_KEYS.pop(0))
        return do_request_current(tr_eq)
    # wrong command
    elif 'Error Message' in response_formatted:
        return None
    else:
        return response_formatted['Realtime Currency Exchange Rate']


# this should run every 5 minutes. (To make several passes in half an hour)
@api_view(['POST'])
@permission_classes((permissions.AllowAny,))
def fill_intraday(request):
    if request.data.get('cron_job_key') != CRON_JOB_KEY:
        raise PermissionDenied()

    all_eq_list = TradingEquipment.objects.filter(Q(type='forex') | Q(type='digital'))

    # CURRENT PRICE PROCESSING
    for tr_eq in all_eq_list:
        if tr_eq.sym == 'USD_USD':
            continue

        result = do_request_current(tr_eq)

        price_date, price_time = result["6. Last Refreshed"].split(' ')

        if result is None:
            continue

        Price.objects.create(
            tr_eq=tr_eq,
            observe_date=price_date,
            observe_time=price_time,
            interval='intraday',
            indicative_value=result['5. Exchange Rate'],
            bid_value=result['8. Bid Price'],
            ask_value=result['9. Ask Price']
        )

    return Response('Success')


# Will not change equipments updated in less than 24 hours.
# It takes three passes to fill all the fx and digitals.
# We can make this function run like 3 times for one hour, then further calls in the same day wont be necessary
@api_view(['POST'])
@permission_classes((permissions.AllowAny,))
def fill_daily(request):
    if request.data.get('cron_job_key') != CRON_JOB_KEY:
        raise PermissionDenied()

    # nasdaq daily job handles price deletion

    all_eq_list = TradingEquipment.objects.filter(Q(type='forex') | Q(type='digital'))

    for tr_eq in all_eq_list:
        if tr_eq.sym == 'USD_USD':
            continue

        result = do_request_daily(tr_eq)

        if result is None:
            continue

        today = date.today()
        last_month = today - relativedelta(months=1)

        for pr_date, prices in result.items():
            if date.fromisoformat(pr_date) < last_month:
                break

            currencies = tr_eq.sym.split('_')
            to = currencies[1]

            values_dict = {
                'open': prices['1. open'] if tr_eq.type == 'forex' else prices['1a. open (' + to + ')'],
                'high': prices['2. high'] if tr_eq.type == 'forex' else prices['2a. high (' + to + ')'],
                'low': prices['3. low'] if tr_eq.type == 'forex' else prices['3a. low (' + to + ')'],
                'close': prices['4. close'] if tr_eq.type == 'forex' else prices['4a. close (' + to + ')'],
            }

            for key, value in values_dict.items():
                Price.objects.create(
                    tr_eq=tr_eq,
                    observe_date=pr_date,
                    indicative_value=value,
                    interval=key
                )

    return Response('Success')
