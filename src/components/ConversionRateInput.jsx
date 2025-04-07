const ConversionRateInput = ({ conversionRate, handleConversionRateChange }) => (
  <div className="row align-items-center mb-4">
    <label className="col-sm-4 col-form-label fw-bold text-white" aria-label="Tasa de Conversión">Tasa de Conversión (Bs a $):</label>
    <div className="col-sm-4">
      <input
        type="number"
        className="form-control text-center"
        value={conversionRate}
        onChange={(e) => handleConversionRateChange(e.target.value)}
        onWheel={(e) => e.target.blur()}
        onFocus={(e) => e.target.select()}
      />
    </div>
  </div>
);

export default ConversionRateInput;