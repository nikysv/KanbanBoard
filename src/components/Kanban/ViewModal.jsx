import { useState, useEffect } from "react";
import dayjs from "dayjs";

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

  // Sincronizar el modal con la tarea cuando se abre
  useEffect(() => {
    setTitle(task.title);
    setDescription(task.description || "");
    setDueDate(task.dueDate || "");
    setFiles(task.files || []);
    setIsCompleted(task.isCompleted || false);
    setComments(task.comments || []);
  }, [task]);

  // Manejar archivos adjuntos
  const handleFileChange = (event) => {
    setFiles([...files, ...event.target.files]);
  };

  // Eliminar un archivo adjunto antes de guardar
  const removeFile = (index) => {
    setFiles(files.filter((_, i) => i !== index));
  };

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
      avatar: "https://i.pravatar.cc/30?img=8", // Avatar diferente para el sistema
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
      author: "Usuario",
      createdAt: dayjs().format("YYYY-MM-DD HH:mm:ss"),
      avatar: "https://i.pravatar.cc/30?img=1",
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
                    <img
                      src={comment.avatar}
                      alt={comment.author}
                      className="w-8 h-8 rounded-full"
                    />
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
              <img
                src="https://i.pravatar.cc/30?img=1"
                alt="Usuario actual"
                className="w-8 h-8 rounded-full"
              />
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
