import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import MainDashboard from "./components/Kanban/principal/Principal";
import Reporte from "./components/Reports/ReportView";



function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<MainDashboard />} />
        <Route path="/reporte" element={<Reporte />} /> {/* ✅ Nueva ruta */}
      </Routes>
    </Router>
  );
}

export default App;