
import { useState } from "react";
import {
  Sprout, Mail, Lock, User, Eye, EyeOff,
  ArrowRight, Leaf, ShieldCheck
} from "lucide-react";
import "./Login.css";

export default function Login({ onLogin }) {
  const [mode, setMode] = useState("login");
  const [showPassword, setShowPassword] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  function handleSubmit(e) {
    e.preventDefault();
    setError("");

    if (mode === "signup" && !name.trim()) {
      setError("Please enter your name.");
      return;
    }

    if (!email.trim() || !email.includes("@")) {
      setError("Enter a valid email address.");
      return;
    }

    if (password.length < 6) {
      setError("Password must contain at least 6 characters.");
      return;
    }

    onLogin({
      name: name.trim() || email.split("@")[0],
      email
    });
  }

  return (
    <div className="auth-page">
      <section className="auth-visual">
        <div className="auth-brand">
          <div className="auth-logo"><Sprout size={25} /></div>
          <div><strong>AgroPulse<span>AI</span></strong><small>PRECISION AGRICULTURE</small></div>
        </div>

        <div className="auth-hero">
          <span className="auth-tag"><Leaf size={14} /> SMARTER FARMING STARTS HERE</span>
          <h1>Grow smarter.<br /><span>Farm better.</span></h1>
          <p>Bring satellite intelligence, weather insights and AI-powered agricultural guidance together in one place.</p>

          <div className="auth-features">
            <div><ShieldCheck /><span>Sensorless farm monitoring</span></div>
            <div><Leaf /><span>Crop health intelligence</span></div>
            <div><Sprout /><span>Precision irrigation insights</span></div>
          </div>
        </div>

        <div className="auth-bottom">
          <span>Built for the future of agriculture</span>
          <span>© 2026 AgroPulse AI</span>
        </div>
      </section>

      <section className="auth-form-side">
        <div className="auth-form-container">
          <div className="auth-mobile-brand">
            <div className="auth-logo"><Sprout size={23} /></div>
            <strong>AgroPulse<span>AI</span></strong>
          </div>

          <div className="auth-heading">
            <span>WELCOME TO AGROPULSE</span>
            <h2>{mode === "login" ? "Welcome back" : "Create your account"}</h2>
            <p>{mode === "login" ? "Enter your details to access your farm dashboard." : "Get started with smarter farm management."}</p>
          </div>

          <div className="auth-tabs">
            <button className={mode === "login" ? "selected" : ""} onClick={() => { setMode("login"); setError(""); }}>Sign in</button>
            <button className={mode === "signup" ? "selected" : ""} onClick={() => { setMode("signup"); setError(""); }}>Create account</button>
          </div>

          <form onSubmit={handleSubmit}>
            {mode === "signup" && (
              <label className="auth-field">
                <span>Full name</span>
                <div><User size={17} /><input value={name} onChange={e => setName(e.target.value)} placeholder="Your name" /></div>
              </label>
            )}

            <label className="auth-field">
              <span>Email address</span>
              <div><Mail size={17} /><input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="you@example.com" /></div>
            </label>

            <label className="auth-field">
              <span>Password</span>
              <div>
                <Lock size={17} />
                <input type={showPassword ? "text" : "password"} value={password} onChange={e => setPassword(e.target.value)} placeholder="Minimum 6 characters" />
                <button type="button" onClick={() => setShowPassword(!showPassword)}>{showPassword ? <EyeOff size={17} /> : <Eye size={17} />}</button>
              </div>
            </label>

            {error && <div className="auth-error">{error}</div>}

            <button className="auth-submit" type="submit">
              {mode === "login" ? "Sign in to dashboard" : "Create account"}
              <ArrowRight size={18} />
            </button>
          </form>

          <div className="auth-demo-note">
            <ShieldCheck size={16} />
            <span>Demo access: any valid email and password with at least 6 characters.</span>
          </div>

          <p className="auth-terms">By continuing, you agree to use AgroPulse AI responsibly. This demo does not create a real account.</p>
        </div>
      </section>
    </div>
  );
}
