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
    TYPE_CHOICES = (
        ('forex', 'forex'),
        ('digital', 'digital'),
        ('stock', 'stock')
    )

    type = models.CharField(max_length=30, choices=TYPE_CHOICES, default='forex')

    name = models.CharField(max_length=50)

    sym = models.CharField(max_length=12, unique=True, blank=True)

    last_updated = models.DateField(null=True, blank=True)

    REQUIRED_FIELDS = ['type', 'name', 'sym']


class Comment(models.Model):
    created_at = models.DateTimeField(auto_now_add=True)

    author = models.ForeignKey('User', on_delete=models.CASCADE)

    content = models.CharField(max_length = 300)

    REQUIRED_FIELDS = ['created_at', 'author', 'content']


class TradingEquipmentComment(Comment):
    tr_eq = models.ForeignKey(TradingEquipment, on_delete=models.CASCADE)


class ArticleComment(Comment):
    article = models.ForeignKey(Article, on_delete=models.CASCADE)


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
        ('daily', 'daily'),
        ('weekly', 'weekly'),
        ('monthly', 'monthly')
    )

    interval_category = models.CharField(max_length=32, choices=INTERVAL_CHOICES, default='daily')

    observed_at = models.DateTimeField()

    tr_eq = models.ForeignKey(TradingEquipment, on_delete=models.CASCADE, null=True)

    open = models.DecimalField(max_digits=15, decimal_places=8)

    close = models.DecimalField(max_digits=15, decimal_places=8)

    high = models.DecimalField(max_digits=15, decimal_places=8)

    low = models.DecimalField(max_digits=15, decimal_places=8)


    REQUIRED_FIELDS = ['observed_at', 'interval_category', 'tr_eq', 'open', 'close', 'high', 'low']


class Prediction(models.Model):
    UPVOTE = 1
    DOWNVOTE = -1

    VOTE_CHOICES = (
        (UPVOTE, 'will_rise'),
        (DOWNVOTE, 'will_decline')
    )

    predictor = models.ForeignKey(User, on_delete=models.CASCADE)

    tr_eq = models.ForeignKey(TradingEquipment, on_delete=models.CASCADE)

    vote = models.SmallIntegerField(choices=VOTE_CHOICES)


class LikeDislike(models.Model):
    LIKE = 1
    DISLIKE = -1

    LIKE_DISLIKE_CHOICES = (
        (LIKE, 'like'),
        (DISLIKE, 'dislike')
    )

    liker = models.ForeignKey(User, on_delete=models.CASCADE)

    choice = models.SmallIntegerField(choices=LIKE_DISLIKE_CHOICES)


class ArticleLikeDislike(LikeDislike):
    article = models.ForeignKey(Article, on_delete=models.CASCADE)

class CommentLikeDislike(LikeDislike):
    comment = models.ForeignKey(Comment, on_delete=models.CASCADE)
