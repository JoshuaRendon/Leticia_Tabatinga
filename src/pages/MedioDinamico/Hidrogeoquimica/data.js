export const ircaMonths = ["Enero"];

export const ircaLegend = [
  {
    range: "80.1 - 100",
    risk: "INVIABLE SANITARIAMENTE",
    notification:
      "Informar a la persona prestadora, al COVE, Alcalde, Gobernador, SSPD, MPS, INS, MAVDT, Contraloría General y Procuraduría General.",
    action:
      "Agua no apta para consumo humano, gestión directa de acuerdo a su competencia de la persona prestadora, alcaldes, gobernadores y entidades del orden nacional.",
    color: "#dc2626",
  },
  {
    range: "35.1 - 80",
    risk: "ALTO",
    notification:
      "Informar a la persona prestadora, COVE, Alcalde, Gobernador y a la SSPD.",
    action:
      "Agua no apta para consumo humano, gestión directa de acuerdo a su competencia de la persona prestadora y de los alcaldes y gobernadores respectivos.",
    color: "#f97316",
  },
  {
    range: "14.1 - 35",
    risk: "MEDIO",
    notification:
      "Informar a la persona prestadora, COVE, Alcalde y Gobernador.",
    action:
      "Agua no apta para consumo humano, gestión directa de la persona prestadora.",
    color: "#eab308",
  },
  {
    range: "5.1 - 14",
    risk: "BAJO",
    notification:
      "Informar a la persona prestadora y al COVE.",
    action:
      "Agua no apta para consumo humano, susceptible de mejoramiento.",
    color: "#22c55e",
  },
  {
    range: "0 - 5",
    risk: "SIN RIESGO",
    notification: "Continuar el control y la vigilancia.",
    action: "Agua apta para consumo humano. Continuar la vigilancia.",
    color: "#16a34a",
  },
];

export const hydroSites = [
  {
    id: "pozo-un",
    name: "Pozo UN",
    lat: -4.191944444444444,
    lng: -69.93972222222223,
    month: "Enero",
    irca: 3.61,
    risk: "Sin riesgo",
    color: "#16a34a",
    note: "Muestra de pozo con condiciones compatibles con agua apta para consumo humano.",
    parameters: {
      turbiedad: 1.74,
      colorAparente: 10,
      pH: 6.15,
      conductividadEspecifica: 39.4,
      alcalinidadTotal: 18,
      acidezTotal: 6,
      durezaTotal: 10,
      durezaCalcica: 2.5,
      durezaMagnesica: 8,
      calcioPorTitulacion: 1,
      magnesio: 2,
      hierro: 0.05,
      manganeso: 0.025,
      carbonoOrganicoTotal: 0.5,
      zinc: 0.025,
      fluoruros: 0.03,
      nitritos: 0.05,
      nitratos: 0.8,
      cloruros: 0.2,
      sulfatos: 0.2,
      ortofosfatos: 0.3,
      solidosTotales: 53,
      solidosSuspendidosTotales: 2.5,
      coliformesTotales: null,
      eColi: null,
    },
  },
  {
    id: "rio-amazonas",
    name: "Rio Amazonas",
    lat: -4.27019,
    lng: -69.948582,
    month: "Enero",
    irca: 69.36,
    risk: "Alto",
    color: "#f97316",
    note: "El valor del IRCA ubica esta muestra en riesgo alto según la clasificación de referencia.",
    parameters: {
      turbiedad: 512,
      colorAparente: 100,
      pH: 7.84,
      conductividadEspecifica: 168.9,
      alcalinidadTotal: 73,
      acidezTotal: 2.5,
      durezaTotal: 80,
      durezaCalcica: 60,
      durezaMagnesica: 20,
      calcioPorTitulacion: 24,
      magnesio: 5,
      hierro: 4.6,
      manganeso: 0.35,
      carbonoOrganicoTotal: 4.16,
      zinc: 0.025,
      fluoruros: 0.1,
      nitritos: 0.05,
      nitratos: 1.6,
      cloruros: 5.3,
      sulfatos: 13,
      ortofosfatos: 0.3,
      solidosTotales: 754,
      solidosSuspendidosTotales: 605,
      coliformesTotales: 1700,
      eColi: 1100,
    },
  },
  {
    id: "numae",
    name: "NUMAE",
    lat: -4.21752946406046,
    lng: -69.9403772026435,
    month: "Enero",
    irca: 50.36,
    risk: "Alto",
    color: "#f97316",
    note: "La muestra presenta una clasificación alta, útil para contrastar con el pozo de menor riesgo.",
    parameters: {
      turbiedad: 0.96,
      colorAparente: 9,
      pH: 5.35,
      conductividadEspecifica: 69,
      alcalinidadTotal: 6,
      acidezTotal: 16,
      durezaTotal: 7,
      durezaCalcica: 2.5,
      durezaMagnesica: 7,
      calcioPorTitulacion: 0,
      magnesio: 2,
      hierro: 0.05,
      manganeso: 0.05,
      carbonoOrganicoTotal: 0.5,
      zinc: 0.025,
      fluoruros: 0.01,
      nitritos: 0.05,
      nitratos: 19.2,
      cloruros: 15,
      sulfatos: 0.5,
      ortofosfatos: 0.1,
      solidosTotales: 54,
      solidosSuspendidosTotales: 2.5,
      coliformesTotales: 9,
      eColi: 9,
    },
  },
];

export const parameterOrder = [
  { key: "turbiedad", label: "Turbiedad", unit: "UNT" },
  { key: "colorAparente", label: "Color aparente", unit: "UPC" },
  { key: "pH", label: "pH", unit: "Unidades" },
  { key: "conductividadEspecifica", label: "Conductividad específica", unit: "µS/cm 25°C" },
  { key: "alcalinidadTotal", label: "Alcalinidad total", unit: "mg/L CaCO₃" },
  { key: "acidezTotal", label: "Acidez total", unit: "mg/L CaCO₃" },
  { key: "durezaTotal", label: "Dureza total", unit: "mg/L CaCO₃" },
  { key: "durezaCalcica", label: "Dureza cálcica", unit: "mg/L CaCO₃" },
  { key: "durezaMagnesica", label: "Dureza magnésica", unit: "mg/L CaCO₃" },
  { key: "calcioPorTitulacion", label: "Calcio por titulación", unit: "mg/L Ca" },
  { key: "magnesio", label: "Magnesio", unit: "mg/L Mg" },
  { key: "hierro", label: "Hierro", unit: "mg/L Fe³⁺" },
  { key: "manganeso", label: "Manganeso", unit: "mg/L Mn⁷⁺" },
  { key: "carbonoOrganicoTotal", label: "Carbono orgánico total", unit: "mg/L C" },
  { key: "zinc", label: "Zinc", unit: "mg/L Zn" },
  { key: "fluoruros", label: "Fluoruros", unit: "mg/L F-" },
  { key: "nitritos", label: "Nitritos", unit: "mg/L N-NO₂-" },
  { key: "nitratos", label: "Nitratos", unit: "mg/L N-NO₃-" },
  { key: "cloruros", label: "Cloruros", unit: "mg/L Cl-" },
  { key: "sulfatos", label: "Sulfatos", unit: "mg/L SO₄²-" },
  { key: "ortofosfatos", label: "Ortofosfatos", unit: "mg/L PO₄³-" },
  { key: "solidosTotales", label: "Sólidos totales", unit: "mg/L" },
  { key: "solidosSuspendidosTotales", label: "Sólidos suspendidos totales", unit: "mg/L" },
  { key: "coliformesTotales", label: "Coliformes totales", unit: "NMP/100 mL" },
  { key: "eColi", label: "E. coli", unit: "NMP/100 mL" },
];

export function classifyIrca(value) {
  if (value > 80) return ircaLegend[0];
  if (value > 35) return ircaLegend[1];
  if (value > 14) return ircaLegend[2];
  if (value > 5) return ircaLegend[3];
  return ircaLegend[4];
}

export function formatValue(value) {
  if (value === null || value === undefined || value === "") return "—";
  if (typeof value === "number") {
    if (Number.isInteger(value)) return value.toString();
    return value.toFixed(2).replace(/\.00$/, "");
  }
  return value;
}
