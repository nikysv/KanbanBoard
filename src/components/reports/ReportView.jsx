import { useLocation, useNavigate } from "react-router-dom";

const Reporte = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const kanbanData = location.state?.kanbanData;

  if (!kanbanData) {
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
      <h1 className="text-3xl font-bold mb-4">📊 Reporte de Tableros</h1>
      <p className="text-gray-600 mb-6">
        <strong>Sitio:</strong> {kanbanData.sitio} | <strong>ID:</strong> {kanbanData.id}
      </p>

      {kanbanData.columnas.map((columna, index) => (
        <div key={index} className="mb-6 p-4 border rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-2">{columna.titulo}</h2>
          <hr className="mb-2" />
          {columna.tareas.length === 0 ? (
            <p className="text-gray-500">No hay tareas en esta columna.</p>
          ) : (
            columna.tareas.map((tarea, i) => (
              <div key={i} className="mb-4 p-3 bg-gray-50 rounded-lg">
                <h3 className="text-lg font-medium">{tarea.titulo}</h3>
                <p className="text-sm text-gray-600">
                  <strong>Prioridad:</strong> {tarea.prioridad} | <strong>Fecha:</strong> {tarea.fecha} |{" "}
                  <strong>Estado:</strong> {tarea.estado}
                </p>

                {tarea.participantes.length > 0 && (
                  <p className="text-sm mt-2">
                    <strong>Participantes:</strong> {tarea.participantes.join(", ")}
                  </p>
                )}

                {tarea.comentarios.length > 0 && (
                  <p className="text-sm mt-2">
                    <strong>Comentarios:</strong> {tarea.comentarios.join(", ")}
                  </p>
                )}

                {tarea.archivos.length > 0 && (
                  <p className="text-sm mt-2">
                    <strong>Archivos adjuntos:</strong> {tarea.archivos.join(", ")}
                  </p>
                )}

                {tarea.checklist.length > 0 && (
                  <div className="mt-2">
                    <strong>Checklist:</strong>
                    <ul className="list-disc list-inside">
                      {tarea.checklist.map((item, idx) => (
                        <li key={idx} className={item.completed ? "text-green-600" : "text-red-600"}>
                          {item.text} {item.completed ? "✅" : "❌"}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      ))}

      <button
        onClick={() => navigate("/")}
        className="mt-6 px-4 py-2 bg-blue-500 text-white rounded-lg"
      >
        Volver al Dashboard
      </button>
    </div>
  );
};

export default Reporte;
