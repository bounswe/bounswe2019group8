from django.urls import path

from nova.class_views.article_view import ArticleUpdateView
from nova.class_views.trading_eq_view import TradingEquipmentViewSet
from . import views
from rest_framework import routers
from django.conf.urls import url, include

router = routers.DefaultRouter()
router.register(r'equipments', TradingEquipmentViewSet)
router.register(r'articles', ArticleUpdateView)


urlpatterns = [
    path('users', views.users_coll),
    path('users/<int:pk>', views.user_res),

    path('users/<int:pk>/followings', views.user_followings_coll),
    path('users/<int:user_pk>/followings/<int:following_pk>', views.user_following_res),

    path('users/<int:pk>/followers', views.user_followers_coll),
 
    path('auth_tokens', views.auth_tokens_coll),

    path('user_searches', views.user_searches_res),

    path('activations/<uidb64>/<token>', views.activate_account),

    path('articles', views.article_coll),

    url(r'^', include(router.urls))
]
