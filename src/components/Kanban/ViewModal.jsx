import { useState, useEffect } from "react";
import dayjs from "dayjs";
import TrashIcon from "../icons/trash";

const ViewModal = ({ isOpen, onClose, task, onSave, onComplete }) => {
  if (!isOpen || !task) return null;

  // Estado para los datos de la tarea
  const [title, setTitle] = useState(task.title);
  const [description, setDescription] = useState(task.description || "");
  const [dueDate, setDueDate] = useState(task.dueDate || "");
  const [files, setFiles] = useState([]);
  const [isCompleted, setIsCompleted] = useState(task.isCompleted || false);

  // Sincronizar el modal con la tarea cuando se abre
  useEffect(() => {
    setTitle(task.title);
    setDescription(task.description || "");
    setDueDate(task.dueDate || "");
    setFiles(task.files || []);
    setIsCompleted(task.isCompleted || false);
  }, [task]);

  // Manejar archivos adjuntos
  const handleFileChange = (event) => {
    setFiles([...files, ...event.target.files]);
  };

  // Eliminar un archivo adjunto antes de guardar
  const removeFile = (index) => {
    setFiles(files.filter((_, i) => i !== index));
  };

  const handleSave = () => {
    onSave({
      ...task,
      title,
      description,
      dueDate,
      files,
      isCompleted,
      columnId: task.columnId, // Asegura que la tarea mantiene su columna
    });
    onClose();
  };

  const handleComplete = () => {
    setIsCompleted(true);
    onComplete({ ...task, isCompleted: true });
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white p-8 rounded-lg shadow-lg w-[800px] max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-start mb-6">
          <h2 className="text-2xl font-semibold">Detalles de la Tarea</h2>
          <div className="flex items-center gap-2">
            {task.isCompleted ? (
              <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">
                ✔ Completada
              </span>
            ) : (
              <span className="px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-sm font-medium">
                En Progreso
              </span>
            )}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-6">
          <div className="space-y-6">
            {/* Campo Título */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Título
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full p-3 border rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            {/* Campo Descripción */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Descripción
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full p-3 border rounded-md shadow-sm h-32 resize-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Añade una descripción..."
              />
            </div>

            {/* Fecha Límite */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Fecha Límite
              </label>
              <input
                type="date"
                value={dayjs(dueDate).format("YYYY-MM-DD")}
                onChange={(e) => setDueDate(e.target.value)}
                className="w-full p-3 border rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>

          <div className="space-y-6">
            {/* Adjuntar Archivos */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Adjuntar Archivos
              </label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-500 transition-colors">
                <input
                  type="file"
                  multiple
                  onChange={handleFileChange}
                  className="hidden"
                  id="file-upload"
                />
                <label htmlFor="file-upload" className="cursor-pointer">
                  <div className="text-gray-600">
                    <svg
                      className="mx-auto h-12 w-12 text-gray-400"
                      stroke="currentColor"
                      fill="none"
                      viewBox="0 0 48 48"
                    >
                      <path
                        d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                    <p className="mt-1">
                      Arrastra archivos aquí o haz clic para seleccionar
                    </p>
                  </div>
                </label>
              </div>
            </div>

            {/* Mostrar archivos adjuntados */}
            {files.length > 0 && (
              <div className="border rounded-lg p-4 bg-gray-50">
                <h4 className="font-medium text-gray-700 mb-2">
                  Archivos Adjuntos:
                </h4>
                <ul className="space-y-2">
                  {files.map((file, index) => (
                    <li
                      key={index}
                      className="flex justify-between items-center bg-white p-2 rounded"
                    >
                      <span className="text-sm text-gray-600 truncate">
                        {file.name}
                      </span>
                      <button
                        onClick={() => removeFile(index)}
                        className="text-red-500 hover:text-red-700"
                      >
                        <TrashIcon size={16} />
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>

        {/* Botones */}
        <div className="flex justify-end gap-3 mt-8 pt-4 border-t">
          <button
            onClick={onClose}
            className="px-6 py-2.5 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
          >
            Cerrar
          </button>
          {!isCompleted && (
            <button
              onClick={handleComplete}
              className="px-6 py-2.5 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
            >
              Marcar como Completada
            </button>
          )}
          <button
            onClick={handleSave}
            className="px-6 py-2.5 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            Guardar Cambios
          </button>
        </div>
      </div>
    </div>
  );
};

export default ViewModal;
