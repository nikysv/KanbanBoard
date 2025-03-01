import dayjs from "dayjs"; // Manejo de fechas en JS
import relativeTime from "dayjs/plugin/relativeTime"; // Para calcular tiempos relativos
import "dayjs/locale/es"; // Español
import TrashIcon from "../icons/trash";
import { useCallback, useState } from "react";

dayjs.extend(relativeTime);
dayjs.locale("es");

const DeleteConfirmationModal = ({ isOpen, onClose, onConfirm, taskTitle }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-96">
        <h3 className="text-lg font-semibold mb-4">Confirmar eliminación</h3>
        <p className="text-gray-600 mb-6">
          ¿Estás seguro de que deseas eliminar la tarea "{taskTitle}"? Esta
          acción no se puede deshacer.
        </p>
        <div className="flex justify-end gap-2">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-300 rounded-md hover:bg-gray-400"
          >
            Cancelar
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600"
          >
            Eliminar
          </button>
        </div>
      </div>
    </div>
  );
};

const TaskCard = ({ task, onView, onDelete, onOpenComments }) => {
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  // Función para calcular el color de la fecha
  const getDateBadgeColor = () => {
    if (task.isCompleted) return "bg-green-200 text-green-800"; // Si está completada, verde suave
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

  const handleDeleteClick = useCallback((e) => {
    e.stopPropagation();
    setShowDeleteModal(true);
  }, []);

  const handleConfirmDelete = useCallback(
    (e) => {
      if (e) e.stopPropagation();
      onDelete(task.id);
      setShowDeleteModal(false);
    },
    [onDelete, task.id]
  );

  const handleCancelDelete = useCallback((e) => {
    if (e) e.stopPropagation();
    setShowDeleteModal(false);
  }, []);

  const handleCommentsClick = useCallback(
    (e) => {
      e.stopPropagation();
      onOpenComments(task);
    },
    [onOpenComments, task]
  );

  return (
    <>
      <div
        className={`bg-white p-2 rounded-lg shadow-md border border-gray-200 flex flex-col gap-1.5 cursor-pointer hover:bg-gray-100 w-full ${
          task.isCompleted ? "bg-green-100 border-green-300" : ""
        }`}
        onClick={() => onView(task)}
      >
        {/* 📍 Fecha con advertencia de retraso */}
        <div className="flex items-center flex-wrap gap-1">
          <div
            className={`text-xs font-semibold px-2 py-1 rounded-md ${getDateBadgeColor()}`}
          >
            {task.dueDate
              ? dayjs(task.dueDate).format("DD MMM").toUpperCase()
              : "SIN FECHA"}
          </div>
          {isOverdue && !task.isCompleted && (
            <span className="text-red-500 text-xs font-bold whitespace-nowrap">
              ⚠ {overdueDays > 2 ? "Vencida" : "Con retraso!"}
            </span>
          )}
          {task.isCompleted && (
            <span className="text-green-800 text-xs font-bold whitespace-nowrap">
              ✔ Completada
            </span>
          )}
        </div>

        {/* Título de la tarea */}
        <h3
          className={`text-sm font-semibold break-words line-clamp-1 ${
            task.isCompleted ? "text-green-800 line-through" : "text-gray-900"
          }`}
        >
          {task.title}
        </h3>

        {/* Íconos de usuarios, comentarios y adjuntos */}
        <div className="flex items-center justify-between mt-1">
          {/* Avatares */}
          <div className="flex -space-x-1.5 overflow-hidden">
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

          {/* Acciones */}
          <div className="flex items-center gap-2 ml-2">
            <button
              className="text-gray-500 hover:text-gray-700 p-1 rounded-full hover:bg-gray-100 relative"
              onClick={handleCommentsClick}
            >
              💬
              {task.comments?.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-blue-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
                  {task.comments.length}
                </span>
              )}
            </button>
            <button className="text-gray-500 hover:text-gray-700 p-1 rounded-full hover:bg-gray-100">
              📂
            </button>
            <button
              className="text-red-500 hover:text-red-700 p-1 rounded-full hover:bg-gray-100"
              onClick={handleDeleteClick}
            >
              <TrashIcon size={16} />
            </button>
          </div>
        </div>
      </div>

      <DeleteConfirmationModal
        isOpen={showDeleteModal}
        onClose={handleCancelDelete}
        onConfirm={handleConfirmDelete}
        taskTitle={task.title}
      />
    </>
  );
};

export default TaskCard;
