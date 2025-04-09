const HistoryList = ({ history }) => (
  <div className="mt-4">
    <h3 className="text-warning">Historial</h3>
    <div className="list-group mt-2">
      {history.length === 0 ? (
        <p className="text-muted text-center">No hay registros aún.</p>
      ) : (
        history.map((entry, index) => (
          <div key={index} className="list-group-item list-group-item-dark d-flex flex-column">
            <span>{entry.date}</span>
            <span>Fichas Dólares: {entry.dollarChips} (Total: {entry.totalDollars})</span>
            <span>Fichas Bolívares: {entry.bolivarChips} (Total: {entry.totalBolivars})</span>
            <span>Billetes Bolívares: {entry.billCount} (Total: {entry.totalBolivarBills})</span>
            <span>Total Bolívares Convertido a Dólares: {entry.totalBolivarsConverted}</span>
            <span>Billetes Dólares: {entry.dollarBills} (Total: {entry.totalDollarBills})</span>
            <span className="fw-bold">Total General: {parseFloat(entry.totalCombined).toFixed(2)}</span>
          </div>
        ))
      )}
    </div>
  </div>
);

export default HistoryList;