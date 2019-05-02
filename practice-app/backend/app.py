from flask import Flask, jsonify
app = Flask(__name__)

@app.route('/')
def hello_world():
    return 'Hello, World!'

@app.route('/health', methods=['GET'])
def get_health():
    return jsonify({'status': 'OK'})
