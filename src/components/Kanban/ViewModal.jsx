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

  // Guardar cambios y sincronizar con la tarea
  const handleSave = () => {
    onSave({ ...task, title, description, dueDate, files, isCompleted });
    onClose();
  };

  // Marcar tarea como completada
  const handleComplete = () => {
    setIsCompleted(true);
    onComplete(task.id, task.columnId);
    onClose();
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-96">
        <h2 className="text-xl font-semibold mb-4">Detalles de la Tarea</h2>

        {/* Campo Título */}
        <label className="block text-sm font-medium">Título</label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full p-2 border rounded-md mb-4"
        />

        {/* Campo Descripción */}
        <label className="block text-sm font-medium">Descripción</label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full p-2 border rounded-md mb-4 h-24 resize-none"
          placeholder="Añade una descripción..."
        ></textarea>

        {/* Fecha Límite */}
        <label className="block text-sm font-medium">Fecha Límite</label>
        <input
          type="date"
          value={dayjs(dueDate).format("YYYY-MM-DD")}
          onChange={(e) => setDueDate(e.target.value)}
          className="w-full p-2 border rounded-md mb-4"
        />

        {/* Estado de la Tarea */}
        <p
          className={`text-sm font-semibold mb-4 ${
            isCompleted ? "text-green-600" : "text-gray-500"
          }`}
        >
          Estado: {isCompleted ? "✔ Completada" : "Pendiente"}
        </p>

        {/* Adjuntar Archivos */}
        <label className="block text-sm font-medium">Adjuntar Archivos</label>
        <input
          type="file"
          multiple
          onChange={handleFileChange}
          className="w-full p-2 border rounded-md mb-2"
        />

        {/* Mostrar archivos adjuntados */}
        {files.length > 0 && (
          <div className="mb-4 text-sm text-gray-600">
            <p className="font-medium">Archivos Adjuntos:</p>
            <ul className="list-disc list-inside">
              {files.map((file, index) => (
                <li key={index} className="flex justify-between items-center">
                  {file.name}
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

        {/* Botones */}
        <div className="flex justify-end gap-2">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-300 rounded-md hover:bg-gray-400"
          >
            Cerrar
          </button>
          {!isCompleted && (
            <button
              onClick={handleComplete}
              className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600"
            >
              Completar
            </button>
          )}
          <button
            onClick={handleSave}
            className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
          >
            Guardar Cambios
          </button>
        </div>
      </div>
    </div>
  );
};

export default ViewModal;
