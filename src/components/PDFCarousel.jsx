import { useState } from "react";

export default function PDFCarousel({ pdfs }) {
  const [index, setIndex] = useState(0);

  const prev = () => setIndex((index - 1 + pdfs.length) % pdfs.length);
  const next = () => setIndex((index + 1) % pdfs.length);

  return (
    <div>
      <iframe
        src={pdfs[index]}
        width="100%"
        height="600px"
        style={{ border: "1px solid #ccc" }}
      ></iframe>

      <div style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        gap: "15px",
        marginTop: "10px"
      }}>
        <button onClick={prev}>⬅ Anterior</button>
        <span>{index + 1} / {pdfs.length}</span>
        <button onClick={next}>Siguiente ➡</button>
      </div>
    </div>
  );
}
