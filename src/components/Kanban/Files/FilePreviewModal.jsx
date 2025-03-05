import { useState, useEffect } from "react";
import DocumentViewer from "./DocumentViewer";

const FilePreviewModal = ({ isOpen, onClose, files, initialSelectedFile }) => {
  const [selectedFile, setSelectedFile] = useState(initialSelectedFile);

  // Actualizar el archivo seleccionado cuando cambia el inicial
  useEffect(() => {
    setSelectedFile(initialSelectedFile);
  }, [initialSelectedFile]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white rounded-lg shadow-lg w-[90vw] h-[90vh] flex flex-col">
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
        </div>

        <div className="flex flex-1 min-h-0">
          {/* Lista de archivos */}
          <div className="w-64 border-r overflow-y-auto bg-gray-50">
            {files.map((file) => (
              <div
                key={file.id}
                className={`p-3 cursor-pointer hover:bg-gray-100 flex items-center gap-2 ${
                  selectedFile?.id === file.id
                    ? "bg-blue-50 border-l-4 border-blue-500"
                    : ""
                }`}
                onClick={() => setSelectedFile(file)}
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
                  <p className="text-sm font-medium truncate">{file.name}</p>
                  <p className="text-xs text-gray-500">
                    {(file.size / 1024).toFixed(2)} KB
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Visor de documentos */}
          <div className="flex-1 overflow-y-auto p-4">
            {selectedFile ? (
              <DocumentViewer file={selectedFile} />
            ) : (
              <div className="flex items-center justify-center h-full text-gray-500">
                Selecciona un archivo para visualizarlo
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FilePreviewModal;
