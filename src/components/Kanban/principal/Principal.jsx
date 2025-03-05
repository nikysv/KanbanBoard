import { useState } from "react";
import { FaFilter, FaCalendarAlt, FaShareAlt } from "react-icons/fa";
import { IoMdSave } from "react-icons/io";
import KanbanBoard from "../Columns/Columns";
import useDropdown from "../../../hooks/useDropdown";
import DropdownFilter from "../Modals/FilterModal";

const MainDashboard = () => {
  const { isOpen, toggleDropdown, dropdownRef } = useDropdown();
  const [filters, setFilters] = useState({ priority: "all" });

  const setPriorityFilter = (priority) => {
    setFilters({ priority }); // ✅ Establecemos el filtro de prioridad
    toggleDropdown();
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
            <div className="relative">
              <button
                onClick={toggleDropdown}
                className="flex items-center space-x-2 px-4 py-2 border rounded-lg shadow-sm hover:bg-gray-100"
              >
                <FaFilter />
                <span>Filtrar</span>
              </button>
              <DropdownFilter isOpen={isOpen} setPriorityFilter={setPriorityFilter} dropdownRef={dropdownRef} />
            </div>

            <button className="flex items-center space-x-2 px-4 py-2 border rounded-lg shadow-sm hover:bg-gray-100">
              <FaCalendarAlt />
              <span>Hoy</span>
            </button>
          </div>

          <div className="flex space-x-3">
            <button className="flex items-center space-x-2 px-4 py-2 border rounded-lg shadow-sm hover:bg-gray-100">
              <FaShareAlt /> <span>Compartir</span>
            </button>
            <button className="flex items-center space-x-2 px-4 py-2 bg-blue-500 text-white rounded-lg shadow-sm hover:bg-blue-600">
              <IoMdSave /> <span>Guardar</span>
            </button>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto mt-32 p-6">
        <KanbanBoard filters={filters} />
      </div>
    </div>
  );
};

export default MainDashboard;
