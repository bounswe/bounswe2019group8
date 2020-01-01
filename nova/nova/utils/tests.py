from django.test import TestCase
from nova.models import User, TradingEquipment
from rest_framework.test import APIClient

_DEFAULT_USER_INFO = {
    'date_of_birth': '2019-01-01',
    'first_name': 'Test',
    'last_name': 'User',
    'email': 'test@test.com',
    'password': 'test'
}

_DEFAULT_TRADER_USER_INFO = {
    'date_of_birth': '2019-01-01',
    'first_name': 'TestTrader',
    'last_name': 'User',
    'email': 'testtrader@test.com',
    'password': 'test'
}


class NovaTestCase(TestCase):
    fixtures = ['nova/fixtures/groups.json', 'nova/fixtures/forexes.json']

    def setUp(self):
        super().setUpClass()

        self.user = User.objects.create(**_DEFAULT_USER_INFO)
        self.user.save()

        self.trader_user = User.objects.create(**_DEFAULT_TRADER_USER_INFO)

        self.trader_user.groups.add(2)

        self.client = APIClient()
        self.client.force_authenticate(user=self.user)

        self.trader_client = APIClient()
        self.trader_client.force_authenticate(user=self.trader_user)
