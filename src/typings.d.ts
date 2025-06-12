import type { FeatureCollection } from "geojson";
import type { FeatureCollection, Polygon, MultiPolygon } from "@turf/turf";

export type NamedFeatureCollection = {
  name: string;
  color?: string;
  data: FeatureCollection<Polygon | MultiPolygon>;
};


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
}

declare interface NamedFeatureCollection extends FeatureCollection {
  name: string;
  color: string | undefined;
}

import type { FeatureCollection, Geometry, GeoJsonProperties } from "geojson";

export type NamedFeatureCollection = FeatureCollection<Geometry, GeoJsonProperties> & {
  name: string;
  color?: string;
};
