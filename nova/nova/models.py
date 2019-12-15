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

    followings = models.ManyToManyField('User', 'followers')

    following_tr_eqs = models.ManyToManyField('TradingEquipment', 'followers')

    following_articles = models.ManyToManyField('Article', related_name='followers')

    following_portfolios = models.ManyToManyField('Portfolio', related_name='followers')

    email_activated = models.BooleanField(blank=True, default=False)

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['created_at', 'date_of_birth', 'groups', 'first_name', 'last_name']


class Article(models.Model):
    created_at = models.DateTimeField(auto_now_add=True)

    # foreign key -> many to one
    author = models.ForeignKey('User', on_delete=models.CASCADE, default=0)

    title = models.CharField(max_length=100)

    content = models.TextField()

    rating = models.FloatField(blank=True, default=0)

    REQUIRED_FIELDS = ['created_at', 'title', 'content']


class TradingEquipment(models.Model):
    TYPE_CHOICES = (
        ('forex', 'forex'),
        ('digital', 'digital'),
        ('stock', 'stock'),
        ('etf', 'etf'),
        ('commodity', 'commodity'),
        ('index', 'index')
    )

    type = models.CharField(max_length=31, choices=TYPE_CHOICES, default='forex')

    name = models.CharField(max_length=255)

    sym = models.CharField(max_length=15, unique=True, blank=True)

    last_updated_daily = models.DateTimeField(null=True, blank=True)

    last_updated_current = models.DateTimeField(null=True, blank=True)

    REQUIRED_FIELDS = ['type', 'name', 'sym']


class Portfolio(models.Model):
    private = models.BooleanField(default=True)

    owner = models.ForeignKey(User, on_delete=models.CASCADE, related_name='portfolios')

    name = models.CharField(max_length=31)

    tr_eqs = models.ManyToManyField(TradingEquipment)


class Comment(models.Model):
    created_at = models.DateTimeField(auto_now_add=True)

    author = models.ForeignKey('User', on_delete=models.CASCADE)

    content = models.TextField()

    REQUIRED_FIELDS = ['created_at', 'author', 'content']


class TradingEquipmentComment(Comment):
    tr_eq = models.ForeignKey(TradingEquipment, on_delete=models.CASCADE)


class ArticleComment(Comment):
    article = models.ForeignKey(Article, on_delete=models.CASCADE)


class Price(models.Model):
    observe_date = models.DateField()
    observe_time = models.TimeField(null=True, default=None)

    tr_eq = models.ForeignKey(TradingEquipment, on_delete=models.CASCADE)

    indicative_value = models.DecimalField(max_digits=15, decimal_places=8)
    bid_value = models.DecimalField(max_digits=15, decimal_places=8, null=True)
    ask_value = models.DecimalField(max_digits=15, decimal_places=8, null=True)

    INTERVAL_CHOICES = (
        ('intraday', 'intraday'),
        ('open', 'open'),
        ('close', 'close'),
        ('high', 'high'),
        ('low', 'low'),
    )

    interval = models.CharField(max_length=31, choices=INTERVAL_CHOICES)


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


class Event(models.Model):
    id = models.CharField(max_length=1000, primary_key=True)

    date = models.DateField()
    time = models.CharField(max_length=10, blank=True)

    name = models.CharField(max_length=1000, blank=True)

    country = models.CharField(max_length=100, blank=True)

    importance = models.PositiveSmallIntegerField(choices=((1, 1), (2, 2), (3, 3)))

    predicted = models.CharField(max_length=100, blank=True)
    value = models.CharField(max_length=100, blank=True)


class Asset(models.Model):
    owner = models.ForeignKey(User, on_delete=models.CASCADE, related_name='assets')

    tr_eq = models.ForeignKey(TradingEquipment, on_delete=models.CASCADE)

    amount = models.DecimalField(max_digits=15, decimal_places=3)


class Notification(models.Model):
    to = models.ForeignKey(User, on_delete=models.CASCADE)

    message = models.TextField()

    created_at = models.DateTimeField(auto_now_add=True)


class Order(models.Model):
    BUY = 1
    SELL = -1

    ABOVE = 1
    BELOW = -1

    TYPE_CHOICES = (
        (BUY, 'BUY'),
        (SELL, 'SELL')
    )

    ORDER_CHOICES = (
        (ABOVE, 'ABOVE'),
        (BELOW, 'BELOW')
    )

    owner = models.ForeignKey(User, on_delete=models.CASCADE)

    max_volume = models.FloatField()

    trigger = models.FloatField()

    type = models.SmallIntegerField(choices=TYPE_CHOICES, default=1)

    choice = models.SmallIntegerField(choices=ORDER_CHOICES)

    tr_eq = models.ForeignKey(TradingEquipment, on_delete=models.CASCADE)
