import { useState } from "react";
import { FaFilter, FaCalendarAlt, FaShareAlt } from "react-icons/fa";
import { IoMdSave } from "react-icons/io";
import { useNavigate } from "react-router-dom"; // Add this import
import dayjs from "dayjs";
import KanbanBoard from "../Columns/Columns";
import useDropdown from "../../../hooks/useDropdown";
import DropdownFilter from "../Modals/FilterModal";

const MainDashboard = () => {
  const navigate = useNavigate(); // Add this hook
  const { isOpen, toggleDropdown, dropdownRef } = useDropdown();
  const [filters, setFilters] = useState({ priority: "all", date: "all" });

    // 🔹 Datos de prueba del KanbanBoard (esto será del backend en el futuro)
  const [kanbanData, setKanbanData] = useState({
    sitio: "PARAGUA",
    id: "PRY",
    columnas: [
      {
        titulo: "Pendiente",
        tareas: [
          {
            titulo: "Revisar documentos",
            prioridad: "Baja",
            fecha: "2025-03-10",
            estado: "Pendiente",
            comentarios: [],
            archivos: [],
            participantes: ["Usuario A", "Usuario B"],
            checklist: [{ text: "Subir archivos", completed: false }],
          },
        ],
      },
      {
        titulo: "En Proceso",
        tareas: [
          {
            titulo: "Desarrollar API",
            prioridad: "Alta",
            fecha: "2025-03-12",
            estado: "Completada",
            comentarios: ["Buen trabajo"],
            archivos: ["api-doc.pdf"],
            participantes: ["Usuario C"],
            checklist: [{ text: "Revisar código", completed: true }],
          },
        ],
      },
    ],
  });

  const toggleDateFilter = () => {
    const todayDate = dayjs().format("YYYY-MM-DD"); // Formato de la fecha de hoy
    setFilters((prevFilters) => ({
      ...prevFilters,
      date: prevFilters.date === todayDate ? "all" : todayDate, // ✅ Alternar entre "hoy" y "todas las fechas"
    }));
  };

  // ✅ Función para establecer filtro por prioridad
  const setPriorityFilter = (priority) => {
    setFilters((prev) => ({ ...prev, priority }));
    toggleDropdown();
  };
     
    // 🔹 Función para manejar el botón de "Generar Reporte"
  const handleGenerateReport = () => {
    navigate("/reporte", { state: { kanbanData } }); // ✅ Pasamos los datos a la vista de reportes
  };

  // ✅ Función para filtrar tareas con fecha de hoy
  const setTodayFilter = () => {
    const today = dayjs().format("YYYY-MM-DD");
    setFilters((prev) => ({ ...prev, date: today }));
  };

  return (
    <div className="h-screen flex flex-col">
      <div className="bg-white shadow-md p-6 fixed top-0 left-0 w-full z-10">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold">PARAGUA</h1>
            <p className="text-gray-500">ID: PRY</p>
          </div>
          <div className="flex items-center space-x-2">
            <span className="inline-block w-3 h-3 rounded-full bg-green-500"></span>
            <span className="text-green-600 font-medium">Activo</span>
          </div>
        </div>

        {/* Controles */}
        <div className="flex justify-between items-center mt-4 relative">
          <div className="flex space-x-3">
            {/* Botón de filtro */}
            <div className="relative">
              <button
                onClick={toggleDropdown}
                className="flex items-center space-x-2 px-4 py-2 border rounded-lg shadow-sm hover:bg-gray-100"
              >
                <FaFilter />
                <span>Filtrar</span>
              </button>
              <DropdownFilter
                isOpen={isOpen}
                setPriorityFilter={setPriorityFilter}
                dropdownRef={dropdownRef}
              />
            </div>

            {/* ✅ Botón para filtrar tareas de hoy */}
            <button
              onClick={toggleDateFilter}
              className={`flex items-center space-x-2 px-4 py-2 border rounded-lg shadow-sm transition-colors ${
                filters.date !== "all"
                  ? "bg-blue-500 text-white"
                  : "hover:bg-gray-100"
              }`}
            >
              <FaCalendarAlt />
              <span>Hoy</span>
            </button>
          </div>

          {/* Acciones */}
          <div className="flex justify-between items-center mt-4">
            <div className="flex space-x-3">
              {/* Botón para generar el reporte */}
              <button
                onClick={handleGenerateReport}
                className="mt-4 flex items-center space-x-2 px-4 py-2 bg-blue-500 text-white rounded-lg shadow-sm hover:bg-blue-600"
              >
                📊 <span>Generar Reporte</span>
              </button>
            </div>
          </div>
        </div>
      </div>
      {/* ✅ Pasamos los filtros a KanbanBoard */}
      <div className="flex-1 overflow-y-auto mt-40 p-6">
        <KanbanBoard data={kanbanData} filters={filters} />
      </div>
    </div>
  );
};

export default MainDashboard;
