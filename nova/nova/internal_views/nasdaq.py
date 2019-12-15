import requests
from dateutil.relativedelta import relativedelta
from django.db.models import Q
from django.utils.datetime_safe import datetime, date
from django.utils.timezone import make_aware, get_default_timezone
from rest_framework import permissions
from rest_framework.decorators import api_view, permission_classes
from rest_framework.exceptions import PermissionDenied
from rest_framework.response import Response

from nova.models import TradingEquipment, Price
from nova.settings import CRON_JOB_KEY, NASDAQ_BASE_URL


def fetch_intradaily(eq_type, asset_class):
    commodities = TradingEquipment.objects.filter(type=eq_type)

    for commodity in commodities:
        url = NASDAQ_BASE_URL + '/' + commodity.sym + '/info'

        response = requests.get(url, params={'assetclass': asset_class})

        if response.status_code != 200:
            print('Error occurred while fetching', commodity.sym)
            continue

        json_response = response.json()

        try:
            indicative_value = parse_price(json_response['data']['primaryData']['lastSalePrice'])
            ask_value = parse_price(json_response['data']['keyStats']['Ask']['value']) if 'Ask' in \
                                                                                          json_response['data'][
                                                                                              'keyStats'] else None
            bid_value = parse_price(json_response['data']['keyStats']['Bid']['value']) if 'Bid' in \
                                                                                          json_response['data'][
                                                                                              'keyStats'] else None
        except KeyError:
            print('Error occurred while parsing', commodity.sym)
            continue
        except TypeError:
            print('Error occurred while parsing', commodity.sym)
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


def fetch_daily(eq_type, asset_class):
    commodities = TradingEquipment.objects.filter(type=eq_type)

    today = date.today()
    last_month = today - relativedelta(months=1)

    for commodity in commodities:
        url = NASDAQ_BASE_URL + '/' + commodity.sym + '/historical'

        response = requests.get(url, params={
            'assetclass': asset_class,
            'limit': 30,
            'fromdate': last_month,
            'todate': today,
        })

        if response.status_code != 200:
            print('Error occurred while fetching', commodity.sym)
            continue

        json_response = response.json()

        try:
            rows = json_response['data']['tradesTable']['rows']
        except KeyError:
            print('Error occurred while parsing', commodity.sym)
            continue
        except TypeError:
            print('Error occurred while parsing', commodity.sym)
            continue

        for row in rows:
            date_tokens = row['date'].split('/')
            date_str = date_tokens[2] + '-' + date_tokens[0] + '-' + date_tokens[1]

            price_dict = {
                'open': parse_price(row['open']),
                'close': parse_price(row['close']),
                'high': parse_price(row['high']),
                'low': parse_price(row['low']),
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
    if request.data.get('cron_job_key') != CRON_JOB_KEY:
        raise PermissionDenied()

    fetch_intradaily('commodity', 'commodities')
    fetch_intradaily('stock', 'stocks')
    fetch_intradaily('etf', 'etf')
    fetch_intradaily('index', 'index')

    # other intradaily jobs will be added here

    return Response('Success')


@api_view(['POST'])
@permission_classes((permissions.AllowAny,))
def fetch_all_daily(request):
    if request.data.get('cron_job_key') != CRON_JOB_KEY:
        raise PermissionDenied()

    delete_old_prices()

    fetch_daily('commodity', 'commodities')
    fetch_daily('stock', 'stocks')
    fetch_daily('etf', 'etf')
    fetch_daily('index', 'index')
    # other daily jobs will be added here

    return Response('Success')


def parse_price(price_str):
    if price_str is None or price_str == 'N/A':
        return None
    else:
        return price_str[1:] if price_str.startswith('$') else price_str
