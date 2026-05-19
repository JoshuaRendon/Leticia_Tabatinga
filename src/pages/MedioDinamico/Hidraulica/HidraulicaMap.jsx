import { MapContainer, Marker, Popup, TileLayer } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

function buildIcon(active) {
  return new L.DivIcon({
    className: `hydro-marker ${active ? "is-active" : "is-inactive"}`,
    html: `<span class="hydro-marker__core"></span>`,
    iconSize: [18, 18],
    iconAnchor: [9, 9],
    popupAnchor: [0, -12],
  });
}

export default function HidraulicaMap({ points, selectedPointId, onSelectPoint }) {
  return (
    <div className="hydro-map-shell">
      <MapContainer center={[-4.22, -69.94]} zoom={12} scrollWheelZoom className="hydro-map">
        <TileLayer
          attribution='&copy; OpenStreetMap contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {points.map((point) => {
          const active = point.id === selectedPointId;
          return (
            <Marker
              key={point.id}
              position={[point.lat, point.lng]}
              icon={buildIcon(active)}
              eventHandlers={{ click: () => onSelectPoint(point.id) }}
            >
              <Popup maxWidth={260}>
                <div className="hydro-map-popup">
                  <strong>{point.name}</strong>
                  <p>{point.hasSeries ? "Con serie de niveles disponible" : "Sin serie por ahora"}</p>
                </div>
              </Popup>
            </Marker>
          );
        })}
      </MapContainer>
    </div>
  );
}
