# ♟️ Minimal Chess.com Helper (For Educational Purposes Only)

⚠️ **DISCLAIMER**

This tool is provided **strictly for educational purposes only**.  
**Do NOT use it in real games.** Be fair and respect the rules of platforms like [Chess.com](https://chess.com).

This project demonstrates how easy it can be to interact with Chess.com’s frontend due to the **lack of Content Security Policy (CSP)**, the fact that the frontend data is **not encrypted** and even not any **DOM Mutation Obeserver** which is completly crazy for a competitive website like that.  
Built in **less than 2 hours** — the goal is to show that **you’re not crazy**: yes, it really is this easy to build helpers and there is way **MORE** cheaters than we can think.

Hope you guys are gonna fix all that cuz i have an account currently ranked 2200+ still no flag while im in the 1Ks usually

---

## 🚀 Features

- Reads the board state directly from Chess.com using a Chrome extension.
- Sends the FEN position to a local Python backend.
- Evaluates the best move using **Stockfish** or any other UCI-compatible engine.
- Displays the recommended move on the webpage.

---

## 🧰 Requirements

- Python 3.x
- Google Chrome
- Stockfish engine (or any UCI engine — you'll need to adapt the backend accordingly)

---

## 🛠️ Setup Instructions

### 1. Open Powershell & check if python is installed 

```bash
python --version
```

### 2. Clone the Repository

```bash
git clone https://github.com/your-repo-url/chess-helper.git
```

### 3. Navigate to the backend folder

```bash
cd backend
```

### 4. Create your virtual environment

```bash
# Windows
python -m venv venv

# MacOS/Linux
python3 -m venv venv
```

### 5. Activate the virtual environment

```bash
# Windows
venv\Scripts\activate

# MacOS/Linux
source venv/bin/activate
```

### 6. Install the required packages

```bash
pip install -r requirements.txt
```

### 7. Configure the path file for your chess engine in the stockfish file (if you are using stockfish)

```bash
path="Your path ...."
```

### 8. Run the backend

```bash
python app.py
```

## Chrome Extension

1. Open Google Chrome
2. Go to `chrome://extensions/`
3. Turn on developer mode using the switch top right
4. Then, top left, select `Load unpacked`
5. Browse to the extension folder of the repo (chess extension).

> Note: launch the backend before the extension & when you click on the button "start helper" pres f12 & wait for 2 secondes then close it, it will inject the content quietly
