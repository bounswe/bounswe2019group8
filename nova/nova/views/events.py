import json

import requests
from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response

from nova.permissions import Public
from ..utils.parse_event_data import parse_event_data
from ..models import Event
from ..serializers import EventSerializer


@api_view(['GET', 'POST'])
@permission_classes([Public])
def events_coll(request, date):
    if request.method == 'GET':
        events = Event.objects.filter(date=date)

        serializer = EventSerializer(events, many=True)

        return Response(serializer.data, status=status.HTTP_200_OK)
    elif request.method == 'POST':
        url = 'https://www.investing.com/economic-calendar/Service/getCalendarFilteredData'
        payload = {'dateFrom': date,
                   'dateTo': date,
                   'timeZone': '63',
                   'timeFilter': 'timeRemain',
                   'currentTab': 'custom',
                   'limit_from': '0'}
        headers = {
            'Referer': 'https://www.investing.com/economic-calendar/',
            'X-Requested-With': 'XMLHttpRequest',
            'Origin': 'https://www.investing.com',
            'Host': 'www.investing.com',
            "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_2) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/78.0.3904.108 Safari/537.36"
        }
        response = requests.request('POST', url, headers=headers, data=payload, allow_redirects=False)

        events = parse_event_data(json.loads(response.text)["data"], date)

        count = 0
        for event in events:
            if len(event["importance"]) == 0:
                continue

            serializer = EventSerializer(data=event)
            if serializer.is_valid():
                count += 1
                serializer.save()

        return Response({"new": count, "total": len(events)}, status=status.HTTP_200_OK)
