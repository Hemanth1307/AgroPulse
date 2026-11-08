import { Sprout, Menu } from "lucide-react";

export default function Navbar({ title = "AgroPulse", user = "Farmer", onMenu }) {
  return (
    <header className="topbar">
      <button className="mobile-menu" onClick={onMenu}>
        <Menu />
      </button>

      <div className="brand-inline">
        <Sprout />
        <b>{title}</b>
      </div>

      <div className="user-chip">
        <span className="user-avatar">
          {user.charAt(0).toUpperCase()}
        </span>
        {user}
      </div>
    </header>
  );
}
