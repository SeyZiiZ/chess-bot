from stockfish import Stockfish
import chess

def pgn_to_uci(pgn_lines):
    board = chess.Board()
    for line in pgn_lines:
        parts = line.split()
        if len(parts) >= 2:
            move_white = parts[1]
            board.push_san(move_white)
        if len(parts) >= 3:
            move_black = parts[2]
            board.push_san(move_black)
    return [move.uci() for move in board.move_stack]

def analyze_position(pgn_moves):
    try:
        uci_moves = pgn_to_uci(pgn_moves)
        print("UCI moves :", uci_moves)

        stockfish = Stockfish(
            path="C:\\Users\\PC\\Documents\\stockfish\\stockfish-windows-x86-64-avx2.exe",
            depth=15,
            parameters={"Threads": 2, "Minimum Thinking Time": 30}
        )

        stockfish.set_position(uci_moves)
        best_move = stockfish.get_best_move()
        evaluation = stockfish.get_evaluation()
        return {
            "best_move": best_move,
            "evaluation": evaluation
        }
    except Exception as e:
        print("❌ Error during Stockfish analysis :", e)
        return {
            "best_move": None,
            "evaluation": {"type": "error", "value": str(e)}
        }