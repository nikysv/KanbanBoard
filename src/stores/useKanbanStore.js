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
          ? {
              ...site,
              data: {
                ...site.data,
                columnas: columns.map((col, index) => ({
                  ...col,
                  position: index,
                })),
              },
            }
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

  // Nuevo método para actualizar un sitio con validación secuencial
  updateSiteBoard: (siteId, boardId, updates) => {
    set((state) => {
      const site = state.sites.find((s) => s.id === siteId);
      if (!site) return state;

      // Encuentra el tablero actual y el anterior
      const currentBoard = site.data.boards.find((b) => b.id === boardId);
      const previousBoard = site.data.boards.find(
        (b) => b.position === currentBoard.position - 1
      );

      // Validar que el tablero anterior esté completo
      if (updates.isCompleted && previousBoard && !previousBoard.isCompleted) {
        alert(
          "No puedes completar este tablero hasta que el anterior esté completo"
        );
        return state;
      }

      // Actualizar el tablero
      const updatedBoards = site.data.boards.map((board) =>
        board.id === boardId ? { ...board, ...updates } : board
      );

      return {
        ...state,
        sites: state.sites.map((s) =>
          s.id === siteId
            ? { ...s, data: { ...s.data, boards: updatedBoards } }
            : s
        ),
      };
    });
  },

  // Método para reordenar tableros
  reorderBoards: (siteId, boardId, newPosition) => {
    set((state) => {
      const site = state.sites.find((s) => s.id === siteId);
      if (!site) return state;

      const boards = [...site.data.boards];
      const board = boards.find((b) => b.id === boardId);
      const oldPosition = board.position;

      // Ajustar posiciones
      boards.forEach((b) => {
        if (newPosition > oldPosition) {
          if (b.position > oldPosition && b.position <= newPosition) {
            b.position--;
          }
        } else {
          if (b.position >= newPosition && b.position < oldPosition) {
            b.position++;
          }
        }
      });

      board.position = newPosition;
      boards.sort((a, b) => a.position - b.position);

      return {
        ...state,
        sites: state.sites.map((s) =>
          s.id === siteId ? { ...s, data: { ...s.data, boards: boards } } : s
        ),
      };
    });
  },
}));

export default useKanbanStore;
