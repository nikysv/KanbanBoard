import FileList from "../Kanban/Files/FileList";

const TaskDetails = ({ tarea }) => {
  return (
    <div className="mb-4 p-3 bg-gray-50 rounded-lg">
      <h3 className="text-lg font-medium">{tarea.titulo}</h3>

      <div className="text-sm text-gray-600">
        <strong>Prioridad:</strong> {tarea.prioridad} | <strong>Fecha:</strong>{" "}
        {tarea.fecha} | <strong>Estado:</strong> {tarea.estado}
      </div>

      {/* Archivos adjuntos */}
      {tarea.archivos?.length > 0 && (
        <div className="mt-3">
          <strong className="text-sm">Archivos adjuntos:</strong>
          <div className="mt-2 space-y-2">
            {tarea.archivos.map((archivo, idx) => (
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
                  <button className="text-blue-600 hover:text-blue-800">
                    ⬇️
                  </button>
                  <button className="text-blue-600 hover:text-blue-800">
                    👁️
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Otros detalles de la tarea */}
      {tarea.checklist?.length > 0 && (
        <div className="mt-3">
          <strong className="text-sm">Checklist:</strong>
          <ul className="mt-1 space-y-1">
            {tarea.checklist.map((item, idx) => (
              <li key={idx} className="flex items-center gap-2 text-sm">
                {item.completed ? "✅" : "⬜"} {item.text}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default TaskDetails;
