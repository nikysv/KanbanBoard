import dayjs from "dayjs"; // Manejo de fechas en JS
import relativeTime from "dayjs/plugin/relativeTime"; // Para calcular tiempos relativos
import "dayjs/locale/es"; // Español
import TrashIcon from "../icons/trash";
import { useCallback, useState, useRef, useEffect } from "react";
import { createPortal } from "react-dom";

dayjs.extend(relativeTime);
dayjs.locale("es");

const TaskCard = ({ task, onView, onDelete }) => {
  const [showActions, setShowActions] = useState(false);
  const [menuPosition, setMenuPosition] = useState({ top: 0, left: 0 });
  const buttonRef = useRef(null);

  const handleActionsClick = useCallback(
    (e) => {
      e.stopPropagation();
      const rect = e.currentTarget.getBoundingClientRect();
      setMenuPosition({
        top: rect.bottom + window.scrollY,
        left: rect.right - 192, // 48px (menu width) from the right edge
      });
      setShowActions(!showActions);
    },
    [showActions]
  );

  // Cerrar el menú cuando se hace clic fuera
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (buttonRef.current && !buttonRef.current.contains(event.target)) {
        setShowActions(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Función para calcular el color de la fecha
  const getDateBadgeColor = () => {
    // Si la tarea está completada, retorna verde oscuro
    if (task.isCompleted) return "bg-green-600 text-white";

    if (!task.dueDate) return "bg-gray-300"; // Si no hay fecha, gris

    const today = dayjs();
    const dueDate = dayjs(task.dueDate);
    const diffDays = dueDate.diff(today, "day");
    const overdueDays = today.diff(dueDate, "day"); // Días de retraso

    if (diffDays >= 5) return "bg-green-300 text-green-800"; // 📍 Más de una semana → Verde
    if (diffDays >= 3) return "bg-orange-300 text-orange-800"; // 📍 3-4 días → Naranja
    if (diffDays >= 0) return "bg-red-400 text-white"; // 📍 Hoy → Rojo
    if (overdueDays <= 2) return "bg-red-500 text-white"; // 📍 Retrasado hasta 2 días → Rojo fuerte
    return "bg-gray-300 text-gray-800"; // 📍 Más de 2 días de retraso → Gris
  };

  const isOverdue = dayjs(task.dueDate).isBefore(dayjs(), "day");
  const overdueDays = dayjs().diff(dayjs(task.dueDate), "day");

  const handleDelete = useCallback(
    (e) => {
      e.stopPropagation();
      onDelete(task.id);
    },
    [onDelete, task.id]
  );

  const handleView = useCallback(() => {
    onView(task);
  }, [onView, task]);

  return (
    <div
      className="bg-white px-3 py-4 rounded-lg shadow-md border border-gray-200 flex flex-col gap-2.5 cursor-pointer hover:bg-gray-100"
      onClick={handleView}
    >
      {/* 📍 Fecha con advertencia de retraso */}
      <div className="flex items-center gap-2">
        <div
          className={`text-xs font-semibold px-2.5 py-1.5 rounded-md w-fit ${getDateBadgeColor()}`}
        >
          {task.dueDate
            ? dayjs(task.dueDate).format("DD MMM").toUpperCase()
            : "SIN FECHA"}
        </div>
        {task.isCompleted && (
          <span className="text-green-600 text-xs font-bold">✔ Completada</span>
        )}
        {isOverdue && !task.isCompleted && (
          <span className="text-red-500 text-xs font-bold">
            ⚠ {overdueDays > 2 ? "Vencida" : "Con retraso!"}
          </span>
        )}
      </div>

      {/* Título de la tarea */}
      <h3 className="text-md font-semibold text-gray-900 px-3">{task.title}</h3>

      {/* Íconos de usuarios, comentarios y adjuntos (simulados) */}
      <div className="flex items-center justify-between px-3">
        {/* Simulación de avatares */}
        <div className="flex -space-x-1">
          <img
            className="w-6 h-6 rounded-full border-2 border-white"
            src="https://i.pravatar.cc/30?img=1"
            alt="user1"
          />
          <img
            className="w-6 h-6 rounded-full border-2 border-white"
            src="https://i.pravatar.cc/30?img=2"
            alt="user2"
          />
          <img
            className="w-6 h-6 rounded-full border-2 border-white"
            src="https://i.pravatar.cc/30?img=3"
            alt="user3"
          />
        </div>

        {/* Menú de acciones */}
        <div className="relative">
          <button
            ref={buttonRef}
            className="p-1 hover:bg-gray-100 rounded-full"
            onClick={handleActionsClick}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-5 h-5 text-gray-500"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 6.75a.75.75 0 110-1.5.75.75 0 010 1.5zM12 12.75a.75.75 0 110-1.5.75.75 0 010 1.5zM12 18.75a.75.75 0 110-1.5.75.75 0 010 1.5z"
              />
            </svg>
          </button>

          {showActions &&
            createPortal(
              <div
                className="fixed bg-white rounded-md shadow-lg z-50 border border-gray-200 w-48"
                style={{
                  top: `${menuPosition.top}px`,
                  left: `${menuPosition.left}px`,
                }}
              >
                <div className="py-1">
                  <button className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full">
                    <span className="mr-2">💬</span>
                    Comentarios
                  </button>
                  <button className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full">
                    <span className="mr-2">📂</span>
                    Adjuntos
                  </button>
                  <button
                    className="flex items-center px-4 py-2 text-sm text-red-600 hover:bg-gray-100 w-full"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDelete(e);
                      setShowActions(false);
                    }}
                  >
                    <TrashIcon size={16} className="mr-2" />
                    Eliminar
                  </button>
                </div>
              </div>,
              document.body
            )}
        </div>
      </div>
    </div>
  );
};

export default TaskCard;
