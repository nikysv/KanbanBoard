import dayjs from "dayjs";

const FileModal = ({ isOpen, onClose, task }) => {
  if (!isOpen || !task) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white rounded-lg shadow-lg w-[500px] max-h-[600px] flex flex-col">
        {/* Header */}
        <div className="p-4 border-b border-gray-200">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold">Archivos adjuntos</h3>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700"
            >
              ✕
            </button>
          </div>
          <p className="text-sm text-gray-600 mt-1">Tarea: {task.title}</p>
        </div>

        {/* Lista de archivos */}
        <div className="flex-1 overflow-y-auto p-4">
          {!task.files || task.files.length === 0 ? (
            <p className="text-gray-500 text-center py-4">
              No hay archivos adjuntos en esta tarea.
            </p>
          ) : (
            <div className="space-y-3">
              {task.files.map((file, index) => (
                <div
                  key={index}
                  className="flex items-start gap-3 bg-gray-50 p-3 rounded-lg"
                >
                  {/* Icono del archivo */}
                  <div className="text-2xl">
                    {file.type?.startsWith("image/") ? "🖼️" : "📄"}
                  </div>

                  <div className="flex-1">
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-medium text-sm">{file.name}</h4>
                        <p className="text-xs text-gray-500">
                          Subido por {file.uploadedBy || "Usuario"}
                        </p>
                      </div>
                      <span className="text-xs text-gray-500">
                        {dayjs(file.uploadedAt).format("DD/MM/YY HH:mm")}
                      </span>
                    </div>

                    <div className="flex items-center gap-2 mt-2">
                      <span className="text-xs bg-gray-200 px-2 py-1 rounded">
                        {(file.size / 1024).toFixed(1)} KB
                      </span>
                      {file.type && (
                        <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                          {file.type}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default FileModal;
