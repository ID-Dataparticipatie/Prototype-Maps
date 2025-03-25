import MapComponent from "./MapComponent.jsx";

function App() {
  return (
    <div className="map-container">

      {/* Button met kaart erin */}
      {/* <button className="fullscreen-button">
        <MapComponent />
      </button> */}

      {/* Hoofdkaart buiten de knop */}
        <MapComponent />
      </div>
  );
}

export default App;
