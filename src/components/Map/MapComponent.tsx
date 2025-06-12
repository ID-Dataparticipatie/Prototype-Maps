import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMapEvents,
  LayersControl,
  LayerGroup,
  useMap,
  GeoJSON, // ✅ GeoJSON-component uit react‑leaflet
} from "react-leaflet";
import { useState, useEffect } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { loadGeoJson } from "../../util/loadGeoJson";
import * as turf from "@turf/turf";
import type { FeatureCollection, Geometry } from "geojson";
import booleanPointOnLine from "@turf/boolean-point-on-line";

import markerShadowPng from "leaflet/dist/images/marker-shadow.png";
import GeoJSONLayer from "./GeoJSONLayer";
import type { NamedFeatureCollection } from "../../typings";
import "leaflet-control-geocoder/dist/Control.Geocoder.css";
import "leaflet-control-geocoder";

/* ------------------------------------------------------------------
  Types
-------------------------------------------------------------------*/

type Buitenobject = {
  id: number;
  lat: number;
  lng: number;
  text: string;
  type: keyof typeof icons;
};

/* ------------------------------------------------------------------
  Icon helper
-------------------------------------------------------------------*/
const createIcon = (url: string) =>
  new L.Icon({
    iconUrl: url,
    shadowUrl: markerShadowPng,
    iconSize: [25, 41],
    iconAnchor: [12, 41],
  });

const icons = {
  vuilnisbak: createIcon("/icons/vuilnisbak.png"),
  lantaarnpaal: createIcon("/icons/lantaarnpaal.png"),
  bushokje: createIcon("/icons/bushokje.png"),
  boom: createIcon("/icons/boom.png"),
} as const;

/* ------------------------------------------------------------------
  Geocoder-control
-------------------------------------------------------------------*/
function GeocoderControl() {
  const map = useMap();

  useEffect(() => {
    if (!map) return;

    const geocoder = (L.Control as any)
      .geocoder({ defaultMarkGeocode: true, placeholder: "Zoek een adres…" })
      .on("markgeocode", (e: any) => map.setView(e.geocode.center, 18))
      .addTo(map);

    return () => map.removeControl(geocoder);
  }, [map]);

  return null;
}

/* ------------------------------------------------------------------
  Hoofdcomponent
-------------------------------------------------------------------*/
export default function MapComponent() {
  /* ------------- state ------------- */
  const [buitenobjecten, setBuitenobjecten] = useState<Buitenobject[]>([]);
  const [geoJsonDatasets, setGeoJson] = useState<NamedFeatureCollection[]>([]);
  const [selectedType, setSelectedType] = useState<keyof typeof icons>("vuilnisbak");
  const [addingObject, setAddingObject] = useState(false);
  const [gebouwGeoJson, setGebouwGeoJson] = useState<FeatureCollection<Geometry> | null>(null);
  const [wegGeoJson, setWegGeoJson] = useState<FeatureCollection<Geometry> | null>(null);
  const [waterGeoJson, setWaterGeoJson] = useState<FeatureCollection<Geometry> | null>(null);
  


  /* ------------- effects ------------- */
  useEffect(() => {
    loadGeoJson().then(setGeoJson).catch(console.error);
  }, []);

  useEffect(() => {
    const saved = localStorage.getItem("buitenobjecten");
    if (saved) setBuitenobjecten(JSON.parse(saved));
  }, []);

  useEffect(() => {
    localStorage.setItem("buitenobjecten", JSON.stringify(buitenobjecten));
  }, [buitenobjecten]);

  useEffect(() => {
    fetch("geojson/export.geojson")
      .then((r) => {
        if (!r.ok) throw new Error("Bestand niet gevonden of fout bij laden.");
        return r.json();
      })
      .then((data) => {
        console.log("✅ GeoJSON geladen:", data);
        setGebouwGeoJson(data);
      })
      .catch((err) => {
        console.error("❌ Fout bij laden GeoJSON:", err);
        // Optioneel: fallback polygon toevoegen
        const fallbackPolygon: FeatureCollection = {
          type: "FeatureCollection",
          features: [
            {
              type: "Feature",
              geometry: {
                type: "Polygon",
                coordinates: [
                  [
                    [4.323, 52.0667],
                    [4.324, 52.0667],
                    [4.324, 52.067],
                    [4.323, 52.067],
                    [4.323, 52.0667],
                  ],
                ],
              },
              properties: {},
            },
          ],
        };
        setGebouwGeoJson(fallbackPolygon);
      });
  }, []);

  // wegen 🆕
  useEffect(() => {
    fetch("/geojson/weg.geojson")
      .then((res) => {
        if (!res.ok) throw new Error("weg.geojson niet gevonden");
        return res.json();
      })
      .then(setWegGeoJson)
      .catch(console.error);
  }, []);

  useEffect(() => {
    fetch("/geojson/water.geojson")
      .then((res) => {
        if (!res.ok) throw new Error("weg.geojson niet gevonden");
        return res.json();
      })
      .then(setWaterGeoJson)
      .catch(console.error);
  }, []);


  /* ------------- helpers ------------- */
  const updateText = (id: number, text: string) =>
    setBuitenobjecten((prev) => prev.map((o) => (o.id === id ? { ...o, text } : o)));

  const removeObj = (id: number) => setBuitenobjecten((prev) => prev.filter((o) => o.id !== id));

  /* ------------- click handler ------------- */
  function MapClickHandler() {
    useMapEvents({
      click(e) {
        if (!addingObject) return;

        const point = turf.point([e.latlng.lng, e.latlng.lat]);

        /* --- 1. staat het punt op een gebouw? --- */
        const onBuilding =
          gebouwGeoJson?.features.some((f) => turf.booleanPointInPolygon(point, f)) ?? false;

        /* --- 2. staat het punt op een weg? --- */
        const onRoad =
          wegGeoJson?.features.some((f) => {
            if (f.geometry.type === "LineString" || f.geometry.type === "MultiLineString") {
              // 1 meter tolerantie – pas aan naar wens
              return booleanPointOnLine(point, f, { tolerance: 1 });
            }
            return false;
          }) ?? false;

        const onWater =
          waterGeoJson?.features.some((f) => {
            if (f.geometry.type === "Polygon" || f.geometry.type === "MultiPolygon") {
              return turf.booleanPointInPolygon(point, f as any);
            }
            if (f.geometry.type === "LineString" || f.geometry.type === "MultiLineString") {
              return turf.booleanPointOnLine(point, f as any, { tolerance: 1 });
            }
            return false;
          }) ?? false;

        if (onBuilding || onRoad || onWater) {
          alert(
            "❌ Je kunt geen object op " +
              (onBuilding ? "gebouw" : onRoad ? "weg" : "water") +
              " plaatsen!",
          );
          setAddingObject(false);
          return;
        }

        /* --- 3. punt is geldig → opslaan --- */
        setBuitenobjecten((prev) => [
          ...prev,
          {
            id: Date.now(),
            lat: e.latlng.lat,
            lng: e.latlng.lng,
            text: "",
            type: selectedType,
          },
        ]);
        setAddingObject(false);
      },
    });
    return null;
  }
  /* ------------------------------------------------------------------
    Render
  -------------------------------------------------------------------*/
  return (
    <div className="flex flex-col items-center w-full">
      {/* ---------- UI boven de kaart ---------- */}
      <div className="flex gap-4 my-4">
        <label>
          Kies buitenobject:
          <select
            className="border p-1 rounded ml-2"
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value as keyof typeof icons)}>
            <option value="bushokje">Bushokje</option>
            <option value="lantaarnpaal">Lantaarnpaal</option>
            <option value="boom">Boom</option>
            <option value="vuilnisbak">Vuilnisbak</option>
          </select>
        </label>
        <button
          onClick={() => setAddingObject(true)}
          className="bg-blue-500 text-white px-4 py-1 rounded hover:bg-blue-600">
          ➕ Nieuw buitenobject
        </button>
        {addingObject && <span className="text-green-600">Klik op de kaart…</span>}
      </div>

      {/* ---------- Kaart ---------- */}
      <MapContainer
        center={[52.0667905, 4.3234636]}
        zoom={25}
        preferCanvas
        className="h-[91vh] w-full"
        maxBounds={L.latLngBounds([
          [-85, -180],
          [85, 180],
        ])}
        maxBoundsViscosity={1}
        minZoom={3}>
        <MapClickHandler />
        <GeocoderControl />

        <LayersControl position="topright">
          {/* basemaps */}
          <LayersControl.BaseLayer checked name="OpenStreetMap">
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution="© OpenStreetMap"
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

          {/* gebouwen */}
          {gebouwGeoJson && (
            <LayersControl.Overlay checked name="Gebouwen">
              <LayerGroup>
                <GeoJSON
                  data={gebouwGeoJson}
                  style={{ color: "#666", weight: 1, fillOpacity: 0.4 }}
                />
              </LayerGroup>
            </LayersControl.Overlay>
          )}

          {wegGeoJson && (
            <LayersControl.Overlay checked name="Wegen">
              <LayerGroup>
                <GeoJSON data={wegGeoJson} style={{ color: "#ff6600", weight: 1 }} />
              </LayerGroup>
            </LayersControl.Overlay>
          )}

                {waterGeoJson && (
            <LayersControl.Overlay checked name="Water">
              <LayerGroup>
                <GeoJSON
                  data={waterGeoJson}
                  style={{ color: "#0077ff", weight: 1, fillOpacity: 0.5 }}
                />
              </LayerGroup>
            </LayersControl.Overlay>
          )}

          {/* overige datasets */}
          {geoJsonDatasets.map((ds) => (
            <GeoJSONLayer
              key={ds.name}
              data={ds}
              layername={ds.name}
              style={{ color: ds.color, weight: 1, fillOpacity: 0.5 }}
            />
          ))}

          {/* markers */}
          <LayersControl.Overlay checked name="Buitenobjecten">
            <LayerGroup>
              {buitenobjecten.map((o) => (
                <Marker key={o.id} position={[o.lat, o.lng]} icon={icons[o.type]}>
                  <Popup>
                    <input
                      className="border p-1 w-full mb-2"
                      value={o.text}
                      placeholder="Naam…"
                      onChange={(e) => updateText(o.id, e.target.value)}
                    />
                    <button
                      className="text-red-600 hover:underline"
                      onClick={() => removeObj(o.id)}>
                      🗑 Verwijder
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
