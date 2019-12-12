from django.urls import path

from nova.other_views import article_view, trading_eq_view, comment_view, like_view, dislike_view, parity_view, \
    events as events_views
from . import views, nasdaq

urlpatterns = [
    path('users', views.users_coll),
    path('users/<int:pk>', views.user_res),

    path('users/<int:pk>/followings', views.user_followings_coll),

    path('users/<int:user_pk>/followings/<int:following_pk>', views.user_following_res),

    path('users/<int:pk>/followers', views.user_followers_coll),

    path('users/<int:pk>/articles', article_view.article_of_users_res),

    path('auth_tokens', views.auth_tokens_coll),

    path('user_searches', views.user_searches_res),

    path('activations/<uidb64>/<token>', views.activate_account),

    path('articles', article_view.article_coll),

    path('articles/<int:pk>', article_view.article_res),

    path('articles/<int:pk>/comments', comment_view.comment_coll_article),

    path('articles/<int:pk>/likes', like_view.likes_article_coll),

    path('articles/<int:pk>/dislikes', dislike_view.dislikes_article_coll),

    path('trading_equipments', trading_eq_view.trading_eq_coll),

    path('trading_equipments/digital', trading_eq_view.trading_eq_digital_coll),

    path('trading_equipments/forex', trading_eq_view.trading_eq_forex_coll),

    path('trading_equipments/<int:pk>', trading_eq_view.trading_eq_res),

    path('trading_equipments/<int:pk>/comments', comment_view.comment_coll_tr_eq),

    path('trading_equipments/<int:pk>/predictions/upvotes', trading_eq_view.upvotes_tr_eq),

    path('trading_equipments/<int:pk>/predictions/downvotes', trading_eq_view.downvotes_tr_eq),

    path('comments/<int:pk>', comment_view.comment_res),

    path('comments/<int:pk>/likes', like_view.likes_comment_coll),

    path('comments/<int:pk>/dislikes', dislike_view.dislikes_comment_coll),

    path('trading_equipment_searches', trading_eq_view.tr_eq_searches),

    # Events
    path('events/<date>', events_views.events_coll),

    # TEMPORARY ENDPOINTS FOR TESTS

    path('cnt', trading_eq_view.cnt),

    path('cron_jobs/nasdaq_intradaily', nasdaq.fetch_all_intradaily),

    path('cron_jobs/nasdaq_daily', nasdaq.fetch_all_daily),
]
