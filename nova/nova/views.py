from django.contrib.auth import authenticate
from rest_framework import permissions
from rest_framework import status
from rest_framework.authtoken.models import Token
from rest_framework.decorators import api_view, permission_classes
from rest_framework.exceptions import AuthenticationFailed, PermissionDenied, NotFound, ValidationError
from rest_framework.response import Response

from .models import User
from .permissions import IsPostOrIsAuthenticated, is_user_in_group
from .serializers import UserSerializer


@api_view(['GET', 'POST'])
@permission_classes((IsPostOrIsAuthenticated,))
def users_coll(request):
    if request.method == 'GET':
        users = User.objects.all()
        serializer = UserSerializer(users, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

    elif request.method == 'POST':
        serializer = UserSerializer(data=request.data)

        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['GET', 'PUT', 'DELETE'])
def user_res(request, pk):
    try:
        user = User.objects.get(pk=pk)
    except User.DoesNotExist:
        raise NotFound()

    serializer = UserSerializer(user, request.data, partial=True)

    if not serializer.is_valid():
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    if request.method == 'PUT':
        if not is_user_in_group(request.user, "admin") and pk != request.user.pk:
            raise PermissionDenied()

        serializer.save()
        return Response(serializer.data, status=status.HTTP_200_OK)

    elif request.method == 'GET':
        return Response(serializer.data)

    elif request.method == 'DELETE':
        if not is_user_in_group(request.user, "admin") and pk != request.user.pk:
            raise PermissionDenied()

        user.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)


@api_view(['GET', 'POST'])
def user_followings_coll(request, pk):
    try:
        user = User.objects.get(pk=pk)
    except User.DoesNotExist:
        raise NotFound()

    if request.method == 'GET':
        followings = user.followings
        serializer = UserSerializer(followings, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

    elif request.method == 'POST':
        if request.user.pk != pk:
            raise PermissionDenied()
        if 'following_pk' not in request.data:
            raise ValidationError()
        try:
            following = User.objects.get(pk=request.data['following_pk'])
        except User.DoesNotExist:
            raise NotFound()

        request.user.followings.add(following)
        serializer = UserSerializer(following)

        return Response(serializer.data, status=status.HTTP_200_OK)


@api_view(['DELETE'])
def user_following_res(request, user_pk, following_pk):
    try:
        user = User.objects.get(pk=user_pk)
        following = User.objects.get(pk=following_pk)
    except User.DoesNotExist:
        raise NotFound()

    if request.method == 'DELETE':
        if request.user.pk != user_pk:
            raise PermissionDenied()

        user.followings.remove(following)
        return Response(status=status.HTTP_204_NO_CONTENT)


@api_view(['GET'])
def user_followers_coll(request, pk):
    try:
        user = User.objects.get(pk=pk)
    except User.DoesNotExist:
        raise NotFound()

    if request.method == 'GET':
        followers = user.followers.all()
        serializer = UserSerializer(followers, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)


@api_view(['POST'])
@permission_classes((permissions.AllowAny,))
def auth_tokens_coll(request):
    user = authenticate(request=request,
                        username=request.data.get('email'), password=request.data.get('password'))

    if user is None:
        raise AuthenticationFailed()

    token, created = Token.objects.get_or_create(user=user)
    return Response({'token': token.key, 'user_id': user.pk}, status=status.HTTP_200_OK)
