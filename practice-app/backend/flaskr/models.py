# models.py

import sqlalchemy as sa
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy_mixins import ActiveRecordMixin, ReprMixin, ModelNotFoundError

Base = declarative_base()


class BaseModel(Base, ActiveRecordMixin, ReprMixin):
    __abstract__ = True
    __repr__ = ReprMixin.__repr__
    pass


class Comment(BaseModel):
    __tablename__ = 'comment'
    id = sa.Column(sa.Integer, primary_key=True)
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
