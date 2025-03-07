export const mockData = {
  // Sitios disponibles para seleccionar
  availableSites: [
    { id: "ARG", name: "ARGENTINA" },
    { id: "CHI", name: "CHILE" },
    { id: "URY", name: "URUGUAY" },
    { id: "COL", name: "COLOMBIA" },
    { id: "PER", name: "PERU" },
  ],

  // Sitios ya en roll-out
  sites: [
    {
      id: "PRY",
      name: "PARAGUAY",
      status: "active",
      stages: [true, true, false, false, false],
      lastUpdate: "2024-03-15",
      data: {
        columnas: [
          {
            id: "1",
            titulo: "Pendiente",
            tareas: [
              {
                id: "101",
                titulo: "Revisar documentación",
                prioridad: "Alta",
                fecha: "2024-03-20",
                estado: "Pendiente",
                participantes: ["Juan P.", "Maria S."],
                comentarios: ["Pendiente revisión del equipo legal"],
                archivos: ["doc-legal.pdf", "contrato-v1.docx"],
                checklist: [
                  { text: "Revisar clausulas", completed: true },
                  { text: "Validar con legal", completed: false },
                ],
              },
            ],
          },
          {
            id: "2",
            titulo: "En Proceso",
            tareas: [
              {
                id: "102",
                titulo: "Implementación inicial",
                prioridad: "Media",
                fecha: "2024-03-25",
                estado: "En proceso",
                participantes: ["Carlos M."],
                comentarios: ["En revisión técnica"],
                archivos: ["specs.xlsx"],
                checklist: [
                  { text: "Setup inicial", completed: true },
                  { text: "Pruebas", completed: false },
                ],
              },
            ],
          },
          {
            id: "3",
            titulo: "Completado",
            tareas: [],
          },
        ],
      },
    },
    {
      id: "BOL",
      name: "BOLIVIA",
      status: "pending",
      stages: [true, true, true, false, false],
      lastUpdate: "2024-03-14",
      data: {
        columnas: [
          {
            id: "1",
            titulo: "Pendiente",
            tareas: [
              {
                id: "201",
                titulo: "Planificación de proyecto",
                prioridad: "Alta",
                fecha: "2024-03-18",
                estado: "Pendiente",
                participantes: ["Ana R.", "Luis M."],
                comentarios: ["Esperando aprobación"],
                archivos: ["plan.pdf"],
                checklist: [
                  { text: "Definir alcance", completed: true },
                  { text: "Asignar recursos", completed: true },
                  { text: "Aprobar presupuesto", completed: false },
                ],
              },
            ],
          },
        ],
      },
    },
  ],
};
