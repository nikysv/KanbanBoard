import { useState, useEffect } from "react";
import dayjs from "dayjs";
import UserInitials from "./UserInitials";

const ViewModal = ({ isOpen, onClose, task, onSave, onComplete }) => {
  if (!isOpen || !task) return null;

  // Estado para los datos de la tarea
  const [title, setTitle] = useState(task.title);
  const [description, setDescription] = useState(task.description || "");
  const [dueDate, setDueDate] = useState(task.dueDate || "");
  const [files, setFiles] = useState([]);
  const [isCompleted, setIsCompleted] = useState(task.isCompleted || false);
  const [newComment, setNewComment] = useState("");
  const [comments, setComments] = useState(task.comments || []);
  const [assignees, setAssignees] = useState(task.assignees || []);
  const [newAssignee, setNewAssignee] = useState("");
  const [checklist, setChecklist] = useState(task.checklist || []);
  const [newChecklistItem, setNewChecklistItem] = useState("");

  // Sincronizar el modal con la tarea cuando se abre
  useEffect(() => {
    setTitle(task.title);
    setDescription(task.description || "");
    setDueDate(task.dueDate || "");
    setFiles(task.files || []);
    setIsCompleted(task.isCompleted || false);
    setComments(task.comments || []);
    setAssignees(task.assignees || []);
    setChecklist(task.checklist || []);
  }, [task]);

  // Manejar archivos adjuntos
  const handleFileChange = (event) => {
    const newFiles = Array.from(event.target.files).map((file) => ({
      name: file.name,
      size: file.size,
      type: file.type,
      uploadedBy: "Usuario", // Esto podría venir del sistema de autenticación
      uploadedAt: dayjs().format("YYYY-MM-DD HH:mm:ss"),
      file: file, // El archivo en sí
    }));
    setFiles([...files, ...newFiles]);
  };

  // Eliminar un archivo adjunto antes de guardar
  const removeFile = (index) => {
    setFiles(files.filter((_, i) => i !== index));
  };

  // Manejar la asignación de usuarios
  const handleAddAssignee = () => {
    if (!newAssignee.trim()) return;
    if (!assignees.includes(newAssignee.trim())) {
      setAssignees([...assignees, newAssignee.trim()]);

      // Agregar comentario automático sobre la asignación
      const assignmentComment = {
        id: Date.now().toString(),
        text: `👤 Se asignó a ${newAssignee.trim()}`,
        author: "Sistema",
        createdAt: dayjs().format("YYYY-MM-DD HH:mm:ss"),
        isSystemComment: true,
      };
      setComments([...comments, assignmentComment]);
    }
    setNewAssignee("");
  };

  const handleRemoveAssignee = (assignee) => {
    setAssignees(assignees.filter((a) => a !== assignee));

    // Agregar comentario automático sobre la eliminación
    const unassignmentComment = {
      id: Date.now().toString(),
      text: `🚫 Se eliminó la asignación de ${assignee}`,
      author: "Sistema",
      createdAt: dayjs().format("YYYY-MM-DD HH:mm:ss"),
      isSystemComment: true,
    };
    setComments([...comments, unassignmentComment]);
  };

  // Manejar checklist
  const handleAddChecklistItem = () => {
    if (!newChecklistItem.trim()) return;
    const newItem = {
      id: Date.now().toString(),
      text: newChecklistItem.trim(),
      completed: false,
      createdAt: dayjs().format("YYYY-MM-DD HH:mm:ss"),
    };
    setChecklist([...checklist, newItem]);
    setNewChecklistItem("");

    // Agregar comentario automático
    const checklistComment = {
      id: Date.now().toString(),
      text: `📋 Se agregó la subtarea: ${newChecklistItem.trim()}`,
      author: "Sistema",
      createdAt: dayjs().format("YYYY-MM-DD HH:mm:ss"),
      isSystemComment: true,
    };
    setComments([...comments, checklistComment]);
  };

  const handleToggleChecklistItem = (itemId) => {
    setChecklist(
      checklist.map((item) => {
        if (item.id === itemId) {
          const newStatus = !item.completed;
          // Agregar comentario automático
          const statusComment = {
            id: Date.now().toString(),
            text: `${newStatus ? "✅" : "🔄"} Subtarea "${
              item.text
            }" marcada como ${newStatus ? "completada" : "pendiente"}`,
            author: "Sistema",
            createdAt: dayjs().format("YYYY-MM-DD HH:mm:ss"),
            isSystemComment: true,
          };
          setComments([...comments, statusComment]);
          return { ...item, completed: newStatus };
        }
        return item;
      })
    );
  };

  const handleDeleteChecklistItem = (itemId) => {
    const item = checklist.find((i) => i.id === itemId);
    setChecklist(checklist.filter((i) => i.id !== itemId));

    // Agregar comentario automático
    const deleteComment = {
      id: Date.now().toString(),
      text: `🗑️ Se eliminó la subtarea: ${item.text}`,
      author: "Sistema",
      createdAt: dayjs().format("YYYY-MM-DD HH:mm:ss"),
      isSystemComment: true,
    };
    setComments([...comments, deleteComment]);
  };

  // Calcular progreso del checklist
  const checklistProgress =
    checklist.length > 0
      ? Math.round(
          (checklist.filter((item) => item.completed).length /
            checklist.length) *
            100
        )
      : 0;

  // Guardar cambios y sincronizar con la tarea
  const handleSave = () => {
    onSave({
      ...task,
      title,
      description,
      dueDate,
      files,
      isCompleted,
      comments,
      assignees,
      checklist,
    });
    onClose();
  };

  // Marcar tarea como completada o descompletada
  const handleToggleComplete = () => {
    const newStatus = !isCompleted;
    setIsCompleted(newStatus);
    if (newStatus) {
      onComplete(task.id, task.columnId);
    }

    // Agregar un comentario automático sobre el cambio de estado
    const statusComment = {
      id: Date.now().toString(),
      text: newStatus
        ? "✅ Tarea marcada como completada"
        : "🔄 Tarea reabierta para modificaciones",
      author: "Sistema",
      createdAt: dayjs().format("YYYY-MM-DD HH:mm:ss"),
      isSystemComment: true,
    };

    setComments([...comments, statusComment]);
  };

  // Manejar nuevo comentario
  const handleAddComment = () => {
    if (!newComment.trim()) return;

    const comment = {
      id: Date.now().toString(),
      text: newComment.trim(),
      author: "Usuario Actual",
      createdAt: dayjs().format("YYYY-MM-DD HH:mm:ss"),
    };

    const updatedComments = [...comments, comment];
    setComments(updatedComments);
    setNewComment("");
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleAddComment();
    }
  };

  // Función para calcular la prioridad basada en la fecha
  const getPriorityInfo = () => {
    if (!dueDate)
      return { text: "Sin fecha", color: "bg-gray-200/60 text-gray-600" };

    const today = dayjs();
    const dueDateObj = dayjs(dueDate);
    const diffDays = dueDateObj.diff(today, "day");

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

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white rounded-lg shadow-lg w-[600px] max-h-[90vh] flex flex-col">
        {/* Header con botón de cierre */}
        <div className="flex justify-end p-2">
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 p-1 rounded-full hover:bg-gray-100 transition-colors"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
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

        <div className="p-6 flex flex-col gap-4 overflow-y-auto">
          {/* Título */}
          <div>
            <label className="block text-sm font-medium mb-1">Título</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Prioridad */}
          {(() => {
            const priority = getPriorityInfo();
            return (
              <div className="flex items-center justify-between bg-gray-50 p-3 rounded-lg">
                <div>
                  <p className="text-sm font-medium text-gray-700 mb-1">
                    Prioridad de la tarea
                  </p>
                  <div className="flex items-center gap-2">
                    <span
                      className={`text-sm font-semibold px-2 py-0.5 rounded-md ${priority.color}`}
                    >
                      {priority.icon} {priority.text}
                    </span>
                    <span className="text-xs text-gray-500">
                      (Basada en la fecha límite)
                    </span>
                  </div>
                </div>
              </div>
            );
          })()}

          {/* Descripción */}
          <div>
            <label className="block text-sm font-medium mb-1">
              Descripción
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full p-2 border rounded-md h-24 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Añade una descripción..."
            />
          </div>

          {/* Checklist */}
          <div className="border-t pt-4">
            <div className="flex items-center justify-between mb-2">
              <label className="block text-sm font-medium">
                Subtareas ({checklist.filter((item) => item.completed).length}/
                {checklist.length})
              </label>
              {checklist.length > 0 && (
                <span className="text-sm text-gray-500">
                  {Math.round(
                    (checklist.filter((item) => item.completed).length /
                      checklist.length) *
                      100
                  )}
                  % completado
                </span>
              )}
            </div>

            {/* Barra de progreso */}
            {checklist.length > 0 && (
              <div className="flex items-center gap-2 mb-4">
                <div className="flex-1 h-1.5 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-blue-500 transition-all duration-300"
                    style={{
                      width: `${Math.round(
                        (checklist.filter((item) => item.completed).length /
                          checklist.length) *
                          100
                      )}%`,
                    }}
                  />
                </div>
              </div>
            )}

            {/* Lista de subtareas */}
            <div className="space-y-2 mb-3">
              {checklist.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center gap-2 p-2 bg-gray-50 rounded-md group"
                >
                  <input
                    type="checkbox"
                    checked={item.completed}
                    onChange={() => handleToggleChecklistItem(item.id)}
                    className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span
                    className={`flex-1 text-sm ${
                      item.completed
                        ? "line-through text-gray-500"
                        : "text-gray-700"
                    }`}
                  >
                    {item.text}
                  </span>
                  <button
                    onClick={() => handleDeleteChecklistItem(item.id)}
                    className="opacity-0 group-hover:opacity-100 text-red-500 hover:text-red-700 transition-opacity"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>

            {/* Input para nueva subtarea */}
            <div className="flex gap-2">
              <input
                type="text"
                value={newChecklistItem}
                onChange={(e) => setNewChecklistItem(e.target.value)}
                placeholder="Agregar nueva subtarea..."
                className="flex-1 p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                onKeyPress={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    handleAddChecklistItem();
                  }
                }}
              />
              <button
                onClick={handleAddChecklistItem}
                disabled={!newChecklistItem.trim()}
                className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Agregar
              </button>
            </div>
          </div>

          {/* Fecha Límite */}
          <div>
            <label className="block text-sm font-medium mb-1">
              Fecha Límite
            </label>
            <input
              type="date"
              value={dayjs(dueDate).format("YYYY-MM-DD")}
              onChange={(e) => setDueDate(e.target.value)}
              className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Estado de la Tarea */}
          <div className="flex items-center justify-between bg-gray-50 p-3 rounded-lg">
            <div>
              <p className="text-sm font-medium text-gray-700 mb-1">
                Estado de la tarea
              </p>
              <p
                className={`text-sm font-semibold ${
                  isCompleted ? "text-green-600" : "text-gray-500"
                }`}
              >
                {isCompleted ? "✔ Completada" : "📝 En proceso"}
              </p>
            </div>
            <button
              onClick={handleToggleComplete}
              className={`px-4 py-2 rounded-md text-white transition-colors ${
                isCompleted
                  ? "bg-yellow-500 hover:bg-yellow-600"
                  : "bg-green-500 hover:bg-green-600"
              }`}
            >
              {isCompleted ? "Reabrir tarea" : "Marcar completada"}
            </button>
          </div>

          {/* Adjuntar Archivos */}
          <div>
            <label className="block text-sm font-medium mb-1">
              Adjuntar Archivos
            </label>
            <input
              type="file"
              multiple
              onChange={handleFileChange}
              className="w-full p-2 border rounded-md"
            />
          </div>

          {/* Mostrar archivos adjuntados */}
          {files.length > 0 && (
            <div className="text-sm text-gray-600">
              <p className="font-medium mb-2">Archivos Adjuntos:</p>
              <ul className="space-y-1">
                {files.map((file, index) => (
                  <li
                    key={index}
                    className="flex justify-between items-center bg-gray-50 p-2 rounded"
                  >
                    <span>{file.name}</span>
                    <button
                      onClick={() => removeFile(index)}
                      className="text-red-500 hover:text-red-700 text-xs"
                    >
                      Eliminar
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Asignación de Usuarios */}
          <div className="border-t pt-4">
            <label className="block text-sm font-medium mb-2">
              Responsables de la tarea
            </label>

            {/* Lista de usuarios asignados */}
            <div className="flex flex-wrap gap-2 mb-3">
              {assignees.map((assignee) => (
                <div
                  key={assignee}
                  className="flex items-center gap-2 bg-gray-100 px-3 py-1.5 rounded-full"
                >
                  <UserInitials name={assignee} size="small" />
                  <span className="text-sm">{assignee}</span>
                  <button
                    onClick={() => handleRemoveAssignee(assignee)}
                    className="text-gray-500 hover:text-red-500"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>

            {/* Input para agregar usuarios */}
            <div className="flex gap-2">
              <input
                type="text"
                value={newAssignee}
                onChange={(e) => setNewAssignee(e.target.value)}
                placeholder="Nombre del responsable..."
                className="flex-1 p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                onKeyPress={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    handleAddAssignee();
                  }
                }}
              />
              <button
                onClick={handleAddAssignee}
                disabled={!newAssignee.trim()}
                className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Asignar
              </button>
            </div>
          </div>

          {/* Botones de acción */}
          <div className="flex justify-center gap-4 border-t pt-4">
            <button
              onClick={onClose}
              className="px-6 py-2 bg-gray-300 rounded-md hover:bg-gray-400 min-w-[120px]"
            >
              Cerrar
            </button>
            <button
              onClick={handleSave}
              className="px-6 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 min-w-[120px]"
            >
              Guardar Cambios
            </button>
          </div>

          {/* Sección de Comentarios */}
          <div className="border-t pt-4">
            <h3 className="text-lg font-semibold mb-4">Comentarios</h3>

            {/* Lista de comentarios */}
            <div className="space-y-4 max-h-[300px] overflow-y-auto mb-4">
              {comments.length === 0 ? (
                <p className="text-gray-500 text-center py-4">
                  No hay comentarios aún. ¡Sé el primero en comentar!
                </p>
              ) : (
                comments.map((comment) => (
                  <div
                    key={comment.id}
                    className="flex gap-3 bg-gray-50 p-3 rounded-lg"
                  >
                    <div className="flex-shrink-0">
                      <UserInitials name={comment.author} size="medium" />
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between items-start">
                        <h4 className="font-semibold text-sm">
                          {comment.author}
                        </h4>
                        <span className="text-xs text-gray-500">
                          {dayjs(comment.createdAt).format("DD/MM/YY HH:mm")}
                        </span>
                      </div>
                      <p className="text-sm text-gray-700 mt-1 whitespace-pre-wrap">
                        {comment.text}
                      </p>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Input para nuevo comentario */}
            <div className="flex gap-3">
              <div className="flex-shrink-0">
                <UserInitials name="Usuario Actual" size="medium" />
              </div>
              <div className="flex-1">
                <textarea
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Escribe un comentario..."
                  className="w-full p-2 border rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows="2"
                />
                <div className="flex justify-end mt-2">
                  <button
                    onClick={handleAddComment}
                    disabled={!newComment.trim()}
                    className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Comentar
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewModal;
