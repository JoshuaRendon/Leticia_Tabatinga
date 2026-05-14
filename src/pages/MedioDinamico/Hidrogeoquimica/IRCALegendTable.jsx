import { ircaLegend } from "./data";

export default function IRCALegendTable() {
  return (
    <section className="irca-card">
      <div className="irca-card__header">
        <div>
          <p className="irca-kicker">Referencia IRCA</p>
          <h2>¿Qué significa el valor del IRCA?</h2>
        </div>
        <p className="irca-card__note">
          Tabla de clasificación para interpretar los valores mostrados en el mapa.
        </p>
      </div>

      <div className="irca-table-wrap">
        <table className="irca-legend-table">
          <thead>
            <tr>
              <th>Clasificación IRCA (%)</th>
              <th>Nivel de riesgo</th>
              <th>Notificaciones</th>
              <th>IRCA mensual / acciones</th>
            </tr>
          </thead>
          <tbody>
            {ircaLegend.map((row) => (
              <tr key={row.range}>
                <td>
                  <span className="irca-swatch" style={{ backgroundColor: row.color }} />
                  {row.range}
                </td>
                <td>{row.risk}</td>
                <td>{row.notification}</td>
                <td>{row.action}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
