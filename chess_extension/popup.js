document.getElementById("btn").addEventListener("click", async () => {
  try {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    if (!tab?.id) return;

    const url = tab.url || "";
    const blocked = /^(chrome|edge|about|brave|opera|vivaldi):/i.test(url)
      || /chrome:\/\/|chromewebstore\.google\.com|chrome\.google\.com\/webstore/i.test(url)
      || url.startsWith("chrome-extension:");

    if (blocked) return;

    await chrome.scripting.executeScript({
      target: { tabId: tab.id },
      func: injectedChessAnalyzer
    });

    window.close();
  } catch (_) {}
});

function injectedChessAnalyzer() {
  const movesMap = new Map();

  const waitForElement = (selector, callback) => {
    const interval = setInterval(() => {
      const el = document.querySelector(selector);
      if (el) {
        clearInterval(interval);
        callback(el);
      }
    }, 300);
  };

  const extract = () => {
    const rows = document.querySelectorAll(".main-line-row");
    rows.forEach(row => {
      const num = row.getAttribute("data-whole-move-number");
      if (!num) return;

      const w = row.querySelector(".node.white-move .node-highlight-content");
      const b = row.querySelector(".node.black-move .node-highlight-content");

      const white = formatMove(w);
      const black = formatMove(b);

      const full = black ? `${num}. ${white} ${black}` : `${num}. ${white}`;
      const existing = movesMap.get(num);
      if (!existing || full.length > existing.length) {
        movesMap.set(num, full);
      }
    });

    const pgn = Array.from(movesMap.values()).map(cleanMove);
    showModal("⌛ Analyzing...");

    fetch("http://127.0.0.1:5000/api/stockfish", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ moves: pgn })
    })
      .then(res => res.json())
      .then(data => {
        const best = data?.analysis?.best_move || "N/A";
        const type = data?.analysis?.evaluation?.type;
        const value = data?.analysis?.evaluation?.value;
        const evalStr = type === "cp" ? `${value > 0 ? "+" : ""}${(value / 100).toFixed(2)}` : type === "mate" ? `#${value}` : "N/A";
        showModal(`🤖 Best Move : ${best}\n📈 Evaluation : ${evalStr}`);
      })
      .catch(() => {
        showModal("❌ Error");
      });
  };

  const formatMove = el => {
    if (!el) return "";
    const fig = el.querySelector("span[data-figurine]")?.getAttribute("data-figurine") || "";
    const txt = el.textContent?.trim() || "";
    return !fig || fig === "P" ? txt : `${fig}${txt}`;
  };

  const cleanMove = move =>
    move.replace(/=D/g, '=Q').replace(/=F/g, '=B').replace(/=C/g, '=N').replace(/=T/g, '=R');

  const showModal = text => {
    let m = document.getElementById("stockfish-modal");
    if (!m) {
      m = document.createElement("div");
      m.id = "stockfish-modal";
      Object.assign(m.style, {
        position: "fixed",
        bottom: "20px",
        right: "20px",
        backgroundColor: "#1e1e1e",
        color: "white",
        padding: "12px 16px",
        borderRadius: "8px",
        zIndex: 9999,
        fontFamily: "monospace",
        fontSize: "14px",
        maxWidth: "300px",
        boxShadow: "0 0 10px rgba(0,0,0,0.3)"
      });
      document.body.appendChild(m);
    }
    m.innerText = text;
  };

  waitForElement(".toggle-timestamps", () => {
    const obs = new MutationObserver(() => extract());
    obs.observe(document.querySelector(".toggle-timestamps"), {
      childList: true,
      subtree: true,
      characterData: true,
      attributes: true,
    });
    extract();
  });
}
