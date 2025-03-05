import React from "react";
import dayjs from "dayjs";

const TaskPriority = ({ dueDate, setDueDate, isCompleted }) => {
  const getPriorityInfo = () => {
    if (isCompleted) {
      return {
        text: "Completada",
        color: "bg-green-700/20 text-green-800",
        icon: "✓",
      };
    }

    if (!dueDate) {
      return { text: "Sin fecha", color: "bg-gray-200/60 text-gray-600" };
    }

    const today = dayjs();
    const dueDateObj = dayjs(dueDate);
    const diffDays = dueDateObj.diff(today, "day");

    if (diffDays < 0)
      return { text: "Alta", color: "bg-red-500/30 text-red-700", icon: "🔥" };
    if (diffDays === 0)
      return { text: "Alta", color: "bg-red-500/30 text-red-700", icon: "⚡" };
    if (diffDays <= 3)
      return {
        text: "Media",
        color: "bg-yellow-500/30 text-yellow-700",
        icon: "⚠️",
      };
    return { text: "Baja", color: "bg-green-500/30 text-green-700", icon: "✓" };
  };

  const priority = getPriorityInfo();

  return (
    <div className="space-y-2">
      {/* Campo de fecha */}
      <div>
        <label className="block text-sm font-medium mb-1">Fecha límite</label>
        <input
          type="date"
          value={dueDate || ""}
          onChange={(e) => !isCompleted && setDueDate(e.target.value)}
          disabled={isCompleted}
          className={`w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
            isCompleted ? "bg-green-50 text-green-800 cursor-not-allowed" : ""
          }`}
        />
      </div>

      {/* Indicador de prioridad */}
      <div>
        <label className="block text-sm font-medium mb-1">
          {isCompleted ? "Estado" : "Prioridad (automática)"}
        </label>
        <div
          className={`inline-flex items-center px-3 py-1 rounded-md ${priority.color}`}
        >
          <span className="mr-1">{priority.icon}</span>
          <span className="font-medium">{priority.text}</span>
        </div>
      </div>
    </div>
  );
};

export default TaskPriority;
