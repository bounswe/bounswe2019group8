# health.py

from flask import Blueprint, jsonify

bp = Blueprint('health', __name__, url_prefix='/health')

@bp.route('/', methods=['GET'])
def get_health():
    return jsonify({'status': 'OK'})
