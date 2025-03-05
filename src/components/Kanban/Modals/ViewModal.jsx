import { useState, useEffect } from "react";
import useTaskModal from "../../../hooks/useTaskModal";
import TaskAssignees from "../Task/TaskAssignees";
import TaskChecklist from "../Task/TaskCheckList";
import TaskComments from "../Task/TaskCommentss";
import TaskPriority from "../Task/TaskPriority";
import useFileManager from "../../../hooks/useFileManager";
import FilePreviewModal from "../Files/FilePreviewModal";

const ViewModal = ({
  isOpen,
  onClose,
  task,
  onSave,
  onComplete,
  onOpenComments,
}) => {
  if (!isOpen || !task) return null;

  const {
    title,
    setTitle,
    description,
    setDescription,
    dueDate,
    setDueDate,
    isCompleted,
    setIsCompleted,
    comments,
    newComment,
    setNewComment,
    handleAddComment: originalHandleAddComment,
    checklist,
    newChecklistItem,
    setNewChecklistItem,
    handleToggleChecklistItem,
    handleAddChecklistItem,
    assignees,
    setAssignees,
    newAssignee,
    setNewAssignee,
    handleAddAssignee,
  } = useTaskModal(task);

  const [localFiles, setLocalFiles] = useState(task.files || []);
  const [showPreviewModal, setShowPreviewModal] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const { handleFileUpload, downloadFile } = useFileManager([]);

  // Resetear archivos locales cuando cambia la tarea
  useEffect(() => {
    setLocalFiles(task.files || []);
    setSelectedFile(null);
  }, [task.files]);

  const handleAddFiles = async (event) => {
    const newFiles = await handleFileUpload(event.target.files);
    setLocalFiles((prev) => [...prev, ...newFiles]);
  };

  const handleRemoveFile = (fileId) => {
    setLocalFiles((prev) => prev.filter((f) => f.id !== fileId));
  };

  const handleFileClick = (file) => {
    setSelectedFile(file);
    setShowPreviewModal(true);
  };

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
  };

  return (
    <>
      <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
        <div className="bg-white rounded-lg shadow-lg w-[600px] max-h-[90vh] overflow-y-auto relative">
          {/* Header con título y botón de cerrar */}
          <div className="sticky top-0 bg-white px-6 py-4 border-b flex justify-between items-center">
            <h2 className="text-xl font-bold">Editar Tarea</h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-full"
            >
              <svg
                className="w-6 h-6"
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

          {/* Contenido del modal */}
          <div className="p-6">
            {/* Estado de completado */}
            <div className="mb-4">
              <button
                onClick={() => setIsCompleted(!isCompleted)}
                className={`w-full py-2 px-4 rounded-md font-medium transition-colors ${
                  isCompleted
                    ? "bg-green-100 text-green-800 hover:bg-green-200 border border-green-300"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200 border border-gray-300"
                }`}
              >
                {isCompleted ? "✓ Tarea Completada" : "Marcar como completada"}
              </button>
            </div>

            {/* Título */}
            <div className="mb-4">
              <label className="block text-sm font-medium mb-1">Título</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className={`w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  isCompleted ? "line-through text-gray-500 bg-green-50" : ""
                }`}
              />
            </div>

            {/* Fecha y Prioridad */}
            <div className="mb-4">
              <TaskPriority
                dueDate={dueDate}
                setDueDate={setDueDate}
                isCompleted={isCompleted}
              />
            </div>

            {/* Descripción */}
            <div className="mb-4">
              <label className="block text-sm font-medium mb-1">
                Descripción
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className={`w-full p-2 border rounded-md h-24 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  isCompleted ? "text-gray-500 bg-green-50" : ""
                }`}
              />
            </div>

            {/* Checklist */}
            <div className="mb-4">
              <TaskChecklist
                checklist={checklist}
                handleToggleChecklistItem={handleToggleChecklistItem}
                newChecklistItem={newChecklistItem}
                setNewChecklistItem={setNewChecklistItem}
                handleAddChecklistItem={handleAddChecklistItem}
              />
            </div>

            {/* Archivos */}
            <div className="mb-4 border-t pt-4">
              <div className="flex justify-between items-center mb-2">
                <label className="text-sm font-medium">Archivos adjuntos</label>
                <input
                  type="file"
                  onChange={handleAddFiles}
                  multiple
                  className="block text-sm text-gray-500
                    file:mr-4 file:py-2 file:px-4
                    file:rounded-full file:border-0
                    file:text-sm file:font-semibold
                    file:bg-blue-50 file:text-blue-700
                    hover:file:bg-blue-100"
                />
              </div>
              <div className="bg-gray-50 p-3 rounded-lg">
                <div className="flex flex-col gap-2">
                  {localFiles.map((file) => (
                    <div
                      key={file.id}
                      className="flex items-center justify-between p-3 border rounded-lg hover:bg-white transition-colors"
                    >
                      <div
                        className="flex items-center gap-3 cursor-pointer flex-1 min-w-0"
                        onClick={() => handleFileClick(file)}
                      >
                        <span className="text-2xl flex-shrink-0">
                          {file.name.endsWith(".pdf")
                            ? "📄"
                            : file.name.match(/\.(doc|docx)$/)
                            ? "📝"
                            : file.name.match(/\.(xls|xlsx)$/)
                            ? "📊"
                            : file.name.match(/\.(ppt|pptx)$/)
                            ? "📽️"
                            : "📎"}
                        </span>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-900 truncate max-w-[300px]">
                            {file.name}
                          </p>
                          <p className="text-xs text-gray-500">
                            {(file.size / 1024).toFixed(2)} KB
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 flex-shrink-0">
                        <button
                          onClick={() => handleRemoveFile(file.id)}
                          className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-colors"
                          title="Eliminar archivo"
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
                              d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                            />
                          </svg>
                        </button>
                      </div>
                    </div>
                  ))}
                  {localFiles.length === 0 && (
                    <div className="text-center py-4 text-gray-500">
                      No hay archivos adjuntos
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Asignación de usuarios */}
            <div className="mb-4">
              <TaskAssignees
                assignees={assignees}
                setAssignees={setAssignees}
                newAssignee={newAssignee}
                setNewAssignee={setNewAssignee}
                handleAddAssignee={handleAddAssignee}
              />
            </div>

            {/* Comentarios */}
            <TaskComments
              comments={comments}
              onAddComment={handleAddComment}
              newComment={newComment}
              setNewComment={setNewComment}
            />
          </div>

          {/* Footer con botones */}
          <div className="sticky bottom-0 bg-white px-6 py-4 border-t flex justify-end gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-md"
            >
              Cancelar
            </button>
            <button
              onClick={() => {
                onSave({
                  ...task,
                  title,
                  description,
                  dueDate,
                  isCompleted,
                  comments,
                  checklist,
                  assignees,
                  files: localFiles,
                });
                onClose();
              }}
              className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
            >
              Guardar
            </button>
          </div>
        </div>
      </div>

      {/* Modal de previsualización de archivos */}
      <FilePreviewModal
        isOpen={showPreviewModal}
        onClose={() => setShowPreviewModal(false)}
        files={localFiles}
        initialSelectedFile={selectedFile}
      />
    </>
  );
};

export default ViewModal;
