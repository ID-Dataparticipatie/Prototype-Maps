import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from "react-leaflet";
import { useState, useEffect } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// Fix voor ontbrekende Leaflet marker-icon
import markerIconPng from "leaflet/dist/images/marker-icon.png";
import markerShadowPng from "leaflet/dist/images/marker-shadow.png";

const customIcon = new L.Icon({
  iconUrl: markerIconPng,
  shadowUrl: markerShadowPng,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

function MapComponent() {
  const [markers, setMarkers] = useState([]);


  useEffect(() => {
    const savedMarkers = JSON.parse(localStorage.getItem("markers")) || [];
    setMarkers(savedMarkers);
  }, []);

 
  useEffect(() => {
    localStorage.setItem("markers", JSON.stringify(markers));
  }, [markers]);

  
  function MapClickHandler() {
    useMapEvents({
      click(e) {
        const newMarker = {
          id: Date.now(),
          lat: e.latlng.lat,
          lng: e.latlng.lng,
          text: "", 
        };
        setMarkers((prevMarkers) => [...prevMarkers, newMarker]);
      },
    });
    return null;
  }


  const updateMarkerText = (id, newText) => {
    setMarkers((prevMarkers) =>
      prevMarkers.map((marker) =>
        marker.id === id ? { ...marker, text: newText } : marker
      )
    );
  };

  
  const removeMarker = (id) => {
    setMarkers((prevMarkers) => prevMarkers.filter((marker) => marker.id !== id));
  };

  return (
    <MapContainer center={[52.0705, 4.3007]} zoom={13} style={{ height: "500px", width: "100%" }}>
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />

      <MapClickHandler />

      {markers.map((marker) => (
        <Marker key={marker.id} position={[marker.lat, marker.lng]} icon={customIcon}>
          <Popup>
            <input
              type="text"
              placeholder="Voer een naam in..."
              value={marker.text}
              onChange={(e) => updateMarkerText(marker.id, e.target.value)}
            />
            <br />
            <button onClick={() => removeMarker(marker.id)}>🗑 Verwijder deze pin</button>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}

export default MapComponent;