import itertools

from django.db.models import Q
from rest_framework.decorators import api_view
from rest_framework.response import Response

from nova.models import User, Article, Portfolio
from nova.serializers import ArticleSerializer, PortfolioSerializer

recommendation_size = 10


@api_view(['GET'])
def article_recommendations_coll(request):
    user = User.objects.get(pk=request.user.pk)

    followings = user.followings.all()
    followers = user.followers.all()

    articles_of_followings = {article for following in followings for article in following.article_set.all()}
    articles_of_followers = {article for follower in followers for article in follower.article_set.all()}

    articles_of_relationships = articles_of_followings | articles_of_followers
    articles_of_relationships = set(itertools.islice(articles_of_relationships, recommendation_size))

    fill_articles = set(Article.objects.filter(
        ~Q(pk__in=[article.pk for article in articles_of_relationships])
    )[:recommendation_size - len(articles_of_relationships)])

    serializer = ArticleSerializer(articles_of_relationships | fill_articles, many=True)

    return Response(serializer.data)


@api_view(['GET'])
def portfolio_recommendations_coll(request):
    user = User.objects.get(pk=request.user.pk)

    followings = user.followings.all()
    followers = user.followers.all()

    portfolios_of_followings = {portfolio for following in followings for portfolio in following.portfolios.all()}
    portfolios_of_followers = {portfolio for follower in followers for portfolio in follower.portfolios.all()}

    portfolios_of_relationships = portfolios_of_followings | portfolios_of_followers
    portfolios_of_relationships = set(itertools.islice(portfolios_of_relationships, recommendation_size))

    fill_portfolios = set(Portfolio.objects.filter(
        ~Q(pk__in=[article.pk for article in portfolios_of_relationships])
    )[:recommendation_size - len(portfolios_of_relationships)])

    serializer = PortfolioSerializer(portfolios_of_relationships | fill_portfolios, many=True)

    return Response(serializer.data)
