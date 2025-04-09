const BillCounter = ({ label, bills, handleBillChange, calculateBillTotal, billValues, totalColor }) => (
  <div>
    <h3 className={totalColor}>{label}</h3>
    {billValues.map((bill, index) => (
      <div
        key={bill}
        className="row align-items-center mb-3 p-2 border rounded"
        style={{
          backgroundColor: `${
            index === 0
              ? "#e7ead9"
              : index === 1
              ? "#f2e4ca"
              : index === 2
              ? "#d5b6c6"
              : index === 3
              ? "#beccb3"
              : index === 4
              ? "#f4e2be"
              : index === 5
              ? "#e5e2f3"
              : "#e6dfcd"
          }`,
        }}
      >
        <label className="col-sm-4 col-form-label fw-bold text-black" aria-label={`Billetes de ${bill}`}>Billetes de {bill}:</label>
        <div className="col-sm-4">
          <input
            type="number"
            className="form-control text-center"
            value={bills[bill]}
            onChange={(e) => handleBillChange(e.target.value, bill)}
            onWheel={(e) => e.target.blur()}
            onFocus={(e) => e.target.select()}
          />
        </div>
        <div className="col-sm-4 text-black fw-bold">
          Total: {bills[bill] * bill}
        </div>
      </div>
    ))}
    <h4 className={`${totalColor} text-center fw-bold`}>Total: {parseFloat(calculateBillTotal(bills)).toFixed(2)}</h4>
  </div>
);

export default BillCounter;