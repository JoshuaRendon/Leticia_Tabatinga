import { MapContainer, Marker, Popup, TileLayer } from "react-leaflet";
import L from "leaflet";
import PointPopup from "./PointPopup";
import { classifyIrca, hydroSites } from "./data";
import "leaflet/dist/leaflet.css";

function buildMarker(color) {
  return new L.DivIcon({
    className: "irca-marker",
    html: `<span class="irca-marker__core" style="background:${color}"></span>`,
    iconSize: [18, 18],
    iconAnchor: [9, 9],
    popupAnchor: [0, -12],
  });
}

export default function HidrogeoquimicaMap({ sites = hydroSites, selectedSiteId, onSelectSite }) {
  return (
    <div className="irca-map-shell">
      <MapContainer center={[-4.22, -69.94]} zoom={12} scrollWheelZoom className="irca-map">
        <TileLayer
          attribution='&copy; OpenStreetMap contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {sites.map((site) => {
          const band = classifyIrca(site.irca);
          const active = site.id === selectedSiteId;
          return (
            <Marker
              key={site.id}
              position={[site.lat, site.lng]}
              icon={buildMarker(active ? band.color : `${band.color}cc`)}
              eventHandlers={onSelectSite ? { click: () => onSelectSite(site.id) } : undefined}
            >
              <Popup className="irca-popup-shell" maxWidth={480}>
                <PointPopup site={site} />
              </Popup>
            </Marker>
          );
        })}
      </MapContainer>
    </div>
  );
}
