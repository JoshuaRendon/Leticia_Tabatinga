export const points = [
  {
    id: "pozo-un",
    name: "Pozo UN",
    lat: -4.191944444444444,
    lng: -69.93972222222223,
    hasSeries: true,
    series: [
      { dateKey: "2026-03-30", timestamp: "2026-03-30T11:12:00", label: "30/03/2026 11:12 a. m.", level: 2.8 },
      { dateKey: "2026-03-31", timestamp: "2026-03-31T15:25:00", label: "31/03/2026 3:25 p. m.", level: 3.6 },
      { dateKey: "2026-04-01", timestamp: "2026-04-01T10:42:00", label: "1/04/2026 10:42 a. m.", level: 3.6 },
      { dateKey: "2026-04-06", timestamp: "2026-04-06T11:07:00", label: "6/04/2026 11:07 a. m.", level: 3.56 },
      { dateKey: "2026-04-13", timestamp: "2026-04-13T11:47:00", label: "13/04/2026 11:47 a. m.", level: 3.42 },
      { dateKey: "2026-04-15", timestamp: "2026-04-15T12:33:00", label: "15/04/2026 12:33 p. m.", level: 3.45 },
      { dateKey: "2026-04-17", timestamp: "2026-04-17T09:20:00", label: "17/04/2026 9:20 a. m.", level: 3.56 },
      { dateKey: "2026-04-20", timestamp: "2026-04-20T09:04:00", label: "20/04/2026 9:04 a. m.", level: 3.67 },
      { dateKey: "2026-04-22", timestamp: "2026-04-22T13:10:00", label: "22/04/2026 1:10 p. m.", level: 3.7 },
      { dateKey: "2026-04-24", timestamp: "2026-04-24T09:00:00", label: "24/04/2026 9:00 a. m.", level: 2.72 },
      { dateKey: "2026-04-27", timestamp: "2026-04-27T11:50:00", label: "27/04/2026 11:50 a. m.", level: 4.65 },
      { dateKey: "2026-04-29", timestamp: "2026-04-29T16:00:00", label: "29/04/2026 4:00 p. m.", level: 2.97 },
      { dateKey: "2026-05-04", timestamp: "2026-05-04T11:30:00", label: "4/05/2026 11:30 a. m.", level: 3.15 },
      { dateKey: "2026-05-06", timestamp: "2026-05-06T10:20:00", label: "6/05/2026 10:20 a. m.", level: 3.12 },
      { dateKey: "2026-05-08", timestamp: "2026-05-08T10:10:00", label: "8/05/2026 10:10 a. m.", level: 3.22 },
      { dateKey: "2026-05-11", timestamp: "2026-05-11T10:45:00", label: "11/05/2026 10:45 a. m.", level: 2.67 },
    ],
  },
  { id: "rio-amazonas", name: "Rio Amazonas", lat: -4.27019, lng: -69.948582, hasSeries: false, series: [] },
  { id: "numae", name: "NUMAE", lat: -4.21752946406046, lng: -69.9403772026435, hasSeries: false, series: [] },
];

export const precipitationSeries = [
  { date: "2026-03-30", value: 25.2 },
  { date: "2026-03-31", value: 0.1 },
  { date: "2026-04-01", value: 0.4 },
  { date: "2026-04-02", value: 32 },
  { date: "2026-04-03", value: 8.5 },
  { date: "2026-04-05", value: 3.7 },
  { date: "2026-04-06", value: 0.6 },
  { date: "2026-04-08", value: 0.5 },
  { date: "2026-04-09", value: 2.6 },
  { date: "2026-04-10", value: 2.5 },
  { date: "2026-04-11", value: 18.7 },
  { date: "2026-04-12", value: 24 },
  { date: "2026-04-13", value: 1.5 },
  { date: "2026-04-14", value: 0.6 },
  { date: "2026-04-17", value: 9.8 },
  { date: "2026-04-18", value: 2.1 },
  { date: "2026-04-20", value: 10.6 },
  { date: "2026-04-21", value: 0.4 },
  { date: "2026-04-23", value: 118.3 },
  { date: "2026-04-24", value: 0.3 },
  { date: "2026-04-26", value: 12.2 },
  { date: "2026-04-27", value: 11.1 },
  { date: "2026-04-28", value: 13.9 },
  { date: "2026-04-30", value: 6.7 },
  { date: "2026-05-01", value: 1.6 },
  { date: "2026-05-02", value: 6.1 },
  { date: "2026-05-03", value: 15.7 },
  { date: "2026-05-05", value: 14.1 },
  { date: "2026-05-07", value: 3 },
  { date: "2026-05-08", value: 8.1 },
  { date: "2026-05-09", value: 1.5 },
  { date: "2026-05-10", value: 53.1 },
  { date: "2026-05-11", value: 0.6 },
];

export function getSelectedPoint(pointsList = points, pointId = points[0]?.id) {
  return pointsList.find((point) => point.id === pointId) ?? pointsList[0];
}

export function formatShortDate(dateKey) {
  const [year, month, day] = dateKey.split("-");
  return `${day}/${month}`;
}

export function getDateLabel(dateKey) {
  const point = getSelectedPoint(points);
  return point.series.find((item) => item.dateKey === dateKey)?.label ?? dateKey;
}
