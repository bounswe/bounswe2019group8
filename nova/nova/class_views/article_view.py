from rest_framework.viewsets import ModelViewSet, GenericViewSet
from ..filters import ArticleFilter
from ..serializers import ArticleSerializer
from rest_framework import mixins, status
from ..models import Article
from ..permissions import IsAuthenticated, IsOwnerOrReadOnly
from rest_framework.response import Response


class ArticleUpdateView(GenericViewSet, mixins.UpdateModelMixin):
    serializer_class = ArticleSerializer
    queryset = Article.objects.all()
    permission_classes = [IsOwnerOrReadOnly, ]








