# - annotation --> /articles/<article-id>/annotations POST yaparsa yeni annotation
# GET yaparsa tüm annotationlar
# /<ann-id>'ye DELETE yaparsa annotation'ı sil

from rest_framework.decorators import api_view, permission_classes
from rest_framework.exceptions import NotFound, PermissionDenied
from rest_framework import status
from rest_framework.response import Response
from rest_framework import permissions

from nova.models import Article
from nova.permissions import is_user_in_group
from nova.serializers import AnnotationSerializer
from nova.utils.dicts import get_subdict


# /articles/<article_pk>/annotations
@api_view(['GET', 'POST'])
@permission_classes((permissions.IsAuthenticated,))
def annotations_coll(request, article_pk):
    try:
        article = Article.objects.get(pk=article_pk)
    except Article.DoesNotExist:
        raise NotFound()

    if request.method == 'GET':
        anns = article.annotations.all()
        serializer = AnnotationSerializer(anns, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

    elif request.method == 'POST':
        serializer = AnnotationSerializer(
            data={**get_subdict(request.data, ['from_position', 'to_position', 'content']),
                  'owner': request.user.pk,
                  'article': article.pk})

        print(serializer)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


# /articles/<article_pk>/annotations/<annotation_pk>
@api_view(['PUT', 'DELETE', 'GET'])
@permission_classes((permissions.IsAuthenticated,))
def annotation_res(request, article_pk, annotation_pk):
    try:
        article = Article.objects.get(pk=article_pk)
        ann = article.annotations.get(pk=annotation_pk)
    except:
        raise NotFound()

    serializer = AnnotationSerializer(ann, request.data, partial=True)

    if not serializer.is_valid():
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    if request.method == 'GET':
        return Response(serializer.data, status=status.HTTP_200_OK)
    else:
        if (not is_user_in_group(request.user, "admin")) and ann.owner.pk != request.user.pk:
            raise PermissionDenied()

        if request.method == 'PUT':
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        elif request.method == 'DELETE':
            ann.delete()
            return Response(status=status.HTTP_204_NO_CONTENT)
