import React from "react";

const DropdownFilter = ({ isOpen, setPriorityFilter, dropdownRef }) => {
  if (!isOpen) return null;

  return (
    <div
      ref={dropdownRef}
      className="absolute mt-2 bg-white border rounded-lg shadow-lg w-48 z-20"
    >
      <p className="text-sm font-medium p-3 border-b bg-gray-100">Filtrar por prioridad:</p>
      
      {/* Opción para mostrar todas las tareas */}
      <button
        onClick={() => setPriorityFilter("all")} // ✅ Quita el filtro
        className="block w-full text-left px-4 py-2 hover:bg-gray-100 text-gray-700 font-semibold"
      >
        Mostrar todas
      </button>

      <button
        onClick={() => setPriorityFilter("high")}
        className="block w-full text-left px-4 py-2 hover:bg-red-100 text-red-600"
      >
        Alta
      </button>
      <button
        onClick={() => setPriorityFilter("medium")}
        className="block w-full text-left px-4 py-2 hover:bg-yellow-100 text-yellow-600"
      >
        Media
      </button>
      <button
        onClick={() => setPriorityFilter("low")}
        className="block w-full text-left px-4 py-2 hover:bg-green-100 text-green-600"
      >
        Baja
      </button>
    </div>
  );
};

export default DropdownFilter;
