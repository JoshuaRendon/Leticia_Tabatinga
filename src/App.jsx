
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import "./App.css";

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
      <nav className="navbar">
        <div className="navbar-brand">
          <h2>Leticia - Tabatinga</h2>
        </div>
        <div className="navbar-links">
          <Link to="/" className="nav-link">Proyecto</Link>
          <Link to="/zona" className="nav-link">Zona de Estudio</Link>
          <Link to="/estatico" className="nav-link">Medio Estático</Link>
          <Link to="/dinamico" className="nav-link">Medio Dinámico</Link>
          <Link to="/nosotros" className="nav-link">Nosotros</Link>
        </div>
      </nav>

      <div className="main-content">
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
      </div>
    </BrowserRouter>
  );
}
