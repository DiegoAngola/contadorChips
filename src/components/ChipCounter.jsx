const ChipCounter = ({ label, chips, type, handleChipChange, calculateTotal, chipValues, totalColor }) => (
  <div>
    <h3 className={totalColor}>{label}</h3>
    {chipValues.map((chip) => (
      <div key={chip} className="row align-items-center mb-3 p-2 border rounded bg-secondary">
        <label className="col-sm-4 col-form-label fw-bold" aria-label={`Fichas de ${chip}`}>Fichas de {chip}:</label>
        <div className="col-sm-4">
          <input
            type="number"
            className="form-control text-center"
            value={chips[chip]}
            onChange={(e) => handleChipChange(e.target.value, chip, type)}
            onWheel={(e) => e.target.blur()}
            onFocus={(e) => e.target.select()}
          />
        </div>
        <div className="col-sm-4 text-black fw-bold">
          Total: {chips[chip] * chip}
        </div>
      </div>
    ))}
    <h4 className={`${totalColor} text-center fw-bold`}>Total: {calculateTotal(chips)}</h4>
  </div>
);

export default ChipCounter;