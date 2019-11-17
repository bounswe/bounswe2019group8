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

    email_activated = models.BooleanField(blank=True, default=False)

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['created_at', 'date_of_birth', 'groups', 'first_name', 'last_name']

class Article(models.Model):
    created_at = models.DateTimeField(auto_now_add=True)

    ## foreign key -> many to one
    author = models.ForeignKey('User', on_delete=models.CASCADE, default=0)

    title = models.CharField(max_length=100)

    content = models.CharField(max_length=3000)

    rating = models.FloatField(blank=True, default=0)

    REQUIRED_FIELDS = ['created_at', 'title',  'content']



class TradingEquipment(models.Model):
    type = models.CharField(max_length=30)

    name = models.CharField(max_length=50)

    daily_prices =  ArrayField(models.FloatField(), default=list)

    current_price = models.FloatField(default=0)

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


class Parity(models.Model):
    observed_at = models.DateTimeField(blank=True)

    from_eq = models.ForeignKey(TradingEquipment, on_delete=models.CASCADE, blank=False, related_name='parity_from')

    to_eq  = models.ForeignKey(TradingEquipment, on_delete=models.CASCADE, blank=False, related_name='parity_to')

    open = models.DecimalField(max_digits=14, decimal_places=8, blank=False)

    close = models.DecimalField(max_digits=14, decimal_places=8, blank=False)

    high = models.DecimalField(max_digits=14, decimal_places=8, blank=False)

    low = models.DecimalField(max_digits=14, decimal_places=8, blank=False)

    REQUIRED_FIELDS = ['observed_at', 'from_eq', 'from_to', 'open', 'close', 'high', 'low']