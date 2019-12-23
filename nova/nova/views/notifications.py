from rest_framework import permissions
from rest_framework import status
from rest_framework.decorators import permission_classes, api_view
from rest_framework.exceptions import PermissionDenied, NotFound
from rest_framework.response import Response

from nova.serializers import NotificationSerializer
from nova.models import User


@api_view(['GET'])
@permission_classes((permissions.IsAuthenticated,))
def notifications_coll(request, user_pk):
    try:
        user = User.objects.get(pk=user_pk)
    except User.DoesNotExist:
        raise NotFound()

    if user_pk != request.user.pk:
        raise PermissionDenied()

    if request.method == 'GET':
        serializer = NotificationSerializer(user.notifications, many=True)
        response = Response(serializer.data, status=status.HTTP_200_OK)

        for notification in user.notifications.filter(is_read=False):
            notification.is_read = True
            notification.save()

        return response


@api_view(['GET'])
@permission_classes((permissions.IsAuthenticated,))
def notifications_coll_count(request, user_pk):
    try:
        user = User.objects.get(pk=user_pk)
    except User.DoesNotExist:
        raise NotFound()

    if user_pk != request.user.pk:
        raise PermissionDenied()

    if request.method == 'GET':
        return Response({"count": user.notifications.filter(is_read=False).count()}, status=status.HTTP_200_OK)
