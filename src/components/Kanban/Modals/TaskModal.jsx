import { useState } from "react";

const TaskModal = ({ isOpen, onClose, onSave, columnId }) => {
  const [taskTitle, setTaskTitle] = useState("");

  if (!isOpen) return null;

  const handleSave = () => {
    if (taskTitle.trim() === "") return;
    onSave(taskTitle, columnId);
    setTaskTitle("");
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleSave();
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-96">
        <h2 className="text-xl font-semibold mb-4">Nueva Tarea</h2>
        <input
          value={taskTitle}
          onChange={(e) => setTaskTitle(e.target.value)}
          onKeyPress={handleKeyPress}
          type="text"
          placeholder="Escribe el título de la tarea..."
          className="w-full p-2 border rounded-md mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
          autoFocus
        />
        <div className="flex justify-end gap-2">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-300 rounded-md hover:bg-gray-400"
          >
            Cancelar
          </button>
          <button
            onClick={handleSave}
            disabled={!taskTitle.trim()}
            className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Guardar
          </button>
        </div>
      </div>
    </div>
  );
};

export default TaskModal;
