import { Routes, Route } from "react-router-dom";
import MainDashboard from "../views/Principal";
import MainPage from "../views/RollOut";
import ReportView from "../views/ReportView";

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<MainPage />} /> {/* Vista principal */}
      <Route path="/kanban/:id" element={<MainDashboard />} /> {/* Kanban de cada sitio */}
      <Route path="/reporte" element={<ReportView />} /> {/* Reporte */}
    </Routes>
  );
};

export default AppRoutes;
