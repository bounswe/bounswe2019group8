from rest_framework import status
from rest_framework.decorators import api_view
from rest_framework.exceptions import NotFound, PermissionDenied

from nova.models import Order
from nova.permissions import is_user_in_group
from nova.serializers import OrderSerializer
from rest_framework.response import Response


@api_view(['GET', 'POST'])
def order_coll(request):
    if request.method == 'GET':
        orders = Order.objects.all()
        serializer = OrderSerializer(orders, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
    # CREATE ARTICLE
    elif request.method == 'POST':
        data = request.data
        data['owner'] = request.user.pk
        serializer = OrderSerializer(data=data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['GET'])
def order_res(request, pk):
    try:
        order = Order.objects.get(pk=pk)
    except Order.DoesNotExist:
        raise NotFound()

    serializer = OrderSerializer(order, request.data, partial=True)
    if not serializer.is_valid():
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    if request.method == 'GET':
        return Response(serializer.data)

    if request.method == 'DELETE':
        if not is_user_in_group(request.user, "admin") and request.user.pk != Order.owner.pk:
            raise PermissionDenied()

        order.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)
