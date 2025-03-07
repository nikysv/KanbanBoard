import React from "react";
import dayjs from "dayjs";

export const getPriorityLevel = (dueDate, isCompleted) => {
  if (isCompleted) return "completed";
  if (!dueDate) return "noDate";

  const today = dayjs();
  const dueDateObj = dayjs(dueDate);
  const diffDays = dueDateObj.diff(today, "day");

  if (diffDays < 0) return "high"; // Ya venció
  if (diffDays <= 1) return "high"; // Vence hoy o mañana
  if (diffDays <= 3) return "medium"; // 2-3 días
  return "low"; // Más de 3 días
};

const TaskPriority = ({ dueDate, isCompleted }) => {
  const priorityMap = {
    high: {
      text: "Alta",
      color: "bg-red-500 text-white",
      icon: "🔥",
    },
    medium: {
      text: "Media",
      color: "bg-orange-400 text-white",
      icon: "⚠️",
    },
    low: {
      text: "Baja",
      color: "bg-green-500 text-white",
      icon: "✓",
    },
    completed: {
      text: "Completada",
      color: "bg-green-700 text-white",
      icon: "✔️",
    },
    noDate: {
      text: "Sin fecha",
      color: "bg-gray-400 text-white",
      icon: "📅",
    },
  };

  const priorityKey = getPriorityLevel(dueDate, isCompleted);
  const priority = priorityMap[priorityKey];

  return (
    <span
      className={`text-xs font-semibold px-2 py-1 rounded-md inline-flex items-center gap-1 ${priority.color}`}
    >
      {priority.icon} {priority.text}
    </span>
  );
};

export default TaskPriority;
