from flask import Flask, jsonify, request
from flask_cors import CORS
from engine.stockfish_engine import analyze_position

app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "https://www.chess.com"}})

last_moves = []

@app.route('/')
def home():
    return "Main Backend Page"

@app.route('/api/stockfish', methods=['POST'])
def handle_moves():
    global last_moves
    content = request.json
    moves = content.get("moves", [])
    print("✅ Moves Received :", moves)

    analysis = analyze_position(moves)
    print("Analyzing new position:", analysis)
    return jsonify({
        "message": "Stockfish API called",
        "data": content,
        "analysis": analysis
    })


if __name__ == '__main__':
    app.run(debug=True)
