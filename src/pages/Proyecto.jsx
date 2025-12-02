export default function Proyecto() {
  return (
    <div className="page-container">
      <h1>Proyecto Leticia - Tabatinga</h1>
      
      <div style={{ marginTop: "2rem", maxWidth: "900px" }}>
        <p style={{ fontSize: "1.1rem", lineHeight: "1.8", marginBottom: "1.5rem" }}>
          El proyecto Leticia - Tabatinga busca evaluar las fuentes de recargar del acuífero aluvial transfronterizo de Leticia (Colombia) – 
          Tabatinga (Brasil) a partir de modelos de mezcla con información hidro geoquímica e isotópica.
        </p>
        
        <div className="cards-container" style={{ marginTop: "2rem" }}>
          <div className="card">
            <h3>🎯 Objetivos</h3>
            <ul style={{ margin: 0, paddingLeft: '1.25rem', lineHeight: '1.8' }}>
              <li>Levantar información hidrogeológica del acuífero aluvial de Leticia correspondiente a niveles de agua subterránea, parámetros fisicoquímicos e isotópicos.</li>
              <li>Construir modelos de mezcla a partir de la integración de datos hidro geoquímicos e isotópicos.</li>
              <li>Evaluar fuentes de recarga del acuífero a partir de información hidro geoquímica, isotópica y niveles freáticos.</li>
              <li>•	Construir una herramienta digital que muestre de forma gráfica e interactiva los resultados del modelo geoquímico para la gestión y monitoreo del acuífero.</li>
              {/* Añade más <li> según necesites — reemplaza el texto por tus objetivos reales */}
            </ul>
          </div>
          
          <div className="card">
            <h3>📍 Ubicación</h3>
            <p>Región fronteriza Colombia-Brasil en la cuenca amazónica.</p>
          </div>
          
          <div className="card">
            <h3>🔬 Metodología</h3>
            <p>Inicialmente se recopilarán los antecedentes y datos previos de la zona de estudio, seguido de esto se planificarán las actividades de campo necesarias entre las cuales se 
              encuentran: muestreo hidro geoquímico e isotópico y la instalación de transductores de presión para el monitoreo de niveles freáticos. Se 
              evaluarán las fuentes de recarga del acuífero a partir de información isotópica y la implementación de modelos de mezcla, por último, se 
              integrará toda la información y análisis en la herramienta digital que será de acceso abierto.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
