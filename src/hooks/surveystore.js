import { create } from "zustand";

export const useSurveyStore = create((set) => ({
  sites: [
    { id: "1", name: "PAR", stages: Array(10).fill(false), tasks: [] }, // Cada sitio tiene tareas
    { id: "2", name: "ABC", stages: Array(10).fill(false), tasks: [] },
  ],
  updateStage: (siteId, stageIndex) =>
    set((state) => ({
      sites: state.sites.map((site) =>
        site.id === siteId
          ? { ...site, stages: site.stages.map((s, i) => (i === stageIndex ? !s : s)) }
          : site
      ),
    })),
  addSite: (name) =>
    set((state) => ({
      sites: [
        ...state.sites,
        { id: Date.now().toString(), name, stages: Array(10).fill(false), tasks: [] },
      ],
    })),
}));
