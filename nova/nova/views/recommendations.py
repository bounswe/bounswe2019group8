import itertools

from django.db.models import Q
from rest_framework.decorators import api_view
from rest_framework.response import Response

from nova.models import User, Article
from nova.serializers import ArticleSerializer

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

