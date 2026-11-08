import { useState } from "react";
import { Bot, Send, User } from "lucide-react";

export default function FarmerChatbot() {
  const [question, setQuestion] = useState("");

  const [messages, setMessages] = useState([
    {
      from: "bot",
      text: "Hello farmer! 🌱 Welcome to AgroPulse. How can I help you today?"
    }
  ]);

  const suggestions = [
    "How often should I water tomato plants?",
    "How can I improve soil health?",
    "How do I identify crop diseases?"
  ];

  const getReply = (text) => {
    const q = text.toLowerCase();

    if (q.includes("water") || q.includes("irrigation")) {
      return "Check soil moisture, crop growth stage and recent rainfall before irrigation. You can also use our Irrigation Advisor.";
    }

    if (q.includes("disease") || q.includes("leaf")) {
      return "Upload a clear leaf photograph using Crop Doctor. A trained disease detection model must be connected for an actual diagnosis.";
    }

    if (q.includes("soil") || q.includes("fertilizer")) {
      return "Start with a soil test. It helps determine nutrient deficiencies and appropriate fertilizer recommendations.";
    }

    return "Thank you for your question! Please provide your crop name, location and farming conditions for more useful guidance. This is a demo assistant.";
  };

  const sendMessage = (e) => {
    e.preventDefault();

    if (!question.trim()) return;

    const text = question.trim();

    setMessages(prev => [
      ...prev,
      { from: "user", text },
      { from: "bot", text: getReply(text) }
    ]);

    setQuestion("");
  };

  return (
    <>
      <div className="page-heading">
        <span className="feature-emoji">🤖</span>
        <div>
          <h2>AgroPulse Farmer Assistant</h2>
          <p>Your farming information assistant.</p>
        </div>
      </div>

      <section className="panel chat-panel">
        <div className="chat-messages">
          {messages.map((msg, index) => (
            <div
              key={index}
              className={`chat-message ${msg.from}`}
            >
              <span>
                {msg.from === "bot" ? <Bot /> : <User />}
              </span>
              <p>{msg.text}</p>
            </div>
          ))}
        </div>

        <div className="suggestion-list">
          {suggestions.map(item => (
            <button
              key={item}
              onClick={() => setQuestion(item)}
            >
              {item}
            </button>
          ))}
        </div>

        <form className="chat-form" onSubmit={sendMessage}>
          <input
            value={question}
            onChange={e => setQuestion(e.target.value)}
            placeholder="Ask your farming question..."
          />

          <button className="primary-button" aria-label="Send">
            <Send size={18} />
          </button>
        </form>
      </section>
    </>
  );
}
