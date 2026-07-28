import { useMemo } from "react";
import { hydroSites } from "./data";

const ION_SPECS = [
  { key: "calcium", label: "Ca²⁺", aliases: ["calcium", "Ca", "calcio", "calcioPorTitulacion"] },
  { key: "magnesium", label: "Mg²⁺", aliases: ["magnesium", "Mg", "magnesio"] },
  { key: "sodium", label: "Na⁺", aliases: ["sodium", "Na", "sodio"] },
  { key: "potassium", label: "K⁺", aliases: ["potassium", "K", "potasio"] },
  { key: "bicarbonates", label: "HCO₃⁻", aliases: ["bicarbonates", "HCO3", "HCO₃", "bicarbonatos"] },
  { key: "carbonates", label: "CO₃²⁻", aliases: ["carbonates", "CO3", "CO₃", "carbonatos"] },
  { key: "chlorides", label: "Cl⁻", aliases: ["chlorides", "Cl", "cloruros"] },
  { key: "sulfates", label: "SO₄²⁻", aliases: ["sulfates", "SO4", "SO₄", "sulfatos"] },
];

const ION_PROPERTIES = {
  calcium: { mw: 40.078, charge: 2 },
  magnesium: { mw: 24.305, charge: 2 },
  sodium: { mw: 22.98976928, charge: 1 },
  potassium: { mw: 39.0983, charge: 1 },
  bicarbonates: { mw: 61.0168, charge: 1 },
  carbonates: { mw: 60.0089, charge: 2 },
  chlorides: { mw: 35.45, charge: 1 },
  sulfates: { mw: 96.06, charge: 2 },
};

const OFFSET = 0.1;
const H = 0.5 * Math.tan(Math.PI / 3);
const SCALE = 300;
const VIEWBOX = { width: 900, height: 780 };
const NORMAL_BOUNDS = { minX: 0, maxX: 2 + 2 * OFFSET, minY: -0.2, maxY: 2.05 };

const PALETTE = ["#d97706", "#16a34a", "#dc2626", "#7c3aed", "#0891b2", "#db2777"];

function formatNumber(value) {
  if (value === null || value === undefined || Number.isNaN(value)) return "—";
  return Number(value).toFixed(2).replace(/\.00$/, "");
}

function resolveIon(site, spec) {
  const source = site?.piper ?? site?.ions ?? site?.parameters ?? {};

  for (const alias of spec.aliases) {
    if (typeof source[alias] === "number") {
      return { value: source[alias], derived: false };
    }
  }

  if (spec.key === "bicarbonates" && typeof source.alcalinidadTotal === "number") {
    return { value: source.alcalinidadTotal * 1.22, derived: true };
  }

  if (spec.key === "carbonates" && typeof source.pH === "number" && source.pH < 8.3) {
    return { value: 0, derived: true };
  }

  return { value: null, derived: false };
}

function toMeq(value, key) {
  const props = ION_PROPERTIES[key];
  return (Number(value) * props.charge) / props.mw;
}

function barycentricPoint(fractions, a, b, c) {
  return {
    x: fractions[0] * a.x + fractions[1] * b.x + fractions[2] * c.x,
    y: fractions[0] * a.y + fractions[1] * b.y + fractions[2] * c.y,
  };
}

function toSvg(point) {
  return {
    x: 45 + point.x * SCALE,
    y: 70 + (NORMAL_BOUNDS.maxY - point.y) * SCALE,
  };
}

function polyline(points) {
  return points.map((point) => {
    const mapped = toSvg(point);
    return `${mapped.x},${mapped.y}`;
  }).join(" ");
}

function computeSample(site) {
  const values = ION_SPECS.map((spec) => {
    const entry = resolveIon(site, spec);
    return { ...spec, ...entry };
  });

  const missing = values.filter((ion) => ion.value === null).map((ion) => ion.label);
  const lookup = Object.fromEntries(values.map((item) => [item.key, item]));

  const ca = lookup.calcium?.value ?? 0;
  const mg = lookup.magnesium?.value ?? 0;
  const na = lookup.sodium?.value ?? 0;
  const k = lookup.potassium?.value ?? 0;
  const hco3 = lookup.bicarbonates?.value ?? 0;
  const co3 = lookup.carbonates?.value ?? 0;
  const cl = lookup.chlorides?.value ?? 0;
  const so4 = lookup.sulfates?.value ?? 0;

  const catMeq = [toMeq(ca, "calcium"), toMeq(mg, "magnesium"), toMeq(na, "sodium") + toMeq(k, "potassium")];
  const anMeq = [toMeq(hco3, "bicarbonates") + toMeq(co3, "carbonates"), toMeq(so4, "sulfates"), toMeq(cl, "chlorides")];

  const catSum = catMeq.reduce((acc, item) => acc + item, 0) || 1;
  const anSum = anMeq.reduce((acc, item) => acc + item, 0) || 1;

  const catFractions = catMeq.map((value) => value / catSum);
  const anFractions = anMeq.map((value) => value / anSum);

  const leftTriangle = {
    ca: { x: 0, y: 0 },
    mg: { x: 0.5, y: H },
    nak: { x: 1, y: 0 },
  };
  const rightTriangle = {
    hco3co3: { x: 1 + 2 * OFFSET, y: 0 },
    so4: { x: 1.5 + 2 * OFFSET, y: H },
    cl: { x: 2 + 2 * OFFSET, y: 0 },
  };

  const cationPoint = barycentricPoint(catFractions, leftTriangle.ca, leftTriangle.mg, leftTriangle.nak);
  const anionPoint = barycentricPoint(anFractions, rightTriangle.hco3co3, rightTriangle.so4, rightTriangle.cl);

  const d_x = anionPoint.y / (4 * H) + 0.5 * anionPoint.x - cationPoint.y / (4 * H) + 0.5 * cationPoint.x;
  const d_y = 0.5 * anionPoint.y + H * anionPoint.x + 0.5 * cationPoint.y - H * cationPoint.x;

  const diamondPoint = {
    x: d_x,
    y: d_y,
  };

  return {
    values,
    missing,
    hasCompleteData: missing.length === 0,
    catFractions,
    anFractions,
    cationPoint,
    anionPoint,
    diamondPoint,
  };
}

function buildGridLines() {
  const lines = { left: [], right: [], diamond: [] };
  const ticks = [0, 0.2, 0.4, 0.6, 0.8, 1];

  ticks.forEach((x) => {
    lines.left.push([{ x, y: 0 }, { x: x - x / 2, y: (x / 2) * Math.tan(Math.PI / 3) }]);
    lines.left.push([{ x, y: 0 }, { x: (1 - x) / 2 + x, y: ((1 - x) / 2) * Math.tan(Math.PI / 3) }]);
    lines.left.push([{ x: x / 2, y: (x / 2) * Math.tan(Math.PI / 3) }, { x: 1 - x / 2, y: (x / 2) * Math.tan(Math.PI / 3) }]);

    const rx = x + 1 + 2 * OFFSET;
    lines.right.push([{ x: rx, y: 0 }, { x: rx - x / 2, y: (x / 2) * Math.tan(Math.PI / 3) }]);
    lines.right.push([{ x: rx, y: 0 }, { x: (1 - x) / 2 + x + 1 + 2 * OFFSET, y: ((1 - x) / 2) * Math.tan(Math.PI / 3) }]);
    lines.right.push([{ x: x / 2 + 1 + 2 * OFFSET, y: (x / 2) * Math.tan(Math.PI / 3) }, { x: 1 - x / 2 + 1 + 2 * OFFSET, y: (x / 2) * Math.tan(Math.PI / 3) }]);

    const dx = 0.5 * x;
    lines.diamond.push([{ x: 0.6 + dx, y: H + OFFSET * Math.tan(Math.PI / 3) + dx * Math.tan(Math.PI / 3) }, { x: 1.1 + dx, y: OFFSET * Math.tan(Math.PI / 3) + dx * Math.tan(Math.PI / 3) }]);
    lines.diamond.push([{ x: 0.6 + dx, y: H + OFFSET * Math.tan(Math.PI / 3) - dx * Math.tan(Math.PI / 3) }, { x: 1.1 + dx, y: 2 * H + OFFSET * Math.tan(Math.PI / 3) - dx * Math.tan(Math.PI / 3) }]);
  });

  return lines;
}

function PointDot({ point, label, color, active, onClick }) {
  const mapped = toSvg(point);
  const size = active ? 8 : 5.2;

  return (
    <g
      transform={`translate(${mapped.x},${mapped.y})`}
      onClick={onClick}
      role="button"
      tabIndex={0}
      style={{ cursor: "pointer" }}
      onKeyDown={(event) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          onClick?.();
        }
      }}
    >
      <circle r={size + 2} className="piper-point-hole" />
      <circle r={size} fill={color} stroke="#ffffff" strokeWidth={1.5} opacity={active ? 1 : 0.82} />
      {active ? <circle r={size + 5} className="piper-point-ring" /> : null}
      <title>{label}</title>
    </g>
  );
}

function PercentBadge({ label, value }) {
  return (
    <div className="piper-percent-badge">
      <span>{label}</span>
      <strong>{(value * 100).toFixed(1)}%</strong>
    </div>
  );
}

export default function PiperDiagram({ sites = hydroSites, selectedSiteId, onSelectSite }) {
  const samples = useMemo(
    () => sites.map((site, index) => ({ ...site, ...computeSample(site), swatch: site.color ?? PALETTE[index % PALETTE.length] })),
    [sites],
  );
  const selectedSample = samples.find((sample) => sample.id === selectedSiteId) ?? samples[0];
  const grid = useMemo(() => buildGridLines(), []);

  const leftTriangle = {
    ca: { x: 0, y: 0 },
    mg: { x: 0.5, y: H },
    nak: { x: 1, y: 0 },
  };
  const rightTriangle = {
    hco3co3: { x: 1 + 2 * OFFSET, y: 0 },
    so4: { x: 1.5 + 2 * OFFSET, y: H },
    cl: { x: 2 + 2 * OFFSET, y: 0 },
  };
  const diamond = [
    { x: 0.5 + OFFSET, y: H + OFFSET * Math.tan(Math.PI / 3) },
    { x: 1 + OFFSET, y: 2 * H + OFFSET * Math.tan(Math.PI / 3) },
    { x: 1.5 + OFFSET, y: H + OFFSET * Math.tan(Math.PI / 3) },
    { x: 1 + OFFSET, y: OFFSET * Math.tan(Math.PI / 3) },
    { x: 0.5 + OFFSET, y: H + OFFSET * Math.tan(Math.PI / 3) },
  ];
  const diamondShape = diamond;

  return (
    <section className="card piper-card">
      <div className="hydro-section-title">
        <h2>Diagrama Piper</h2>
        <span>{selectedSample?.name ?? "Sin selección"}</span>
      </div>

      <p className="piper-note">
        El gráfico sigue la forma clásica del Piper: dos triángulos inferiores, un rombo superior y los puntos de cada
        muestra del mapa.
      </p>

      <div className="piper-layout">
        <svg viewBox={`0 0 ${VIEWBOX.width} ${VIEWBOX.height}`} className="piper-svg" role="img" aria-label="Diagrama Piper interactivo">
          <rect x="0" y="0" width={VIEWBOX.width} height={VIEWBOX.height} rx="18" fill="#ffffff" />

          <polygon points={polyline([leftTriangle.ca, leftTriangle.mg, leftTriangle.nak])} className="piper-outline" />
          <polygon points={polyline([rightTriangle.hco3co3, rightTriangle.so4, rightTriangle.cl])} className="piper-outline" />
          <polygon points={polyline([...diamond, diamond[0]])} className="piper-outline" />

          <polygon points={polyline([{ x: 0.25, y: H / 2 }, { x: 0.5, y: 0 }, { x: 0.75, y: H / 2 }, { x: 0.25, y: H / 2 }])} className="piper-fill" />
          <polygon points={polyline([{ x: 1 + 2 * OFFSET + 0.25, y: H / 2 }, { x: 1 + 2 * OFFSET + 0.5, y: 0 }, { x: 1 + 2 * OFFSET + 0.75, y: H / 2 }, { x: 1 + 2 * OFFSET + 0.25, y: H / 2 }])} className="piper-fill" />
          <polygon points={polyline(diamondShape)} className="piper-fill piper-fill--diamond" />

          {grid.left.map((segment, index) => (
            <line
              key={`left-${index}`}
              x1={toSvg(segment[0]).x}
              y1={toSvg(segment[0]).y}
              x2={toSvg(segment[1]).x}
              y2={toSvg(segment[1]).y}
              className="piper-grid-line"
            />
          ))}
          {grid.right.map((segment, index) => (
            <line
              key={`right-${index}`}
              x1={toSvg(segment[0]).x}
              y1={toSvg(segment[0]).y}
              x2={toSvg(segment[1]).x}
              y2={toSvg(segment[1]).y}
              className="piper-grid-line"
            />
          ))}
          {grid.diamond.map((segment, index) => (
            <line
              key={`diamond-${index}`}
              x1={toSvg(segment[0]).x}
              y1={toSvg(segment[0]).y}
              x2={toSvg(segment[1]).x}
              y2={toSvg(segment[1]).y}
              className="piper-grid-line"
            />
          ))}

          <text x={toSvg({ x: 0.5, y: -0.07 }).x} y={toSvg({ x: 0.5, y: -0.07 }).y} textAnchor="middle" className="piper-axis-label">%Ca²⁺</text>
          <text
            x={toSvg({ x: 0.07, y: 0.36 }).x}
            y={toSvg({ x: 0.07, y: 0.36 }).y}
            textAnchor="middle"
            className="piper-axis-label"
            transform={`rotate(-60 ${toSvg({ x: 0.07, y: 0.36 }).x} ${toSvg({ x: 0.07, y: 0.36 }).y})`}
          >
            %Mg²⁺
          </text>
          <text
            x={toSvg({ x: 0.83, y: 0.36 }).x}
            y={toSvg({ x: 0.83, y: 0.36 }).y}
            textAnchor="middle"
            className="piper-axis-label"
            transform={`rotate(60 ${toSvg({ x: 0.83, y: 0.36 }).x} ${toSvg({ x: 0.83, y: 0.36 }).y})`}
          >
            %Na⁺ + %K⁺
          </text>

          <text x={toSvg({ x: 1.2 + OFFSET, y: -0.07 }).x} y={toSvg({ x: 1.2 + OFFSET, y: -0.07 }).y} textAnchor="middle" className="piper-axis-label">%Cl⁻</text>
          <text
            x={toSvg({ x: 1.18 + OFFSET, y: 0.36 }).x}
            y={toSvg({ x: 1.18 + OFFSET, y: 0.36 }).y}
            textAnchor="middle"
            className="piper-axis-label"
            transform={`rotate(-60 ${toSvg({ x: 1.18 + OFFSET, y: 0.36 }).x} ${toSvg({ x: 1.18 + OFFSET, y: 0.36 }).y})`}
          >
            %SO₄²⁻
          </text>

          <text
            x={toSvg({ x: 0.48, y: 1.34 }).x}
            y={toSvg({ x: 0.48, y: 1.34 }).y}
            textAnchor="middle"
            className="piper-axis-label"
            transform={`rotate(-60 ${toSvg({ x: 0.48, y: 1.34 }).x} ${toSvg({ x: 0.48, y: 1.34 }).y})`}
          >
            %HCO₃⁻ + %CO₃²⁻
          </text>
          <text
            x={toSvg({ x: 1.72, y: 1.34 }).x}
            y={toSvg({ x: 1.72, y: 1.34 }).y}
            textAnchor="middle"
            className="piper-axis-label"
            transform={`rotate(60 ${toSvg({ x: 1.72, y: 1.34 }).x} ${toSvg({ x: 1.72, y: 1.34 }).y})`}
          >
            %Ca²⁺ + %Mg²⁺
          </text>

          {samples.map((sample) => (
            <g key={sample.id}>
              <PointDot
                point={sample.cationPoint}
                label={sample.name}
                color={sample.swatch}
                active={sample.id === selectedSample?.id}
                onClick={() => onSelectSite?.(sample.id)}
              />
              <PointDot
                point={sample.anionPoint}
                label={sample.name}
                color={sample.swatch}
                active={sample.id === selectedSample?.id}
                onClick={() => onSelectSite?.(sample.id)}
              />
              <PointDot
                point={sample.diamondPoint}
                label={sample.name}
                color={sample.swatch}
                active={sample.id === selectedSample?.id}
                onClick={() => onSelectSite?.(sample.id)}
              />
              {sample.id === selectedSample?.id ? (
                <text x={toSvg(sample.diamondPoint).x + 12} y={toSvg(sample.diamondPoint).y - 12} className="piper-selected-label">
                  {sample.name}
                </text>
              ) : null}
            </g>
          ))}

          <g className="piper-legend">
            {samples.map((sample, index) => (
              <g key={sample.id} transform={`translate(40, ${80 + index * 30})`} onClick={() => onSelectSite?.(sample.id)} style={{ cursor: "pointer" }}>
                <circle cx="0" cy="0" r="4.5" fill={sample.swatch} stroke="#fff" strokeWidth="1.5" />
                <text x="15" y="4" className="piper-legend-text">{sample.name}</text>
              </g>
            ))}
          </g>
        </svg>

        <div className="piper-summary">
          <div className="piper-summary__card">
            <h3>Resumen de la muestra activa</h3>
            <p><strong>{selectedSample?.name ?? "—"}</strong></p>
            <p>IRCA: {selectedSample?.irca?.toFixed?.(2) ?? "—"}</p>
            <p>{selectedSample?.note}</p>
          </div>

          <div className="piper-summary__card">
            <h3>Parámetros usados</h3>
            <ul className="piper-ion-list">
              {selectedSample?.values?.map((ion) => (
                <li key={ion.key}>
                  <span>{ion.label}</span>
                  <strong>
                    {formatNumber(ion.value)} {ion.derived ? <small>(derivado)</small> : null}
                  </strong>
                </li>
              ))}
            </ul>
          </div>

          <div className="piper-summary__card">
            <h3>Proporciones</h3>
            <div className="piper-percent-grid">
              <PercentBadge label="Ca" value={selectedSample?.catFractions?.[0] ?? 0} />
              <PercentBadge label="Mg" value={selectedSample?.catFractions?.[1] ?? 0} />
              <PercentBadge label="Na + K" value={selectedSample?.catFractions?.[2] ?? 0} />
              <PercentBadge label="HCO₃ + CO₃" value={selectedSample?.anFractions?.[0] ?? 0} />
              <PercentBadge label="SO₄" value={selectedSample?.anFractions?.[1] ?? 0} />
              <PercentBadge label="Cl" value={selectedSample?.anFractions?.[2] ?? 0} />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
