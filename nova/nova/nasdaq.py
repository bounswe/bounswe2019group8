import requests
from dateutil.relativedelta import relativedelta
from django.db.models import Q
from django.utils.datetime_safe import datetime, date
from rest_framework import permissions
from rest_framework.decorators import api_view, permission_classes
from rest_framework.exceptions import PermissionDenied
from rest_framework.response import Response

from nova.models import TradingEquipment, Price
from nova.settings import CRON_JOB_KEY, NASDAQ_BASE_URL


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


def fetch_commodities_daily():
    commodities = TradingEquipment.objects.filter(type='commodity')

    today = date.today()
    last_month = today - relativedelta(months=1)

    for commodity in commodities:
        url = NASDAQ_BASE_URL + '/' + commodity.sym + '/historical'

        response = requests.get(url, params={
            'assetclass': 'commodities',
            'limit': 30,
            'fromdate': last_month,
            'todate': today,
        })

        if response.status_code != 200:
            print('Error occurred while fetching ', commodity.sym)
            continue

        json_response = response.json()

        rows = json_response['data']['tradesTable']['rows']

        for row in rows:
            date_tokens = row['date'].split('/')
            date_str = date_tokens[2] + '-' + date_tokens[0] + '-' + date_tokens[1]

            price_dict = {
                'open': row['open'],
                'close': row['close'],
                'high': row['high'],
                'low': row['low'],
            }

            for key, value in price_dict.items():
                Price.objects.create(
                    observe_date=date_str,
                    observe_time=None,
                    tr_eq=commodity,
                    indicative_value=value,
                    bid_value=None,
                    ask_value=None,
                    interval=key,
                )


def delete_old_prices():
    """
    This method deletes intraday prices starting from yesterday (exclusive), and all price objects that are not intraday.
    """

    today = date.today()
    yesterday = today - relativedelta(days=1)

    prices_to_delete = Price.objects.filter(
        ~Q(interval='intraday') |
        (Q(interval='intraday') & Q(observe_date__lt=yesterday))
    )

    prices_to_delete.delete()


@api_view(['POST'])
@permission_classes((permissions.AllowAny,))
def fetch_all_intradaily(request):
    if request.data.get('cronJobKey') != CRON_JOB_KEY:
        raise PermissionDenied()

    fetch_commodities_intradaily()
    # others will be added here

    return Response('Success')
