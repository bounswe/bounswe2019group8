from django.contrib.auth.hashers import make_password
from django.contrib.auth.models import Group
from rest_framework import serializers
from nova.utils.validators import validate_exists

from nova.permissions import is_user_in_group
from .utils.serializers import NovaSerializer
from .models import User, Article, TradingEquipment, Comment, TradingEquipmentComment, ArticleComment, \
    Prediction, LikeDislike, ArticleLikeDislike, CommentLikeDislike, Event, Asset, Notification, Order, Portfolio


class UserBasicSerializer(NovaSerializer):
    class Meta:
        model = User
        fields = ['pk', 'first_name', 'last_name']


class TradingEquipmentSerializer(NovaSerializer):
    class Meta:
        model = TradingEquipment
        fields = ['type', 'name', 'sym', 'pk', 'last_updated_daily', 'last_updated_current']
        create_only_fields = ['type', 'name', 'sym']


class TradingEquipmentOfPortfolioSerializer(NovaSerializer):
    class Meta:
        model = TradingEquipment
        fields = ['sym']

        extra_kwargs = {
            'sym': {'validators': [lambda d: validate_exists(TradingEquipment, {"sym": d})]},
        }


class PortfolioSerializer(NovaSerializer):
    tr_eqs = TradingEquipmentOfPortfolioSerializer(many=True, default=[])

    class Meta:
        model = Portfolio
        fields = ['pk', 'tr_eqs', 'owner', 'name', 'private']
        create_only_fields = ['owner', 'followers']

    def create(self, validated_data):
        tr_eqs = validated_data.pop('tr_eqs')
        portfolio = Portfolio.objects.create(**validated_data)

        portfolio.tr_eqs.set([TradingEquipment.objects.get(sym=d["sym"]) for d in tr_eqs])

        return portfolio

    def update(self, instance, validated_data):
        tr_eqs = validated_data.pop('tr_eqs')

        super(PortfolioSerializer, self).update(instance, validated_data)

        instance.tr_eqs.set([TradingEquipment.objects.get(sym=d["sym"]) for d in tr_eqs])

        instance.save()

        return instance


class AssetSerializer(NovaSerializer):
    class Meta:
        model = Asset
        fields = ['owner', 'tr_eq', 'amount']


class UserSerializer(NovaSerializer):
    class Meta:
        model = User
        fields = ['email', 'lat', 'long', 'first_name', 'last_name', 'date_of_birth', 'profile_image', 'password', 'pk',
                  'groups', 'followers', 'followings', 'email_activated', 'following_portfolios']
        read_only_fields = ['followers', 'followings', 'following_portfolios']
        create_only_fields = ['first_name', 'last_name']

    assets = AssetSerializer(read_only=True, many=True)
    followers = UserBasicSerializer(read_only=True, many=True)
    followings = UserBasicSerializer(read_only=True, many=True)
    following_portfolios = PortfolioSerializer(read_only=True, many=True)

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

        created = super(UserSerializer, self).create(validated_data)

        if is_user_in_group(created, "trader"):
            created.assets.set([
                Asset.objects.create(owner=created, amount=0,
                                     tr_eq=TradingEquipment.objects.get(sym='USD_USD'))])

            created.save()

        return created

    def update(self, instance, validated_data):
        if 'password' in validated_data:
            validated_data['password'] = make_password(validated_data['password'])
        return super(UserSerializer, self).update(instance, validated_data)


class ArticleSerializer(NovaSerializer):
    class Meta:
        model = Article
        fields = ['author', 'title', 'content', 'rating', 'pk']
        create_only_fields = ['author']


class CommentSerializer(NovaSerializer):
    class Meta:
        model = Comment
        create_only_fields = ['author']
        fields = ['author', 'content', 'pk']


class TradingEquipmentCommentSerializer(NovaSerializer):
    class Meta:
        model = TradingEquipmentComment
        fields = ['author', 'content', 'pk', 'tr_eq']


class ArticleCommentSerializer(NovaSerializer):
    class Meta:
        model = ArticleComment
        fields = ['author', 'content', 'pk', 'article']


class PredictionSerializer(NovaSerializer):
    class Meta:
        model = Prediction
        fields = ['predictor', 'tr_eq', 'vote']


class LikeDislikeSerializer(NovaSerializer):
    class Meta:
        model = LikeDislike
        fields = ['liker', 'choice']


class ArticleLikeDislikeSerializer(NovaSerializer):
    class Meta:
        model = ArticleLikeDislike
        fields = ['liker', 'choice', 'article']


class CommentLikeDislikeSerializer(NovaSerializer):
    class Meta:
        model = CommentLikeDislike
        fields = ['liker', 'choice', 'comment']


class EventSerializer(NovaSerializer):
    class Meta:
        model = Event

        fields = create_only_fields = ['id', 'date', 'time', 'name', 'country', 'importance', 'value']


class NotificationSerializer(NovaSerializer):
    class Meta:
        model = Notification
        fields = ['to', 'message', 'created_at']


class OrderSerializer(NovaSerializer):
    class Meta:
        model = Order
        fields = ['type', 'owner', 'max_volume', 'trigger', 'choice', 'tr_eq']
