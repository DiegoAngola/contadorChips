import { useState, useEffect } from "react";
import ChipCounter from "./ChipCounter";
import BillCounter from "./BillCounter";
import ConversionRateInput from "./ConversionRateInput";
import HistoryList from "./HistoryList";

export default function DualChipCounter() {
  // Estados iniciales
  const [conversionRate, setConversionRate] = useState(0); // Tasa de conversión
  const [dollarChips, setDollarChips] = useState({ 100: 0, 50: 0, 25: 0, 10: 0, 5: 0, 1: 0 });
  const [bolivarChips, setBolivarChips] = useState({ 100: 0, 50: 0, 25: 0, 10: 0, 5: 0, 1: 0 });
  const [billCount, setBillCount] = useState({ 500: 0, 200: 0, 100: 0, 50: 0, 20: 0, 10: 0, 5: 0 });
  const [dollarBills, setDollarBills] = useState({ 100: 0, 50: 0, 20: 0, 10: 0, 5: 0, 1: 0 });
  const [history, setHistory] = useState([]);

  // Función para manejar el cambio de la tasa de conversión
  const handleConversionRateChange = (value) => {
    const sanitizedValue = value === "" ? 0 : Math.max(0, Number(value));
    setConversionRate(sanitizedValue > 0 ? sanitizedValue : 0);
  };

  // Función para calcular el total de fichas
  const calculateTotal = (chips) => {
    return Object.keys(chips).reduce((acc, chip) => acc + chips[chip] * chip, 0);
  };

  // Función para calcular el total de billetes
  const calculateBillTotal = (bills) => {
    return Object.keys(bills).reduce((acc, bill) => acc + bills[bill] * bill, 0);
  };

  // Función para calcular el total en bolívares convertido a dólares
  const calculateBolivarTotalInDollars = () => {
    const totalBolivars = calculateTotal(bolivarChips) + calculateBillTotal(billCount);
    return conversionRate > 0 ? (totalBolivars / conversionRate).toFixed(2) : 0;
  };

  // Función para calcular el total general
  const calculateTotalGeneral = () => {
    const totalDollars = calculateTotal(dollarChips); // Total de fichas en dólares
    const totalBolivars = calculateTotal(bolivarChips); // Total de fichas en bolívares
    const totalBolivarsConverted = calculateBolivarTotalInDollars(); // Total de billetes en bolívares convertido a dólares
    const totalDollarBills = calculateBillTotal(dollarBills); // Total de billetes en dólares

    return totalDollars + totalBolivars + parseFloat(totalBolivarsConverted) + totalDollarBills;
  };

  // Función para guardar el historial
  const saveToHistory = () => {
    const formatChips = (chips) =>
      Object.keys(chips)
        .map((chip) => `${chips[chip]} fichas de ${chip}`)
        .filter((entry) => !entry.startsWith("0"))
        .join(", ");

    const formatBills = (bills) =>
      Object.keys(bills)
        .map((bill) => `${bills[bill]} billetes de ${bill}`)
        .filter((entry) => !entry.startsWith("0"))
        .join(", ");

    const totalDollars = calculateTotal(dollarChips); // Total de fichas en dólares
    const totalBolivars = calculateTotal(bolivarChips); // Total de fichas en bolívares
    const totalBolivarBills = calculateBillTotal(billCount); // Total de billetes en bolívares
    const totalBolivarsConverted = calculateBolivarTotalInDollars(); // Total de billetes en bolívares convertido a dólares
    const totalDollarBills = calculateBillTotal(dollarBills); // Total de billetes en dólares
    const totalCombined =
      totalDollars + totalBolivars + parseFloat(totalBolivarsConverted) + totalDollarBills; // Total General

    const newEntry = {
      dollarChips: formatChips(dollarChips),
      bolivarChips: formatChips(bolivarChips),
      billCount: formatBills(billCount),
      dollarBills: formatBills(dollarBills),
      totalDollars,
      totalBolivars,
      totalBolivarBills,
      totalBolivarsConverted,
      totalDollarBills,
      totalCombined,
      date: new Date().toLocaleString(),
    };

    setHistory((prevHistory) => [...prevHistory, newEntry]);
  };

  // Función para reiniciar los valores
  const reset = () => {
    setDollarChips({ 100: 0, 50: 0, 25: 0, 10: 0, 5: 0, 1: 0 });
    setBolivarChips({ 100: 0, 50: 0, 25: 0, 10: 0, 5: 0, 1: 0 });
    setBillCount({ 500: 0, 200: 0, 100: 0, 50: 0, 20: 0, 10: 0, 5: 0 });
    setDollarBills({ 100: 0, 50: 0, 20: 0, 10: 0, 5: 0, 1: 0 });
    setConversionRate(0);
  };

  // Función para borrar el historial
  const clearHistory = () => {
    setHistory([]);
  };

  // Persistencia del estado en localStorage
  useEffect(() => {
    const savedState = localStorage.getItem("chipCounterState");
    if (savedState) {
      const parsedState = JSON.parse(savedState);
      setDollarChips(parsedState.dollarChips || {});
      setBolivarChips(parsedState.bolivarChips || {});
      setBillCount(parsedState.billCount || {});
      setDollarBills(parsedState.dollarBills || {});
      setConversionRate(parsedState.conversionRate || 0);
      setHistory(parsedState.history || []);
    }
  }, []);

  useEffect(() => {
    const stateToSave = {
      dollarChips,
      bolivarChips,
      billCount,
      dollarBills,
      conversionRate,
      history,
    };
    localStorage.setItem("chipCounterState", JSON.stringify(stateToSave));
  }, [dollarChips, bolivarChips, billCount, dollarBills, conversionRate, history]);

  return (
    <div className="container mt-5">
      <div className="card bg-dark text-white shadow-lg p-4">
        <h2 className="text-center text-warning mb-4">Contador de Fichas y Billetes</h2>

        <ConversionRateInput
          conversionRate={conversionRate}
          handleConversionRateChange={handleConversionRateChange}
        />

        <ChipCounter
          label="Ficha Dólares 💵"
          chips={dollarChips}
          type="dollar"
          handleChipChange={(value, chip) =>
            setDollarChips({ ...dollarChips, [chip]: Number(value) })
          }
          calculateTotal={calculateTotal}
          chipValues={[100, 50, 25, 10, 5, 1]}
          totalColor="text-success"
        />

        <ChipCounter
          label="Ficha Bolívares 💴"
          chips={bolivarChips}
          type="bolivar"
          handleChipChange={(value, chip) =>
            setBolivarChips({ ...bolivarChips, [chip]: Number(value) })
          }
          calculateTotal={calculateTotal}
          chipValues={[100, 50, 25, 10, 5, 1]}
          totalColor="text-primary"
        />

        <BillCounter
          label="Billetes Bolívares"
          bills={billCount}
          handleBillChange={(value, bill) =>
            setBillCount({ ...billCount, [bill]: Number(value) })
          }
          calculateBillTotal={calculateBillTotal}
          billValues={[500, 200, 100, 50, 20, 10, 5]}
          totalColor="text-warning"
        />

        <h4 className="text-info text-center fw-bold">
          Total en Bolívares Convertido a Dólares: {calculateBolivarTotalInDollars()}
        </h4>

        <BillCounter
          label="Billetes Dólares"
          bills={dollarBills}
          handleBillChange={(value, bill) =>
            setDollarBills({ ...dollarBills, [bill]: Number(value) })
          }
          calculateBillTotal={calculateBillTotal}
          billValues={[100, 50, 20, 10, 5, 1]}
          totalColor="text-info"
        />

        <h3 className="text-warning text-center fw-bold mt-3">
          Total General: {calculateTotalGeneral()}
        </h3>

        <div className="d-flex justify-content-center gap-3">
          <button className="btn btn-success px-4" onClick={saveToHistory}>
            Guardar
          </button>
          <button className="btn btn-danger px-4" onClick={reset}>
            Reiniciar
          </button>
          <button className="btn btn-warning px-4" onClick={clearHistory}>
            Borrar Historial
          </button>
        </div>

        <HistoryList history={history} />
      </div>
    </div>
  );
}