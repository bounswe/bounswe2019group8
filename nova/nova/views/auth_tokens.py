from rest_framework.exceptions import AuthenticationFailed
from rest_framework.authtoken.models import Token
from django.contrib.auth import authenticate

from rest_framework.decorators import api_view, permission_classes
from rest_framework import permissions
from rest_framework import status
from rest_framework.response import Response


@api_view(['POST'])
@permission_classes((permissions.AllowAny,))
def auth_tokens_coll(request):
    user = authenticate(request=request,
                        username=request.data.get('email'), password=request.data.get('password'))
    if user is None:
        raise AuthenticationFailed()

    token, created = Token.objects.get_or_create(user=user)
    return Response({'token': token.key, 'user_id': user.pk}, status=status.HTTP_200_OK)
