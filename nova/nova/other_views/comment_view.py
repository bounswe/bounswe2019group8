from rest_framework import status
from rest_framework import permissions
from rest_framework.decorators import permission_classes, api_view

from nova.serializers import CommentSerializer, ArticleCommentSerializer, TradingEquipmentCommentSerializer
from ..permissions import is_user_in_group
from ..models import Comment, Article, TradingEquipment, ArticleComment, TradingEquipmentComment

from rest_framework.exceptions import PermissionDenied, NotFound


from rest_framework.response import Response


@api_view(['POST', 'GET'])
@permission_classes((permissions.IsAuthenticated, ))
def comment_coll_article(request, pk):
    try:
        article = Article.objects.get(pk=pk)
    except Article.DoesNotExist:
        raise NotFound()

    if request.method == 'GET':
        comments = ArticleComment.objects.filter(article = pk)
        serializer = ArticleCommentSerializer(comments, many = True)
        return Response(serializer.data, status = status.HTTP_200_OK)

    elif request.method == 'POST':

        comment = request.data
        comment['author'] = request.user.pk
        comment['article'] = article.pk
        serializer = ArticleCommentSerializer(data = comment)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['POST', 'GET'])
@permission_classes((permissions.IsAuthenticated, ))
def comment_coll_tr_eq(request, pk):
    try:
        tr_eq = TradingEquipment.objects.get(pk=pk)
    except TradingEquipment.DoesNotExist:
        raise NotFound()

    if request.method == 'GET':
        comments = TradingEquipmentComment.objects.filter(tr_eq = pk)
        serializer = TradingEquipmentCommentSerializer(comments, many = True)
        return Response(serializer.data, status = status.HTTP_200_OK)

    elif request.method == 'POST':
        comment = request.data
        comment['author'] = request.user.pk
        comment['tr_eq'] = tr_eq.pk
        serializer = TradingEquipmentCommentSerializer(data = comment)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['PUT', 'DELETE'])
@permission_classes((permissions.IsAuthenticated, ))
def comment_res(request, pk):
    try:
        comment = Comment.objects.get(pk = pk)
    except Comment.DoesNotExist:
        raise NotFound()

    author_pk = comment.author.pk
    serializer = CommentSerializer(comment, request.data, partial=True)

    if request.method == 'PUT':
        if not is_user_in_group(request.user, "admin") and request.user.pk != author_pk:
            raise PermissionDenied()
        if serializer.is_valid():
            serializer.save()
        else:
            return  Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        return Response(serializer.data, status=status.HTTP_200_OK)

    elif request.method == 'DELETE':
        print(str(request.user.pk)+ " " + str(author_pk))
        if not is_user_in_group(request.user, "admin") and request.user.pk != author_pk:
            raise PermissionDenied()
        comment = Comment.objects.get(pk = pk)
        comment.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)

