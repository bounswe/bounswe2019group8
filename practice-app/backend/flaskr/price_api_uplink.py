# api_uplink.py

from flask import current_app
from urllib.parse import urlencode
import json
import requests

_ROOT = current_app.config['PRICE_API_ROOT']
_KEY = current_app.config['PRICE_API_KEY']

def get_from_api(**kwargs):
    params = dict(kwargs)
    params['apikey'] = _KEY
    params['datatype'] = 'json'

    return json.loads(requests.get('{}/query?{}'.format(_ROOT, urlencode(params))).content)

def get_symbols_from_nasdaq():
    as_csv = requests.get('http://www.nasdaq.com/screening/companies-by-industry.aspx?exchange=NASDAQ&render=download').content
    res = []

    for line in as_csv.splitlines():
        line = str(line.decode())
        res.append(line[:line.find(',')][1:-1])

    return res[1:]

