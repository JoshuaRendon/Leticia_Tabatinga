export default function Nosotros() {
  // Sugerencia: guarda las fotos de las personas en `public/images/team/`
  // por ejemplo: public/images/team/leticia.jpg
  // Logo del semillero: guarda el logo en `public/images/logos/semillero_logo.png` (o cambia la ruta en el código)
  // Si prefieres importarlas desde src/assets, puedo ajustar el código.

  const team = [
    {
      name: "Adriana Piña Fulano",
      image: "/images/team/Profesora_Adriana_Pina.jpg",
      desc: "Directora del proyecto. ",
      email: "appinaf@unal.edu.co",
      phone: "Tel +57 601 3165000 Ext. ",
      cvlacUrl: "https://scienti.minciencias.gov.co/cvlac/visualizador/persona?ID=REPLACE_WITH_ID",
      orcidId: "0000-0000-0000-0000"
    },
        {
      name: "Arturo Samuel Gomez Insuasti",
      image: "/images/team/Profesor_Arturo.webp",
      desc: "Director del proyecto.",
      email: "asgomezi@unal.edu.co",
      phone: "Tel +57 608 5927996 Ext. ",
      cvlacUrl: "https://scienti.minciencias.gov.co/cvlac/visualizador/persona?ID=REPLACE_WITH_ID",
      orcidId: "0000-0000-0000-0000"
    },
    {
      name: "Joshua Rendon Algecira",
      image: "/images/team/Estudiante_Joshua_Rendon.jpeg",
      desc: "Estudiante encargado del proyecto",
      email: "jorendona@unal.edu.co",
      phone: "Tel +57 601 3165000 Ext. 13474",
      cvlacUrl: "https://scienti.minciencias.gov.co/cvlac/visualizador/generarCurriculoCv.do?cod_rh=0002124044",
      orcidId: "0009-0000-6550-3467"
    },

    // Añade más objetos aquí según necesites
  ];

  return (
    <div className="page-container">
      <h1>Nosotros</h1>

      <p style={{ maxWidth: 900, lineHeight: 1.6 }}>
        Somos un equipo multidisciplinario dedicado al estudio hidrogeológico y la gestión de recursos hídricos
        en la región Leticia – Tabatinga. Aquí están los integrantes y sus roles principales.
      </p>

      {/* Recuadro del semillero — coloca el logo en public/images/logos/semillero_logo.png */}
      <div className="semillero-card" style={{ marginTop: '1.5rem' }}>
        <a href="https://sites.google.com/unal.edu.co/agua-unal/investigaci%C3%B3n/siams?authuser=0" target="_blank" rel="noreferrer" className="semillero-link">
          <div className="semillero-logo-wrapper">
            <img src="/images/team/logos/Semillero_logo.png" alt="Logo del semillero" className="semillero-logo" />
          </div>
          <div className="semillero-content">
            <div className="semillero-name">Semillero SIAMS - Agua UNAL</div>
            <div className="semillero-desc">Visita la página del semillero y conoce nuestras líneas de investigación.</div>
            <div className="semillero-link-text">Abrir página del semillero ↗</div>
          </div>
        </a>
      </div>

      <div className="team-grid" style={{ marginTop: '1.5rem' }}>
        {team.map((member, idx) => (
          <div className="member-card" key={idx}>
            <div className="member-img-wrapper">
              <img className="member-img" src={member.image} alt={`Foto de ${member.name}`} />
            </div>
            <div className="member-content">
              <div className="member-name">{member.name}</div>
              <div className="member-desc">{member.desc}</div>

              {/* Contacto: correo y teléfono (si están disponibles) */}
              { (member.email || member.phone) && (
                <div className="member-contact">
                  {member.email ? (
                    <a href={`mailto:${member.email}`} className="contact-link">✉️ {member.email}</a>
                  ) : null}

                  {member.email && member.phone ? <span className="contact-sep">•</span> : null}

                  {member.phone ? (
                    <a href={`tel:${member.phone}`} className="contact-link">📞 {member.phone}</a>
                  ) : null}
                </div>
              )}

              <div className="member-actions">
                {/* CvLac link (Minciencias) */}
                {member.cvlacUrl ? (
                  <a className="btn btn-cvlac" href={member.cvlacUrl} target="_blank" rel="noreferrer">
                    Ver CvLac
                  </a>
                ) : (
                  <span className="btn btn-cvlac disabled">CvLac (pendiente)</span>
                )}

                {/* ORCID link: show the ID as clickable text */}
                {member.orcidId ? (
                  <a
                    className="btn btn-orcid"
                    href={`https://orcid.org/${member.orcidId}`}
                    target="_blank"
                    rel="noreferrer"
                  >
                    ORCID: {member.orcidId}
                  </a>
                ) : (
                  <span className="btn btn-orcid disabled">ORCID (pendiente)</span>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      <p style={{ marginTop: '1rem', color: '#444' }}>
        Nota: coloca las imágenes en <code>public/images/team/</code> y nómbralas como en el array (ej. <code>leticia.jpg</code>). Guarda el logo del semillero en <code>public/images/logos/semillero_logo.png</code>.
      </p>
    </div>
  );
}
