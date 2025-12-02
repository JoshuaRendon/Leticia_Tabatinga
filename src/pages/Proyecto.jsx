export default function Proyecto() {
  return (
    <div className="page-container">
      <h1>Proyecto Leticia - Tabatinga</h1>
      
      <div style={{ marginTop: "2rem", maxWidth: "900px" }}>
        <p style={{ fontSize: "1.1rem", lineHeight: "1.8", marginBottom: "1.5rem" }}>
          El proyecto Leticia - Tabatinga es un estudio hidrogeológico integral de la zona fronteriza 
          entre Colombia y Brasil en la región amazónica. Este proyecto tiene como objetivo caracterizar 
          los recursos hídricos subterráneos y superficiales de la región.
        </p>
        
        <div className="cards-container" style={{ marginTop: "2rem" }}>
          <div className="card">
            <h3>🎯 Objetivo</h3>
            <p>Caracterización hidrogeológica de los acuíferos en la zona de Leticia - Tabatinga.</p>
          </div>
          
          <div className="card">
            <h3>📍 Ubicación</h3>
            <p>Región fronteriza Colombia-Brasil en la cuenca amazónica.</p>
          </div>
          
          <div className="card">
            <h3>🔬 Metodología</h3>
            <p>Análisis del medio estático y dinámico mediante técnicas hidrogeológicas avanzadas.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
