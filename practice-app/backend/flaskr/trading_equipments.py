# trading_equipments.py

from flask import Blueprint, abort, jsonify, request
from .models import Comment
from datetime import datetime

bp = Blueprint('tr-eqs', __name__, url_prefix='/tr-eqs')

@bp.route('<string:sym>/predictions/', methods=['GET'])
def get_prediction(sym):
	return jsonify([pred.serialize() for pred in Prediction.query.filter_by(tr_eq_sym=sym).all()])

@bp.route('<string:sym>/predictions/', methods=['POST'])
def create_prediction(sym):
    # upvote-> 'upvote' = 1 & 'downvote' = 0
    # downvote -> 'upvote' = 0 & 'downvote' = 1
    if 'upvote' not in request.json or \
       'downvote' not in request.json:
       abort(400)
    prediction = Prediction.create(upvote=request.json['upvote'],
                             	   downvote=request.json['downvote'],
                                   tr_eq_sym=sym)
    return jsonify({'prediction': prediction.serialize()})


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


@bp.route('<string:sym>/comments/<int:com_id>', methods=['DELETE'])
def delete_comment(com_id):
    # check if comment with com_id exists
    comment_to_delete = Comment.find(com_id)

    if comment_to_delete == None:
        abort(404)

    # delete comment
    Comment.destroy(com_id)

    return ''
