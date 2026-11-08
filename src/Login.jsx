import { useState } from "react";
import { Sprout, Mail, Lock, User, Eye, EyeOff } from "lucide-react";

export default function Login({ onLogin }) {
  const [mode, setMode] = useState("login");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [show, setShow] = useState(false);
  const [message, setMessage] = useState("");

  const submit = (e) => {
    e.preventDefault();

    if (password.length < 6) {
      setMessage("Password must contain at least 6 characters.");
      return;
    }

    if (mode === "signup" && !name.trim()) {
      setMessage("Please enter your name.");
      return;
    }

    onLogin(name.trim() || email.split("@")[0]);
  };

  return (
    <div className="auth-screen">
      <section className="auth-visual">
        <h1><Sprout /> AgroPulse</h1>
        <h2>Make Every Season Count.</h2>
        <p>Smart farming starts with smarter decisions.</p>
        <p>🌱 Crop health monitoring</p>
        <p>💧 Smart irrigation planning</p>
        <p>🛰️ Satellite-based monitoring</p>
      </section>

      <section className="auth-panel">
        <div className="auth-card">
          <h2>{mode === "login" ? "Welcome Back!" : "Create Account"}</h2>
          <p className="muted">Access your AgroPulse farming dashboard.</p>

          <button
            className="google-button"
            type="button"
            onClick={() =>
              setMessage("Connect Firebase to enable Google authentication.")
            }
          >
            <b className="google-g">G</b> Continue with Google
          </button>

          <div className="or-divider">OR CONTINUE WITH EMAIL</div>

          <form onSubmit={submit}>
            {mode === "signup" && (
              <label className="field-label">
                Full Name
                <div className="input-wrap">
                  <User />
                  <input
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Enter your name"
                    required
                  />
                </div>
              </label>
            )}

            <label className="field-label">
              Email Address
              <div className="input-wrap">
                <Mail />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter email"
                  required
                />
              </div>
            </label>

            <label className="field-label">
              Password
              <div className="input-wrap">
                <Lock />
                <input
                  type={show ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter password"
                  minLength="6"
                  required
                />
                <button type="button" onClick={() => setShow(!show)}>
                  {show ? <EyeOff /> : <Eye />}
                </button>
              </div>
            </label>

            {mode === "login" && (
              <button
                type="button"
                className="forgot-button"
                onClick={() =>
                  setMessage("Password reset requires Firebase integration.")
                }
              >
                Forgot password?
              </button>
            )}

            <button className="primary-button auth-submit">
              {mode === "login" ? "Login" : "Create Account"}
            </button>
          </form>

          {message && <p className="notice">{message}</p>}

          <p className="auth-switch">
            {mode === "login"
              ? "Don't have an account?"
              : "Already have an account?"}
            <button
              onClick={() => {
                setMode(mode === "login" ? "signup" : "login");
                setMessage("");
              }}
            >
              {mode === "login" ? "Sign Up" : "Login"}
            </button>
          </p>
        </div>
      </section>
    </div>
  );
}
