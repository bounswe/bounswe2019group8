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

    sym = models.CharField(max_length=12, unique=True, blank=True)

    #daily_prices =  ArrayField(models.FloatField(), default=list)

    #weekly_prices = ArrayField(models.FloatField(), default=list)

    #monthly_prices = ArrayField(models.FloatField(), default=list)

    #current_price = ArrayField(models.FloatField(), default=list)

    REQUIRED_FIELDS = ['type', 'name', 'sym']


class Comment(models.Model):
    created_at = models.DateTimeField(auto_now_add=True)

    ## article comment, foreignkey -> many to one
    article = models.ForeignKey('Article' , on_delete=models.CASCADE, null = True)

    ## trading equipment comment
    trading_eq = models.ForeignKey(TradingEquipment, on_delete=models.CASCADE, null=True)

    author = models.ForeignKey('User', on_delete=models.CASCADE)

    content = models.CharField(max_length = 300)

    REQUIRED_FIELDS = ['created_at', 'author', 'content']


class Parity(models.Model):

    # COMMENTS ARE RELATED TO ALPHAVANTAGE

    # for intraday, we can set the time interval for 10mins, which results in 144 entries per day
    # At the end of the day we can clear the previous data from database

    # for weekly, we can store the last 156 weeks = 3 years
    # Once a week, we can update these 156 week data

    # for monthly, we can store the last 36 months = 3 years
    # Once a month, we can update these 36 months data

    INTERVAL_CHOICES = (
        ('intraday', 'intraday'),
        ('weekly', 'weekly'),
        ('monthly', 'monthly')
    )

    interval_category = models.CharField(max_length=32, choices=INTERVAL_CHOICES, default='weekly')

    observed_at = models.DateTimeField(blank=True)

    tr_eq = models.ForeignKey(TradingEquipment, on_delete=models.CASCADE, null=True)

    open = models.DecimalField(max_digits=14, decimal_places=8, blank=False)

    close = models.DecimalField(max_digits=14, decimal_places=8, blank=False)

    high = models.DecimalField(max_digits=14, decimal_places=8, blank=False)

    low = models.DecimalField(max_digits=14, decimal_places=8, blank=False)

    REQUIRED_FIELDS = ['observed_at', 'interval_category', 'tr_eq', 'open', 'close', 'high', 'low']

