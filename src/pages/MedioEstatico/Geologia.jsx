import PDFCarousel from "../../components/PDFCarousel";

export default function Geologia() {

  const pdfsGeologia = [
    "/pdf/geologia/geologia_leticia.pdf",
    "/pdf/geologia/suelos.pdf",
    "/pdf/geologia/geomorfologia.pdf",
    "/pdf/geologia/Aptidud_biofisca.pdf",
    "/pdf/geologia/Cobertura_Vegetal.pdf",
    "/pdf/geologia/Zoneamiento.pdf"
  ];

  return (
    <div style={{ padding: "20px" }}>
      <h1>Geología</h1>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "20px",
          marginTop: "20px"
        }}
      >

        {/* IZQUIERDA: Carrusel */}
        <div>
          <h2>Mapas Geológicos</h2>
          <PDFCarousel pdfs={pdfsGeologia} />
        </div>

        {/* DERECHA: Texto */}
        <div>
          <h2>Descripción</h2>
          <p style={{ lineHeight: 1.6, textAlign: "justify" }}>
            En el año 2000 el informe titulado "Zoneamiento ecológico-económico Brasil-Colombia eixo Tabatinga-Apaporis" 
            integra información ambiental, social y económica de más de 43.000 km² de la frontera amazónica para orientar 
            el uso sostenible del territorio compartido. A partir de estudios en geología, geomorfología, hidrología, suelos, 
            vegetación, fauna, limnología y socioeconomía, se elaboraron once mapas temáticos y una propuesta de zonificación que 
            incluye áreas institucionales, zonas de conservación, expansión y consolidación. El análisis revela una región de alta 
            biodiversidad, baja intervención humana, suelos naturalmente pobres pero protegidos por una densa cobertura forestal, 
            fuerte dependencia de los ríos Solimões/Amazonas, Içá/Putumayo y Japurá/Caquetá, y una población marcada por 
            comunidades indígenas y ribereñas con economías basadas principalmente en el extrativismo.
            <br /><br />

            El estudio concluye que la sustentabilidad regional depende de mantener la cobertura forestal que protege los suelos 
            frágiles ante la erosión, promover actividades económicas compatibles con la baja fertilidad natural, especialmente el 
            extrativismo y la agricultura de várzea, y fortalecer la gestión territorial conjunta entre Brasil y Colombia. No se identifican 
            áreas críticas de degradación, pero sí la necesidad de mejorar el conocimiento científico sobre los recursos naturales y de apoyar 
            el desarrollo social de las comunidades locales. La zonificación propuesta se presenta como un instrumento fundamental para planificar 
            el territorio fronterizo de forma integrada, garantizar la conservación ecológica y orientar políticas de desarrollo sostenible en 
            una de las regiones más biodiversas y vulnerables de la Amazonía.
            <br /><br />
            En el Carrusel de la izquierda, se pueden explorar algunos de los mapas generados junto al informe, destacando especialmente los mapas de 
            suelos, geomorfología y el geológico de la zona de estudio.
          </p>
        </div>

      </div>
    </div>
  );
}
