import { useState } from "react";
import { CalendarDays, Plus } from "lucide-react";

export default function FarmingCalendar() {
  const [task, setTask] = useState("");
  const [date, setDate] = useState("");

  const [tasks, setTasks] = useState(() =>
    JSON.parse(localStorage.getItem("agropulse-tasks") || "[]")
  );

  const addTask = (e) => {
    e.preventDefault();

    if (!task.trim() || !date) return;

    const updated = [
      ...tasks,
      {
        id: Date.now(),
        task,
        date,
        completed: false
      }
    ].sort((a, b) => a.date.localeCompare(b.date));

    setTasks(updated);
    localStorage.setItem("agropulse-tasks", JSON.stringify(updated));

    setTask("");
    setDate("");
  };

  const toggleTask = (id) => {
    const updated = tasks.map(item =>
      item.id === id
        ? { ...item, completed: !item.completed }
        : item
    );

    setTasks(updated);
    localStorage.setItem("agropulse-tasks", JSON.stringify(updated));
  };

  return (
    <>
      <div className="page-heading">
        <span className="feature-emoji">📅</span>
        <div>
          <h2>Farming Calendar</h2>
          <p>Organize and manage your farming activities.</p>
        </div>
      </div>

      <section className="panel">
        <form onSubmit={addTask}>
          <label className="field-label">
            Activity Name
            <input
              value={task}
              onChange={e => setTask(e.target.value)}
              placeholder="Example: Water the crops"
              required
            />
          </label>

          <label className="field-label">
            Activity Date
            <input
              type="date"
              value={date}
              onChange={e => setDate(e.target.value)}
              required
            />
          </label>

          <button className="primary-button">
            <Plus size={17} /> Add Activity
          </button>
        </form>
      </section>

      <div className="section-title">
        <h2><CalendarDays size={18} /> Scheduled Activities</h2>
      </div>

      <div className="task-list">
        {tasks.map(item => (
          <label className="task-item" key={item.id}>
            <input
              type="checkbox"
              checked={item.completed}
              onChange={() => toggleTask(item.id)}
            />

            <span>
              <b>{item.task}</b>
              <small>{item.date}</small>
            </span>
          </label>
        ))}
      </div>

      {tasks.length === 0 && (
        <div className="empty-state">No activities scheduled.</div>
      )}
    </>
  );
}
