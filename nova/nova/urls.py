from django.urls import path
from . import views

urlpatterns = [
    path('users', views.users_coll),
    path('users/<int:pk>', views.user_res),

    path('users/<int:pk>/followings', views.user_followings_coll),
    path('users/<int:user_pk>/followings/<int:following_pk>', views.user_following_res),

    path('users/<int:pk>/followers', views.user_followers_coll),

    path('auth_tokens', views.auth_tokens_coll)
]
