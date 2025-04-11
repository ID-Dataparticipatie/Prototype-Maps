import { createRoot } from "react-dom/client";
import { BrowserRouter, Route, Routes } from "react-router";
import MainLayout from "./layouts/MainLayout.tsx";
import MapPage from "./pages/MapPage.tsx";
import MapPageTest from "./pages/MapPageTest.tsx";

createRoot(document.getElementById("app")!).render(
  <BrowserRouter>
    <Routes>
      <Route element={<MainLayout />}>
        <Route index element={<MapPage />} />
      </Route>
      <Route path="/testmap" element={<MainLayout />}>
        <Route index element={<MapPageTest />} />
      </Route>
    </Routes>
  </BrowserRouter>
);
