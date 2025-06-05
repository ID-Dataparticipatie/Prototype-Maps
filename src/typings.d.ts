import type { FeatureCollection } from "geojson";
import type { Icon } from "leaflet";

declare module "*.png" {
  const value: string;
  export default value;
}

declare module "*.css" {
  const value: string;
  export default value;
}

declare interface MapMarkerWithText {
  id: number;
  lat: number;
  lng: number;
  text: string;
  icon?: Icon;
}

declare interface NamedFeatureCollection extends FeatureCollection {
  name: string;
  color: string | undefined;
}
