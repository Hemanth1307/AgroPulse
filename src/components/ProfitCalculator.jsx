
import { useState } from "react";

export default function ProfitCalculator() {
  const [income, setIncome] = useState(50000);
  const [expense, setExpense] = useState(20000);

  return (
    <section>
      <h1>💰 Profit Calculator</h1>
      <label>Expected income (₹)</label>
      <input type="number" value={income} onChange={e => setIncome(Number(e.target.value))} />
      <label>Total expenses (₹)</label>
      <input type="number" value={expense} onChange={e => setExpense(Number(e.target.value))} />
      <h2>Estimated profit: ₹{(income - expense).toLocaleString("en-IN")}</h2>
    </section>
  );
}
