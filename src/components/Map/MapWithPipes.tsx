import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMapEvents,
  LayersControl,
  LayerGroup,
  GeoJSON,
  useMap,
} from "react-leaflet";
import { useState, useEffect, use } from "react";
import L from "leaflet";
import type { FeatureCollection } from "geojson";

import "leaflet/dist/leaflet.css";

const mapCenter = L.latLng([52.0667905, 4.3234636]);

import pipes_small from "../../data/pipes-small.json";

function MapWithPipes() {
  const [data, setData] = useState<FeatureCollection | null>(null);

  useEffect(() => {
    fetch("/pipes-new-cords.geojson")
      .then((res) => {
        return res.json();
      })
      .then((geoJson) => {
        setData(geoJson as FeatureCollection);
      });
  }, []);

  useEffect(() => {
    console.log("Data changed:", data);
  }, [data]);

  return (
    <div className="flex items-center justify-center">
      <MapContainer
        center={mapCenter}
        zoom={25}
        preferCanvas={true}
        className="h-[91vh] w-full overflow-hidden"
        // Locks the map to disallow scrolling outside of the map view.
      >
        <LayersControl position="topright">
          <LayersControl.Overlay name="OSM" checked>
            <LayerGroup>
              <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                noWrap={true}
              />
            </LayerGroup>
          </LayersControl.Overlay>
          {data && (
            <LayersControl.Overlay name="GJSN" checked>
              <LayerGroup>
                <GeoJSON attribution="NEOM Map Data" key="FuckOFfImRendering" data={data} />
              </LayerGroup>
            </LayersControl.Overlay>
          )}
        </LayersControl>
      </MapContainer>
    </div>
  );
}

export default MapWithPipes;
