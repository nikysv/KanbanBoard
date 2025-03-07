import { useState } from "react";
import { FaFilter, FaCalendarAlt, FaArrowLeft } from "react-icons/fa";
import { useNavigate, useParams } from "react-router-dom";
import dayjs from "dayjs";
import KanbanBoard from "../components/Kanban/Columns/Columns";
import useDropdown from "../hooks/useDropdown";
import DropdownFilter from "../components/Kanban/Modals/FilterModal";
import useKanbanStore from "../stores/useKanbanStore";

const MainDashboard = () => {
  const { id } = useParams();
  const { sites } = useKanbanStore();
  const navigate = useNavigate();
  const { isOpen, toggleDropdown, dropdownRef } = useDropdown();
  const [filters, setFilters] = useState({ priority: "all", date: "all" });

  // Obtener el sitio actual usando el ID de la URL
  const currentSite = sites.find((site) => site.id === id);

  if (!currentSite) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-800">
            Sitio no encontrado
          </h2>
          <button
            onClick={() => navigate("/")}
            className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg"
          >
            Volver al inicio
          </button>
        </div>
      </div>
    );
  }

  const toggleDateFilter = () => {
    const todayDate = dayjs().format("YYYY-MM-DD");
    setFilters((prevFilters) => ({
      ...prevFilters,
      date: prevFilters.date === todayDate ? "all" : todayDate,
    }));
  };

  const setPriorityFilter = (priority) => {
    setFilters((prev) => ({ ...prev, priority }));
    toggleDropdown();
  };

  const handleGenerateReport = () => {
    const reportData = {
      sitio: currentSite.name,
      id: currentSite.id,
      columnas: currentSite.data.columnas.map((col) => ({
        titulo: col.title || col.titulo,
        tareas: col.tasks || col.tareas || [],
      })),
    };

    navigate("/reporte", { state: { kanbanData: reportData } });
  };

  const setTodayFilter = () => {
    const today = dayjs().format("YYYY-MM-DD");
    setFilters((prev) => ({ ...prev, date: today }));
  };

  return (
    <div className="h-screen flex flex-col">
      <div className="bg-white shadow-md p-4 fixed top-0 left-0 w-full z-10">
        <div className="flex flex-col gap-2">
          {/* Header con botón volver, título y estado */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <button
                onClick={() => navigate("/")}
                className="p-2 hover:bg-gray-100 rounded-full"
                title="Volver"
              >
                <FaArrowLeft className="text-gray-600" size={16} />
              </button>
              <div>
                <h1 className="text-xl font-bold">{currentSite.name}</h1>
                <p className="text-sm text-gray-500">ID: {currentSite.id}</p>
              </div>
            </div>

            {/* Indicadores de progreso */}
            <div className="flex items-center gap-2">
              <div className="flex gap-1">
                {currentSite.stages.map((completed, index) => (
                  <div
                    key={index}
                    className={`w-5 h-5 flex items-center justify-center rounded-full text-xs font-bold
                      ${completed ? "bg-green-500 text-white" : "bg-gray-200"}`}
                  >
                    {index + 1}
                  </div>
                ))}
              </div>
              <span
                className={`px-2 py-1 rounded-full text-xs ${
                  currentSite.status === "active"
                    ? "bg-green-100 text-green-800"
                    : "bg-yellow-100 text-yellow-800"
                }`}
              >
                {currentSite.status === "active" ? "Activo" : "Pendiente"}
              </span>
            </div>
          </div>

          {/* Barra de filtros y botón de reporte */}
          <div className="flex justify-between items-center">
            <div className="flex gap-2">
              <div className="relative">
                <button
                  onClick={toggleDropdown}
                  className="flex items-center gap-2 px-3 py-1.5 border rounded-lg shadow-sm hover:bg-gray-100"
                >
                  <FaFilter size={14} />
                  <span className="text-sm">Filtrar</span>
                </button>
                <DropdownFilter
                  isOpen={isOpen}
                  setPriorityFilter={setPriorityFilter}
                  dropdownRef={dropdownRef}
                />
              </div>

              <button
                onClick={toggleDateFilter}
                className={`flex items-center gap-2 px-3 py-1.5 border rounded-lg shadow-sm transition-colors ${
                  filters.date !== "all"
                    ? "bg-blue-500 text-white"
                    : "hover:bg-gray-100"
                }`}
              >
                <FaCalendarAlt size={14} />
                <span className="text-sm">Hoy</span>
              </button>
            </div>

            {/* Botón de reporte */}
            <button
              onClick={handleGenerateReport}
              className="flex items-center gap-2 px-3 py-1.5 bg-blue-500 text-white rounded-lg shadow-sm hover:bg-blue-600"
            >
              📊 <span className="text-sm">Generar Reporte</span>
            </button>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto mt-24 p-6">
        <KanbanBoard
          data={currentSite.data}
          filters={filters}
          userType="tigo"
        />
      </div>
    </div>
  );
};

export default MainDashboard;
