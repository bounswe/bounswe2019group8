from django.contrib.auth.models import AbstractUser
from django.db import models


class User(AbstractUser):
    created_at = models.DateTimeField(auto_now_add=True)

    date_of_birth = models.DateField()

    lat = models.FloatField()

    long = models.FloatField()

    profile_image = models.ImageField()

    email = models.EmailField(unique=True)

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['created_at', 'date_of_birth', 'password']

