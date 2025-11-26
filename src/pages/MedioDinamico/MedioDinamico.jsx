import { Link } from "react-router-dom";

export default function MedioDinamico() {
  return (
    <div style={{ padding: "20px" }}>
      <h1>Medio Dinámico</h1>

      <ul>
        <li><Link to="/dinamico/hidraulica">Hidráulica</Link></li>
        <li><Link to="/dinamico/hidrogeoquimica">Hidrogeoquímica</Link></li>
        <li><Link to="/dinamico/isotopia">Isotopía</Link></li>
      </ul>
    </div>
  );
}
