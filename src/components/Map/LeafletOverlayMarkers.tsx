import { useEffect, useState } from "react";
import L from "leaflet";
import { LayerGroup, LayersControl, Marker, Popup, useMap, useMapEvents } from "react-leaflet";
import { leafletMarkerIcon } from "./LeafletCustomItems";
import type { MapMarkerWithText } from "../../typings";

function LeafletOverlayMarkers() {
  const [markers, setMarkers] = useState<MapMarkerWithText[]>([]);
  const map = useMap();

  useEffect(() => {
    localStorage.setItem("markers", JSON.stringify(markers));
  }, [markers]);

  useEffect(() => {
    const savedData = localStorage.getItem("markers");
    if (savedData) {
      const savedMarkers = JSON.parse(savedData) || [];
      setMarkers(savedMarkers);
    }
  }, []);

  useEffect(() => {
    L.Icon.Default.mergeOptions(leafletMarkerIcon);
    map.addEventListener("click", (e) => {
      console.log(e);
      const newMarker: MapMarkerWithText = {
        id: Date.now(),
        lat: e.latlng.lat,
        lng: e.latlng.lng,
        text: "",
      };
      if (
        !markers.find(
          (marker) => calcDistance(marker.lat, marker.lng, newMarker.lat, newMarker.lng) < 0.0001
        )
      ) {
        setMarkers((prevMarkers) => [...prevMarkers, newMarker]);
      }
    });
  }, [markers]);

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
    <LayersControl.Overlay checked name="Markers">
      <LayerGroup>
        {markers.map((marker) => (
          <Marker
            key={marker.id}
            position={[marker.lat, marker.lng]}
            icon={marker.icon ?? leafletMarkerIcon}>
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
      </LayerGroup>
    </LayersControl.Overlay>
  );
}

export default LeafletOverlayMarkers;
