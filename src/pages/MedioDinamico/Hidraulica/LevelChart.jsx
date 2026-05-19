import { useState } from "react";

function sortDateKeys(dateKeys) {
  return [...new Set(dateKeys)].sort();
}

const MONTHS_ES = [
  "Enero",
  "Febrero",
  "Marzo",
  "Abril",
  "Mayo",
  "Junio",
  "Julio",
  "Agosto",
  "Septiembre",
  "Octubre",
  "Noviembre",
  "Diciembre",
];

function formatDayMonth(dateKey) {
  const [, month, day] = dateKey.split("-");
  return `${Number(day)}-${MONTHS_ES[Number(month) - 1]}`;
}

function formatExactDate(dateKey) {
  const [year, month, day] = dateKey.split("-");
  return `${Number(day)} de ${MONTHS_ES[Number(month) - 1]} de ${year}`;
}

export default function LevelChart({ levels, precipitation = [] }) {
  const [activePopup, setActivePopup] = useState(null);

  if (!levels.length) {
    return <div className="hydro-empty-state">No hay datos en el rango seleccionado.</div>;
  }

  const width = 900;
  const height = 460;
  const padding = { top: 28, right: 78, bottom: 96, left: 78 };
  const plotWidth = width - padding.left - padding.right;
  const plotHeight = height - padding.top - padding.bottom;

  const precipitationByDate = new Map(precipitation.map((item) => [item.date, item]));
  const domainDates = sortDateKeys([
    ...levels.map((item) => item.dateKey),
    ...precipitation.map((item) => item.date),
  ]);

  const getX = (dateKey) => {
    const index = domainDates.indexOf(dateKey);
    return padding.left + (Math.max(index, 0) / Math.max(domainDates.length - 1, 1)) * plotWidth;
  };

  const levelValues = levels.map((item) => item.level);
  const minLevel = Math.min(...levelValues);
  const maxLevel = Math.max(...levelValues);
  const levelRange = maxLevel - minLevel || 1;
  const levelY = (value) => padding.top + ((value - minLevel) / levelRange) * plotHeight;

  const precipitationValues = precipitation.map((item) => Number(item.value) || 0);
  const precipMax = Math.max(...precipitationValues, 1);
  const bottomY = height - padding.bottom;

  const levelTicks = [0, 0.25, 0.5, 0.75, 1].map((ratio) => {
    const value = minLevel + ratio * levelRange;
    const y = padding.top + ratio * plotHeight;
    return { value, y };
  });

  const precipTicks = [0, 0.25, 0.5, 0.75, 1].map((ratio) => {
    const value = precipMax - ratio * precipMax;
    const y = padding.top + ratio * plotHeight;
    return { value, y };
  });

  const visibleDates = domainDates.filter((_, index) => index % 5 === 0 || index === domainDates.length - 1);
  const orderedLevels = [...levels].sort((a, b) => a.dateKey.localeCompare(b.dateKey));
  const levelPath = orderedLevels
    .map((item) => `${getX(item.dateKey)},${levelY(item.level)}`)
    .join(" ");

  const popupWidth = activePopup ? Math.max(...activePopup.lines.map((line) => line.length)) * 7.2 + 20 : 0;
  const popupHeight = activePopup ? activePopup.lines.length * 16 + 14 : 0;
  const popupX = activePopup
    ? Math.min(Math.max(activePopup.x + 10, padding.left + 4), width - padding.right - popupWidth - 4)
    : 0;
  const popupY = activePopup
    ? Math.max(activePopup.y - popupHeight - 10, padding.top + 4)
    : 0;

  return (
    <div className="hydro-chart-shell">
      <div className="hydro-chart-shell__header">
        <h3>Niveles de agua subterránea</h3>
      </div>

      <svg
        viewBox={`0 0 ${width} ${height}`}
        className="hydro-svg-chart"
        role="img"
        aria-label="Gráfica de niveles contra tiempo y precipitación"
        onClick={() => setActivePopup(null)}
      >
        {[0, 0.25, 0.5, 0.75, 1].map((ratio) => {
          const y = padding.top + ratio * plotHeight;
          return <line key={ratio} x1={padding.left} x2={width - padding.right} y1={y} y2={y} className="hydro-grid-line" />;
        })}

        <line x1={padding.left} x2={padding.left} y1={padding.top} y2={bottomY} className="hydro-axis-line" />
        <line x1={width - padding.right} x2={width - padding.right} y1={padding.top} y2={bottomY} className="hydro-axis-line" />
        <line x1={padding.left} x2={width - padding.right} y1={bottomY} y2={bottomY} className="hydro-axis-line" />

        <text x={20} y={(padding.top + bottomY) / 2} textAnchor="middle" transform={`rotate(-90 20 ${(padding.top + bottomY) / 2})`} className="hydro-axis-title hydro-axis-title--left">
          Niveles (m)
        </text>
        <text x={width - 20} y={(padding.top + bottomY) / 2} textAnchor="middle" transform={`rotate(90 ${width - 20} ${(padding.top + bottomY) / 2})`} className="hydro-axis-title hydro-axis-title--right">
          Precipitación (mm)
        </text>

        {levelTicks.map((tick) => (
          <g key={tick.y}>
            <line x1={padding.left - 6} x2={padding.left} y1={tick.y} y2={tick.y} className="hydro-axis-line" />
            <text x={padding.left - 10} y={tick.y + 4} textAnchor="end" className="hydro-axis-label hydro-axis-label--left">
              {tick.value.toFixed(2)}
            </text>
          </g>
        ))}

        {precipTicks.map((tick) => (
          <g key={`precip-${tick.y}`}>
            <line x1={width - padding.right} x2={width - padding.right + 6} y1={tick.y} y2={tick.y} className="hydro-axis-line" />
            <text x={width - padding.right + 10} y={tick.y + 4} textAnchor="start" className="hydro-axis-label hydro-axis-label--right">
              {tick.value.toFixed(0)}
            </text>
          </g>
        ))}

        {domainDates.map((dateKey) => {
          const item = precipitationByDate.get(dateKey);
          if (!item) return null;
          const barHeight = (Number(item.value) / precipMax) * plotHeight;
          const x = getX(dateKey);
          return (
            <rect
              key={item.date}
              x={x - 7}
              y={bottomY - barHeight}
              width="14"
              height={barHeight}
              className="hydro-precip-bar"
              onClick={(event) => {
                event.stopPropagation();
                setActivePopup({
                  x,
                  y: bottomY - barHeight,
                  lines: [
                    `Precipitación: ${Number(item.value).toFixed(1)} mm`,
                    `Fecha: ${formatExactDate(item.date)}`,
                  ],
                });
              }}
            >
            </rect>
          );
        })}

        <polyline points={levelPath} className="hydro-line" />

        {visibleDates.map((dateKey) => (
          <g key={dateKey}>
            <text
              x={getX(dateKey)}
              y={height - 34}
              textAnchor="middle"
              transform={`rotate(45 ${getX(dateKey)} ${height - 34})`}
              className="hydro-x-label"
            >
              {formatDayMonth(dateKey)}
            </text>
          </g>
        ))}

        {levels.map((point) => (
          <g key={point.timestamp}>
            <circle
              cx={getX(point.dateKey)}
              cy={levelY(point.level)}
              r="4.5"
              className="hydro-point"
              onClick={(event) => {
                event.stopPropagation();
                setActivePopup({
                  x: getX(point.dateKey),
                  y: levelY(point.level),
                  lines: [
                    `Nivel: ${point.level.toFixed(2)} m`,
                    `Fecha: ${point.label ?? formatExactDate(point.dateKey)}`,
                  ],
                });
              }}
            />
          </g>
        ))}

        {activePopup ? (
          <g className="hydro-click-popup" pointerEvents="none">
            <rect x={popupX} y={popupY} width={popupWidth} height={popupHeight} rx="8" className="hydro-click-popup__box" />
            {activePopup.lines.map((line, index) => (
              <text
                key={`${line}-${index}`}
                x={popupX + 10}
                y={popupY + 18 + index * 16}
                className="hydro-click-popup__text"
              >
                {line}
              </text>
            ))}
          </g>
        ) : null}
      </svg>

      <div className="hydro-chart-legend">
        <span><i className="hydro-legend-swatch hydro-legend-swatch--level" /> Niveles (m, eje izquierdo)</span>
        <span><i className="hydro-legend-swatch hydro-legend-swatch--precip" /> Precipitación (mm, eje derecho)</span>
      </div>
    </div>
  );
}
