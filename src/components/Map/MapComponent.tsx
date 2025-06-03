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
import "leaflet/dist/leaflet.css";
import { loadGeoJson } from "../../util/loadGeoJson";
import LeafletControlGeocoder from "./LeafletControlGeocoder";

// Fix voor ontbrekende Leaflet marker-icon

import GeoJSONLayer from "./GeoJSONLayer";
import { leafletMarkerIcon, leafletSingleMapBounds } from "./LeafletCustomItems";
import type { MapMarkerWithText, NamedFeatureCollection } from "../../typings";


function MapComponent() {
  const [markers, setMarkers] = useState<MapMarkerWithText[]>([]);
  const [geoJsonDatasets, setGeoJson] = useState<NamedFeatureCollection[]>([]);

  useEffect(() => {
    loadGeoJson()
      .then((data) => setGeoJson(data))
      .catch((err) => console.error("Error fetching datasets:", err));
  }, []);

  useEffect(() => {
    const savedData = localStorage.getItem("markers");
    if (savedData) {
      const savedMarkers = JSON.parse(savedData) || [];
      setMarkers(savedMarkers);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("markers", JSON.stringify(markers));
  }, [markers]);

  function MapClickHandler() {
    useMapEvents({
      click(e) {
        const newMarker: MapMarkerWithText = {
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
        maxBounds={leafletSingleMapBounds}
        maxBoundsViscosity={1.0}
        minZoom={4}>

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

          <LayersControl.Overlay checked name="Markers">
            <LayerGroup>
              {markers.map((marker) => (
                <Marker
                  key={marker.id}
                  position={[marker.lat, marker.lng]}
                  icon={leafletMarkerIcon}>
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
        </LayersControl>
        <LeafletControlGeocoder />
      </MapContainer>
    </div>
  );
}

export default MapComponent;
