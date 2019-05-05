# __init__.py

import os
from flask import Flask
from flask_cors import CORS, cross_origin

def create_app(test_config=None):
    # create and configure the app
    app = Flask(__name__, instance_relative_config=True)

    app.url_map.strict_slashes = False

    # ensure the instance folder exists
    try:
        os.makedirs(app.instance_path)
    except OSError:
        pass

    app.config.from_mapping(
        SECRET_KEY='_&xgtWg72Nf2Y2Gh'
    )
    app.config.from_envvar('MERCATUS_SETTINGS')

    if test_config is None:
        # load the instance config, if it exists, when not testing
        app.config.from_pyfile(os.path.join(app.root_path, 'config.py'))
    else:
        # load the test config if passed in
        app.config.from_mapping(test_config)

    if app.config['ENV'] == 'development':
        CORS(app)

    with app.app_context():
        from .db import prepare_db_conn, init_db, session
        prepare_db_conn()

    from . import trading_equipments, health
    app.register_blueprint(trading_equipments.bp)
    app.register_blueprint(health.bp)

    @app.cli.command('initdb')
    def initdb_command():
        init_db()

    @app.route('/')
    def hello():
        return 'Hello, World!'

    @app.teardown_appcontext
    def shutdown_session(exception=None):
        session.remove()

    return app
