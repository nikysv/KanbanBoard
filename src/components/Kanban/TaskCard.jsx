import dayjs from "dayjs"; // Manejo de fechas en JS
import relativeTime from "dayjs/plugin/relativeTime"; // Para calcular tiempos relativos
import "dayjs/locale/es"; // Español
import TrashIcon from "../icons/trash";
import { useCallback, useState } from "react";
import FileModal from "./FileModal";
import UserInitials from "./UserInitials";

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
  const [showFileModal, setShowFileModal] = useState(false);

  // Función para calcular la prioridad basada en la fecha
  const getPriorityInfo = () => {
    if (!task.dueDate)
      return { text: "Sin fecha", color: "bg-gray-200/60 text-gray-600" };

    const today = dayjs();
    const dueDate = dayjs(task.dueDate);
    const diffDays = dueDate.diff(today, "day");

    if (diffDays < 0)
      return {
        text: "Alta",
        color: "bg-red-500/30 text-red-700",
        icon: "🔥",
      };
    if (diffDays === 0)
      return {
        text: "Alta",
        color: "bg-red-500/30 text-red-700",
        icon: "⚡",
      };
    if (diffDays <= 3)
      return {
        text: "Media",
        color: "bg-yellow-500/30 text-yellow-700",
        icon: "⚠️",
      };
    return {
      text: "Baja",
      color: "bg-green-500/30 text-green-700",
      icon: "✓",
    };
  };

  // Función para calcular el color de la fecha
  const getDateBadgeColor = () => {
    if (task.isCompleted) return "bg-green-200 text-green-800";
    if (!task.dueDate) return "bg-gray-300";

    const today = dayjs();
    const dueDate = dayjs(task.dueDate);
    const diffDays = dueDate.diff(today, "day");
    const overdueDays = today.diff(dueDate, "day");

    if (diffDays >= 5) return "bg-green-300 text-green-800";
    if (diffDays >= 3) return "bg-orange-300 text-orange-800";
    if (diffDays >= 0) return "bg-red-400 text-white";
    if (overdueDays <= 2) return "bg-red-500 text-white";
    return "bg-gray-300 text-gray-800";
  };

  const isOverdue = dayjs(task.dueDate).isBefore(dayjs(), "day");
  const overdueDays = dayjs().diff(dayjs(task.dueDate), "day");
  const priority = getPriorityInfo();

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

  const handleFilesClick = useCallback((e) => {
    e.stopPropagation();
    setShowFileModal(true);
  }, []);

  return (
    <>
      <div
        className={`bg-white p-2 rounded-lg shadow-md border border-gray-200 flex flex-col gap-1.5 cursor-pointer hover:bg-gray-100 w-full ${
          task.isCompleted ? "bg-green-100 border-green-300" : ""
        }`}
        onClick={() => onView(task)}
      >
        {/* Fecha con advertencia de retraso */}
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

        {/* Etiqueta de prioridad */}
        <div className="flex items-center gap-1">
          <span
            className={`text-xs font-semibold px-2 py-0.5 rounded-md ${priority.color}`}
          >
            {priority.icon} Prioridad {priority.text}
          </span>
        </div>

        {/* Progreso del checklist */}
        {task.checklist && task.checklist.length > 0 && (
          <div className="flex items-center gap-2 mt-1">
            <div className="flex-1 h-1.5 bg-gray-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-blue-500 transition-all duration-300"
                style={{
                  width: `${Math.round(
                    (task.checklist.filter((item) => item.completed).length /
                      task.checklist.length) *
                      100
                  )}%`,
                }}
              />
            </div>
            <span className="text-xs text-gray-500">
              {task.checklist.filter((item) => item.completed).length}/
              {task.checklist.length}
            </span>
          </div>
        )}

        {/* Íconos de usuarios, comentarios y adjuntos */}
        <div className="flex items-center justify-between mt-1">
          {/* Avatares de responsables */}
          <div className="flex -space-x-1.5 overflow-hidden">
            {task.assignees && task.assignees.length > 0 ? (
              <>
                {task.assignees.slice(0, 3).map((assignee, index) => (
                  <div
                    key={index}
                    className="border-2 border-white rounded-full"
                  >
                    <UserInitials name={assignee} size="small" />
                  </div>
                ))}
                {task.assignees.length > 3 && (
                  <div className="w-6 h-6 flex items-center justify-center bg-gray-200 rounded-full border-2 border-white text-xs font-medium text-gray-600">
                    +{task.assignees.length - 3}
                  </div>
                )}
              </>
            ) : (
              <div className="w-6 h-6 flex items-center justify-center bg-gray-100 rounded-full text-xs text-gray-400">
                <UserInitials name="Sin Asignar" size="small" />
              </div>
            )}
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
            <button
              className="text-gray-500 hover:text-gray-700 p-1 rounded-full hover:bg-gray-100 relative"
              onClick={handleFilesClick}
            >
              📂
              {task.files?.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-blue-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
                  {task.files.length}
                </span>
              )}
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

      <FileModal
        isOpen={showFileModal}
        onClose={() => setShowFileModal(false)}
        task={task}
      />
    </>
  );
};

export default TaskCard;
