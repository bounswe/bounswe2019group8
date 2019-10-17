from rest_framework import serializers
from .models import User
from django.contrib.auth.hashers import make_password
from django.contrib.auth.models import Group


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['email', 'lat', 'long', 'first_name', 'last_name', 'date_of_birth', 'profile_image', 'password', 'pk',
                  'groups']
        read_only_fields = ['first_name', 'last_name']

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
        validated_data['password'] = make_password(validated_data.get('password'))
        return super(UserSerializer, self).update(instance, validated_data)
