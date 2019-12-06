from django.contrib.auth.hashers import make_password
from django.contrib.auth.models import Group
from rest_framework import serializers

from .libs.serializers import NovaSerializer
from .models import User, Article, TradingEquipment, Comment, Parity, TradingEquipmentComment, ArticleComment, \
    Prediction, LikeDislike, ArticleLikeDislike, CommentLikeDislike, Event, CurrentPrice, Asset, Notification, Order, \
    Currency


class UserBasicSerializer(NovaSerializer):
    class Meta:
        model = User
        fields = ['pk', 'first_name', 'last_name']


class UserSerializer(NovaSerializer):
    class Meta:
        model = User
        fields = ['email', 'lat', 'long', 'first_name', 'last_name', 'date_of_birth', 'profile_image', 'password', 'pk',
                  'groups', 'followers', 'followings', 'email_activated']
        read_only_fields = ['followers', 'followings']
        create_only_fields = ['first_name', 'last_name']

    followers = UserBasicSerializer(read_only=True, many=True)
    followings = UserBasicSerializer(read_only=True, many=True)

    password = serializers.CharField(
        write_only=True,
        required=True,
        style={'input_type': 'password', 'placeholder': 'Password'}
    )

    def validate(self, attrs):
        if len(attrs.get('groups', [])) != 1:
            attrs['groups'] = Group.objects.filter(name="basic")

        return attrs

    def create(self, validated_data):
        validated_data['password'] = make_password(validated_data.get('password'))

        return super(UserSerializer, self).create(validated_data)

    def update(self, instance, validated_data):
        if 'password' in validated_data:
            validated_data['password'] = make_password(validated_data['password'])
        return super(UserSerializer, self).update(instance, validated_data)


class ArticleSerializer(NovaSerializer):
    class Meta:
        model = Article
        fields = ['author', 'title', 'content', 'rating', 'pk']
        create_only_fields = ['author']

    def create(self, data):
        return super(ArticleSerializer, self).create(data)

    def update(self, instance, data):
        return super(ArticleSerializer, self).update(instance, data)


class TradingEquipmentSerializer(NovaSerializer):
    class Meta:
        model = TradingEquipment
        fields = ['type', 'name', 'sym', 'pk', 'last_updated_daily', 'last_updated_current']
        create_only_fields = ['type', 'name', 'sym']

    def create(self, data):
        return super(TradingEquipmentSerializer, self).create(data)

    def update(self, instance, data):
        return super(TradingEquipmentSerializer, self).update(instance, data)


class CommentSerializer(NovaSerializer):
    class Meta:
        model = Comment
        create_only_fields = ['author']
        fields = ['author', 'content', 'pk']

    def create(self, data):
        return super(CommentSerializer, self).create(data)

    def update(self, instance, data):
        return super(CommentSerializer, self).update(instance, data)


class TradingEquipmentCommentSerializer(NovaSerializer):
    class Meta:
        model = TradingEquipmentComment
        fields = ['author', 'content', 'pk', 'tr_eq']

    def create(self, data):
        return super(TradingEquipmentCommentSerializer, self).create(data)

    def update(self, instance, validated_data):
        return super(TradingEquipmentCommentSerializer, self).update(instance, validated_data)


class ArticleCommentSerializer(NovaSerializer):
    class Meta:
        model = ArticleComment
        fields = ['author', 'content', 'pk', 'article']

    def create(self, data):
        return super(ArticleCommentSerializer, self).create(data)

    def update(self, instance, validated_data):
        return super(ArticleCommentSerializer, self).update(instance, validated_data)


class PredictionSerializer(NovaSerializer):
    class Meta:
        model = Prediction
        fields = ['predictor', 'tr_eq', 'vote']

    def create(self, data):
        return super(PredictionSerializer, self).create(data)

    def update(self, instance, validated_data):
        return super(PredictionSerializer, self).update(instance, validated_data)


class LikeDislikeSerializer(NovaSerializer):
    class Meta:
        model = LikeDislike
        fields = ['liker', 'choice']

    def create(self, data):
        return super(LikeDislikeSerializer, self).create(data)

    def update(self, instance, validated_data):
        return super(LikeDislikeSerializer, self).update(instance, validated_data)


class ArticleLikeDislikeSerializer(NovaSerializer):
    class Meta:
        model = ArticleLikeDislike
        fields = ['liker', 'choice', 'article']

    def create(self, data):
        return super(ArticleLikeDislikeSerializer, self).create(data)

    def update(self, instance, validated_data):
        return super(ArticleLikeDislikeSerializer, self).update(instance, validated_data)


class CommentLikeDislikeSerializer(NovaSerializer):
    class Meta:
        model = CommentLikeDislike
        fields = ['liker', 'choice', 'comment']

    def create(self, data):
        return super(CommentLikeDislikeSerializer, self).create(data)

    def update(self, instance, validated_data):
        return super(CommentLikeDislikeSerializer, self).update(instance, validated_data)


class ParitySerializer(NovaSerializer):
    class Meta:
        model = Parity
        fields = ['interval_category', 'observed_at', 'tr_eq', 'open', 'close', 'high', 'low']

    def create(self, validated_data):
        return super(ParitySerializer, self).create(validated_data)

    def update(self, instance, validated_data):
        return super(ParitySerializer, self).update(instance, validated_data)


class CurrentPriceSerializer(NovaSerializer):
    class Meta:
        model = CurrentPrice
        fields = ['observed_at', 'tr_eq', 'bid_price', 'ask_price', 'exchange_rate']

    def create(self, validated_data):
        return super(CurrentPriceSerializer, self).create(validated_data)

    def update(self, instance, validated_data):
        return super(CurrentPriceSerializer, self).update(instance, validated_data)


class EventSerializer(NovaSerializer):
    class Meta:
        model = Event

        fields = create_only_fields = ['id', 'date', 'time', 'name', 'country', 'importance', 'value']

class CurrencySerializer(NovaSerializer):
    class Meta:
        model = Currency
        fields = create_only_fields = ['sym']

class AssetSerializer(NovaSerializer):
    class Meta:
        model = Asset
        fields = ['owner', 'currency', 'amount']

    def create(self, validated_data):
        return super(AssetSerializer, self).create(validated_data)

    def update(self, instance, validated_data):
        return super(AssetSerializer, self).update(instance, validated_data)


class NotificationSerializer(NovaSerializer):
    class Meta:
        model = Notification
        fields = ['to', 'message', 'date']

    def create(self, validated_data):
        return super(NotificationSerializer, self).create(validated_data)

    def update(self, instance, validated_data):
        return super(NotificationSerializer, self).update(instance, validated_data)


class OrderSerializer(NovaSerializer):
    class Meta:
        model = Order
        fields = ['type', 'owner', 'max_volume', 'trigger', 'choice', 'tr_eq']

    def create(self, validated_data):
        return super(OrderSerializer, self).create(validated_data)

    def update(self, instance, validated_data):
        return super(OrderSerializer, self).update(instance, validated_data)
