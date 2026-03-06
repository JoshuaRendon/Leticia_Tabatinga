import { Link } from "react-router-dom";
import { useEffect, useState } from "react";


export default function MedioDinamico() {

  // Meses (ordenados como el GIF)
  const months = [
    "Enero","Febrero","Marzo","Abril","Mayo","Junio",
    "Julio","Agosto","Septiembre","Octubre","Noviembre","Diciembre"
  ];

  const [monthIndex, setMonthIndex] = useState(0);

  // Cambia el mes cada 1 segundo (igual que el GIF)
  useEffect(() => {
    const interval = setInterval(() => {
      setMonthIndex((prev) => (prev + 1) % months.length);
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="page-container">
      <h1>Medio Dinámico</h1>

      {/* ===== CARDS ===== */}
      <div className="cards-container">
        <Link to="/dinamico/hidraulica" className="card">
          <h3>🌊 Hidráulica</h3>
          <p>
            Análisis de propiedades hidráulicas y comportamiento del flujo de agua
            en el sistema acuífero.
          </p>
        </Link>

        <Link to="/dinamico/hidrogeoquimica" className="card">
          <h3>🧪 Hidrogeoquímica</h3>
          <p>
            Estudio de la composición química del agua subterránea y procesos geoquímicos.
          </p>
        </Link>

        <Link to="/dinamico/isotopia" className="card">
          <h3>⚛️ Isotopía</h3>
          <p>
            Análisis de isótopos para determinar origen, edad y trayectorias del agua.
          </p>
        </Link>
      </div>

      {/* ===== HIDROCLIMATOLOGÍA (CENTRADO) ===== */}
      <div style={{ marginTop: "3rem", marginBottom: "3rem" }}>
        <div className="hidroclimatologia-centered">
          <h2>Hidroclimatología</h2>
          <p>
            La precipitación es uno de los elementos climáticos más importante en el ciclo hidrológico. 
            En Colombia, los patrones de precipitación varían significativamente según la región geográfica, 
            la altitud y la proximidad a las fuentes de humedad.
          </p>
          <p>
            La hidroclimatología de Colombia presenta variaciones espaciales y temporales, dando paso a un gran nivel 
            de complejidad hidroclimatológica, puesto que las escalas de los fenómenos van desde eventos que ocurren en ciclos
            interdecadales hasta eventos intranuales.
          </p>
          <p>
            Los fenómenos interdecadales son aquellos que ocurren en ciclos de varias decadas, como la Oscilación decadal del Pacífico 
            (PDO) o la Oscilación del Atlántico Norte (NAO). así mismo existen fenómenos interanuales cuyos ciclos son de varios años, 
            entre los que se destacan El Niño-Oscilación del Sur (ENSO) y el chorro del del Chocó, el primero asociado a variaciones en la temperatura 
            superficial del océano Pacífico y el segundo a un patrón de viento que afecta la región del Chocó en Colombia. Los fenómenos de escala 
            anual ncluyen la Zona de Convergencia Intertropical (ZCIT), la cual influye en los patrones de precipitación del país. Finalmente los 
            fenómenos intranuales se componen de ciclos que se repiten varias veces dentro de un mismo año como la Oscilación Madden-Julian (MJO), que
            influyen en la distribución de la precipitación a lo largo del año.
          </p>
          <p>
            El GIF animado muestra la variabilidad mensual de la precipitación climatológica en toda 
            Colombia, permitiendo visualizar cómo cambian los patrones de lluvia a través del año.
          </p>
        </div>
      </div>

      {/* ===== PRECIPITACIÓN (GIF + TEXTO) ===== */}
      <div style={{ marginTop: "2rem" }}>
        <h2 className="precipitation-title">Precipitación</h2>
        <div className="precipitation-layout">
          {/* Columna Izquierda: GIF */}
          <div className="precipitation-gif-container">
            <div className="gif-wrapper">
              <img
                src="/gif/precipitacion_colombia_climatologia.gif"
                alt="Climatología de precipitación mensual en Colombia"
              />
              {/* TEXTO DEL MES */}
              <div className="month-label">
                {months[monthIndex]}
              </div>
            </div>
          </div>

          {/* Columna Derecha: Texto */}
          <div className="precipitation-text-container">
            <p>
              El análisis de la precipitación en Colombia es fundamental para entender el comportamiento del ciclo hidrológico 
              y la disponibilidad de recursos hídricos en diferentes regiones del país.
            </p>
            <p>
              Colombia se caracteriza por tener dos períodos de máxima precipitación que coinciden con el paso de la Zona de 
              Convergencia Intertropical (ZCIT) sobre el territorio nacional. El primero ocurre entre marzo y junio, mientras que 
              el segundo se presenta entre septiembre y noviembre.
            </p>
            <p>
              Las regiones del Pacífico colombiano constituyen una de las áreas con mayor precipitación en el mundo, con valores 
              anuales superiores a 10,000 mm en algunos sectores. Por el contrario, en las zonas de llanuras orientales y en la 
              región de la Guajira se registran los menores montos anuales de precipitación del país.
            </p>
            <p>
              La variabilidad temporal de la precipitación es controlada por múltiples fenómenos climáticos en diferentes escalas 
              temporales, desde oscilaciones intranuales hasta variaciones interdecadales que afectan la disponibilidad de agua 
              a nivel local, regional y nacional.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
