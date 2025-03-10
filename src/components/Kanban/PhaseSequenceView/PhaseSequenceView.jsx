import { useEffect, useState } from "react";

const PhaseSequenceView = ({ columns, onBack }) => {
  const [isVisible, setIsVisible] = useState(false);

  // 🔹 Activar animaciones cuando el componente se monta
  useEffect(() => {
    setTimeout(() => setIsVisible(true), 100);
  }, []);

  // 🔹 Agrupar las fases en filas de 6 elementos
  const chunkSize = 6;
  const rows = [];
  for (let i = 0; i < columns.length; i += chunkSize) {
    rows.push(columns.slice(i, i + chunkSize));
  }

  return (
    <div className="container mx-auto p-5">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold">Secuencia de Fases</h2>
        <button
          onClick={onBack}
          className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200"
        >
          ← Volver al Tablero
        </button>
      </div>

      <div className="bg-white rounded-lg shadow-lg p-6">
        {/* 🔹 Grid para estructurar el diagrama */}
        <div className="grid gap-y-10">
          {rows.map((row, rowIndex) => (
            <div
              key={rowIndex}
              className={`relative grid grid-cols-6 gap-4 items-center justify-center transition-opacity duration-700 ${
                isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-5"
              }`}
            >
              {/* 🔹 Fila de fases */}
              {row.map((column, index) => (
                <div key={column.id} className="relative flex flex-col items-center">
                  {/* 🔹 Flecha de bajada (solo entre filas) */}
                  {rowIndex > 0 && index === row.length - 1 && (
                    <div className="absolute -top-10 text-gray-400 text-2xl animate-bounce">
                      ↓
                    </div>
                  )}

                  {/* 🔹 Caja de fase con animación */}
                  <div
                    className={`w-40 p-3 rounded-lg border-2 text-center shadow-md flex flex-col items-center transition-all duration-700 ${
                      isVisible ? "scale-100" : "scale-90 opacity-0"
                    } ${
                      column.isCompleted
                        ? "bg-green-100 border-green-500 text-green-700"
                        : "bg-gray-50 border-gray-200 text-gray-600"
                    }`}
                  >
                    <div className="text-sm font-bold mb-1">{column.title}</div>
                    <div
                      className={`text-xs ${
                        column.isCompleted ? "text-green-600" : "text-gray-500"
                      }`}
                    >
                      {column.isCompleted ? "✓ Completada" : "○ Pendiente"}
                    </div>
                    <div className="text-xs mt-1">
                      {column.tasksCompleted}/{column.totalTasks}
                    </div>
                  </div>

                  {/* 🔹 Flechas horizontales animadas entre fases */}
                  {index < row.length - 1 && (
                    <div
                      className={`absolute right-[-24px] text-gray-400 text-lg transition-transform duration-700 ${
                        isVisible ? "translate-x-0 opacity-100" : "translate-x-5 opacity-0"
                      }`}
                    >
                      {rowIndex % 2 === 0 ? "→" : "←"}
                    </div>
                  )}
                </div>
              ))}
            </div>
          ))}
        </div>

        {/* 🔹 Información importante */}
        <div className="mt-12 p-4 bg-blue-50 rounded-lg">
          <h4 className="font-semibold text-blue-700 mb-2">
            ℹ️ Información sobre la secuencia
          </h4>
          <ul className="list-disc list-inside space-y-2 text-blue-600">
            <li>Las fases deben completarse en orden secuencial</li>
            <li>No se puede completar una fase si la anterior no está completa</li>
            <li>Al descompletar una fase, las fases siguientes se descompletarán</li>
            <li>
              Se pueden agregar archivos a una tarea completada, pero esto la
              marcará como incompleta
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default PhaseSequenceView;
