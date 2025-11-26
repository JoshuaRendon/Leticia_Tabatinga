import { BrowserRouter, Routes, Route, Link } from "react-router-dom";

import Proyecto from "./pages/Proyecto";
import MedioEstatico from "./pages/MedioEstatico";
import MedioDinamico from "./pages/MedioDinamico";

export default function App() {
  return (
    <BrowserRouter>
      <nav style={{
        display: "flex",
        gap: "20px",
        padding: "10px",
        background: "#eee"
      }}>
        <Link to="/">Proyecto</Link>
        <Link to="/estatico">Medio Estático</Link>
        <Link to="/dinamico">Medio Dinámico</Link>
      </nav>

      <Routes>
        <Route path="/" element={<Proyecto />} />
        <Route path="/estatico" element={<MedioEstatico />} />
        <Route path="/dinamico" element={<MedioDinamico />} />
      </Routes>
    </BrowserRouter>
  );
}
