import requests
from django.db.models import Q
from django.db.models.fields import CharField, TextField
from rest_framework import permissions
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response

from nova.models import Article
from nova.serializers import ArticleSerializer
from nova.settings import SEMANTIC_SEARCH_URL

similar_count = 10


@api_view(['GET'])
@permission_classes((permissions.AllowAny,))
def search_articles(request):
    keyword = request.GET.get('keyword', '')

    response = requests.get(
        SEMANTIC_SEARCH_URL,
        {
            'ml': keyword,
            'max': similar_count
        }
    )

    response_json = response.json()

    all_words = [obj['word'] for obj in response_json] + keyword.split('+')

    fields = [f.name for f in Article._meta.fields if isinstance(f, CharField) or isinstance(f, TextField)]
    queries = [Q(**{field + '__icontains': word}) for field in fields for word in all_words]

    queries_union = Q()
    for query in queries:
        queries_union = queries_union | query

    articles = Article.objects.filter(queries_union)
    serializer = ArticleSerializer(articles, many=True)

    return Response(serializer.data)
