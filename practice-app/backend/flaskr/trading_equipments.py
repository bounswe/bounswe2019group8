# trading_equipments.py

from flask import Blueprint, abort, jsonify, request
from .models import Comment, Prediction
from datetime import datetime
from .price_api_uplink import get_from_api, get_symbols_from_nasdaq

bp = Blueprint('tr-eqs', __name__, url_prefix='/tr-eqs')


@bp.route('<string:sym>/price', methods=['GET'])
def get_current_price(sym):
    # TODO move these functionalities (get_price etc.) to price_api_uplink
    resp = get_from_api(symbol=sym,
                        function='TIME_SERIES_INTRADAY',
                        interval='1min')['Time Series (1min)']

    last_time = list(resp.keys())[0]

    return jsonify({
        'symbol': sym,
        'price': resp[last_time]['4. close'],
        'time': last_time
    })


@bp.route('<string:sym>/movingavg/', methods=['GET'])
def get_sma(sym):
    # let possible parameters be:
    # interval = '60 min' or 'daily' or 'weekly' or 'monthly'
    # series_type = 'close' or 'open' or 'high' or 'low'

    time_period = "10"
    if 'interval' not in request.args or \
       'series_type' not in request.args or\
       'data_amount' not in request.args:  # how many 'intervals' of avg data is requested
        abort(400)

    json_obj = get_from_api(symbol=sym,
                            function='SMA',
                            interval=request.args['interval'],
                            series_type=request.args['series_type'],
                            time_period=time_period)

    print(json_obj)
    result = []
    time_points = list(json_obj['Technical Analysis: SMA'].keys())
    for i in range(int(request.args['data_amount'])):
        result.append(json_obj['Technical Analysis: SMA'][time_points[i]])

    return jsonify(result)


@bp.route('<string:sym>/predictions/', methods=['GET'])
def get_predictions(sym):
    pred = Prediction.query.filter_by(tr_eq_sym=sym).first()

    if pred is None:
        return jsonify([])
    else:
        return jsonify(pred.serialize())


@bp.route('<string:sym>/predictions/', methods=['POST'])
def create_prediction(sym):
    # vote = 1 => upvote, vote = 0 => downvote
    if 'vote' not in request.json:
        abort(400)

    prediction = Prediction.query.filter_by(tr_eq_sym=sym).first()

    if prediction is None:  # no prediction for that stock yet
        prediction = Prediction.create(tr_eq_sym=sym)

    if request.json['vote'] == 1:
        prediction.upvote = prediction.upvote + 1
    else:
        prediction.downvote = prediction.downvote + 1

    prediction.update()

    return jsonify(prediction.serialize())


@bp.route('<string:sym>/comments/', methods=['POST'])
def create_comment(sym):
    # check if json format is valid
    if 'author' not in request.json or \
       'content' not in request.json:
        abort(400)

    # create comment instance in database
    comment = Comment.create(author=request.json['author'],
                             content=request.json['content'],
                             tr_eq_sym=sym,
                             created_at=datetime.now())

    return jsonify({'comment': comment.serialize()})


@bp.route('<string:sym>/comments/', methods=['GET'])
def get_comments(sym):
    return jsonify([c.serialize() for c in Comment.query.filter_by(tr_eq_sym=sym).all()])


@bp.route('<string:sym>/comments/<string:com_id>', methods=['DELETE'])
def delete_comment(sym, com_id):
    # check if comment with com_id exists
    comment_to_delete = Comment.find(com_id)

    if comment_to_delete == None:
        abort(404)

    # delete comment
    Comment.destroy(com_id)

    return ''


@bp.route('/', methods=['GET'])
def get_all_symbols():
    return jsonify(get_symbols_from_nasdaq())
