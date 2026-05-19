import { useMemo, useState } from "react";
import HidraulicaMap from "./HidraulicaMap";
import DateRangeSelector from "./DateRangeSelector";
import LevelChart from "./LevelChart";
import { getSelectedPoint, points, precipitationSeries } from "./data";
import "./styles.css";

export default function HidraulicaPage() {
  const [selectedPointId, setSelectedPointId] = useState(points[0].id);
  const selectedPoint = useMemo(() => getSelectedPoint(points, selectedPointId), [selectedPointId]);
  const [range, setRange] = useState({ start: 0, end: Math.max(selectedPoint.series.length - 1, 0) });

  const series = selectedPoint.series;
  const safeEnd = Math.max(series.length - 1, 0);
  const startIndex = Math.min(range.start, safeEnd);
  const endIndex = Math.min(Math.max(range.end, startIndex), safeEnd);

  const filtered = series.slice(startIndex, endIndex + 1);
  const startDate = filtered[0]?.dateKey ?? series[0]?.dateKey;
  const endDate = filtered[filtered.length - 1]?.dateKey ?? series[safeEnd]?.dateKey;
  const precipitationFiltered = precipitationSeries.filter((item) => {
    if (!startDate || !endDate) return false;
    return item.date >= startDate && item.date <= endDate;
  });

  const handleSelectPoint = (pointId) => {
    const next = getSelectedPoint(points, pointId);
    setSelectedPointId(next.id);
    setRange({ start: 0, end: Math.max(next.series.length - 1, 0) });
  };

  const handleRangeChange = (start, end) => {
    const normalizedStart = Math.max(0, Math.min(start, end));
    const normalizedEnd = Math.max(normalizedStart, Math.min(end, series.length - 1));
    setRange({ start: normalizedStart, end: normalizedEnd });
  };

  return (
    <div className="page-container hydro-page">
      <header className="hydro-hero card">
        <div>
          <p className="hydro-eyebrow">Hidráulica</p>
          <h1>Niveles de agua subterránea</h1>
          <p className="hydro-lead">
            Selecciona un pozo en el mapa para ver la gráfica de niveles contra tiempo.
            La curva usa eje Y invertido para que los valores positivos se lean de forma más natural.
          </p>
        </div>

        <div className="hydro-info-card card">
          <span className="hydro-info-card__label">Punto activo</span>
          <strong>{selectedPoint.name}</strong>
          <p>
            {selectedPoint.hasSeries
              ? "Este punto ya tiene una serie de niveles cargada para empezar a probar el filtro por fechas."
              : "Todavía no hay serie para este punto."}
          </p>
        </div>
      </header>

      <section className="hydro-layout">
        <div className="card hydro-map-card">
          <div className="hydro-section-title">
            <h2>Mapa de pozos</h2>
            <span>{points.length} puntos</span>
          </div>
          <HidraulicaMap points={points} selectedPointId={selectedPointId} onSelectPoint={handleSelectPoint} />
        </div>

        <aside className="hydro-side-panel">
          <div className="card hydro-side-card">
            <div className="hydro-section-title">
              <h2>Detalle del punto</h2>
              <span>{selectedPoint.hasSeries ? "Con datos" : "Sin datos"}</span>
            </div>

            <div className="hydro-point-meta">
              <div>
                <span>Nombre</span>
                <strong>{selectedPoint.name}</strong>
              </div>
              <div>
                <span>Coordenadas</span>
                <strong>{selectedPoint.lat.toFixed(6)}, {selectedPoint.lng.toFixed(6)}</strong>
              </div>
            </div>

            <DateRangeSelector series={series} startIndex={startIndex} endIndex={endIndex} onChange={handleRangeChange} />

            <div className="hydro-mini-summary">
              <div>
                <span>Registros visibles</span>
                <strong>{filtered.length}</strong>
              </div>
              <div>
                <span>Rango</span>
                <strong>{series.length ? `${startIndex + 1} - ${endIndex + 1}` : "—"}</strong>
              </div>
            </div>
          </div>

          <details className="card hydro-side-card hydro-details-card">
            <summary className="hydro-details-summary">
              <div className="hydro-section-title hydro-section-title--compact">
                <h2>Serie filtrada</h2>
                <span>{filtered.length} registros</span>
              </div>
            </summary>

            <div className="hydro-details-content">
              {selectedPoint.hasSeries ? (
                <ul className="hydro-series-list">
                  {filtered.map((item) => (
                    <li key={item.timestamp}>
                      <span>{item.label}</span>
                      <strong>{item.level.toFixed(2)} m</strong>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="hydro-empty-state">Aún no hay niveles para este punto.</p>
              )}
            </div>
          </details>
        </aside>
      </section>

      <section className="card hydro-chart-card">
        <div className="hydro-section-title">
          <h2>Gráfica de niveles</h2>
          <span>{selectedPoint.name}</span>
        </div>
        <LevelChart levels={filtered} precipitation={precipitationFiltered} />
      </section>
    </div>
  );
}
