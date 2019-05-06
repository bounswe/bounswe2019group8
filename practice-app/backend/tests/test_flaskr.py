import os
import tempfile

import pytest

from . import flaskr


@pytest.fixture
def client():
    app = flaskr.create_app()
    app.config['TESTING'] = True
    client = app.test_client()

    with app.app_context():
        flaskr.init_db()

    yield client


def test_comment(client):
    client.post('tr-eqs/teststock/comments',
    {
	    "author": "test",
	    "content": "buy"
    })

    rv = client.get('tr-eqs/teststock/comments')
    assert len(json.loads(rv.data)) == 1
