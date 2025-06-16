import React, { useState, useRef, useEffect } from "react";
import axios from "axios";

const HF_API_URL = "https://api-inference.huggingface.co/models/google/flan-t5-small";
// For demo, no API key needed for public models, but you can add one if you have it.

function Chatbot() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([
    { from: "bot", text: "Hi! Ask me anything." }
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const panelRef = useRef(null);

  useEffect(() => {
    if (open && panelRef.current) {
      panelRef.current.scrollTop = panelRef.current.scrollHeight;
    }
  }, [messages, open]);

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;
    setMessages((msgs) => [...msgs, { from: "user", text: input }]);
    setLoading(true);

    try {
      // Hugging Face Inference API call
      const res = await axios.post(
        HF_API_URL,
        { inputs: input },
        {
          headers: {
            // If you have a HF API key, add: Authorization: `Bearer YOUR_KEY`
            "Content-Type": "application/json"
          }
        }
      );
      const answer = res.data[0]?.generated_text || "Sorry, I couldn't answer that.";
      setMessages((msgs) => [...msgs, { from: "bot", text: answer }]);
    } catch (err) {
      setMessages((msgs) => [
        ...msgs,
        { from: "bot", text: "Sorry, there was an error. Try again later." }
      ]);
    }
    setInput("");
    setLoading(false);
  };

  return (
    <>
      {/* Floating Chatbot Button */}
      <div
        style={{
          position: "fixed",
          bottom: "32px",
          right: "32px",
          zIndex: 9999
        }}
      >
        <button
          onClick={() => setOpen((o) => !o)}
          style={{
            background: "#850E35",
            color: "#fff",
            border: "none",
            borderRadius: "50%",
            width: "60px",
            height: "60px",
            fontSize: "2rem",
            boxShadow: "0 2px 8px rgba(0,0,0,0.2)",
            cursor: "pointer"
          }}
          aria-label="Open AI Chatbot"
        >
          🤖
        </button>
      </div>

      {/* Chatbot Panel */}
      {open && (
        <div
          style={{
            position: "fixed",
            bottom: "100px",
            right: "32px",
            width: "320px",
            maxHeight: "400px",
            background: "#850E35",
            borderRadius: "12px",
            boxShadow: "0 4px 24px rgba(0,0,0,0.2)",
            zIndex: 10000,
            display: "flex",
            flexDirection: "column",
            overflow: "hidden"
          }}
        >
          <div
            style={{
              background: "#850E35",
              color: "#fff",
              padding: "12px",
              fontWeight: "bold"
            }}
          >
            AI Chatbot
            <button
              onClick={() => setOpen(false)}
              style={{
                float: "right",
                background: "none",
                border: "none",
                color: "#fff",
                fontSize: "1.2rem",
                cursor: "pointer"
              }}
              aria-label="Close"
            >
              ×
            </button>
          </div>
          <div
            ref={panelRef}
            style={{
              flex: 1,
              padding: "12px",
              overflowY: "auto",
              background: "#f9f9f9"
            }}
          >
            {messages.map((msg, idx) => (
              <div
                key={idx}
                style={{
                  textAlign: msg.from === "user" ? "right" : "left",
                  margin: "8px 0"
                }}
              >
                <span
                  style={{
                    display: "inline-block",
                    background: msg.from === "user" ? "#e6f0ff" : "#e9ecef",
                    color: "#222",
                    borderRadius: "8px",
                    padding: "8px 12px",
                    maxWidth: "80%",
                    wordBreak: "break-word"
                  }}
                >
                  {msg.text}
                </span>
              </div>
            ))}
            {loading && (
              <div style={{ textAlign: "left", color: "#888" }}>Thinking...</div>
            )}
          </div>
          <form
            onSubmit={sendMessage}
            style={{
              display: "flex",
              borderTop: "1px solid #eee",
              background: "#fff"
            }}
          >
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask me anything..."
              style={{
                flex: 1,
                border: "none",
                padding: "12px",
                outline: "none",
                fontSize: "1rem"
              }}
              disabled={loading}
            />
            <button
              type="submit"
              style={{
                background: "#850E35",
                color: "#fff",
                border: "none",
                padding: "0 16px",
                fontSize: "1.2rem",
                cursor: "pointer"
              }}
              disabled={loading}
            >
              ➤
            </button>
          </form>
        </div>
      )}
    </>
  );
}

export default Chatbot;