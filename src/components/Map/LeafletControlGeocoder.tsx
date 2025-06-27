import L from "leaflet";
import Geocoder, {
  geocoders,
} from "leaflet-control-geocoder";
import { useEffect } from "react";
import { useMap } from "react-leaflet";

import "leaflet-control-geocoder/dist/Control.Geocoder.css";
import { leafletMarkerIcon } from "./LeafletCustomItems";

function LeafletControlGeocoder() {
  const map = useMap();

  useEffect(() => {
    new Geocoder({
      query: "",
      placeholder: "Search here...",
      defaultMarkGeocode: false,
      geocoder: geocoders.nominatim(),
    })
      .on("markgeocode", function (e) {
        const latlng = e.geocode.center;

        const locationMarker = L.marker(latlng, {icon: leafletMarkerIcon})
          .addTo(map)
          .bindPopup(e.geocode.name)
          .openPopup()

        .on("popupclose", () => {
          map.removeLayer(locationMarker);
        });
        map.fitBounds(e.geocode.bbox);
      })
      .addTo(map);
  }, [map]);

  return null;
}

export default LeafletControlGeocoder;
