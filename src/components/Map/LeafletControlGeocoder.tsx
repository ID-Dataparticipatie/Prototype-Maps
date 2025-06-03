import L from "leaflet";
import Geocoder, { geocoders } from "leaflet-control-geocoder";
import { useEffect } from "react";
import { useMap } from "react-leaflet";

import "leaflet-control-geocoder/dist/Control.Geocoder.css";

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
        var latlng = e.geocode.center;
        L.marker(latlng)
          .addTo(map)
          .bindPopup(e.geocode.name)
          .openPopup();
        map.fitBounds(e.geocode.bbox);
      })
      .addTo(map);
  }, []);

  return null;
}

export default LeafletControlGeocoder;