import MapComponent from "./MapComponent.jsx";

function App() {
  return (
    <div>

<header className="header">
        <img src="images.png" alt="Den Haag Logo" className="logo" />
      </header>
      

      
      <div className="map-container">
        <MapComponent />
      </div>
    </div>
  );
}

export default App;
