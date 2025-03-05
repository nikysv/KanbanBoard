import React from "react";
import dayjs from "dayjs";

// Función para determinar la prioridad según la fecha
export const getPriorityLevel = (dueDate) => {
  if (!dueDate) return "low"; // Sin fecha -> Baja prioridad

  const today = dayjs();
  const dueDateObj = dayjs(dueDate);
  const diffDays = dueDateObj.diff(today, "day");

  if (diffDays < 0) return "high"; // Vencida -> Alta
  if (diffDays <= 1) return "high"; // Hoy -> Alta
  if (diffDays >= 2 && diffDays <= 3) return "medium"; // 1-3 días -> Media
  return "low"; // Más de 3 días -> Baja
};

// Componente de prioridad con edición de fecha opcional (solo en ViewModal)
const TaskPriority = ({ dueDate, setDueDate, isCompleted }) => {
  const priorityMap = {
    high: { text: "Alta", color: "bg-red-500/30 text-red-700", icon: "🔥" },
    medium: { text: "Media", color: "bg-yellow-500/30 text-yellow-700", icon: "⚠️" },
    low: { text: "Baja", color: "bg-green-500/30 text-green-700", icon: "✓" },
    completed: { text: "Completada", color: "bg-green-700/20 text-green-800", icon: "✔" },
    noDate: { text: "Sin fecha", color: "bg-gray-200/60 text-gray-600" },
  };

  const priorityKey = isCompleted ? "completed" : getPriorityLevel(dueDate);
  const priority = priorityMap[priorityKey] || priorityMap.noDate;

  return (
    <div className="flex flex-col gap-1">
      {/* ✅ Solo mostramos la opción de cambiar fecha si `setDueDate` está definido */}
      {setDueDate && (
        <input
          type="date"
          value={dueDate || ""}
          onChange={(e) => !isCompleted && setDueDate(e.target.value)}
          disabled={isCompleted}
          className={`w-full p-2 border rounded-md text-xs focus:outline-none focus:ring-2 focus:ring-blue-500 ${
            isCompleted ? "bg-green-50 text-green-800 cursor-not-allowed" : ""
          }`}
        />
      )}
      {/* ✅ Solo se muestra la prioridad */}
      <span className={`text-xs font-semibold px-2 py-0.2 rounded-md ${priority.color}`}>
        {priority.icon} {priority.text}
      </span>
    </div>
  );
};

export default TaskPriority;
