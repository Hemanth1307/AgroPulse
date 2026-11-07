
import { useState } from "react";

export default function Login({ onLogin }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  function handleSubmit(e) {
    e.preventDefault();

    if (!email.trim() || !password.trim()) {
      alert("Please enter email and password");
      return;
    }

    onLogin();
  }

  return (
    <div className="login-page">
      <div className="login-card">
        <h1>🌱 AgroPulse</h1>
        <p>Smart Farming, Better Future</p>

        <h2>Welcome Back!</h2>
        <p>Login to your farmer dashboard</p>

        <form onSubmit={handleSubmit}>
          <label>Email Address</label>
          <input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <label>Password</label>
          <input
            type="password"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <button type="submit">Login</button>
        </form>

        <p className="login-footer">
          Empowering Farmers 🌾
        </p>
      </div>
    </div>
  );
}
