import { Link } from "react-router-dom";

export default function MedioDinamico() {
  return (
    <div className="page-container">
      <h1>Medio Dinámico</h1>
      
      <div className="cards-container">
        <Link to="/dinamico/hidraulica" className="card">
          <h3>🌊 Hidráulica</h3>
          <p>Análisis de propiedades hidráulicas y comportamiento del flujo de agua en el sistema acuífero.</p>
        </Link>
        
        <Link to="/dinamico/hidrogeoquimica" className="card">
          <h3>🧪 Hidrogeoquímica</h3>
          <p>Estudio de la composición química del agua subterránea y procesos geoquímicos.</p>
        </Link>
        
        <Link to="/dinamico/isotopia" className="card">
          <h3>⚛️ Isotopía</h3>
          <p>Análisis de isótopos para determinar origen, edad y trayectorias del agua.</p>
        </Link>
      </div>

      <div className="iframe-container">
        <iframe 
          src="https://leticia-tabatinga.projects.earthengine.app/view/surfacewater"
          title="Surface Water Analysis - Earth Engine"
          allow="geolocation"
        />
      </div>
    </div>
  );
}
