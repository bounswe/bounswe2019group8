from django.contrib.auth.models import AbstractUser
from django.db import models


class User(AbstractUser):
    created_at = models.DateTimeField(auto_now_add=True)

    username = None

    date_of_birth = models.DateField()

    lat = models.FloatField(blank=True, default=0)

    long = models.FloatField(blank=True, default=0)

    profile_image = models.ImageField(upload_to='images', blank=True)

    email = models.EmailField(unique=True)

    first_name = models.CharField(max_length=30)
    last_name = models.CharField(max_length=150)

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['created_at', 'date_of_birth', 'groups', 'first_name', 'last_name']
