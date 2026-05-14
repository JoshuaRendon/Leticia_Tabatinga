import { useMemo, useState } from "react";
import { classifyIrca, formatValue, parameterOrder } from "./data";

function Section({ title, open, onToggle, children }) {
  return (
    <div className="irca-section">
      <button type="button" className="irca-section__header" onClick={onToggle}>
        <span>{title}</span>
        <span aria-hidden style={{ fontSize: 14 }}>{open ? "▼" : "▶"}</span>
      </button>
      {open ? <div className="irca-section__content">{children}</div> : null}
    </div>
  );
}

export default function PointPopup({ site }) {
  // Show parameters immediately when the popup opens
  const [openSection, setOpenSection] = useState("parametros");
  const ircaBand = useMemo(() => classifyIrca(site.irca), [site.irca]);

  return (
    <div className="irca-popup">
      <div className="irca-popup__header">
        <p className="irca-kicker">Punto de muestreo</p>
        <h3>{site.name}</h3>
        <div className="irca-chip" style={{ backgroundColor: ircaBand.color }}>
          {ircaBand.risk}
        </div>
      </div>

      <div className="irca-summary-grid">
        <div>
          <span>Mes</span>
          <strong>{site.month}</strong>
        </div>
        <div>
          <span>IRCA</span>
          <strong>{site.irca.toFixed(2)}</strong>
        </div>
        <div>
          <span>Clasificación</span>
          <strong>{ircaBand.risk}</strong>
        </div>
      </div>

      <Section
        title="Resumen"
        open={openSection === "resumen"}
        onToggle={() => setOpenSection(openSection === "resumen" ? null : "resumen")}
      >
        <p>{site.note}</p>
        <p>
          <strong>Ubicación:</strong> {site.lat.toFixed(6)}, {site.lng.toFixed(6)}
        </p>
      </Section>

      <Section
        title="Parámetros fisicoquímicos"
        open={openSection === "parametros"}
        onToggle={() => setOpenSection(openSection === "parametros" ? null : "parametros")}
      >
        <table className="irca-table">
          <tbody>
            {parameterOrder.map((parameter) => (
              <tr key={parameter.key}>
                <td>{parameter.label}</td>
                <td>{formatValue(site.parameters[parameter.key])}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </Section>

      <Section
        title="IRCA"
        open={openSection === "irca"}
        onToggle={() => setOpenSection(openSection === "irca" ? null : "irca")}
      >
        <p>
          Este punto se clasifica como <strong>{ircaBand.risk}</strong> según la banda de IRCA.
        </p>
        <p>{ircaBand.notification}</p>
      </Section>
    </div>
  );
}
