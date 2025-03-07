import { useState } from "react";
import useKanbanStore from "../../stores/useKanbanStore";

const AddSiteModal = ({ isOpen, onClose, onSave }) => {
  if (!isOpen) return null;

  const { availableSites } = useKanbanStore();
  const [selectedSite, setSelectedSite] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    const site = availableSites.find((s) => s.id === selectedSite);
    if (!site) return;

    onSave({
      ...site,
      status: "pending",
      stages: [false, false, false, false, false],
      lastUpdate: new Date().toISOString(),
      data: {
        columnas: [
          {
            id: "1",
            title: "Pendiente",
            tasks: [],
          },
          {
            id: "2",
            title: "En Proceso",
            tasks: [],
          },
          {
            id: "3",
            title: "Finalizado",
            tasks: [],
          },
        ],
      },
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-[500px]">
        <h2 className="text-xl font-bold mb-4">Agregar Nuevo Sitio</h2>
        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">
                Seleccionar Sitio
              </label>
              <select
                value={selectedSite}
                onChange={(e) => setSelectedSite(e.target.value)}
                className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                required
              >
                <option value="">Seleccione un sitio...</option>
                {availableSites.map((site) => (
                  <option key={site.id} value={site.id}>
                    {site.name} ({site.id})
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="mt-6 flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={!selectedSite}
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed"
            >
              Agregar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddSiteModal;
