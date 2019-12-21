from django.conf.urls.static import static
from django.urls import path, re_path

from nova.internal_views import alphavantage as av_views
from nova.internal_views import nasdaq as nasdaq_views
from nova.views import articles as article_views, auth_tokens as auth_token_views, \
    comments as comment_views, events as event_views, likes as like_views, dislikes as dislike_views, \
    users as user_views, \
    trading_equipments as trading_equipment_views, \
    portfolios as portfolio_views, assets as asset_views, \
    annotations as annotation_views, \
    notifications as notification_views, \
    recommendations as recommendation_views, \
    prices as price_views, \
    semantic_search as semantic_search_views

from .settings import MEDIA_URL, MEDIA_ROOT
from .swagger import get_swagger_view

urlpatterns = [
    # Swagger
    path('', get_swagger_view(title='Mercatus - Nova API Documentation')),

    # Users
    path('users', user_views.users_coll),

    path('users/<int:pk>', user_views.user_res),

    path('users/<int:pk>/followings', user_views.user_followings_coll),

    path('users/<int:user_pk>/followings/<int:following_pk>', user_views.user_following_res),

    path('users/<int:pk>/followers', user_views.user_followers_coll),

    path('users/<int:pk>/articles', article_views.article_of_users_res),

    path('user_searches', user_views.user_searches_res),

    # Auth tokens
    path('auth_tokens', auth_token_views.auth_tokens_coll),

    # Activation
    path('activations/<uidb64>/<token>', user_views.activate_account),

    # Articles
    path('articles', article_views.article_coll),

    path('articles/<int:pk>', article_views.article_res),

    path('articles/<int:pk>/comments', comment_views.comment_coll_article),

    path('articles/<int:pk>/likes', like_views.likes_article_coll),

    path('articles/<int:pk>/dislikes', dislike_views.dislikes_article_coll),

    # Trading Equipments

    path('trading_equipments', trading_equipment_views.trading_eq_coll),

    path('trading_equipments/digital', trading_equipment_views.trading_eq_digital_coll),

    path('trading_equipments/forex', trading_equipment_views.trading_eq_forex_coll),

    path('trading_equipments/<int:pk>', trading_equipment_views.trading_eq_res),

    path('trading_equipments/<int:pk>/comments', comment_views.comment_coll_tr_eq),

    path('trading_equipments/<int:pk>/predictions/upvotes', trading_equipment_views.upvotes_tr_eq),

    path('trading_equipments/<int:pk>/predictions/downvotes', trading_equipment_views.downvotes_tr_eq),

    path('trading_equipment_searches', trading_equipment_views.tr_eq_searches),

    # Prices
    path('trading_equipments/<str:tr_eq_sym>/prices/daily', price_views.daily_prices_coll),

    path('trading_equipments/<str:tr_eq_sym>/prices/intradaily', price_views.intradaily_prices_coll),

    path('trading_equipments/<str:tr_eq_sym>/prices/current', price_views.current_price_res),

    # Comments
    path('comments/<int:pk>', comment_views.comment_res),

    path('comments/<int:pk>/likes', like_views.likes_comment_coll),

    path('comments/<int:pk>/dislikes', dislike_views.dislikes_comment_coll),

    # Portfolios
    path('users/<int:user_pk>/portfolios', portfolio_views.portfolios_coll),

    path('users/<int:user_pk>/portfolios/<int:portfolio_pk>', portfolio_views.portfolios_res),

    path('users/<int:user_pk>/following_portfolios/<int:portfolio_pk>', portfolio_views.user_following_portfolios_res),

    path('users/<int:user_pk>/following_portfolios', portfolio_views.user_following_portfolios_coll),

    # Events
    path('events/<date>', event_views.events_coll),

    # Assets
    path('users/<int:user_pk>/cash', asset_views.cash_coll),

    path('users/<int:user_pk>/assets', asset_views.assets_coll),

    # Annotations
    path('articles/<int:article_pk>/annotations', annotation_views.annotations_coll),

    path('articles/<int:article_pk>/annotations/<int:annotation_pk>', annotation_views.annotation_res),

    # Notifications
    path('users/<int:user_pk>/notifications', notification_views.notifications_coll),

    path('users/<int:user_pk>/notifications/count', notification_views.notifications_coll_count),

    # Internal
    path('cron_jobs/nasdaq_intradaily', nasdaq_views.fetch_all_intradaily),

    path('cron_jobs/nasdaq_daily', nasdaq_views.fetch_all_daily),

    path('cron_jobs/av_intradaily', av_views.fill_intraday),

    path('cron_jobs/av_daily', av_views.fill_daily),

    # Recommendations
    path('articles/recommendations', recommendation_views.article_recommendations_coll),

    path('portfolios/recommendations', recommendation_views.portfolio_recommendations_coll),

    # Semantic Search
    path('semantic_search', semantic_search_views.search_articles),

] + static(MEDIA_URL, document_root=MEDIA_ROOT)
