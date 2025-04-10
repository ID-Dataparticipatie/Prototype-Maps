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

const bounds = L.latLngBounds([
  [-85, -180], // Southwest
  [85, 180], // Northeast
]);

interface TestMarker {
  id: number;
  lat: number;
  lng: number;
  text: string;
}

function MapComponent() {
  const [markers, setMarkers] = useState<TestMarker[]>([]);

  useEffect(() => {
    const savedMarkers = JSON.parse(localStorage.getItem("markers") ?? "") || [];
    setMarkers(savedMarkers);
  }, []);

  useEffect(() => {
    localStorage.setItem("markers", JSON.stringify(markers));
  }, [markers]);

  function MapClickHandler() {
    useMapEvents({
      click(e) {
        const newMarker: TestMarker = {
          id: Date.now(),
          lat: e.latlng.lat,
          lng: e.latlng.lng,
          text: "",
        };
        if (
          markers.find(
            (marker) => calcDistance(marker.lat, marker.lng, newMarker.lat, newMarker.lng) < 0.0001
          )
        ) {
          return;
        }
        setMarkers((prevMarkers) => [...prevMarkers, newMarker]);
      },
    });
    return null;
  }

  function calcDistance(x1: number, y1: number, x2: number, y2: number) {
    // Standard pythagorean theorem
    return Math.sqrt((x2 - x1) * (x2 - x1) + (y2 - y1) * (y2 - y1));
  }

  const updateMarkerText = (id: number, newText: string) => {
    setMarkers((prevMarkers) =>
      prevMarkers.map((marker) => (marker.id === id ? { ...marker, text: newText } : marker))
    );
  };

  const removeMarker = (id: number) => {
    setMarkers((prevMarkers) => prevMarkers.filter((marker) => marker.id !== id));
  };

  return (
    <div className="flex items-center justify-center">
      <MapContainer
        center={[52.0667905, 4.3234636]}
        zoom={25}
        preferCanvas={true}
        className="h-[91vh] w-full overflow-hidden"
        // Locks the map to disallow scrolling outside of the map view.
        maxBounds={bounds}
        maxBoundsViscosity={1.0}
        minZoom={3}>
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          noWrap={true}
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
              <button
                onClick={(e) => {
                  e.stopPropagation(); // Prevents triggering the map click event
                  removeMarker(marker.id);
                }}>
                🗑 Verwijder deze pin
              </button>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}

export default MapComponent;
