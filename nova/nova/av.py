import requests
import csv

from rest_framework import status
from rest_framework.response import Response

from .settings import AV_URLS, ALPHAVANTAGE_KEYS


# list_type -> phy_cur || dig_cur
def get_currency_list(list_type):
    response_decoded = requests.get(AV_URLS['alpha'] + AV_URLS[list_type]).content.decode('utf-8')
    response_csv = csv.reader(response_decoded.splitlines(), delimiter = ',')
    response_list = list(response_csv)
    cur_dict = {}
    for cur in response_list:
        cur_dict[cur[0]] = cur[1]
    return Response(cur_dict, status = status.HTTP_200_OK)


