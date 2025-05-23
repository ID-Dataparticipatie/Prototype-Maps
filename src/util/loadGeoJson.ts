// src/utils/datasets.ts

import type { NamedFeatureCollection } from "../typings";

// Map dataset names to file paths or URLs
const datasetMap = {
  hoofdnetwerk: "/geojson/hoofdnetwerk.geojson",
  stroom: "/geojson/stroom.geojson",
  riool: "/geojson/riool.geojson",
};

export const loadGeoJson = async (): Promise<NamedFeatureCollection[]> => {
  const datasetPromises = Object.values(datasetMap).map((url) =>
    fetch(url).then((res) => {
      if (!res.ok) throw new Error(`Failed to fetch ${url}`);
      return res.json();
    })
  );

  return Promise.all(datasetPromises);
};
