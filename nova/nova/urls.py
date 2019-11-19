from django.urls import path

from nova.other_views import article_view, trading_eq_view, comment_view
from . import views





urlpatterns = [
    path('users', views.users_coll),
    path('users/<int:pk>', views.user_res),

    path('users/<int:pk>/followings', views.user_followings_coll),
    path('users/<int:user_pk>/followings/<int:following_pk>', views.user_following_res),

    path('users/<int:pk>/followers', views.user_followers_coll),
 
    path('auth_tokens', views.auth_tokens_coll),

    path('user_searches', views.user_searches_res),

    path('activations/<uidb64>/<token>', views.activate_account),

    path('articles', article_view.article_coll),

    path('articles/<int:pk>', article_view.article_res),

    path('articles/<int:pk>/comments', comment_view.comment_coll_article),

    path('trading_equipments', trading_eq_view.trading_eq_coll),

    path('trading_equipments/<int:pk>', trading_eq_view.trading_eq_res),

    path('trading_equipments/<int:pk>/comments', comment_view.comment_coll_tr_eq),

    path('comments/<int:pk>', comment_view.comment_res)
]
