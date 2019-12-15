from rest_framework.decorators import api_view, permission_classes
from rest_framework.exceptions import NotFound, PermissionDenied, ValidationError
from rest_framework import permissions, status
from rest_framework.response import Response

from nova.models import Portfolio, User
from nova.permissions import is_user_in_group
from nova.serializers import PortfolioSerializer


# users/<user_pk>/portfolios
@api_view(['GET', 'POST'])
@permission_classes((permissions.IsAuthenticated,))
def portfolios_coll(request, user_pk):
    try:
        user = User.objects.get(pk=user_pk)
    except User.DoesNotExist:
        raise NotFound()

    if request.method == 'GET':
        if request.user.pk == user_pk:
            portfolios = user.portfolios.filter()
        else:
            portfolios = user.portfolios.filter(private=False)

        serializer = PortfolioSerializer(portfolios, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

    elif request.method == 'POST':
        if request.user.pk != user_pk:
            raise PermissionDenied()

        serializer = PortfolioSerializer(data={'owner': request.user.pk, **request.data})

        if serializer.is_valid():
            serializer.save()

            return Response(serializer.data, status=status.HTTP_201_CREATED)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


# users/<user_pk>/portfolios/<portfolio_pk>
@api_view(['GET', 'PUT', 'DELETE'])
@permission_classes((permissions.IsAuthenticated,))
def portfolios_res(request, user_pk, portfolio_pk):
    try:
        user = User.objects.get(pk=user_pk)
        portfolio = user.portfolios.get(pk=portfolio_pk)
    except:
        raise NotFound()

    serializer = PortfolioSerializer(portfolio, request.data, partial=True)

    if not serializer.is_valid():
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    if request.method == 'PUT':
        if not is_user_in_group(request.user, "admin") and user_pk != request.user.pk:
            raise PermissionDenied()

        serializer.save()
        return Response(serializer.data, status=status.HTTP_200_OK)

    elif request.method == 'GET':
        if not is_user_in_group(request.user, "admin") and portfolio.private and user_pk != request.user.pk:
            raise PermissionDenied()

        return Response(serializer.data)

    elif request.method == 'DELETE':
        if not is_user_in_group(request.user, "admin") and user_pk != request.user.pk:
            raise PermissionDenied()

        portfolio.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)


# users/<user_pk>/following_portfolios/<portfolio_pk>
@api_view(['DELETE'])
@permission_classes((permissions.IsAuthenticated,))
def user_following_portfolios_res(request, user_pk, portfolio_pk):
    try:
        user = User.objects.get(pk=user_pk)
        portfolio = user.following_portfolios.get(pk=portfolio_pk)
    except:
        raise NotFound()

    if request.method == 'DELETE':
        if request.user.pk != user_pk:
            raise PermissionDenied()

        user.following_portfolios.remove(portfolio)

        user.save()

        return Response(status=status.HTTP_204_NO_CONTENT)


# user/<user_pk>/following_portfolios/
@api_view(['GET', 'POST'])
@permission_classes((permissions.IsAuthenticated,))
def user_following_portfolios_coll(request, user_pk):
    try:
        user = User.objects.get(pk=user_pk)
    except:
        raise NotFound()

    if request.method == 'POST':
        if 'portfolio_pk' not in request.data:
            raise ValidationError()

        try:
            portfolio = Portfolio.objects.get(pk=request.data["portfolio_pk"])
        except:
            raise NotFound()

        if portfolio.private or request.user.pk != user_pk:
            raise PermissionDenied()

        user.following_portfolios.add(portfolio)

        user.save()

        serializer = PortfolioSerializer(portfolio)

        return Response(serializer.data, status=status.HTTP_200_OK)
    elif request.method == 'GET':
        portfolios = user.following_portfolios
        serializer = PortfolioSerializer(portfolios, many=True)

        return Response(serializer.data, status=status.HTTP_200_OK)
