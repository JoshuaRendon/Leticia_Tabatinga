import { Link } from "react-router-dom";

export default function MedioEstatico() {
  return (
    <div className="page-container">
      <h1>Medio Estático</h1>
      
      <div className="cards-container">
        <Link to="/estatico/geologia" className="card">
          <h3>🗻 Geología</h3>
          <p>Caracterización geológica de la zona de estudio, incluyendo formaciones, estructuras y litología.</p>
        </Link>
      </div>
    </div>
  );
}
