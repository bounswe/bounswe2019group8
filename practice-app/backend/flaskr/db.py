# db.py

from flask import current_app
from sqlalchemy import create_engine
from sqlalchemy.orm import scoped_session, sessionmaker
from sqlalchemy.ext.declarative import declarative_base


engine = create_engine(
    'postgresql+psycopg2://{}:{}@{}/{}'.format(
        current_app.config['DB_USERNAME'],
        current_app.config['DB_PASSWORD'],
        current_app.config['DB_ADDR'],
        current_app.config['DB_NAME']
    ), convert_unicode=True)

session = scoped_session(sessionmaker(bind=engine, autocommit=True))

Base = declarative_base()
Base.query = session.query_property()


def prepare_db_conn():
    from . import models

    models.BaseModel.set_session(session)


def init_db():
    Base.metadata.drop_all(engine)
    Base.metadata.create_all(engine)
