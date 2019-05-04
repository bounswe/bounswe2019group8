# db.py

from flask import current_app
from sqlalchemy import create_engine
from sqlalchemy.orm import scoped_session, sessionmaker
from .models import BaseModel

def prepare_db_conn():
    engine = create_engine(
        'postgresql+psycopg2://{}:{}@{}/{}'.format(
            current_app.config['DB_USERNAME'],
            current_app.config['DB_PASSWORD'],
            current_app.config['DB_ADDR'],
            current_app.config['DB_NAME']
        ))

    session = scoped_session(sessionmaker(bind=engine, autocommit=True))

    BaseModel.set_session(session)
