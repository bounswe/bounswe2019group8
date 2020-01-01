from django.test import TestCase
from nova.models import Article, User
from rest_framework.test import APIClient
from nova.utils.tests import NovaTestCase

DEFAULT_USER_INFO = {
    'date_of_birth': '2019-01-01',
    'first_name': 'Test',
    'last_name': 'User',
    'email': 'test@test.com',
    'password': 'test'
}


class ArticleTestCase(NovaTestCase):
    def setUp(self):
        super(ArticleTestCase, self).setUp()

        self.article = Article.objects.create(title="test_article",
                                              content="test_content",
                                              author=self.user)

    def test_article_get(self):
        """GET articles/<id> returns the correct article"""

        response = self.client.get(f'/articles/{self.article.pk}')

        self.assertEqual(response.status_code, 200)

        self.assertEqual(response.data['pk'], self.article.pk)
        self.assertEqual(response.data['author'], self.article.author_id)
        self.assertEqual(response.data['title'], self.article.title)
        self.assertEqual(response.data['content'], self.article.content)

    def test_article_list(self):
        """GET articles returns the correct articles list"""

        response = self.client.get(f'/articles')

        self.assertEqual(response.status_code, 200)

        self.assertEqual(len(response.data), 1)


class AssetTestCase(NovaTestCase):
    def setUp(self):
        super(AssetTestCase, self).setUp()

    def test_deposit_cash(self):
        """POST users/<id>/cash deposits the correct amout of cash"""

        response = self.trader_client.post(f'/users/{self.trader_user.pk}/cash', {'amount': 50})

        self.assertEqual(response.status_code, 201)

        self.assertEqual(self.user.assets.count(), 1)

        cash_asset = self.user.assets.first()

        self.assertEqual(cash_asset.amount, 50)
        self.assertEqual(cash_asset.tr_eq.sym, 'USD_USD')
