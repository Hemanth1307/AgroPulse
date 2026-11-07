
import { useState } from "react";

export default function FarmingCalendar() {
  const [task, setTask] = useState("");
  const [tasks, setTasks] = useState([]);

  function addTask() {
    if (task.trim()) {
      setTasks([...tasks, task.trim()]);
      setTask("");
    }
  }

  return (
    <section>
      <h1>📅 Farming Calendar</h1>
      <input value={task} onChange={e => setTask(e.target.value)} placeholder="Enter farming task" />
      <button onClick={addTask}>Add Task</button>
      <ul>{tasks.map((t, i) => <li key={i}>{t}</li>)}</ul>
    </section>
  );
}
