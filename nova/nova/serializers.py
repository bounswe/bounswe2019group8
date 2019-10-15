from rest_framework import serializers
from .models import User


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['email', 'first_name', 'last_name', 'lat', 'long', 'profile_image', 'groups']
        read_only_fields = ['first_name', 'last_name']
