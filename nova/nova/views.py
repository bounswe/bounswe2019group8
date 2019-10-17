from rest_framework import status
from rest_framework.response import Response
from .models import User
from .serializers import UserSerializer
from rest_framework.decorators import api_view, permission_classes
from rest_framework import permissions
from .permissions import IsPostOrIsAuthenticated, is_user_in_group
from django.contrib.auth import authenticate
from rest_framework.authtoken.models import Token
from rest_framework.exceptions import AuthenticationFailed, PermissionDenied, NotFound


@api_view(['GET', 'POST'])
@permission_classes((IsPostOrIsAuthenticated,))
def users_coll(request):
    if request.method == 'GET':
        if not is_user_in_group(request.user, "admin"):
            raise PermissionDenied()

        users = User.objects.all()
        serializer = UserSerializer(users, many=True)
        return Response(serializer.data)

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
        serializer.save()
        return Response(serializer.data, status=status.HTTP_200_OK)
    elif request.method == 'GET':
        return Response(serializer.data)


@api_view(['POST'])
@permission_classes((permissions.AllowAny,))
def auth_tokens_coll(request):
    user = authenticate(request=request,
                        username=request.data.get('email'), password=request.data.get('password'))

    if user is None:
        raise AuthenticationFailed()

    token, created = Token.objects.get_or_create(user=user)
    return Response({'token': token.key, 'user_id': user.pk})
