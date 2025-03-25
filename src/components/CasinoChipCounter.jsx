import { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";

export default function DualChipCounter() {
  const chipValues = [100, 50, 25, 10, 5, 1];
  const billValues = [500, 200, 100, 50, 20, 10, 5];
  const [dollarChips, setDollarChips] = useState({ 100: 0, 50: 0, 25: 0, 10: 0, 5: 0, 1: 0 });
  const [bolivarChips, setBolivarChips] = useState({ 100: 0, 50: 0, 25: 0, 10: 0, 5: 0, 1: 0 });
  const [bolivarBills, setBolivarBills] = useState({ 500: 0, 200: 0, 100: 0, 50: 0, 20: 0, 10: 0, 5: 0 });
  const [history, setHistory] = useState([]);

  useEffect(() => {
    try {
      const savedHistory = localStorage.getItem("chipHistory");
      if (savedHistory) {
        setHistory(JSON.parse(savedHistory));
      }
    } catch (error) {
      console.error("Error cargando historial:", error);
      setHistory([]); // Asegura que history tenga un valor válido en caso de error
    }
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem("chipHistory", JSON.stringify(history));
    } catch (error) {
      console.error("Error guardando historial:", error);
    }
  }, [history]);

  const handleChange = (value, chip, type) => {
    const sanitizedValue = value === "" ? 0 : Math.max(0, Number(value));
    if (type === "dollar") {
      setDollarChips({ ...dollarChips, [chip]: sanitizedValue });
    } else if (type === "bolivarChip") {
      setBolivarChips({ ...bolivarChips, [chip]: sanitizedValue });
    } else {
      setBolivarBills({ ...bolivarBills, [chip]: sanitizedValue });
    }
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
      bolivarBills: formatBills(bolivarBills),
      totalDollars: calculateTotal(dollarChips),
      totalBolivarsChips: calculateTotal(bolivarChips),
      totalBolivarsBills: calculateBillTotal(bolivarBills),
      totalCombined: calculateTotal(dollarChips) + calculateTotal(bolivarChips) + calculateBillTotal(bolivarBills),
      date: new Date().toLocaleString()
    };
    setHistory((prevHistory) => [...prevHistory, newEntry]);
  };

  const reset = () => {
    setDollarChips({ 100: 0, 50: 0, 25: 0, 10: 0, 5: 0, 1: 0 });
    setBolivarChips({ 100: 0, 50: 0, 25: 0, 10: 0, 5: 0, 1: 0 });
    setBolivarBills({ 500: 0, 200: 0, 100: 0, 50: 0, 20: 0, 10: 0, 5: 0 });
  };

  const billColors = {
    5: "#e6dfcd",
    10: "#e5e2f3",
    20: "#f4e2be",
    50: "#beccb3",
    100: "#d5b6c6",
    200: "#f2e4ca",
    500: "#e7ead9"
  };

  return (
    <div className="container mt-5">
      <div className="card bg-dark text-white shadow-lg p-4">
        <h2 className="text-center text-warning mb-4">Contador de Fichas y Billetes</h2>

        {[{ label: "Dólares 💵", chips: dollarChips, type: "dollar", totalColor: "text-success" },
          { label: "Bolívares 💴", chips: bolivarChips, type: "bolivarChip", totalColor: "text-primary" }].map(({ label, chips, type, totalColor }) => (
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
                    onChange={(e) => handleChange(e.target.value, chip, type)}
                    onWheel={(e) => e.target.blur()} // Desactiva el cambio por scroll
                    onFocus={(e) => e.target.select()} // Selecciona el valor al enfocar
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


        {/* Sección de Billetes */}
        <div className="mt-4">
          <h3 className="text-warning">Contador de Billetes de Bolívares 💴</h3>
          {billValues.map((bill) => (
            <div key={bill} className="row align-items-center mb-3 p-2 border rounded" style={{ backgroundColor: billColors[bill] }}>
              <label className="col-sm-4 col-form-label fw-bold">Billetes de {bill}:</label>
              <div className="col-sm-4">
                <input
                  type="number"
                  className="form-control text-center"
                  value={bolivarBills[bill]}
                  onChange={(e) => handleChange(e.target.value, bill, "bolivarBill")}
                  onWheel={(e) => e.target.blur()} // Desactiva el cambio por scroll
                  onFocus={(e) => e.target.select()} // Selecciona el valor al enfocar
                />
              </div>
              <div className="col-sm-4 text-black fw-bold">
                Total: {bolivarBills[bill] * bill}
              </div>
            </div>
          ))}
          <h4 className="text-primary text-center fw-bold">Total Billetes: {calculateBillTotal(bolivarBills)}</h4>
        </div>
        <h3 className="text-warning text-center fw-bold mt-3">Total General: {calculateTotal(dollarChips) + calculateTotal(bolivarChips) + calculateBillTotal(bolivarBills)}</h3>
        <div className="d-flex justify-content-center gap-3">
          <button className="btn btn-success px-4" onClick={saveToHistory}>Guardar</button>
          <button className="btn btn-danger px-4" onClick={reset}>Reiniciar</button>
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
                  <span>Bolívares (Fichas): {entry.bolivarChips} (Total: {entry.totalBolivarsChips})</span>
                  <span>Bolívares (Billetes): {entry.bolivarBills} (Total: {entry.totalBolivarsBills})</span>
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
