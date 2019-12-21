import requests
from django.db.models import Q
from django.db.models.fields import CharField, TextField
from rest_framework import permissions
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response

from nova.models import Article, ArticleComment, Annotation, Event
from nova.serializers import ArticleSerializer, CommentSerializer, AnnotationSerializer, EventSerializer
from nova.settings import SEMANTIC_SEARCH_URL

similar_count = 10

models_serializers = [
    ('article', Article, ArticleSerializer),
    ('comment', ArticleComment, CommentSerializer),
    ('annotation', Annotation, AnnotationSerializer),
    ('event', Event, EventSerializer)
]


@api_view(['GET'])
@permission_classes((permissions.AllowAny,))
def search_articles(request):
    keyword = request.GET.get('keyword', '')
    search_for = request.GET.get('type', 'all')

    response = requests.get(
        SEMANTIC_SEARCH_URL,
        {
            'ml': keyword,
            'max': similar_count
        }
    )

    response_json = response.json()

    all_words = [obj['word'] for obj in response_json] + keyword.split('+')

    total_data = None

    for name, model, serializer in models_serializers:
        if name != search_for and search_for != "all":
            continue
        print(name)

        fields = [f.name for f in model._meta.fields if isinstance(f, CharField) or isinstance(f, TextField)]
        queries = [Q(**{field + '__icontains': word}) for field in fields for word in all_words]

        queries_union = Q()
        for query in queries:
            queries_union = queries_union | query

        serializer = serializer(model.objects.filter(queries_union), many=True)

        data = [{**d, "type": name} for d in serializer.data]

        if total_data is None:
            total_data = data
        else:
            total_data += data

    return Response(total_data)
