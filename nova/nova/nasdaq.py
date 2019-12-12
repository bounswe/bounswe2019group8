import requests
from django.utils.datetime_safe import datetime, date
from django.utils.timezone import make_aware, get_default_timezone
from rest_framework import permissions, status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.exceptions import PermissionDenied, NotFound
from rest_framework.response import Response

from nova.models import TradingEquipment, Price
from nova.serializers import TradingEquipmentSerializer
from nova.settings import CRON_JOB_KEY, NASDAQ_BASE_URL

from dateutil.relativedelta import relativedelta

def fetch_stocks_daily():
    stocks = TradingEquipment.objects.filter(type='stock')

    for stock in stocks:
        url = NASDAQ_BASE_URL +  '/' + stock.sym + '/historical'

        now = datetime.now()
        before = now - relativedelta(months=1)
        now = str(now).split(' ')
        before = str(before).split(' ')

        response = requests.get(url, params = {'assetclass' : 'stocks', 'fromdate' : before[0], 'todate': now[0]})

        if response.status_code != 200:
            print('Error occurred while fetching ', stock.sym)
            continue

        json_response = response.json()
        for row in range(0, len(json_response['data']['tradesTable']['rows'])-1):
            try:
                data_date = json_response['data']['tradesTable']['rows'][row]['date']
                close = json_response['data']['tradesTable']['rows'][row]['close']
                open = json_response['data']['tradesTable']['rows'][row]['open']
                high = json_response['data']['tradesTable']['rows'][row]['high']
                low = json_response['data']['tradesTable']['rows'][row]['low']
            except TypeError:
                print('Error occurred while parsing ', stock.sym)
                continue

            date_arr = data_date.split('/')

            data_date = date_arr[2] + '-' + date_arr[0] + '-' + date_arr[1]
            Price.objects.create(
                observe_date=make_aware(datetime.strptime(data_date, '%Y-%m-%d')),
                tr_eq=stock,
                indicative_value=close[1:],
                interval='close',
            )
            Price.objects.create(
                observe_date=make_aware(datetime.strptime(data_date, '%Y-%m-%d')),
                tr_eq=stock,
                indicative_value=open[1:],
                interval='open',
            )
            Price.objects.create(
                observe_date=make_aware(datetime.strptime(data_date, '%Y-%m-%d')),
                tr_eq=stock,
                indicative_value=high[1:],
                interval='high',
            )
            Price.objects.create(
                observe_date=make_aware(datetime.strptime(data_date, '%Y-%m-%d')),
                tr_eq=stock,
                indicative_value=low[1:],
                interval='low',
            )
            now = make_aware(datetime.now(), get_default_timezone())
            stock.last_updated_daily = now
            stock.save()

def fetch_stocks_intradaily():
    stocks = TradingEquipment.objects.filter(type='stock')

    for stock in stocks:
        url = NASDAQ_BASE_URL +  '/' + stock.sym + '/info'
        print("STOCK"+stock.sym)
        response = requests.get(url, params = {'assetclass' : 'stocks'})
        print(response)
        if response.status_code != 200:
            print('Error occurred while fetching ', stock.sym)
            continue

        json_response = response.json()
        try:
            indicative_value = json_response['data']['primaryData']['lastSalePrice']
        except TypeError:
            print('Error occurred while parsing ', stock.sym)
            continue

        current_date = date.today()
        current_time = datetime.now().time()

        Price.objects.create(
            observe_date=current_date,
            observe_time=current_time,
            tr_eq=stock,
            indicative_value=indicative_value[1:],
            interval='intraday',
        )
        now = make_aware(datetime.now(), get_default_timezone())
        stock.last_updated_current = now
        stock.save()


def fetch_commodities_intradaily():
    commodities = TradingEquipment.objects.filter(type='commodity')

    for commodity in commodities:
        url = NASDAQ_BASE_URL + '/' + commodity.sym + '/info'

        response = requests.get(url, params={'assetclass': 'commodities'})

        if response.status_code != 200:
            print('Error occurred while fetching ', commodity.sym)
            continue

        json_response = response.json()

        try:
            indicative_value = json_response['data']['primaryData']['lastSalePrice']
            ask_value = json_response['data']['keyStats']['Ask']['value']
            ask_value = None if ask_value == 'N/A' else float(ask_value)
            bid_value = json_response['data']['keyStats']['Bid']['value']
            bid_value = None if bid_value == 'N/A' else float(bid_value)
        except TypeError:
            print('Error occurred while parsing ', commodity.sym)
            continue

        current_date = date.today()
        current_time = datetime.now().time()

        Price.objects.create(
            observe_date=current_date,
            observe_time=current_time,
            tr_eq=commodity,
            indicative_value=indicative_value,
            bid_value=bid_value,
            ask_value=ask_value,
            interval='intraday',
        )
        now = make_aware(datetime.now(), get_default_timezone())
        commodity.last_updated_current = now
        commodity.save()

@api_view(['POST'])
@permission_classes((permissions.AllowAny,))
def fetch_all_intradaily(request):
    if request.data.get('cronJobKey') != CRON_JOB_KEY:
        raise PermissionDenied()

    fetch_commodities_intradaily()
    fetch_stocks_intradaily()
    # others will be added here

    return Response('Success')
