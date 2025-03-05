import { useState } from "react";
import { FaFilter, FaCalendarAlt, FaShareAlt } from "react-icons/fa";
import { IoMdSave } from "react-icons/io";
import KanbanBoard from "../Columns/Columns";

const MainDashboard = ({
  siteName = "Mi Sitio",
  siteID = "ID-001",
  status = "Activo",
  users = [],
}) => {
  const [selectedDate, setSelectedDate] = useState("Today");

  return (
    <div className="p-6 space-y-6">
      {/* Encabezado del sitio */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">{siteName}</h1>
          <p className="text-gray-500">ID: {siteID}</p>
        </div>
        <div className="flex items-center space-x-2">
          <span className="inline-block w-3 h-3 rounded-full bg-green-500"></span>
          <span className="text-green-600 font-medium">{status}</span>
        </div>
      </div>

      {/* Controles y filtros */}
      <div className="flex justify-between items-center">
        <div className="flex space-x-3">
          <button className="flex items-center space-x-2 px-4 py-2 border rounded-lg shadow-sm hover:bg-gray-100">
            <FaFilter /> <span>Filter</span>
          </button>
          <button className="flex items-center space-x-2 px-4 py-2 border rounded-lg shadow-sm hover:bg-gray-100">
            <FaCalendarAlt /> <span>{selectedDate}</span>
          </button>
        </div>

        {/* Participantes */}
        {users.length > 0 && (
          <div className="flex items-center space-x-2">
            {users.slice(0, 4).map((user, index) => (
              <img
                key={index}
                src={user.avatar}
                alt={user.name}
                className="w-8 h-8 rounded-full border-2 border-white"
              />
            ))}
            {users.length > 4 && (
              <div className="w-8 h-8 flex items-center justify-center bg-gray-300 rounded-full border-2 border-white text-xs">
                +{users.length - 4}
              </div>
            )}
            <button className="text-blue-500 font-medium">Invite</button>
          </div>
        )}
      </div>

      {/* Botones de acción */}
      <div className="flex justify-end space-x-3">
        <button className="flex items-center space-x-2 px-4 py-2 border rounded-lg shadow-sm hover:bg-gray-100">
          <FaShareAlt /> <span>Share</span>
        </button>
        <button className="flex items-center space-x-2 px-4 py-2 bg-blue-500 text-white rounded-lg shadow-sm hover:bg-blue-600">
          <IoMdSave /> <span>Save</span>
        </button>
      </div>

      {/* Tablero Kanban */}
      <KanbanBoard />
    </div>
  );
};

export default MainDashboard;
