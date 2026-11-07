
import { useState } from "react";

export default function FarmerChatbot() {
  const [question, setQuestion] = useState("");
  const [messages, setMessages] = useState([]);

  function sendMessage() {
    if (!question.trim()) return;
    setMessages([...messages, {
      question,
      answer: "Thank you for your question. Please consult your local agricultural officer for crop-specific advice. AI chatbot integration is pending."
    }]);
    setQuestion("");
  }

  return (
    <section>
      <h1>🤖 Farmer Assistant</h1>
      <div>
        {messages.map((m, i) => (
          <div key={i}>
            <p><strong>You:</strong> {m.question}</p>
            <p><strong>AgroPulse:</strong> {m.answer}</p>
          </div>
        ))}
      </div>
      <input value={question} onChange={e => setQuestion(e.target.value)} placeholder="Ask a farming question..." />
      <button onClick={sendMessage}>Send</button>
    </section>
  );
}
