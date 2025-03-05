import dayjs from "dayjs"; // Manejo de fechas en JS
import relativeTime from "dayjs/plugin/relativeTime"; // Para calcular tiempos relativos
import "dayjs/locale/es"; // Español
import TrashIcon from "../../icons/trash";
import { useCallback, useState } from "react";
import UserInitials from "./UserInitials";
import FilePreviewModal from "../Files/FilePreviewModal";
import TaskPriority from "./TaskPriority";
import DeleteConfirmationModal from "../Modals/DeleteConfirmationModal";
import TaskComments from "./TaskCommentss";

dayjs.extend(relativeTime);
dayjs.locale("es");

const TaskCard = ({ task, onView, onDelete, onOpenComments }) => {
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showFilePreviewModal, setShowFilePreviewModal] = useState(false);
  const [showCommentModal, setShowCommentModal] = useState(false);
  const [newComment, setNewComment] = useState("");

  // ✅ Función para calcular el color de la fecha
  const getDateBadgeColor = () => {
    if (task.isCompleted) return "bg-green-600 text-slate-200";
    if (!task.dueDate) return "bg-gray-300";

    const today = dayjs();
    const dueDate = dayjs(task.dueDate);
    const diffDays = dueDate.diff(today, "day");
    const overdueDays = today.diff(dueDate, "day");

    if (diffDays >= 4) return "bg-green-300 text-green-800";
    if (diffDays >= 2) return "bg-orange-300 text-orange-800";
    if (diffDays >= 0) return "bg-red-400 text-white";
    if (overdueDays <= 2) return "bg-red-500 text-white";
    return "bg-gray-300 text-gray-800";
  };

  const isOverdue =
    !task.isCompleted && dayjs(task.dueDate).isBefore(dayjs(), "day");
  const overdueDays = dayjs().diff(dayjs(task.dueDate), "day");

  // ✅ Restauramos las funciones originales
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

  const handleCommentsClick = useCallback((e) => {
    e.stopPropagation();
    setShowCommentModal(true);
  }, []);

  const handleFilesClick = useCallback((e) => {
    e.stopPropagation();
    setShowFilePreviewModal(true);
  }, []);

  const handleAddComment = (commentText) => {
    const updatedTask = {
      ...task,
      comments: [
        ...(task.comments || []),
        {
          id: Date.now().toString(),
          text: commentText,
          author: "Usuario",
          timestamp: new Date().toISOString(),
        },
      ],
    };
    onOpenComments(updatedTask);
    setShowCommentModal(false);
  };

  return (
    <>
      <div
        className={`bg-white p-2 rounded-lg shadow-md border border-gray-200 flex flex-col gap-1.5 cursor-pointer hover:bg-gray-100 w-full ${
          task.isCompleted ? "bg-green-100 border-green-300" : ""
        }`}
        onClick={() => onView(task)}
      >
        {/* ✅ Fecha con advertencia de retraso */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1">
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
        </div>

        {/* ✅ Título de la tarea */}
        <h3
          className={`text-sm font-semibold break-words ${
            task.isCompleted ? "text-green-800 line-through" : "text-gray-900"
          }`}
        >
          {task.title}
        </h3>

        {/* ✅ MOVEMOS LA PRIORIDAD DEBAJO DEL TÍTULO Y AJUSTAMOS SU ANCHO */}
        <div className="flex justify-start mt-1">
          <TaskPriority dueDate={task.dueDate} isCompleted={task.isCompleted} />
        </div>

        {/* ✅ Acciones */}
        <div className="flex items-center justify-between mt-1">
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

          {/* Botones */}
          <div className="flex items-center gap-2 ml-2">
            {/* ✅ Restauramos el contador de comentarios */}
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
              {task.files && task.files.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-blue-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
                  {task.files.length}
                </span>
              )}
            </button>

            <button
              className="text-red-500 hover:text-red-700 p-1 rounded-full hover:bg-gray-100"
              onClick={(e) => {
                e.stopPropagation();
                setShowDeleteModal(true); // ✅ Muestra el modal en lugar de eliminar directamente
              }}
            >
              <TrashIcon size={16} />
            </button>
          </div>
        </div>
      </div>

      {/* ✅ Modales */}
      <DeleteConfirmationModal
        isOpen={showDeleteModal}
        onClose={handleCancelDelete}
        onConfirm={handleConfirmDelete}
        taskTitle={task.title}
      />

      <FilePreviewModal
        isOpen={showFilePreviewModal}
        onClose={() => setShowFilePreviewModal(false)}
        files={task.files || []}
      />

      {/* ✅ Modal de comentarios restaurado */}
      {showCommentModal && (
        <div
          className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50"
          onClick={(e) => {
            if (e.target === e.currentTarget) setShowCommentModal(false);
          }}
        >
          <div
            className="bg-white rounded-lg shadow-lg w-[400px] max-h-[80vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="sticky top-0 bg-white px-4 py-3 border-b flex justify-between items-center">
              <h3 className="font-semibold">Comentarios</h3>
              <button
                onClick={() => setShowCommentModal(false)}
                className="p-1 hover:bg-gray-100 rounded-full"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>
            <div className="p-4">
              <TaskComments
                comments={task.comments || []}
                onAddComment={handleAddComment} // ✅ Ahora los comentarios se sincronizan correctamente
                newComment={newComment}
                setNewComment={setNewComment}
              />
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default TaskCard;
