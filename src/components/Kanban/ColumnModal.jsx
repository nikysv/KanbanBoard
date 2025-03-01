import { useState } from "react";

const ColumnModal = ({ isOpen, onClose, onSave }) => {
  if (!isOpen) return null;

  const [tasks, setTasks] = useState([""]);
  const [showTaskInputs, setShowTaskInputs] = useState(false);
  const [userTypes, setUserTypes] = useState({
    tigo: true,
    externo: false,
  });

  const handleSave = () => {
    const columnName = document.getElementById("columnName").value.trim();
    if (columnName === "") return;
    if (!userTypes.tigo && !userTypes.externo) {
      alert("Debes seleccionar al menos un tipo de usuario");
      return;
    }

    const columnTasks = showTaskInputs
      ? tasks
          .filter((task) => task.trim() !== "")
          .map((task) => ({
            id: Date.now().toString() + Math.random(),
            title: task,
            description: "",
            dueDate: "",
            comments: [],
          }))
      : [];

    onSave(columnName, columnTasks, userTypes);
    setTasks([""]);
    setShowTaskInputs(false);
    setUserTypes({ tigo: true, externo: false });
  };

  const handleUserTypeChange = (type) => {
    setUserTypes((prev) => ({
      ...prev,
      [type]: !prev[type],
    }));
  };

  const handleAddTask = () => {
    setTasks([...tasks, ""]);
  };

  const handleTaskChange = (index, value) => {
    const newTasks = [...tasks];
    newTasks[index] = value;
    setTasks(newTasks);
  };

  const handleRemoveTask = (index) => {
    const newTasks = tasks.filter((_, i) => i !== index);
    setTasks(newTasks.length ? newTasks : [""]); // Mantener al menos una tarea
  };

  const getUserTypesText = () => {
    if (userTypes.tigo && userTypes.externo) {
      return "Todos los usuarios podrán ver esta columna";
    } else if (userTypes.tigo) {
      return "Solo los trabajadores de Tigo podrán ver esta columna";
    } else if (userTypes.externo) {
      return "Solo los trabajadores externos podrán ver esta columna";
    }
    return "Debes seleccionar al menos un tipo de usuario";
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-[500px] max-h-[80vh] overflow-y-auto">
        <h2 className="text-xl font-semibold mb-4">Nueva Columna</h2>

        {/* Nombre de la columna */}
        <div className="mb-6">
          <label className="block text-sm font-medium mb-2">
            Nombre de la columna
          </label>
          <input
            id="columnName"
            type="text"
            placeholder="Escribe el nombre de la columna..."
            className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Selección de tipo de usuario */}
        <div className="mb-6">
          <label className="block text-sm font-medium mb-2">
            ¿Quién podrá ver esta columna?
          </label>
          <div className="flex gap-4">
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={userTypes.tigo}
                onChange={() => handleUserTypeChange("tigo")}
                className="form-checkbox h-4 w-4 text-blue-500 rounded"
              />
              <span className="ml-2 text-sm">Tigo</span>
            </label>
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={userTypes.externo}
                onChange={() => handleUserTypeChange("externo")}
                className="form-checkbox h-4 w-4 text-blue-500 rounded"
              />
              <span className="ml-2 text-sm">Externo</span>
            </label>
          </div>
          <p
            className={`mt-1 text-xs ${
              !userTypes.tigo && !userTypes.externo
                ? "text-red-500"
                : "text-gray-500"
            }`}
          >
            {getUserTypesText()}
          </p>
        </div>

        {/* Toggle para mostrar/ocultar tareas */}
        <div className="mb-6">
          <label className="flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={showTaskInputs}
              onChange={(e) => setShowTaskInputs(e.target.checked)}
              className="form-checkbox h-5 w-5 text-blue-500 rounded"
            />
            <span className="ml-2 text-sm">Agregar tareas iniciales</span>
          </label>
        </div>

        {/* Lista de tareas */}
        {showTaskInputs && (
          <div className="space-y-3 mb-6">
            <label className="block text-sm font-medium mb-2">
              Tareas iniciales
            </label>
            {tasks.map((task, index) => (
              <div key={index} className="flex gap-2">
                <input
                  type="text"
                  value={task}
                  onChange={(e) => handleTaskChange(index, e.target.value)}
                  placeholder={`Tarea ${index + 1}`}
                  className="flex-1 p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button
                  onClick={() => handleRemoveTask(index)}
                  className="px-2 py-1 text-red-500 hover:text-red-700"
                >
                  ✕
                </button>
              </div>
            ))}
            <button
              onClick={handleAddTask}
              className="w-full p-2 border-2 border-dashed border-gray-300 rounded-md text-gray-500 hover:border-blue-500 hover:text-blue-500"
            >
              + Agregar otra tarea
            </button>
          </div>
        )}

        {/* Botones de acción */}
        <div className="flex justify-end gap-2">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-300 rounded-md hover:bg-gray-400"
          >
            Cancelar
          </button>
          <button
            onClick={handleSave}
            className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
          >
            Guardar
          </button>
        </div>
      </div>
    </div>
  );
};

export default ColumnModal;
