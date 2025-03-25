import { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";

export default function CasinoChipCounter() {
  const chipValues = [100, 50, 25, 10, 5, 1];
  const [chips, setChips] = useState({ 100: 0, 50: 0, 25: 0, 10: 0, 5: 0, 1: 0 });
  const [history, setHistory] = useState([]);

  // Cargar historial desde localStorage al iniciar
  useEffect(() => {
    try {
      const savedHistory = localStorage.getItem("chipHistory");
      if (savedHistory) {
        setHistory(JSON.parse(savedHistory));
      }
    } catch (error) {
      console.error("Error cargando historial:", error);
    }
  }, []);

  // Guardar historial en localStorage cada vez que cambie
  useEffect(() => {
    try {
      if (history.length > 0) {
        localStorage.setItem("chipHistory", JSON.stringify(history));
      }
    } catch (error) {
      console.error("Error guardando historial:", error);
    }
  }, [history]);

  const handleChange = (value, chip) => {
    setChips({ ...chips, [chip]: Number(value) || 0 });
  };

  const calculateTotal = () => {
    return chipValues.reduce((acc, chip) => acc + chips[chip] * chip, 0);
  };

  const saveToHistory = () => {
    const newEntry = {
      ...chips,
      total: calculateTotal(),
      date: new Date().toLocaleString()
    };
    setHistory((prevHistory) => [...prevHistory, newEntry]);
  };

  const reset = () => {
    setChips({ 100: 0, 50: 0, 25: 0, 10: 0, 5: 0, 1: 0 });
  };

  return (
    <div className="container mt-5">
      <div className="card bg-dark text-white shadow-lg p-4">
        <h2 className="text-center text-warning mb-4">
          <i className="bi bi-coin"></i> Contador de Fichas
        </h2>

        {/* Sección de fichas */}
        <div className="mb-4">
          {chipValues.map((chip) => (
            <div key={chip} className="row align-items-center mb-3 p-2 border rounded bg-secondary">
              <label className="col-sm-4 col-form-label fw-bold">Fichas de {chip}:</label>
              <div className="col-sm-4">
                <input
                  type="number"
                  className="form-control text-center"
                  value={chips[chip]}
                  onChange={(e) => handleChange(e.target.value, chip)}
                />
              </div>
              <div className="col-sm-4 text-black fw-bold">
                Total: {chips[chip] * chip}
              </div>
            </div>
          ))}
        </div>

        {/* Total */}
        <h3 className="text-center text-success fw-bold mb-3">Total: {calculateTotal()}</h3>

        {/* Botones */}
        <div className="d-flex justify-content-center gap-3">
          <button className="btn btn-success px-4" onClick={saveToHistory}>
            Guardar <i className="bi bi-save"></i>
          </button>
          <button className="btn btn-danger px-4" onClick={reset}>
            Reiniciar <i className="bi bi-arrow-counterclockwise"></i>
          </button>
        </div>

        {/* Historial */}
        <div className="mt-4">
          <h3 className="text-warning"><i className="bi bi-journal-text"></i> Historial</h3>
          <div className="list-group mt-2">
            {history.length === 0 ? (
              <p className="text-muted text-center">No hay registros aún.</p>
            ) : (
              history.map((entry, index) => (
                <div key={index} className="list-group-item list-group-item-dark d-flex flex-column">
                  <span>
                    {chipValues
                      .filter((chip) => entry[chip] > 0)
                      .map((chip) => `${entry[chip]} x ${chip}`)
                      .join(" | ")}
                  </span>
                  <strong className="text-success">Total: {entry.total}</strong>
                  <small className="text-muted">📅 {entry.date}</small>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
