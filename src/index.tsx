import { createRoot } from "react-dom/client";
import { BrowserRouter, Route, Routes } from "react-router";
import MainLayout from "./layouts/MainLayout.tsx";
import MapPage from "./pages/MapPage.tsx";

createRoot(document.getElementById("app")!).render(
  <BrowserRouter>
    <Routes>
      <Route element={<MainLayout />}>
        <Route index element={<MapPage />} />
      </Route>
    </Routes>
  </BrowserRouter>
);
