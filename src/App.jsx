
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";

import Proyecto from "./pages/Proyecto";
import ZonaEstudio from "./pages/ZonaEstudio";

import MedioEstatico from "./pages/MedioEstatico/MedioEstatico";
import Geologia from "./pages/MedioEstatico/Geologia";

import MedioDinamico from "./pages/MedioDinamico/MedioDinamico";
import Hidraulica from "./pages/MedioDinamico/Hidraulica";
import Hidrogeoquimica from "./pages/MedioDinamico/Hidrogeoquimica";
import Isotopia from "./pages/MedioDinamico/Isotopia";

import Nosotros from "./pages/Nosotros";

export default function App() {
  return (
    <BrowserRouter>
      <nav style={{
        display: "flex",
        gap: "20px",
        padding: "10px",
        background: "#eee",
        marginBottom: "20px"
      }}>
        <Link to="/">Proyecto</Link>
        <Link to="/zona">Zona de estudio</Link>
        <Link to="/estatico">Medio Estático</Link>
        <Link to="/dinamico">Medio Dinámico</Link>
        <Link to="/nosotros">Nosotros</Link>
      </nav>

      <Routes>
        {/* PRINCIPALES */}
        <Route path="/" element={<Proyecto />} />
        <Route path="/zona" element={<ZonaEstudio />} />
        <Route path="/nosotros" element={<Nosotros />} />

        {/* MEDIO ESTÁTICO */}
        <Route path="/estatico" element={<MedioEstatico />} />
        <Route path="/estatico/geologia" element={<Geologia />} />

        {/* MEDIO DINÁMICO */}
        <Route path="/dinamico" element={<MedioDinamico />} />
        <Route path="/dinamico/hidraulica" element={<Hidraulica />} />
        <Route path="/dinamico/hidrogeoquimica" element={<Hidrogeoquimica />} />
        <Route path="/dinamico/isotopia" element={<Isotopia />} />
      </Routes>
    </BrowserRouter>
  );
}
