from django.urls import path
from . import views

urlpatterns = [
    path('users', views.users_coll),
    path('users/<int:pk>', views.user_res),

    path('auth_tokens', views.auth_tokens_coll)
]
