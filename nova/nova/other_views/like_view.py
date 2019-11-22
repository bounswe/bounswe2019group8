from rest_framework import permissions
from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.exceptions import NotFound
from rest_framework.response import Response

from ..models import Article, ArticleLikeDislike, Comment, CommentLikeDislike
from ..serializers import ArticleLikeDislikeSerializer, CommentLikeDislikeSerializer

@api_view(['GET', 'POST', 'DELETE'])
@permission_classes((permissions.IsAuthenticated,))
def likes_article_coll(request, pk):
    try:
        article = Article.objects.get(pk = pk)
    except Article.DoesNotExist:
        raise NotFound()


    like = ArticleLikeDislike.objects.filter(article=article, choice=1, liker=request.user)
    print(len(like))
    if request.method == 'GET':
        likes = ArticleLikeDislike.objects.filter(article=article, choice=1)
        serializer = ArticleLikeDislikeSerializer(likes, many=True)
        return Response(serializer.data, status.HTTP_200_OK)

    elif request.method == 'POST':
        if len(like) != 0:
            return Response('You already liked this.', status.HTTP_400_BAD_REQUEST)
        else:
            article_like = ArticleLikeDislike.objects.create(
                article = article,
                liker = request.user,
                choice = 1
            )
            article_like.save()
            return Response(status.HTTP_201_CREATED)

    elif request.method == 'DELETE':
        if len(like) == 0:
            return Response('You have not liked this already.', status.HTTP_400_BAD_REQUEST)
        else:
            like.delete()
            return Response(status.HTTP_200_OK)

@api_view(['GET', 'POST', 'DELETE'])
@permission_classes((permissions.IsAuthenticated,))
def likes_comment_coll(request, pk):
    try:
        comment = Comment.objects.get(pk = pk)
    except Comment.DoesNotExist:
        raise NotFound()


    like = CommentLikeDislike.objects.filter(comment = comment, choice = 1, liker = request.user)

    if request.method == 'GET':
        likes = CommentLikeDislike.objects.filter(comment=comment, choice=1)
        serializer = CommentLikeDislikeSerializer(likes, many=True)
        return Response(serializer.data, status.HTTP_200_OK)

    elif request.method == 'POST':
        if len(like) != 0:
            return Response('You already liked this.', status.HTTP_400_BAD_REQUEST)
        else:
            comment_like = CommentLikeDislike.objects.create(
                comment = comment,
                liker = request.user,
                choice = 1
            )
            comment_like.save()
            return  Response(status.HTTP_201_CREATED)
    elif request.method == 'DELETE':
        if len(like) == 0:
            return Response('You have not liked this already.', status.HTTP_400_BAD_REQUEST)
        else:
            like.delete()
            return Response(status.HTTP_200_OK)



