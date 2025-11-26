import { Link } from "react-router-dom";

export default function MedioEstatico() {
  return (
    <div style={{ padding: "20px" }}>
      <h1>Medio Estático</h1>

      <ul>
        <li><Link to="/estatico/geologia">Geología</Link></li>
      </ul>
    </div>
  );
}
