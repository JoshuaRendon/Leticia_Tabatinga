import { useMemo } from "react";

const ION_PROPERTIES = {
  calcium: { mw: 40.078, charge: 2 },
  magnesium: { mw: 24.305, charge: 2 },
  sodium: { mw: 22.98976928, charge: 1 },
  potassium: { mw: 39.0983, charge: 1 },
  bicarbonates: { mw: 61.0168, charge: 1 },
  chlorides: { mw: 35.45, charge: 1 },
  sulfates: { mw: 96.06, charge: 2 },
};

const ION_ALIASES = {
  calcium: ["calcium", "Ca", "calcio", "calcioPorTitulacion"],
  magnesium: ["magnesium", "Mg", "magnesio"],
  sodium: ["sodium", "Na", "sodio"],
  potassium: ["potassium", "K", "potasio"],
  bicarbonates: ["bicarbonates", "HCO3", "HCO₃", "bicarbonatos"],
  chlorides: ["chlorides", "Cl", "cloruros"],
  sulfates: ["sulfates", "SO4", "SO₄", "sulfatos"],
};

function formatNumber(value) {
  if (value === null || value === undefined || Number.isNaN(value)) return "—";
  return Number(value).toFixed(2).replace(/\.00$/, "");
}

function toMeq(value, key) {
  const props = ION_PROPERTIES[key];
  return (Number(value) * props.charge) / props.mw;
}

function getIonValue(site, key) {
  const source = site?.piper ?? site?.ions ?? site?.parameters ?? {};

  for (const alias of ION_ALIASES[key]) {
    if (typeof source[alias] === "number") return source[alias];
  }

  if (key === "bicarbonates" && typeof source.alcalinidadTotal === "number") {
    return source.alcalinidadTotal * 1.22;
  }

  return null;
}

function niceCeil(value) {
  if (!Number.isFinite(value) || value <= 0) return 1;

  const exponent = Math.floor(Math.log10(value));
  const magnitude = 10 ** exponent;
  const normalized = value / magnitude;

  if (normalized <= 1) return magnitude;
  if (normalized <= 2) return 2 * magnitude;
  if (normalized <= 5) return 5 * magnitude;
  return 10 * magnitude;
}

function computeSample(site) {
  const raw = {
    ca: getIonValue(site, "calcium"),
    mg: getIonValue(site, "magnesium"),
    na: getIonValue(site, "sodium"),
    k: getIonValue(site, "potassium"),
    hco3: getIonValue(site, "bicarbonates"),
    cl: getIonValue(site, "chlorides"),
    so4: getIonValue(site, "sulfates"),
  };

  const missing = Object.entries(raw)
    .filter(([, value]) => value === null)
    .map(([key]) => key);

  const values = Object.fromEntries(
    Object.entries(raw).map(([key, value]) => [key, value ?? 0]),
  );

  return {
    raw: values,
    missing,
    hasData: Object.values(values).some((value) => Number(value) > 0),
    meq: {
      ca: toMeq(values.ca, "calcium"),
      mg: toMeq(values.mg, "magnesium"),
      nak: toMeq(values.na, "sodium") + toMeq(values.k, "potassium"),
      hco3: toMeq(values.hco3, "bicarbonates"),
      cl: toMeq(values.cl, "chlorides"),
      so4: toMeq(values.so4, "sulfates"),
    },
  };
}

function buildStiffGeometry(sample) {
  const { ca, mg, nak, hco3, cl, so4 } = sample.meq;
  const maxValue = niceCeil(Math.max(ca, mg, nak, hco3, cl, so4));
  const centerX = 390;
  const halfWidth = 230;
  const widthScale = halfWidth / maxValue;
  const rows = {
    top: 78,
    middle: 170,
    bottom: 262,
  };
  const xLeft = (value) => centerX - value * widthScale;
  const xRight = (value) => centerX + value * widthScale;

  const points = [
    [xLeft(nak), rows.top],
    [xLeft(ca), rows.middle],
    [xLeft(mg), rows.bottom],
    [xRight(so4), rows.bottom],
    [xRight(hco3), rows.middle],
    [xRight(cl), rows.top],
  ];

  const ticks = [0, maxValue / 2, maxValue];

  return {
    points: [...points, points[0]],
    rows,
    centerX,
    leftEdge: centerX - halfWidth,
    rightEdge: centerX + halfWidth,
    maxValue,
    ticks,
    meq: { ca, mg, nak, hco3, cl, so4 },
    tickX: (value) => centerX + value * widthScale,
  };
}

export default function StiffDiagram({ site }) {
  const sample = useMemo(() => computeSample(site), [site]);

  const stiff = useMemo(() => buildStiffGeometry(sample), [sample]);

  const path = stiff.points.map(([x, y]) => `${x},${y}`).join(" ");

  return (
    <section className="card stiff-card">
      <div className="hydro-section-title">
        <h2>Diagrama de Stiff</h2>
        <span>{site?.name ?? "Sin selección"}</span>
      </div>

      <p className="piper-note">
        Este diagrama solo muestra la muestra clicada. Cambia al seleccionar otro punto del mapa o del Piper.
      </p>

      <div className="stiff-layout">
        <svg viewBox="0 0 780 360" className="stiff-svg" role="img" aria-label="Diagrama de Stiff">
          <rect x="0" y="0" width="780" height="360" rx="14" className="stiff-bg" />

          <line x1={stiff.leftEdge} y1="40" x2={stiff.rightEdge} y2="40" className="stiff-grid" />
          <line x1={stiff.leftEdge} y1={stiff.rows.middle} x2={stiff.rightEdge} y2={stiff.rows.middle} className="stiff-grid" />
          <line x1={stiff.leftEdge} y1="300" x2={stiff.rightEdge} y2="300" className="stiff-axis" />
          <line x1={stiff.centerX} y1="40" x2={stiff.centerX} y2="300" className="stiff-axis stiff-axis--center" />

          {stiff.ticks.slice(1).map((tick) => (
            <g key={tick}>
              <line x1={stiff.tickX(-tick)} y1="40" x2={stiff.tickX(-tick)} y2="300" className="stiff-grid" />
              <line x1={stiff.tickX(tick)} y1="40" x2={stiff.tickX(tick)} y2="300" className="stiff-grid" />
              <text x={stiff.tickX(-tick)} y="324" textAnchor="middle" className="stiff-value-label">{formatNumber(tick)}</text>
              <text x={stiff.tickX(tick)} y="324" textAnchor="middle" className="stiff-value-label">{formatNumber(tick)}</text>
            </g>
          ))}
          <text x={stiff.centerX} y="324" textAnchor="middle" className="stiff-value-label">0</text>

          <polygon points={path} className="stiff-area" />
          <polyline points={path} className="stiff-outline" />

          <text x="150" y={stiff.rows.top + 5} textAnchor="end" className="stiff-side-label">Na⁺ + K⁺</text>
          <text x="150" y={stiff.rows.middle + 5} textAnchor="end" className="stiff-side-label">Ca²⁺</text>
          <text x="150" y={stiff.rows.bottom + 5} textAnchor="end" className="stiff-side-label">Mg²⁺</text>

          <text x="630" y={stiff.rows.top + 5} className="stiff-side-label">Cl⁻</text>
          <text x="630" y={stiff.rows.middle + 5} className="stiff-side-label">HCO₃⁻</text>
          <text x="630" y={stiff.rows.bottom + 5} className="stiff-side-label">SO₄²⁻</text>

          <text x="390" y="348" textAnchor="middle" className="stiff-label">Stiff diagram (meq/L)</text>

          {!sample.hasData ? <text x="390" y="150" textAnchor="middle" className="stiff-empty">Sin datos suficientes para dibujar la muestra</text> : null}
        </svg>

        <div className="stiff-summary">
          <div className="piper-summary__card">
            <h3>Muestra activa</h3>
            <p><strong>{site?.name ?? "—"}</strong></p>
            <p>IRCA: {site?.irca?.toFixed?.(2) ?? "—"}</p>
          </div>
          <div className="piper-summary__card">
            <h3>Valores usados (mg/L)</h3>
            <ul className="piper-ion-list">
              <li><span>Ca</span><strong>{formatNumber(sample.raw.ca)}</strong></li>
              <li><span>Mg</span><strong>{formatNumber(sample.raw.mg)}</strong></li>
              <li><span>Na</span><strong>{formatNumber(sample.raw.na)}</strong></li>
              <li><span>K</span><strong>{formatNumber(sample.raw.k)}</strong></li>
              <li><span>HCO₃</span><strong>{formatNumber(sample.raw.hco3)}</strong></li>
              <li><span>Cl</span><strong>{formatNumber(sample.raw.cl)}</strong></li>
              <li><span>SO₄</span><strong>{formatNumber(sample.raw.so4)}</strong></li>
            </ul>
          </div>
          <div className="piper-summary__card">
            <h3>Conversión Stiff (meq/L)</h3>
            <ul className="piper-ion-list">
              <li><span>Na + K</span><strong>{formatNumber(stiff.meq.nak)}</strong></li>
              <li><span>Ca</span><strong>{formatNumber(stiff.meq.ca)}</strong></li>
              <li><span>Mg</span><strong>{formatNumber(stiff.meq.mg)}</strong></li>
              <li><span>Cl</span><strong>{formatNumber(stiff.meq.cl)}</strong></li>
              <li><span>HCO₃</span><strong>{formatNumber(stiff.meq.hco3)}</strong></li>
              <li><span>SO₄</span><strong>{formatNumber(stiff.meq.so4)}</strong></li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
