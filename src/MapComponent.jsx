import {MapContainer, TileLayer, Marker, Popup} from 'react-leaflet';
import { icon } from 'leaflet'
import 'leaflet/dist/leaflet.css';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

const MapComponent = () => {
  const position = [52.0705, 4.3007]; // Coördinaten van Den Haag
  return (
    <MapContainer center={position} zoom={13} >
      
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />
      <Marker position={position} icon={icon({iconUrl: markerIcon, iconRetinaUrl: markerIcon2x, iconSize: [25, 41], iconAnchor: [12, 41], popupAnchor: [1, -34], shadowUrl: markerShadow, shadowSize: [41, 41], shadowAnchor: [12, 41]})}>
        <Popup>Welkom in Den Haag team data & participatie!</Popup>
      </Marker>
    </MapContainer>
  );
};



export default MapComponent;