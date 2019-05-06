# models.py

import uuid
import sqlalchemy as sa
from sqlalchemy_mixins import ActiveRecordMixin, ReprMixin, ModelNotFoundError
from . import db

Base = db.Base


def _default_key():
    return str(uuid.uuid4())


class BaseModel(Base, ActiveRecordMixin, ReprMixin):
    __abstract__ = True
    __repr__ = ReprMixin.__repr__
    pass


class Comment(BaseModel):
    __tablename__ = 'comment'
    id = sa.Column(sa.String, primary_key=True, default=_default_key)
    author = sa.Column(sa.String)
    content = sa.Column(sa.String)
    tr_eq_sym = sa.Column(sa.String)
    created_at = sa.Column(sa.DateTime)

    def serialize(self):
        return {
            'author': self.author,
            'content': self.content,
            'id': self.id,
            'tr_eq_sym': self.tr_eq_sym,
            'created_at': self.created_at
        }


class Prediction(BaseModel):
    __tablename__ = 'prediction'
    id = sa.Column(sa.String, primary_key=True, default=_default_key)
    upvote = sa.Column(sa.Integer, default=int)
    downvote = sa.Column(sa.Integer, default=int)
    tr_eq_sym = sa.Column(sa.String)

    def serialize(self):
        return {
            'upvote': self.upvote,
            'downvote': self.downvote,
            'tr_eq_sym': self.tr_eq_sym
        }
