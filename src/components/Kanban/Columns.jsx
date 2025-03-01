import { useState } from "react";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd"; // ✅ Drag & Drop funcional
import AddIcon from "../icons/add";
import TrashIcon from "../icons/trash";
import ViewModal from "./ViewModal";
import TaskModal from "./TaskModal";
import TaskCard from "./TaskCard";
import ColumnModal from "./ColumnModal";
import ModalComments from "./ModalComments";
import dayjs from "dayjs";

const DeleteColumnModal = ({
  isOpen,
  onClose,
  onConfirm,
  columnTitle,
  tasksCount,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-96">
        <h3 className="text-lg font-semibold mb-4">
          Confirmar eliminación de columna
        </h3>
        <p className="text-gray-600 mb-4">
          ¿Estás seguro de que deseas eliminar la columna "{columnTitle}"?
        </p>
        {tasksCount > 0 && (
          <p className="text-red-600 mb-6">
            ⚠️ Esta columna contiene {tasksCount}{" "}
            {tasksCount === 1 ? "tarea" : "tareas"} que también{" "}
            {tasksCount === 1 ? "será eliminada" : "serán eliminadas"}.
          </p>
        )}
        <div className="flex justify-end gap-2">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-300 rounded-md hover:bg-gray-400"
          >
            Cancelar
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600"
          >
            Eliminar
          </button>
        </div>
      </div>
    </div>
  );
};

const KanbanBoard = () => {
  const [columns, setColumns] = useState([
    { id: "1", title: "Pendiente" },
    { id: "2", title: "En Proceso" },
    { id: "3", title: "Finalizado" },
  ]);

  const [tasks, setTasks] = useState({
    1: [
      {
        id: "101",
        title: "Revisar documentos",
        description: "Revisar y firmar los documentos legales",
        dueDate: dayjs().add(5, "day").format("YYYY-MM-DD"),
        comments: [],
      },
    ],
    2: [
      {
        id: "201",
        title: "Desarrollar API",
        description: "Implementar endpoints de usuario",
        dueDate: dayjs().add(7, "day").format("YYYY-MM-DD"),
        isCompleted: true,
        comments: [],
      },
    ],
    3: [
      {
        id: "301",
        title: "Publicar reporte final",
        description: "Subir el informe de desempeño",
        dueDate: dayjs().subtract(1, "day").format("YYYY-MM-DD"),
        comments: [],
      },
    ],
  });

  const [modalOpen, setModalOpen] = useState(false);
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [columnModalOpen, setColumnModalOpen] = useState(false);
  const [deleteColumnModalOpen, setDeleteColumnModalOpen] = useState(false);
  const [commentsModalOpen, setCommentsModalOpen] = useState(false);
  const [selectedColumn, setSelectedColumn] = useState(null);
  const [selectedTask, setSelectedTask] = useState(null);
  const [columnToDelete, setColumnToDelete] = useState(null);

  const generateColor = (index, lightness = 80) => {
    const hue = (index * 137) % 360; // Espaciado uniforme en la rueda de colores
    return `hsl(${hue}, 70%, ${lightness}%)`; // 70% saturación, luz ajustable
  };

  const openModal = (columnId) => {
    setSelectedColumn(columnId); // ✅ Guarda la columna seleccionada
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setSelectedColumn(null);
  };

  const openViewModal = (task) => {
    setSelectedTask(task);
    setViewModalOpen(true);
  };

  const closeViewModal = () => {
    setViewModalOpen(false);
    setSelectedTask(null);
  };

  const openColumnModal = () => setColumnModalOpen(true); // ✅ Abrir modal de columnas
  const closeColumnModal = () => setColumnModalOpen(false);

  const addColumn = (
    title,
    initialTasks = [],
    userTypes = { tigo: true, externo: false }
  ) => {
    const newColumn = {
      id: Date.now().toString(),
      title,
      userTypes,
    };
    setColumns([...columns, newColumn]);
    setTasks((prevTasks) => ({
      ...prevTasks,
      [newColumn.id]: initialTasks,
    }));
    closeColumnModal();
  };

  const handleDeleteColumnClick = (columnId, e) => {
    e.stopPropagation();
    const column = columns.find((col) => col.id === columnId);
    setColumnToDelete(column);
    setDeleteColumnModalOpen(true);
  };

  const handleConfirmDeleteColumn = () => {
    if (columnToDelete) {
      setColumns((prevColumns) =>
        prevColumns.filter((column) => column.id !== columnToDelete.id)
      );

      setTasks((prevTasks) => {
        const updatedTasks = { ...prevTasks };
        delete updatedTasks[columnToDelete.id];
        return updatedTasks;
      });
    }
    setDeleteColumnModalOpen(false);
    setColumnToDelete(null);
  };

  const handleCancelDeleteColumn = () => {
    setDeleteColumnModalOpen(false);
    setColumnToDelete(null);
  };

  const addTask = (taskTitle, columnId) => {
    if (!columnId) return; // ✅ Evita que se agregue si `columnId` no está definido

    const newTask = {
      id: Date.now().toString(),
      title: taskTitle,
      description: "",
      dueDate: dayjs().format("YYYY-MM-DD"),
      comments: [],
      checklist: [],
      assignees: [],
      files: [],
      isCompleted: false,
      columnId: columnId,
    };

    setTasks((prevTasks) => ({
      ...prevTasks,
      [columnId]: [...prevTasks[columnId], newTask], // ✅ Agrega la tarea en la columna correcta
    }));

    closeModal();
  };

  const updateTask = (updatedTask) => {
    setTasks((prevTasks) => ({
      ...prevTasks,
      [updatedTask.columnId]: prevTasks[updatedTask.columnId].map((task) =>
        task.id === updatedTask.id ? updatedTask : task
      ),
    }));
  };

  const deleteTask = (taskId, columnId) => {
    setTasks((prevTasks) => ({
      ...prevTasks,
      [columnId]: prevTasks[columnId].filter((task) => task.id !== taskId),
    }));
  };

  const onDragEnd = (result) => {
    if (!result.destination) return;

    const reorderedColumns = [...columns];
    const [movedColumn] = reorderedColumns.splice(result.source.index, 1);
    reorderedColumns.splice(result.destination.index, 0, movedColumn);

    setColumns(reorderedColumns);
  };

  const completeTask = (taskId, columnId) => {
    setTasks((prevTasks) => ({
      ...prevTasks,
      [columnId]: prevTasks[columnId].map((task) =>
        task.id === taskId ? { ...task, isCompleted: true } : task
      ),
    }));
  };

  const handleOpenComments = (task) => {
    setSelectedTask(task);
    setCommentsModalOpen(true);
  };

  const handleCloseComments = () => {
    setSelectedTask(null);
    setCommentsModalOpen(false);
  };

  const handleSaveComments = (updatedTask) => {
    setTasks((prevTasks) => ({
      ...prevTasks,
      [updatedTask.columnId]: prevTasks[updatedTask.columnId].map((task) =>
        task.id === updatedTask.id ? updatedTask : task
      ),
    }));
  };

  return (
    <div className="container mx-auto p-5">
      <button
        onClick={openColumnModal}
        className="mb-4 px-4 py-2 bg-sky-500 text-white rounded-md hover:bg-slate-400"
      >
        + Agregar Columna
      </button>
      <DragDropContext onDragEnd={onDragEnd}>
        <Droppable droppableId="columns" direction="horizontal">
          {(provided) => (
            <div
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 p-5"
              {...provided.droppableProps}
              ref={provided.innerRef}
            >
              {columns.map((column, index) => (
                <Draggable
                  key={column.id}
                  draggableId={column.id}
                  index={index}
                >
                  {(provided) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                      className="bg-stone-100 p-4 rounded-lg shadow-md relative flex flex-col w-full h-[280px]"
                    >
                      {/* Header con título, número y eliminar */}
                      <div className="flex justify-between items-center mb-2">
                        <div>
                          <h2 className="text-lg font-semibold">
                            {column.title}
                          </h2>
                          <div className="flex gap-1 mt-1">
                            {column.userTypes?.tigo && (
                              <span className="text-xs px-2 py-0.5 bg-blue-100 text-blue-800 rounded">
                                Tigo
                              </span>
                            )}
                            {column.userTypes?.externo && (
                              <span className="text-xs px-2 py-0.5 bg-green-100 text-green-800 rounded">
                                Externo
                              </span>
                            )}
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <div
                            className="w-6 h-6 flex items-center justify-center rounded-full text-black text-sm font-bold"
                            style={{
                              backgroundColor: generateColor(index, 80),
                            }}
                          >
                            {tasks[column.id]?.length || 0}
                          </div>
                          <button
                            className="p-1.5 hover:bg-gray-200 rounded-md"
                            onClick={(e) =>
                              handleDeleteColumnClick(column.id, e)
                            }
                          >
                            <TrashIcon size={20} color="black" />
                          </button>
                        </div>
                      </div>

                      <hr
                        className="w-full mb-4 border-t-2"
                        style={{ borderColor: generateColor(index, 60) }}
                      />

                      {/* Contenedor de tareas con scroll */}
                      <div className="flex-1 overflow-y-auto space-y-2 pr-2 scrollbar-hide">
                        {tasks[column.id]?.map((task) => (
                          <TaskCard
                            key={task.id}
                            task={{ ...task, columnId: column.id }}
                            onView={openViewModal}
                            onDelete={(taskId) => deleteTask(taskId, column.id)}
                            onOpenComments={handleOpenComments}
                          />
                        ))}
                      </div>

                      {/* ✅ Botón para agregar tareas */}
                      <div className="mt-3">
                        <button
                          onClick={() => openModal(column.id)}
                          className="flex items-center justify-center gap-2 bg-slate-100 rounded-lg border border-gray-400 px-6 py-2 w-full text-black font-semibold hover:bg-gray-200"
                        >
                          <AddIcon size={24} color="black" />
                          Añadir nueva tarea
                        </button>
                      </div>
                    </div>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>
      <ColumnModal
        isOpen={columnModalOpen}
        onClose={closeColumnModal}
        onSave={addColumn}
      />
      <TaskModal
        isOpen={modalOpen}
        onClose={closeModal}
        onSave={(title) => addTask(title, selectedColumn)}
        columnId={selectedColumn}
      />
      <ViewModal
        isOpen={viewModalOpen}
        onClose={closeViewModal}
        task={selectedTask}
        onSave={updateTask}
        onComplete={completeTask}
      />
      <DeleteColumnModal
        isOpen={deleteColumnModalOpen}
        onClose={handleCancelDeleteColumn}
        onConfirm={handleConfirmDeleteColumn}
        columnTitle={columnToDelete?.title}
        tasksCount={columnToDelete ? tasks[columnToDelete.id]?.length || 0 : 0}
      />
      <ModalComments
        isOpen={commentsModalOpen}
        onClose={handleCloseComments}
        task={selectedTask}
        onSave={handleSaveComments}
      />
    </div>
  );
};

export default KanbanBoard;
