from django.db.models import Q
from rest_framework.decorators import api_view, permission_classes
from rest_framework.exceptions import NotFound, PermissionDenied
from rest_framework import permissions, status
from rest_framework.response import Response

from nova.models import Portfolio, TradingEquipment
from nova.permissions import is_user_in_group
from nova.serializers import PortfolioSerializer, UserSerializer


# /portfolios
# CREATE NEW PORTFOLIO, GET ALL OF MY PORTFOLIOS
@api_view(['GET', 'POST'])
@permission_classes((permissions.IsAuthenticated,))
def portfolio_ops(request):
    if request.method == 'GET':
        try:
            portfolio = Portfolio.objects.filter(owner=request.user)
        except Portfolio.DoesNotExist:
            raise NotFound()
        serializer = PortfolioSerializer(portfolio, many=True)
        return Response(serializer.data, status.HTTP_200_OK)

    else:
        portfolio = Portfolio.objects.create(
            owner=request.user,
            name=request.data['name']
        )
        serializer = PortfolioSerializer(portfolio)
        return Response(serializer.data, status.HTTP_200_OK)


# /users/pk/portfolios
@api_view(['GET'])
@permission_classes((permissions.IsAuthenticated,))
def portfolio_visitor(request, pk):
    try:
        portfolio = Portfolio.objects.filter(Q(owner=pk) & Q(private=False))
    except Portfolio.DoesNotExist:
        raise NotFound()
    serializer = PortfolioSerializer(portfolio, many=True)
    return Response(serializer.data, status.HTTP_200_OK)


# /portfolios/pk
@api_view(['POST', 'DELETE', 'GET', 'PUT'])
@permission_classes((permissions.IsAuthenticated,))
def portfolio_update(request, pk):
    try:
        portfolio = Portfolio.objects.get(pk=pk)
    except Portfolio.DoesNotExist:
        raise NotFound()

    if request.method == 'GET':
        if request.user.pk == portfolio.owner.pk or portfolio.private == False:
            serializer = PortfolioSerializer(portfolio, partial=True)
            return Response(serializer.data, status.HTTP_200_OK)

    # BELOW FUNCTIONS ARE ADD DELETE AND UPDATES TO THE PORTFOLIO
    if not is_user_in_group(request.user, "admin") and request.user.pk != portfolio.owner.pk:
        raise PermissionDenied()

    if 'tr_eq' in request.data:
        tr_eq_pk = request.data['tr_eq']
        try:
            equipment = TradingEquipment.objects.get(pk=tr_eq_pk)
        except TradingEquipment.DoesNotExist:
            raise NotFound()
        if request.method == 'POST':
            equipment.appeared_portfolios.add(portfolio)
            serializer = PortfolioSerializer(portfolio)
            return Response(serializer.data, status.HTTP_200_OK)

        elif request.method == 'DELETE':
            if equipment.appeared_portfolios.filter(pk=portfolio.pk):
                serializer = PortfolioSerializer(portfolio)
                equipment.appeared_portfolios.remove(portfolio)
                return Response(serializer.data, status.HTTP_200_OK)
            else:
                return Response('Equipment not in portfolio.', status.HTTP_400_BAD_REQUEST)

    if 'name' in request.data or 'private' in request.data:
        if request.method == 'PUT':
            try:
                portfolio = Portfolio.objects.get(pk=pk)
            except Portfolio.DoesNotExist:
                raise NotFound()
            if 'name' in request.data:
                portfolio.name = request.data['name']

            elif 'private' in request.data:
                portfolio.private = request.data['private']

            portfolio.save()
            serializer = PortfolioSerializer(portfolio, partial=True)
            return Response(serializer.data, status.HTTP_200_OK)

    if len(request.data) == 0 and request.method == 'DELETE':
        try:
            portfolio = Portfolio.objects.get(pk=pk)
        except Portfolio.DoesNotExist:
            raise NotFound()
        portfolio.delete()
        return Response(status.HTTP_200_OK)


# /portfolios/pk/follows
@api_view(['POST', 'DELETE'])
def portfolio_follows(request, pk):
    try:
        portfolio = Portfolio.objects.get(pk=pk)
    except Portfolio.DoesNotExist:
        raise NotFound()

    if portfolio.private == True:
        raise PermissionDenied()

    if request.method == 'POST':
        portfolio.followers.add(request.user)
        serializer = PortfolioSerializer(portfolio, partial=True)
        return Response(serializer.data, status.HTTP_200_OK)

    elif request.method == 'DELETE':
        portfolio.followers.remove(request.user)
        return Response('Unfollowed the portfolio', status.HTTP_200_OK)
