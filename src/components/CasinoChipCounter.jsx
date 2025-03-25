import { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";

export default function DualChipCounter() {
  const chipValues = [100, 50, 25, 10, 5, 1];
  const billValues = [500, 200, 100, 50, 20, 10, 5];
  const [dollarChips, setDollarChips] = useState({ 100: 0, 50: 0, 25: 0, 10: 0, 5: 0, 1: 0 });
  const [bolivarChips, setBolivarChips] = useState({ 100: 0, 50: 0, 25: 0, 10: 0, 5: 0, 1: 0 });
  const [billCount, setBillCount] = useState({ 500: 0, 200: 0, 100: 0, 50: 0, 20: 0, 10: 0, 5: 0 });
  const [history, setHistory] = useState([]);

  useEffect(() => {
    try {
      const savedHistory = localStorage.getItem("chipHistory");
      if (savedHistory) {
        setHistory(JSON.parse(savedHistory));
      }
    } catch (error) {
      console.error("Error cargando historial:", error);
      setHistory([]);
    }
  }, []);
  
  useEffect(() => {
    try {
      localStorage.setItem("chipHistory", JSON.stringify(history));
    } catch (error) {
      console.error("Error guardando historial:", error);
    }
  }, [history]);

  const handleChipChange = (value, chip, type) => {
    const sanitizedValue = value === "" ? 0 : Math.max(0, Number(value));
    if (type === "dollar") {
      setDollarChips({ ...dollarChips, [chip]: sanitizedValue });
    } else {
      setBolivarChips({ ...bolivarChips, [chip]: sanitizedValue });
    }
  };

  const handleBillChange = (value, bill) => {
    const sanitizedValue = value === "" ? 0 : Math.max(0, Number(value));
    setBillCount({ ...billCount, [bill]: sanitizedValue });
  };

  const calculateTotal = (chips) => {
    return chipValues.reduce((acc, chip) => acc + chips[chip] * chip, 0);
  };

  const calculateBillTotal = (bills) => {
    return billValues.reduce((acc, bill) => acc + bills[bill] * bill, 0);
  };

  const saveToHistory = () => {
    const formatChips = (chips) =>
      chipValues.map((chip) => chips[chip] > 0 ? `${chips[chip]} fichas de ${chip}` : null).filter(Boolean).join(", ");
    
    const formatBills = (bills) =>
      billValues.map((bill) => bills[bill] > 0 ? `${bills[bill]} billetes de ${bill}` : null).filter(Boolean).join(", ");

    const newEntry = {
      dollarChips: formatChips(dollarChips),
      bolivarChips: formatChips(bolivarChips),
      billCount: formatBills(billCount),
      totalDollars: calculateTotal(dollarChips),
      totalBolivars: calculateTotal(bolivarChips),
      totalBills: calculateBillTotal(billCount),
      totalCombined: calculateTotal(dollarChips) + calculateTotal(bolivarChips) + calculateBillTotal(billCount),
      date: new Date().toLocaleString()
    };
    setHistory((prevHistory) => [...prevHistory, newEntry]);
  };

  const reset = () => {
    setDollarChips({ 100: 0, 50: 0, 25: 0, 10: 0, 5: 0, 1: 0 });
    setBolivarChips({ 100: 0, 50: 0, 25: 0, 10: 0, 5: 0, 1: 0 });
    setBillCount({ 500: 0, 200: 0, 100: 0, 50: 0, 20: 0, 10: 0, 5: 0 });
  };

  const clearHistory = () => {
    setHistory([]);
    localStorage.removeItem("chipHistory");
  };

  return (
    <div className="container mt-5">
      <div className="card bg-dark text-white shadow-lg p-4">
        <h2 className="text-center text-warning mb-4">Contador de Fichas y Billetes</h2>

        {/* Dollar and Bolivar Chips */}
        {[{ label: "Dólares 💵", chips: dollarChips, type: "dollar", totalColor: "text-success" },
          { label: "Bolívares 💴", chips: bolivarChips, type: "bolivar", totalColor: "text-primary" }].map(({ label, chips, type, totalColor }) => (
          <div key={type}>
            <h3 className={totalColor}>{label}</h3>
            {chipValues.map((chip) => (
              <div key={chip} className="row align-items-center mb-3 p-2 border rounded bg-secondary">
                <label className="col-sm-4 col-form-label fw-bold">Fichas de {chip}:</label>
                <div className="col-sm-4">
                  <input
                    type="number"
                    className="form-control text-center"
                    value={chips[chip]}
                    onChange={(e) => handleChipChange(e.target.value, chip, type)}
                    onWheel={(e) => e.target.blur()} // Disable scroll changes
                    onFocus={(e) => e.target.select()} // Select input value on focus
                  />
                </div>
                <div className="col-sm-4 text-black fw-bold">
                  Total: {chips[chip] * chip}
                </div>
              </div>
            ))}
            <h4 className={`${totalColor} text-center fw-bold`}>Total: {calculateTotal(chips)}</h4>
          </div>
        ))}

        {/* Bill Counter */}
        <h3 className="text-warning">Contador de Billetes</h3>
        {billValues.map((bill, index) => (
          <div key={bill} className="row align-items-center mb-3 p-2 border rounded" style={{ backgroundColor: `${index === 0 ? "#e7ead9" : index === 1 ? "#f2e4ca" : index === 2 ? "#d5b6c6" : index === 3 ? "#beccb3" : index === 4 ? "#f4e2be" : index === 5 ? "#e5e2f3" : "#e6dfcd"}` }}>
            <label className="col-sm-4 col-form-label fw-bold">Billetes de {bill}:</label>
            <div className="col-sm-4">
              <input
                type="number"
                className="form-control text-center"
                value={billCount[bill]}
                onChange={(e) => handleBillChange(e.target.value, bill)}
                onWheel={(e) => e.target.blur()} // Disable scroll changes
                onFocus={(e) => e.target.select()} // Select input value on focus
              />
            </div>
            <div className="col-sm-4 text-black fw-bold">
              Total: {billCount[bill] * bill}
            </div>
          </div>
        ))}
        <h4 className="text-warning text-center fw-bold">Total de Billetes: {calculateBillTotal(billCount)}</h4>

        <h3 className="text-warning text-center fw-bold mt-3">Total General: {calculateTotal(dollarChips) + calculateTotal(bolivarChips) + calculateBillTotal(billCount)}</h3>

        <div className="d-flex justify-content-center gap-3">
          <button className="btn btn-success px-4" onClick={saveToHistory}>Guardar</button>
          <button className="btn btn-danger px-4" onClick={reset}>Reiniciar</button>
          <button className="btn btn-warning px-4" onClick={clearHistory}>Borrar Historial</button>
        </div>

        <div className="mt-4">
          <h3 className="text-warning">Historial</h3>
          <div className="list-group mt-2">
            {history.length === 0 ? (
              <p className="text-muted text-center">No hay registros aún.</p>
            ) : (
              history.map((entry, index) => (
                <div key={index} className="list-group-item list-group-item-dark d-flex flex-column">
                  <span>{entry.date}</span>
                  <span>Dólares: {entry.dollarChips} (Total: {entry.totalDollars})</span>
                  <span>Bolívares: {entry.bolivarChips} (Total: {entry.totalBolivars})</span>
                  <span>Billetes: {entry.billCount} (Total: {entry.totalBills})</span>
                  <span className="fw-bold">Total General: {entry.totalCombined}</span>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
