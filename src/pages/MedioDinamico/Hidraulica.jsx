export default function Hidraulica() {
  return (
    <div className="page-container">
      <h1>Hidráulica</h1>

      <p style={{ maxWidth: 900, lineHeight: 1.6 }}>
        Sección dedicada al estudio del comportamiento del agua en distintos compartimentos: subterráneo, superficial y atmosférico.
      </p>

      {/* Agua Subterránea */}
      <section className="subsection">
        <h2>Subterránea</h2>

        <div className="sub-layout">
          <div className="sub-left">
            {/* Imagen: colocar en public/images/hidraulica/acuifero.jpg */}
            <img src="/images/hidraulica/acuifero.jpg" alt="Agua subterránea" className="sub-image" />

            {/* Espacio para video vertical: colocar en public/videos/hidraulica/vertical.mp4 o usar un iframe */}
            <div className="sub-video">
              {/* Ejemplo: video local (descomenta y reemplaza ruta si subes el archivo) */}
              {/* <video src="/videos/hidraulica/vertical.mp4" controls className="vertical-video" /> */}
              <div className="vertical-video-placeholder">Video vertical (sube: public/videos/hidraulica/vertical.mp4)</div>
            </div>
          </div>

          <div className="sub-right">
            <h3>Adquisición de datos</h3>
            <p>
              Para la medición de niveles en el agúa subterránea, se instalaron 3 transductores de presión en distintos puntos 
              de Leticia, los cuales registran niveles cada 30 minutos.
              En el video se presenta la instalación de uno de estos transductores. 
            </p>

            <p>
              Nota: coloca imágenes en <code>public/images/hidraulica/</code> y videos en <code>public/videos/hidraulica/</code>.
            </p>
          </div>
        </div>
      </section>

      {/* Agua Superficial */}
      <section className="subsection">
        <h2>Superficial</h2>

        <div className="sub-acquisition">
          <h3>Adquisición de datos</h3>
          <p>
            La información de los cuerpos de agua superficiales se obtiene a través de entidades como el IDEAM y las corporaciones 
            ambientales del sector tanto de Leticia como de Tabatinga. Esta información incluye los caudales y niveles del río Amazonas.
            Así mismo se analizó información satelital para evaluar la dinámica de las zonas inundables en la región. esto mediante 
            herramientas como Google Earth Engine.
          </p>
        </div>
      </section>

      {/* Agua Atmosférica */}
      <section className="subsection">
        <h2>Atmosférica</h2>

        <div className="sub-acquisition">
          <h3>Adquisición de datos</h3>
          <p>
            Gran parte de la información obtenida se obtuvo de instituciones meteroloógicas como el IDEAM y las corporaciones autonomas de 
            Colombia, y de sus contrapartes en Brasil. Esta información incluye datos de precipitación, temperatura, humedad relativa.
            Sumado a esto se 
          </p>
        </div>
      </section>
    </div>
  );
}
5