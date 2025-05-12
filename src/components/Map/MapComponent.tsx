import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMapEvents,
  GeoJSON,
  LayersControl,
} from "react-leaflet";
import { useState, useEffect } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import * as turf from "@turf/turf";

import markerIconPng from "/icon.png";
import markerShadowPng from "leaflet/dist/images/marker-shadow.png";

const customIcon = new L.Icon({
  iconUrl: markerIconPng,
  shadowUrl: markerShadowPng,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

const bounds = L.latLngBounds([
  [-85, -180],
  [85, 180],
]);

interface TestMarker {
  id: number;
  lat: number;
  lng: number;
  text: string;
}

function MapComponent() {
  const [markers, setMarkers] = useState<TestMarker[]>([]);
  const [stroomData, setStroomData] = useState<any>(null);
  const [rioolData, setRioolData] = useState<any>(null);
  const [hoofdnetwerkData, setHoofdnetwerkData] = useState<any>(null);

  useEffect(() => {
    fetch("/stroom.geojson")
      .then((res) => res.json())
      .then(setStroomData)
      .catch((err) => console.error("Fout bij laden stroom (banaan2.geojson):", err));

    fetch("/riool.geojson")
      .then((res) => res.json())
      .then(setRioolData)
      .catch((err) => console.error("Fout bij laden riool (buizen.geojson):", err));

    fetch("/hoofdnetwerk.geojson")
      .then((res) => res.json())
      .then(setHoofdnetwerkData)
      .catch((err) => console.error("Fout bij laden hoofdnetwerk.geojson:", err));
  }, []);

  useEffect(() => {
    const savedMarkers = JSON.parse(localStorage.getItem("markers") ?? "[]");
    setMarkers(savedMarkers);
  }, []);

  useEffect(() => {
    localStorage.setItem("markers", JSON.stringify(markers));
  }, [markers]);

  const calcDistance = (x1: number, y1: number, x2: number, y2: number) => {
    return Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2);
  };

  const MapClickHandler = () => {
    useMapEvents({
      click(e) {
        const point = turf.point([e.latlng.lng, e.latlng.lat]);

        const layersToCheck = [
          { data: stroomData, type: "stroomkabel", emoji: "⚡" },
          { data: rioolData, type: "rioolbuis", emoji: "💧" },
          { data: hoofdnetwerkData, type: "hoofdnetwerk", emoji: "🟠" },
        ];

        for (const layer of layersToCheck) {
          if (!layer.data) continue;

          const intersects = layer.data.features.some((feature: any) => {
            const geometry = feature.geometry;
            if (!geometry) return false;

            if (geometry.type === "LineString" || geometry.type === "MultiLineString") {
              return turf.booleanPointOnLine(point, feature, { ignoreEndVertices: true });
            }

            if (geometry.type === "Polygon" || geometry.type === "MultiPolygon") {
              return turf.booleanPointInPolygon(point, feature);
            }

            return false;
          });

          if (intersects) {
            alert(`⛔ Je kunt hier geen pin plaatsen – ${layer.emoji} ${layer.type} aanwezig.`);
            return;
          }
        }

        // Check op dubbele pin op bijna dezelfde locatie
        const newMarker: TestMarker = {
          id: Date.now(),
          lat: e.latlng.lat,
          lng: e.latlng.lng,
          text: "",
        };

        const isDuplicate = markers.some(
          (marker) => calcDistance(marker.lat, marker.lng, newMarker.lat, newMarker.lng) < 0.0001
        );

        if (isDuplicate) return;

        setMarkers((prev) => [...prev, newMarker]);
      },
    });

    return null;
  };

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
        preferCanvas
        className="h-[91vh] w-full overflow-hidden"
        maxBounds={bounds}
        maxBoundsViscosity={1.0}
        minZoom={3}>
        <MapClickHandler />

        <LayersControl position="topright">
          <LayersControl.BaseLayer checked name="OpenStreetMap">
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              noWrap
            />
          </LayersControl.BaseLayer>

          <LayersControl.BaseLayer name="Esri Satellite">
            <TileLayer
              url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
              attribution="Tiles © Esri"
              noWrap
            />
          </LayersControl.BaseLayer>

          {stroomData && (
            <LayersControl.Overlay checked={false} name="Stroom Laag">
              <GeoJSON
                data={stroomData}
                style={{ color: "yellow", weight: 6, opacity: 0 }}
                onEachFeature={(feature, layer) => {
                  const naam = feature.properties?.name || "Onbekende stroomlijn";
                  layer.bindPopup(`⚡ ${naam}`);
                }}
              />
            </LayersControl.Overlay>
          )}

          {rioolData && (
            <LayersControl.Overlay checked={false} name="Riool Laag">
              <GeoJSON
                data={rioolData}
                style={{ color: "blue", weight: 6, opacity: 0 }}
                onEachFeature={(feature, layer) => {
                  const naam = feature.properties?.name || "Onbekende rioolbuis";
                  layer.bindPopup(`💧 ${naam}`);
                }}
              />
            </LayersControl.Overlay>
          )}

          {hoofdnetwerkData && (
            <LayersControl.Overlay checked={false} name="Hoofdnetwerk Laag">
              <GeoJSON
                data={hoofdnetwerkData}
                style={{ color: "orange", weight: 6, opacity: 0 }}
                onEachFeature={(feature, layer) => {
                  const naam = feature.properties?.name || "Hoofdnetwerk";
                  layer.bindPopup(`🟠 ${naam}`);
                }}
              />
            </LayersControl.Overlay>
          )}

          <LayersControl.Overlay checked name="Pinnetjes">
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
                      e.stopPropagation();
                      removeMarker(marker.id);
                    }}>
                    🗑 Verwijder deze pin
                  </button>
                </Popup>
              </Marker>
            ))}
          </LayersControl.Overlay>
        </LayersControl>
      </MapContainer>
    </div>
  );
}

export default MapComponent;
