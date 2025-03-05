import { useState, useEffect } from "react";
import FileViewer from "../Files/FileViewer";
import useFileManager from "../../../hooks/useFileManager";

const FileModal = ({ isOpen, onClose, task, onUpdateFiles }) => {
  if (!isOpen || !task) return null;

  const [tempFiles, setTempFiles] = useState([]);
  const { handleFileUpload, downloadFile } = useFileManager([]);

  // Inicializar archivos temporales cuando se abre el modal
  useEffect(() => {
    if (isOpen) {
      setTempFiles(task.files || []);
    }
  }, [isOpen, task.id, task.files]);

  const handleFilesChange = async (event) => {
    const newFiles = await handleFileUpload(event.target.files);
    setTempFiles((prev) => [...prev, ...newFiles]);
  };

  const handleRemoveFile = (fileId) => {
    setTempFiles((prev) => prev.filter((f) => f.id !== fileId));
  };

  const handleClose = () => {
    setTempFiles(task.files || []);
    onClose();
  };

  const handleSave = () => {
    if (onUpdateFiles) {
      onUpdateFiles(tempFiles);
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white rounded-lg shadow-lg w-[800px] max-h-[80vh] flex flex-col">
        {/* Header */}
        <div className="p-4 border-b border-gray-200">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold">Archivos adjuntos</h3>
            <button
              onClick={handleClose}
              className="text-gray-500 hover:text-gray-700"
            >
              ✕
            </button>
          </div>
          <p className="text-sm text-gray-600 mt-1">Tarea: {task.title}</p>
        </div>

        {/* Área de carga de archivos */}
        <div className="p-4 border-b border-gray-200">
          <input
            type="file"
            onChange={handleFilesChange}
            multiple
            className="block w-full text-sm text-gray-500
              file:mr-4 file:py-2 file:px-4
              file:rounded-full file:border-0
              file:text-sm file:font-semibold
              file:bg-blue-50 file:text-blue-700
              hover:file:bg-blue-100"
          />
        </div>

        {/* Lista de archivos */}
        <div className="flex-1 overflow-y-auto p-4">
          <FileViewer
            files={tempFiles}
            onRemove={handleRemoveFile}
            onDownload={downloadFile}
          />
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-gray-200 flex justify-end gap-2">
          <button
            onClick={handleClose}
            className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-md"
          >
            Cancelar
          </button>
          <button
            onClick={handleSave}
            className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
          >
            Guardar cambios
          </button>
        </div>
      </div>
    </div>
  );
};

export default FileModal;
