from django.contrib.auth.models import AbstractUser
from django.db import models
from rest_framework.serializers import ModelSerializer
from django.contrib.postgres.fields import ArrayField

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

    followings = models.ManyToManyField('User', 'followers')

    following_tr_eqs = models.ManyToManyField('TradingEquipment', 'followers')

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['created_at', 'date_of_birth', 'groups', 'first_name', 'last_name']

class Article(models.Model):
    created_at = models.DateTimeField(auto_now_add=True)

    ## foreign key -> many to one
    author = models.ForeignKey(User, on_delete=models.CASCADE)

    title = models.CharField(max_length=100)

    content = models.CharField(max_length=3000)

    rating = models.FloatField(blank=True, default=0)

    REQUIRED_FIELDS = ['created_at', 'title', 'author', 'content']



class TradingEquipment(models.Model):
    type = models.CharField(max_length=30)

    name = models.CharField(max_length=50)

    daily_prices =  ArrayField(ArrayField(models.FloatField()))

    current_price = models.FloatField()

    REQUIRED_FIELDS = ['type', 'name']


class Comment(models.Model):
    created_at = models.DateTimeField(auto_now_add=True)

    ## article comment, foreignkey -> many to one
    article = models.ForeignKey(Article, on_delete=models.CASCADE)

    ## trading equipment comment
    trading_eq = models.ForeignKey(TradingEquipment, on_delete=models.CASCADE)

    author = models.OneToOneField(User, on_delete=models.CASCADE)

    content = models.CharField(max_length = 300)

    REQUIRED_FIELDS = ['created_at', 'author']