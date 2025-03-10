const CompleteTaskModal = ({ isOpen, onClose, onConfirm, taskTitle }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-[60]">
      <div className="bg-white p-6 rounded-lg shadow-lg w-[500px]">
        <h3 className="text-lg font-semibold mb-4">
          Confirmar completar tarea
        </h3>
        <p className="text-gray-600 mb-4">
          ¿Estás seguro que deseas marcar como completada la tarea "{taskTitle}
          "?
        </p>
        <p className="text-amber-600 mb-6 text-sm">
          ⚠️ Una vez completada, solo podrás subir archivos y la tarea se
          marcará como incompleta, esto afectará la secuencia de las fases.
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
            className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600"
          >
            Completar Tarea
          </button>
        </div>
      </div>
    </div>
  );
};

export default CompleteTaskModal;
