import MapComponent from "./MapComponent.jsx";

function App() {
  return (
    <div>
      {/* Button met kaart erin */}
      <button className="fullscreen-button">
        <MapComponent />
      </button>

      {/* Hoofdkaart buiten de knop */}
      <div className="map-container">
        <MapComponent />
      </div>
    </div>
  );
}

export default App;
