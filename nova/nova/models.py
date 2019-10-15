from django.db import models
from django.contrib.auth.models import Group

from django.contrib.auth.models import AbstractUser


class User(AbstractUser):
    created_at = models.DateTimeField(auto_now_add=True)

    date_of_birth = models.DateField()

    lat, long = models.FloatField(), models.FloatField()

    profile_image = models.ImageField()
