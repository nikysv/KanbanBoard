const DeleteConfirmationModal = ({ isOpen, onClose, onConfirm, taskTitle }) => {
    if (!isOpen) return null;
  
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
        <div className="bg-white p-6 rounded-lg shadow-lg w-96">
          <h3 className="text-lg font-semibold mb-4">Confirmar eliminación</h3>
          <p className="text-gray-600 mb-6">
            ¿Estás seguro de que deseas eliminar la tarea "{taskTitle}"? Esta acción no se puede deshacer.
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
  
  export default DeleteConfirmationModal; // 📌 Asegúrate de que está exportado correctamente
  