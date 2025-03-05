import { useState } from "react";

const FileViewer = ({ files, onRemove, onDownload }) => {
  const [selectedFile, setSelectedFile] = useState(null);

  const formatFileSize = (bytes) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  const getFileIcon = (fileName) => {
    const extension = fileName.split(".").pop().toLowerCase();
    switch (extension) {
      case "pdf":
        return "📄";
      case "doc":
      case "docx":
        return "📝";
      case "xls":
      case "xlsx":
        return "📊";
      case "ppt":
      case "pptx":
        return "📽️";
      case "jpg":
      case "jpeg":
      case "png":
      case "gif":
        return "🖼️";
      default:
        return "📎";
    }
  };

  return (
    <div className="space-y-2">
      {files.length === 0 ? (
        <p className="text-gray-500 text-center py-4">
          No hay archivos adjuntos
        </p>
      ) : (
        files.map((file) => (
          <div
            key={file.id}
            className="flex items-center justify-between p-3 bg-white rounded-lg border hover:shadow-md transition-shadow"
          >
            <div className="flex items-center space-x-3 flex-1 min-w-0">
              <span className="text-2xl">{getFileIcon(file.name)}</span>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">
                  {file.name}
                </p>
                <p className="text-sm text-gray-500">
                  {formatFileSize(file.size)}
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-2 ml-4">
              <button
                onClick={() => onDownload(file)}
                className="p-1 hover:bg-gray-100 rounded"
                title="Descargar archivo"
              >
                ⬇️
              </button>
              <button
                onClick={() => onRemove(file.id)}
                className="p-1 hover:bg-gray-100 rounded text-red-500"
                title="Eliminar archivo"
              >
                🗑️
              </button>
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default FileViewer;
