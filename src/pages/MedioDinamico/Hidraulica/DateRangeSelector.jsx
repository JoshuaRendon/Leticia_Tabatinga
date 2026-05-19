export default function DateRangeSelector({ series, startIndex, endIndex, onChange }) {
  if (!series.length) return null;

  const min = 0;
  const max = series.length - 1;
  const startItem = series[startIndex] ?? series[0];
  const endItem = series[endIndex] ?? series[max];

  return (
    <div className="hydro-range-card">
      <div className="hydro-range-card__header">
        <h3>Seleccionador de fechas</h3>
        <p>Arrastra para elegir inicio y final</p>
      </div>

      <div className="hydro-range-values">
        <div>
          <span>Inicio</span>
          <strong>{startItem.label}</strong>
        </div>
        <div>
          <span>Final</span>
          <strong>{endItem.label}</strong>
        </div>
      </div>

      <div className="hydro-range-sliders">
        <label>
          <span>Desde</span>
          <input
            type="range"
            min={min}
            max={max}
            value={startIndex}
            onChange={(e) => onChange(Number(e.target.value), endIndex)}
          />
        </label>

        <label>
          <span>Hasta</span>
          <input
            type="range"
            min={min}
            max={max}
            value={endIndex}
            onChange={(e) => onChange(startIndex, Number(e.target.value))}
          />
        </label>
      </div>
    </div>
  );
}
