from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework import status
from ..models import Article
from ..serializers import ArticleSerializer
from ..permissions import IsGetOrIsAuthenticated, is_user_in_group
from rest_framework.exceptions import PermissionDenied, NotFound
from rest_framework import permissions


@api_view(['GET', 'POST'])
@permission_classes((IsGetOrIsAuthenticated, ))
def article_coll(request):
    # GET ALL ARTICLES
    if request.method == 'GET':
        articles = Article.objects.all()
        serializer = ArticleSerializer(articles, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
    # CREATE ARTICLE
    elif request.method == 'POST':
        data = request.data
        data['author'] = request.user.pk
        serializer = ArticleSerializer(data=data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['PUT', 'DELETE', 'GET'])
@permission_classes((permissions.IsAuthenticated, ))
def article_res(request, pk):
    try:
        article = Article.objects.get(pk = pk)
    except Article.DoesNotExist:
        raise NotFound()

    serializer = ArticleSerializer(article, request.data, partial=True)
    if not serializer.is_valid():
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    author_pk = article.author.pk

    # UPDATE ARTICLE
    if request.method == 'PUT':
        if not is_user_in_group(request.user, "admin") and request.user.pk != author_pk:
            raise PermissionDenied()
        serializer.save()
        return Response(serializer.data, status=status.HTTP_200_OK)

    #DELETE ARTICLE
    elif request.method == 'DELETE':
        if not is_user_in_group(request.user, "admin") and request.user.pk != author_pk:
            raise PermissionDenied()

        article.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)

    #GET SPECIFIC ARTICLE
    elif request.method == 'GET':
        return Response(serializer.data)
