import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMapEvents,
  LayersControl,
  LayerGroup,
} from "react-leaflet";
import { useState, useEffect } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { loadGeoJson } from "../../util/loadGeoJson";

import markerIconPng from "leaflet/dist/images/marker-icon.png";
import markerShadowPng from "leaflet/dist/images/marker-shadow.png";
import GeoJSONLayer from "./GeoJSONLayer";
import type { NamedFeatureCollection } from "../../typings";

type Buitenobject = {
  id: number;
  lat: number;
  lng: number;
  text: string;
  type?: string;
};

// 📍 Verschillende iconen
const defaultIcon = new L.Icon({
  iconUrl: "icons/vuilnisbak.png",
  shadowUrl: markerShadowPng,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

const redIcon = new L.Icon({
  iconUrl: "/icons/lantaarnpaal.png",
  shadowUrl: markerShadowPng,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

const greenIcon = new L.Icon({
  iconUrl:
    "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-green.png",
  shadowUrl: markerShadowPng,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

const bounds = L.latLngBounds([
  [-85, -180],
  [85, 180],
]);

function MapComponent() {
  const [buitenobjecten, setBuitenobjecten] = useState<Buitenobject[]>([]);
  const [geoJsonDatasets, setGeoJson] = useState<NamedFeatureCollection[]>([]);
  const [selectedType, setSelectedType] = useState<string>("default");
  const [addingObject, setAddingObject] = useState<boolean>(false);

  useEffect(() => {
    loadGeoJson()
      .then((data) => setGeoJson(data))
      .catch((err) => console.error("Error fetching datasets:", err));
  }, []);

  useEffect(() => {
    const savedData = localStorage.getItem("buitenobjecten");
    if (savedData) {
      const saved = JSON.parse(savedData) || [];
      setBuitenobjecten(saved);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("buitenobjecten", JSON.stringify(buitenobjecten));
  }, [buitenobjecten]);

  function MapClickHandler() {
    useMapEvents({
      click(e) {
        if (!addingObject) return;

        const nieuwObject: Buitenobject = {
          id: Date.now(),
          lat: e.latlng.lat,
          lng: e.latlng.lng,
          text: "",
          type: selectedType,
        };

        setBuitenobjecten((prev) => [...prev, nieuwObject]);
        setAddingObject(false);
      },
    });
    return null;
  }

  const updateBuitenobjectText = (id: number, newText: string) => {
    setBuitenobjecten((prev) =>
      prev.map((obj) => (obj.id === id ? { ...obj, text: newText } : obj))
    );
  };

  const removeBuitenobject = (id: number) => {
    setBuitenobjecten((prev) => prev.filter((obj) => obj.id !== id));
  };

  const getIconForType = (type: string | undefined) => {
    switch (type) {
      case "red":
        return redIcon;
      case "green":
        return greenIcon;
      default:
        return defaultIcon;
    }
  };

  return (
    <div className="flex flex-col items-center justify-center w-full">
      {/* UI boven de kaart */}
      <div className="flex gap-4 my-4">
        <div>
          <label className="mr-2">Kies buitenobject:</label>
          <select
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
            className="border p-1 rounded">
            <option value="bushokje">Bushokje</option>
            <option value="lantaarnpaal">Lantaarnpaal</option>
            <option value="boom">Boom</option>
            <option value="vuilnisbak">Vuilnisbak</option>
          </select>
        </div>
        <button
          onClick={() => setAddingObject(true)}
          className="bg-blue-500 text-white px-4 py-1 rounded hover:bg-blue-600">
          ➕ Nieuw buitenobject
        </button>
        {addingObject && (
          <span className="text-green-600">
            Klik op de kaart om het buitenobject te plaatsen...
          </span>
        )}
      </div>

      {/* Kaart */}
      <MapContainer
        center={[52.0667905, 4.3234636]}
        zoom={25}
        preferCanvas={true}
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
              noWrap={true}
            />
          </LayersControl.BaseLayer>

          <LayersControl.BaseLayer name="Esri Satellite">
            <TileLayer
              url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
              attribution="Tiles © Esri"
              noWrap={true}
            />
          </LayersControl.BaseLayer>

          {geoJsonDatasets.map((dataset) => (
            <GeoJSONLayer
              key={dataset.name}
              data={dataset}
              layername={dataset.name}
              style={{ color: dataset.color, weight: 1, fillOpacity: 0.5 }}
            />
          ))}

          <LayersControl.Overlay checked name="Buitenobjecten">
            <LayerGroup>
              {buitenobjecten.map((obj) => (
                <Marker key={obj.id} position={[obj.lat, obj.lng]} icon={getIconForType(obj.type)}>
                  <Popup>
                    <input
                      type="text"
                      placeholder="Naam van buitenobject..."
                      value={obj.text}
                      onChange={(e) => updateBuitenobjectText(obj.id, e.target.value)}
                    />
                    <br />
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        removeBuitenobject(obj.id);
                      }}>
                      🗑 Verwijder dit buitenobject
                    </button>
                  </Popup>
                </Marker>
              ))}
            </LayerGroup>
          </LayersControl.Overlay>
        </LayersControl>
      </MapContainer>
    </div>
  );
}

export default MapComponent;
