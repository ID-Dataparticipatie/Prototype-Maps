import { Outlet } from "react-router-dom";
import Header from "../components/Header/Header.tsx";

function MainLayout() {
  return (
    <div className="bg-gray-900">
      <Header />
      <Outlet />
    </div>
  );
}

export default MainLayout;
