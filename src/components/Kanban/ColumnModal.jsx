const ColumnModal = ({ isOpen, onClose, onSave }) => {
    if (!isOpen) return null;
  
    const handleSave = () => {
      const columnName = document.getElementById("columnName").value.trim();
      if (columnName === "") return;
      onSave(columnName);
    };
  
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
        <div className="bg-white p-6 rounded-lg shadow-lg w-96">
          <h2 className="text-xl font-semibold mb-4">Nueva Columna</h2>
          <input
            id="columnName"
            type="text"
            placeholder="Escribe el nombre de la columna..."
            className="w-full p-2 border rounded-md mb-4"
          />
          <div className="flex justify-end gap-2">
            <button onClick={onClose} className="px-4 py-2 bg-gray-300 rounded-md hover:bg-gray-400">
              Cancelar
            </button>
            <button onClick={handleSave} className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600">
              Guardar
            </button>
          </div>
        </div>
      </div>
    );
  };
  
  export default ColumnModal;
  