from django.db.models import Q
from rest_framework import permissions
from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.exceptions import NotFound
from rest_framework.response import Response

from ..models import TradingEquipment, Parity, Prediction
from ..serializers import TradingEquipmentSerializer, ParitySerializer, PredictionSerializer

from ..settings import FX_CURRENCY_LIST, DIG_CURRENCY_LIST, AV_EXCLUDE

from django.contrib.postgres.search import SearchQuery, SearchVector, SearchRank, TrigramSimilarity

from ..av import fill_parities

from ..permissions import is_user_in_group

# TRADING EQUIPMENTS ARE READ ONLY. THEY ARE CREATED AFTER EXTERNAL API REQUESTS

@api_view(['GET'])
@permission_classes((permissions.AllowAny, ))
def trading_eq_coll(request):
    trading_eqs = TradingEquipment.objects.all()
    serializer = TradingEquipmentSerializer(trading_eqs, many=True)
    return Response(serializer.data, status=status.HTTP_200_OK)

@api_view(['GET'])
@permission_classes((permissions.AllowAny, ))
def trading_eq_digital_coll(request):
    trading_eqs = TradingEquipment.objects.filter(type = 'digital')
    serializer = TradingEquipmentSerializer(trading_eqs, many=True)
    return Response(serializer.data, status=status.HTTP_200_OK)

@api_view(['GET'])
@permission_classes((permissions.AllowAny, ))
def trading_eq_forex_coll(request):
    trading_eqs = TradingEquipment.objects.filter(type = 'forex')
    serializer = TradingEquipmentSerializer(trading_eqs, many=True)
    return Response(serializer.data, status=status.HTTP_200_OK)


@api_view(['GET'])
@permission_classes((permissions.AllowAny, ))
def trading_eq_res(request, pk):
    try:
        trading_eq = TradingEquipment.objects.get(pk = pk)
    except TradingEquipment.DoesNotExist:
        raise NotFound()

    serializer = TradingEquipmentSerializer(trading_eq, request.data, partial=True)
    if(not serializer.is_valid()):
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    return Response(serializer.data)

@api_view(['GET', 'POST', 'DELETE'])
@permission_classes((permissions.IsAuthenticated, ))
def upvotes_tr_eq(request, pk):
    try:
        tr_eq = TradingEquipment.objects.get(pk = pk)
    except TradingEquipment.DoesNotExist:
        raise NotFound()

    upvote = Prediction.objects.filter(tr_eq = tr_eq, predictor = request.user, vote = 1)
    downvote = Prediction.objects.filter(tr_eq = tr_eq, predictor = request.user, vote = -1)

    if request.method == 'GET':
        upvotes = Prediction.objects.filter(tr_eq = tr_eq, vote = 1)
        serializer = PredictionSerializer(upvotes, many = True)
        return Response(serializer.data, status.HTTP_200_OK)

    if request.method == 'POST':
        if len(upvote) != 0 or len(downvote) != 0:
            return Response('You have already voted for this equipment', status.HTTP_400_BAD_REQUEST)
        else:
            user_upvote = Prediction.objects.create(
                predictor = request.user,
                tr_eq = tr_eq,
                vote = 1
            )
            user_upvote.save()
            return Response(status.HTTP_201_CREATED)

    if request.method == 'DELETE':
        if len(upvote) == 0:
            return Response('You have already not voted for this equipment', status.HTTP_400_BAD_REQUEST)
        else:
            upvote.delete()
            return Response(status.HTTP_200_OK)

@api_view(['GET', 'POST', 'DELETE'])
@permission_classes((permissions.IsAuthenticated, ))
def downvotes_tr_eq(request, pk):
    try:
        tr_eq = TradingEquipment.objects.get(pk = pk)
    except TradingEquipment.DoesNotExist:
        raise NotFound()

    upvote = Prediction.objects.filter(tr_eq = tr_eq, predictor = request.user, vote = 1)
    downvote = Prediction.objects.filter(tr_eq = tr_eq, predictor = request.user, vote = -1)

    if request.method == 'GET':
        downvotes = Prediction.objects.filter(tr_eq = tr_eq, vote = -1)
        serializer = PredictionSerializer(downvotes, many = True)
        return Response(serializer.data, status.HTTP_200_OK)

    if request.method == 'POST':
        if len(upvote) != 0 or len(downvote) != 0:
            return Response('You have already voted for this equipment', status.HTTP_400_BAD_REQUEST)
        else:
            user_downvote = Prediction.objects.create(
                predictor = request.user,
                tr_eq = tr_eq,
                vote = -1
            )
            user_downvote.save()
            return Response(status.HTTP_201_CREATED)

    if request.method == 'DELETE':
        if len(downvote) == 0:
            return Response('You have already not voted for this equipment', status.HTTP_400_BAD_REQUEST)
        else:
            downvote.delete()
            return Response(status.HTTP_200_OK)


@api_view(['POST'])
@permission_classes((permissions.IsAuthenticated, ))
def tr_eq_searches(request):
    search_text = request.data.get('search_text')
    vector = SearchVector('sym')
    fts_qs = TradingEquipment.objects.annotate(search = vector).filter(Q(search__icontains=search_text) | Q(search=search_text))
    serializer = TradingEquipmentSerializer(fts_qs, many = True)
    return Response(serializer.data, status = status.HTTP_200_OK)

#TEMPORARY ENDPOINTS FOR TESTS

#   Below function inits all trading equipments. We need to either call it once for all when server is deployed
#   or make it run itself upon server start

@api_view(['GET'])
def init_eqs(request):
    for from_cur in FX_CURRENCY_LIST:
        for to_cur in FX_CURRENCY_LIST:
            if from_cur != to_cur:
                sym = from_cur + '_' + to_cur
                if sym not in AV_EXCLUDE:
                    tr_eq = TradingEquipment.objects.create(
                        type = 'forex',
                        name = sym,
                        sym = sym
                    )
                    tr_eq.save()

    for from_cur in DIG_CURRENCY_LIST:
        for to_cur in FX_CURRENCY_LIST:
            sym = from_cur + '_' + to_cur
            if sym not in AV_EXCLUDE:
                tr_eq = TradingEquipment.objects.create(
                    type = 'digital',
                    name = sym,
                    sym = sym
                )
                tr_eq.save()

    return Response(status=status.HTTP_200_OK)



# create parities from alphavantage responses
@api_view(['GET'])
def fill(request):
    fill_parities()
    return Response(status.HTTP_200_OK)

@api_view(['GET'])
def getp(request):
    serializer = ParitySerializer(Parity.objects.all(), many=True)
    return Response(serializer.data, status.HTTP_200_OK)

@api_view(['GET'])
def cnt(request):
    tr_eqs = TradingEquipment.objects.all()
    cnt = 0
    for eq in tr_eqs:
        if eq.last_updated == None:
            cnt+=1
    return Response(cnt, status.HTTP_200_OK)