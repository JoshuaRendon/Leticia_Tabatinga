import { useEffect, useMemo, useState } from "react";
import HidrogeoquimicaMap from "./HidrogeoquimicaMap";
import PiperDiagram from "./PiperDiagram";
import StiffDiagram from "./StiffDiagram";
import IRCALegendTable from "./IRCALegendTable";
import { hydroSites, ircaMonths } from "./data";
import "./styles.css";

export default function HidrogeoquimicaPage() {
  const [selectedMonth, setSelectedMonth] = useState("Enero");
  const visibleSites = useMemo(() => hydroSites.filter((site) => site.month === selectedMonth), [selectedMonth]);
  const [selectedSiteId, setSelectedSiteId] = useState(visibleSites[0]?.id ?? hydroSites[0]?.id);
  const selectedSite = visibleSites.find((site) => site.id === selectedSiteId) ?? visibleSites[0] ?? hydroSites[0];

  useEffect(() => {
    if (visibleSites.length && !visibleSites.some((site) => site.id === selectedSiteId)) {
      setSelectedSiteId(visibleSites[0].id);
    }
  }, [selectedMonth, selectedSiteId, visibleSites]);

  return (
    <div className="page-container hydro-module">
      <header className="hydro-header card">
        <div>
          <p className="hydro-eyebrow">Hidrogeoquímica</p>
          <h1>Mapa de puntos con IRCA</h1>
          <p className="hydro-lead">
            Esta versión usa los datos de <strong>IRCA_vertical</strong> y <strong>Puntos</strong> del Excel.
            Los puntos del mapa cambian de color según su clasificación IRCA y la tabla inferior explica
            el significado de cada rango.
          </p>
        </div>

        <div className="hydro-filter card">
          <label htmlFor="month-select">Mes</label>
          <select id="month-select" value={selectedMonth} onChange={(e) => setSelectedMonth(e.target.value)}>
            {ircaMonths.map((month) => (
              <option key={month} value={month}>
                {month}
              </option>
            ))}
          </select>
          <p>Por ahora solo está cargado Enero. Cuando agregues más meses, aparecerán aquí.</p>
        </div>
      </header>

      <section className="hydro-grid">
        <div className="card hydro-map-card">
          <div className="hydro-section-title">
            <h2>Puntos del mes</h2>
            <span>{selectedMonth}</span>
          </div>
          <HidrogeoquimicaMap
            sites={hydroSites}
            selectedSiteId={selectedSite?.id}
            onSelectSite={setSelectedSiteId}
          />
        </div>

        <aside className="card hydro-summary-card">
          <div className="hydro-section-title">
            <h2>Resumen de puntos</h2>
            <span>{visibleSites.length} puntos</span>
          </div>

          <div className="point-list">
            {visibleSites.map((site) => (
              <article
                key={site.id}
                className={`point-item ${site.id === selectedSite?.id ? "is-selected" : ""}`}
                onClick={() => setSelectedSiteId(site.id)}
                role="button"
                tabIndex={0}
                onKeyDown={(event) => {
                  if (event.key === "Enter" || event.key === " ") {
                    event.preventDefault();
                    setSelectedSiteId(site.id);
                  }
                }}
              >
                <div>
                  <h3>{site.name}</h3>
                  <p>{site.note}</p>
                </div>
                <div className="point-meta">
                  <span className="point-chip" style={{ backgroundColor: site.color }}>
                    {site.risk}
                  </span>
                  <strong>IRCA {site.irca.toFixed(2)}</strong>
                </div>
              </article>
            ))}
          </div>
        </aside>
      </section>

      <PiperDiagram sites={visibleSites} selectedSiteId={selectedSite?.id} onSelectSite={setSelectedSiteId} />

      <StiffDiagram site={selectedSite} />

      <IRCALegendTable />
    </div>
  );
}
