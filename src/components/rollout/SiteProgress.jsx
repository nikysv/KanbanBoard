import { useNavigate } from "react-router-dom";
import { FaEye } from "react-icons/fa";

export default function SiteProgress({ site, lastUpdate }) {
  const navigate = useNavigate();
  const phaseLabels = ["INI", "DES", "IMP", "REV", "FIN"];
  const completed = site?.stages?.filter(Boolean).length || 0;
  const total = site?.stages?.length || 1;
  const progressPercentage = Math.round((completed / total) * 100);

  return (
    <div className="flex items-center px-4 py-3 border-b hover:bg-gray-50 transition-colors">
      {/* Información del sitio */}
      <div className="w-1/4 flex items-center gap-3">
        <div>
          <h3 className="font-medium text-gray-900">{site.name}</h3>
          <p className="text-sm text-gray-500">ID: {site.id}</p>
        </div>
        <span
          className={`px-2 py-1 rounded-full text-xs font-medium ${
            site.status === "active"
              ? "bg-green-100 text-green-700"
              : "bg-yellow-100 text-yellow-700"
          }`}
        >
          {site.status === "active" ? "Activo" : "Pendiente"}
        </span>
      </div>

      {/* Etapas */}
      <div className="w-1/3 flex gap-2 items-center">
        {site.stages.map((completed, index) => (
          <div
            key={index}
            className={`w-8 h-8 flex items-center justify-center rounded-full text-xs font-medium
              ${
                completed
                  ? "bg-green-500 text-white"
                  : "bg-gray-200 text-gray-600"
              }`}
          >
            {phaseLabels[index]}
          </div>
        ))}
      </div>

      {/* Barra de progreso */}
      <div className="w-1/4 pr-4">
        <div className="flex items-center gap-2">
          <div className="flex-1 bg-gray-200 rounded-full h-2">
            <div
              className="bg-blue-500 rounded-full h-2 transition-all duration-300"
              style={{ width: `${progressPercentage}%` }}
            />
          </div>
          <span className="text-sm font-medium text-gray-700">
            {progressPercentage}%
          </span>
        </div>
        <p className="text-xs text-gray-500 mt-1">
          Actualizado: {new Date(lastUpdate).toLocaleDateString()}
        </p>
      </div>

      {/* Acciones */}
      <div className="w-1/6 flex justify-end">
        <button
          onClick={() => navigate(`/kanban/${site.id}`)}
          className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-full transition-colors"
          title="Ver tablero"
        >
          <FaEye size={20} />
        </button>
      </div>
    </div>
  );
}
