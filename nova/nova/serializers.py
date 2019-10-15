from django.contrib.auth.models import User, Group
from rest_framework import serializers


class UserSerializer(serializers.Serializer):
    class Meta:
        model = User
        fields = ['email', 'first_name', 'last_name', 'lat', 'long', 'profile_image', 'groups']
        read_only_fields = ['first_name', 'last_name']
