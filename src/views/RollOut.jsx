import { useState } from "react";
import { useNavigate } from "react-router-dom";
import useKanbanStore from "../stores/useKanbanStore";
import SiteProgress from "../components/rollout/SiteProgress";
import SearchBar from "../components/rollout/SearchBar";
import AddSiteModal from "../components/rollout/AddSiteModal";
import { FaPlus } from "react-icons/fa";

const MainPage = () => {
  const navigate = useNavigate();
  const { sites, setSearchTerm, getFilteredSites, setSites } = useKanbanStore();
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const filteredSites = getFilteredSites();

  const handleAddSite = (newSite) => {
    setSites([...sites, newSite]);
  };

  return (
    <div className="container mx-auto p-8">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-4">
          <h1 className="text-2xl font-bold">Roll Out Sites</h1>
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
          >
            <FaPlus size={14} />
            <span>Agregar Sitio</span>
          </button>
        </div>
        <div className="w-1/3">
          <SearchBar onSearch={setSearchTerm} />
        </div>
      </div>

      <div className="bg-gray-50 p-4 rounded-t-lg border-b flex items-center font-semibold text-gray-700">
        <div className="w-1/4">Sitio</div>
        <div className="w-1/3">Etapas</div>
        <div className="w-1/4">Progreso</div>
        <div className="w-1/6">Acciones</div>
      </div>

      <div className="bg-white rounded-b-lg shadow">
        {filteredSites.length > 0 ? (
          filteredSites.map((site) => (
            <SiteProgress
              key={site.id}
              site={site}
              lastUpdate={site.lastUpdate}
            />
          ))
        ) : (
          <div className="p-4 text-center text-gray-500">
            No se encontraron sitios
          </div>
        )}
      </div>

      <AddSiteModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSave={handleAddSite}
      />
    </div>
  );
};

export default MainPage;
