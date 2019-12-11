import requests
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
            ask_value=ask_value
        )


@api_view(['POST'])
@permission_classes((permissions.AllowAny,))
def fetch_all_intradaily(request):
    if request.data.get('cronJobKey') != CRON_JOB_KEY:
        raise PermissionDenied()

    fetch_commodities_intradaily()
    # others will be added here

    return Response('Success')
