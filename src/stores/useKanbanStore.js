import { create } from "zustand";
import { mockData } from "../data/mockData";

const useKanbanStore = create((set, get) => ({
  // Estado inicial con datos de ejemplo
  sites: mockData.sites,
  availableSites: mockData.availableSites.filter(
    (site) => !mockData.sites.find((s) => s.id === site.id)
  ),
  currentSite: null,
  searchTerm: "",

  // Acciones
  setSearchTerm: (term) => set({ searchTerm: term }),
  setSites: (sites) => set({ sites }),
  setCurrentSite: (site) => set({ currentSite: site }),

  // Agregar una acción para añadir un solo sitio
  addSite: (newSite) =>
    set((state) => ({
      sites: [...state.sites, newSite],
    })),

  // Actualizar un sitio específico
  updateSite: (siteId, updatedData) =>
    set((state) => ({
      sites: state.sites.map((site) =>
        site.id === siteId ? { ...site, ...updatedData } : site
      ),
    })),

  // Actualizar las columnas de un sitio
  updateSiteColumns: (siteId, columns) =>
    set((state) => ({
      sites: state.sites.map((site) =>
        site.id === siteId
          ? { ...site, data: { ...site.data, columnas: columns } }
          : site
      ),
    })),

  // Selectores
  getFilteredSites: () => {
    const { sites, searchTerm } = get();
    return sites.filter(
      (site) =>
        site.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        site.id.toLowerCase().includes(searchTerm.toLowerCase())
    );
  },

  // Acciones compuestas
  updateSiteProgress: (siteId, progress) => {
    set((state) => ({
      sites: state.sites.map((site) =>
        site.id === siteId ? { ...site, progress } : site
      ),
    }));
  },
}));

export default useKanbanStore;
