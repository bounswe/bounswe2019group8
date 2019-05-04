from flask import Flask, jsonify
import sqlalchemy as sa
from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.ext.hybrid import hybrid_property
from sqlalchemy.orm import scoped_session, sessionmaker
from sqlalchemy_mixins import ActiveRecordMixin, ReprMixin, ModelNotFoundError

app = Flask(__name__)

### DB stuff
Base = declarative_base()

class BaseModel(Base, ActiveRecordMixin, ReprMixin):
    __abstract__ = True
    __repr__ = ReprMixin.__repr__
    pass

engine = create_engine('postgresql+psycopg2://alpercakan:123456@localhost/mercatus')

# autocommit=True - it's to make you see data in 3rd party DB view tool
session = scoped_session(sessionmaker(bind=engine, autocommit=True))

BaseModel.set_session(session)

class Comment(BaseModel):
    __tablename__ = 'comment'
    __repr_attrs__ = ['id', 'author', 'content']
    id = sa.Column(sa.Integer, primary_key=True)
    author = sa.Column(sa.String)
    content = sa.Column(sa.String)

    def serialize(self):
        return {
            'author': self.author,
            'content': self.content
        }

### Routes

@app.route('/')
def hello_world():
    return 'Hello, World!'

@app.route('/health', methods=['GET'])
def get_health():
    return jsonify({'status': 'OK'})

@app.route('/comments', methods=['GET'])
def get_comments():
    return jsonify([c.serialize() for c in Comment.all()])
