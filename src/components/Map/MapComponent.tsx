import { useState, useEffect } from "react";
import "leaflet/dist/leaflet.css";
import {
  MapContainer,
  TileLayer,
  LayersControl,
} from "react-leaflet";

import LeafletControlGeocoder from "./LeafletControlGeocoder";
import LeafletOverlayGeoJSON from "./LeafletOverlayGeoJSON";
import { leafletMarkerIcon, leafletSingleMapBounds } from "./LeafletCustomItems";
import { loadGeoJson } from "../../util/loadGeoJson";
import type { MapMarkerWithText, NamedFeatureCollection } from "../../typings";
import LeafletOverlayMarkers from "./LeafletOverlayMarkers";

function MapComponent() {
  const [geoJsonDatasets, setGeoJson] = useState<NamedFeatureCollection[]>([]);

  useEffect(() => {
    loadGeoJson()
      .then((data) => setGeoJson(data))
      .catch((err) => console.error("Error fetching datasets:", err));
  }, []);

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
            <LeafletOverlayGeoJSON
              key={dataset.name}
              data={dataset}
              layername={dataset.name}
              style={{ color: dataset.color, weight: 1, fillOpacity: 0.5 }}
            />
          ))}
          <LeafletOverlayMarkers />
        </LayersControl>
        <LeafletControlGeocoder />
      </MapContainer>
    </div>
  );
}

export default MapComponent;
