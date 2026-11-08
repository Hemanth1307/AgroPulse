import { useState } from "react";
import { Calculator } from "lucide-react";

export default function ProfitCalculator() {
  const [area, setArea] = useState(1);
  const [yieldPerAcre, setYieldPerAcre] = useState(2500);
  const [price, setPrice] = useState(25);
  const [cost, setCost] = useState(30000);

  const revenue = area * yieldPerAcre * price;
  const profit = revenue - cost;

  return (
    <>
      <div className="page-heading">
        <span className="feature-emoji">💰</span>
        <div>
          <h2>Farm Profit Calculator</h2>
          <p>Estimate your farming revenue and expenses.</p>
        </div>
      </div>

      <div className="two-column">
        <section className="panel">
          <h3>Enter Farm Details</h3>

          <label className="field-label">
            Cultivated Area (Acres)
            <input
              type="number"
              min="0"
              value={area}
              onChange={e => setArea(Math.max(0, Number(e.target.value) || 0))}
            />
          </label>

          <label className="field-label">
            Expected Yield (kg/acre)
            <input
              type="number"
              min="0"
              value={yieldPerAcre}
              onChange={e =>
                setYieldPerAcre(Math.max(0, Number(e.target.value) || 0))
              }
            />
          </label>

          <label className="field-label">
            Selling Price (₹/kg)
            <input
              type="number"
              min="0"
              value={price}
              onChange={e => setPrice(Math.max(0, Number(e.target.value) || 0))}
            />
          </label>

          <label className="field-label">
            Total Farming Cost (₹)
            <input
              type="number"
              min="0"
              value={cost}
              onChange={e => setCost(Math.max(0, Number(e.target.value) || 0))}
            />
          </label>
        </section>

        <section className="panel result-panel">
          <Calculator size={30} />

          <span className="overline">ESTIMATED NET PROFIT / LOSS</span>

          <div className={`big-result ${profit < 0 ? "negative" : ""}`}>
            ₹{profit.toLocaleString("en-IN")}
          </div>

          <div className="result-row">
            <span>Total Revenue</span>
            <b>₹{revenue.toLocaleString("en-IN")}</b>
          </div>

          <div className="result-row">
            <span>Total Cost</span>
            <b>₹{cost.toLocaleString("en-IN")}</b>
          </div>

          <div className="result-row">
            <span>Net Profit / Loss</span>
            <b>₹{profit.toLocaleString("en-IN")}</b>
          </div>

          <p className="helper-text">
            This is an estimate based on your inputs. Actual market prices
            and expenses may differ.
          </p>
        </section>
      </div>
    </>
  );
}
