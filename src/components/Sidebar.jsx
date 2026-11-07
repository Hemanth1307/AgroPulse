
export default function Sidebar({ activePage, setActivePage }) {
  const menus = [
    "Dashboard", "Irrigation", "Weather", "Crop Doctor",
    "Crop Health", "Nutrient Advisor", "Satellite Monitoring",
    "Farming Calendar", "Profit Calculator", "Yield Predictor",
    "Farmer Chatbot"
  ];

  return (
    <aside className="sidebar">
      <h3>🌾 Menu</h3>
      {menus.map((menu) => (
        <button
          key={menu}
          className={activePage === menu ? "active" : ""}
          onClick={() => setActivePage(menu)}
        >
          {menu}
        </button>
      ))}
    </aside>
  );
}
