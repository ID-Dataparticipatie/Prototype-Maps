import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';



const MapComponent = () => {
  const position = [52.0705, 4.3007]; // Coördinaten van Den Haag

  

  return (
    <MapContainer center={position} zoom={13} className="leaflet-container ">
      
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />
      <Marker position={position}>
        <Popup>Welkom in Den Haag team data & participatie!</Popup>
      </Marker>
    </MapContainer>
  );
};



export default MapComponent;