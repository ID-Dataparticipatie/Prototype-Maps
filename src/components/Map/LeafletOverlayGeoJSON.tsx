import type { FeatureCollection } from "geojson";
import { LayersControl, GeoJSON } from "react-leaflet";

function LeafletOverlayGeoJSON({
  layername,
  data,
  style,
}: {
  layername: string;
  data: FeatureCollection;
  style?: object;
}) {
  return (
    <LayersControl.Overlay checked name={layername}>
      <GeoJSON
        data={data}
        style={style || { color: "blue", weight: 2, opacity: 0.7 }}
        onEachFeature={(feature, layer) => {
          const naam = layername || "Unknown";
          layer.bindPopup(naam);
        }}
      />
    </LayersControl.Overlay>
  );
}

export default LeafletOverlayGeoJSON;
