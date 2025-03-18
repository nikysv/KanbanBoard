import FilePreviewModal from "../Kanban/Files/FilePreviewModal";
import { useState } from "react";

const FileList = ({ files }) => {
  const getFileIcon = (filename) => {
    const ext = filename.split(".").pop().toLowerCase();
    const icons = {
      pdf: "📄",
      doc: "📝",
      docx: "📝",
      xls: "📊",
      xlsx: "📊",
      default: "📎",
    };
    return icons[ext] || icons.default;
  };

  return (
    <div className="space-y-2">
      {files.map((file) => (
        <div
          key={file.id}
          className="flex items-center justify-between p-3 bg-white rounded-lg border hover:bg-gray-50"
        >
          <div className="flex items-center gap-3">
            <span className="text-2xl">{getFileIcon(file.name)}</span>
            <div>
              <p className="text-sm font-medium">{file.name}</p>
              <p className="text-xs text-gray-500">
                Subido por {file.uploadedBy} el{" "}
                {new Date(file.uploadDate).toLocaleDateString()}
              </p>
            </div>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => window.open(file.url, "_blank")}
              className="text-blue-600 hover:text-blue-800 p-2"
              title="Ver archivo"
            >
              👁️
            </button>
            <button
              onClick={() => window.open(file.downloadUrl, "_blank")}
              className="text-blue-600 hover:text-blue-800 p-2"
              title="Descargar archivo"
            >
              ⬇️
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

const ReportView = ({ data }) => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [showPreviewModal, setShowPreviewModal] = useState(false);

  // Agrupar archivos por fase/columna
  const filesByPhase = data.columns.reduce((acc, column) => {
    const files = column.tasks.flatMap((task) => task.files || []);
    if (files.length > 0) {
      acc[column.title] = files;
    }
    return acc;
  }, {});

  return (
    <div className="container mx-auto p-6">
      <h2 className="text-2xl font-bold mb-6">Archivos del Proyecto</h2>

      {Object.entries(filesByPhase).map(([phase, files]) => (
        <div key={phase} className="mb-8">
          <h3 className="text-lg font-semibold mb-4 text-gray-700">{phase}</h3>
          <FileList files={files} />
        </div>
      ))}

      <FilePreviewModal
        isOpen={showPreviewModal}
        onClose={() => setShowPreviewModal(false)}
        files={selectedFile ? [selectedFile] : []}
      />
    </div>
  );
};

export default ReportView;
