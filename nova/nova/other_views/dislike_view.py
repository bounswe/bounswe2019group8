from rest_framework import permissions
from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.exceptions import NotFound
from rest_framework.response import Response

from ..models import Article, ArticleLikeDislike, Comment, CommentLikeDislike
from ..serializers import ArticleLikeDislikeSerializer, CommentLikeDislikeSerializer

@api_view(['GET', 'POST', 'DELETE'])
@permission_classes((permissions.IsAuthenticated,))
def dislikes_article_coll(request, pk):
    try:
        article = Article.objects.get(pk = pk)
    except Article.DoesNotExist:
        raise NotFound()

    dislike = ArticleLikeDislike.objects.filter(article=article, choice=-1, liker=request.user)

    if request.method == 'GET':
        dislikes = ArticleLikeDislike.objects.filter(article=article, choice=-1)
        serializer = ArticleLikeDislikeSerializer(dislikes, many=True)
        return Response(serializer.data, status.HTTP_200_OK)

    elif request.method == 'POST':
        if len(dislike) != 0:
            return Response('You already disliked this.', status.HTTP_400_BAD_REQUEST)
        else:
            article_dislike = ArticleLikeDislike.objects.create(
                article = article,
                liker = request.user,
                choice = -1
            )
            article_dislike.save()
            return Response(status.HTTP_201_CREATED)

    elif request.method == 'DELETE':
        if len(dislike) == 0:
            return Response('You have not disliked this already.', status.HTTP_400_BAD_REQUEST)
        else:
            dislike.delete()
            return Response(status.HTTP_200_OK)


@api_view(['GET', 'POST', 'DELETE'])
@permission_classes((permissions.IsAuthenticated,))
def dislikes_comment_coll(request, pk):
    try:
        comment = Comment.objects.get(pk = pk)
    except Comment.DoesNotExist:
        raise NotFound()

    dislike = CommentLikeDislike.objects.filter(comment = comment, choice=-1, liker=request.user)

    if request.method == 'GET':
        dislikes = CommentLikeDislike.objects.filter(comment = comment, choice=-1)
        serializer = CommentLikeDislikeSerializer(dislikes, many=True)
        return Response(serializer.data, status.HTTP_200_OK)

    elif request.method == 'POST':
        if len(dislike) != 0:
            return Response('You already disliked this.', status.HTTP_400_BAD_REQUEST)
        else:
            comment_dislike = CommentLikeDislike.objects.create(
                comment = comment,
                liker = request.user,
                choice = -1
            )
            comment_dislike.save()
            return Response(status.HTTP_201_CREATED)

    elif request.method == 'DELETE':
        if len(dislike) == 0:
            return Response('You have not disliked this already.', status.HTTP_400_BAD_REQUEST)
        else:
            dislike.delete()
            return Response(status.HTTP_200_OK)