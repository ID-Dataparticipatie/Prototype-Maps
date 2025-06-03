import L from "leaflet";
import markerRetinaPng from "leaflet/dist/images/marker-icon-2x.png";
import markerIconPng from "leaflet/dist/images/marker-icon.png";
import markerShadowPng from "leaflet/dist/images/marker-shadow.png";

export const leafletMarkerIcon = new L.Icon({
  iconRetinaUrl: markerRetinaPng,
  iconUrl: markerIconPng,
  shadowUrl: markerShadowPng,
  // iconSize: [25, 41],
  popupAnchor: [0, -28],
  iconAnchor: [12, 41],
});

export const leafletSingleMapBounds = L.latLngBounds([
  [-85, -180], // Southwest
  [85, 180], // Northeast
]);