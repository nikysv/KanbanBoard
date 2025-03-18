import { useLocation, useNavigate } from "react-router-dom";
import useKanbanStore from "../stores/useKanbanStore";
import FilePreviewModal from "../components/Kanban/Files/FilePreviewModal";
import { useState } from "react";

const TaskFiles = ({ tarea }) => {
  return (
    <div className="mt-3">
      <strong className="text-sm">Archivos adjuntos:</strong>
      <div className="mt-2 space-y-2">
        {tarea.archivos?.map((archivo, idx) => (
          <div
            key={`${archivo}-${idx}`}
            className="flex items-center justify-between p-2 bg-white rounded border"
          >
            <div className="flex items-center gap-2">
              <span className="text-xl">
                {archivo.endsWith(".pdf")
                  ? "📄"
                  : archivo.endsWith(".doc") || archivo.endsWith(".docx")
                  ? "📝"
                  : archivo.endsWith(".xls") || archivo.endsWith(".xlsx")
                  ? "📊"
                  : "📎"}
              </span>
              <div>
                <p className="text-sm font-medium">{archivo}</p>
                <p className="text-xs text-gray-500">
                  Subido por {tarea.participantes?.[0] || "Usuario"}
                </p>
              </div>
            </div>
            <div className="flex gap-2">
              <button className="text-blue-600 hover:text-blue-800">⬇️</button>
              <button className="text-blue-600 hover:text-blue-800">👁️</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const TaskDetails = ({ tarea }) => (
  <div className="mb-4 p-3 bg-gray-50 rounded-lg">
    <h3 className="text-lg font-medium">{tarea.titulo}</h3>
    <div className="text-sm text-gray-600">
      <strong>Prioridad:</strong> {tarea.prioridad} | <strong>Fecha:</strong>{" "}
      {tarea.fecha} | <strong>Estado:</strong> {tarea.estado}
    </div>
    {tarea.archivos?.length > 0 && <TaskFiles tarea={tarea} />}
  </div>
);

const ColumnSection = ({ columna }) => (
  <div className="mb-6 p-4 border rounded-lg shadow-md">
    <h2 className="text-xl font-semibold mb-2">{columna.titulo}</h2>
    <hr className="mb-4" />
    <div className="space-y-4">
      {columna.tareas?.map((tarea, index) => (
        <TaskDetails key={tarea.id || index} tarea={tarea} />
      ))}
    </div>
  </div>
);

const ReportView = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { sites } = useKanbanStore();
  const [selectedFile, setSelectedFile] = useState(null);

  // Obtener datos del sitio
  const siteData =
    location.state?.kanbanData ||
    (() => {
      const siteId = location.pathname.split("/").pop();
      const site = sites.find((s) => s.id === siteId);
      return site
        ? {
            sitio: site.name,
            id: site.id,
            columnas: site.data.columnas,
          }
        : null;
    })();

  if (!siteData || !siteData.columnas) {
    return (
      <div className="p-10 text-center">
        <h2 className="text-2xl font-bold text-red-600">
          ❌ No hay datos disponibles para el reporte.
        </h2>
        <button
          onClick={() => navigate("/")}
          className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg"
        >
          Volver al Dashboard
        </button>
      </div>
    );
  }

  return (
    <div className="p-10">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-3xl font-bold">📊 Reporte de Tableros</h1>
        <button
          onClick={() => navigate(`/kanban/${siteData.id}`)}
          className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
        >
          Volver al Tablero
        </button>
      </div>

      <p className="text-gray-600 mb-6">
        <strong>Sitio:</strong> {siteData.sitio} | <strong>ID:</strong>{" "}
        {siteData.id}
      </p>

      {siteData.columnas.map((columna, index) => (
        <ColumnSection key={columna.id || index} columna={columna} />
      ))}

      <FilePreviewModal
        isOpen={Boolean(selectedFile)}
        onClose={() => setSelectedFile(null)}
        files={selectedFile ? [selectedFile] : []}
        initialSelectedFile={selectedFile}
      />
    </div>
  );
};

export default ReportView;
