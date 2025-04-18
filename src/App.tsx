import Footer from "./components/Footer/Footer.tsx";
import Header from "./components/Header/Header.tsx";
import MapComponent from "./components/Map/MapComponent.tsx";

function App() {
  return (
    <div className="bg-gray-900">
      <Header />
      {/* Should have a maincontent thingy but since we are only displaying the map I couldn't be arsed */}
      <MapComponent />
      {/* Footer */}
      {/* <Footer /> */}
    </div>
  );
}

export default App;
