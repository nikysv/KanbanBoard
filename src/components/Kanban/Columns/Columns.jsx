import { useState } from "react";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd"; // ✅ Drag & Drop funcional
import AddIcon from "../../icons/add";
import TrashIcon from "../../icons/trash";
import ViewModal from "../Modals/ViewModal";
import TaskModal from "../Modals/TaskModal";
import TaskCard from "../Task/TaskCard";
import ColumnModal from "../Modals/ColumnModal";
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

// Agregar la función getPriorityLevel directamente en el componente
const getPriorityLevel = (dueDate) => {
  if (!dueDate) return "low";

  const today = dayjs();
  const taskDate = dayjs(dueDate);
  const diffDays = taskDate.diff(today, "day");

  if (diffDays < 0) return "high"; // Vencida
  if (diffDays === 0) return "high"; // Vence hoy
  if (diffDays <= 3) return "medium"; // Próxima a vencer
  return "low"; // Tiene tiempo
};

const KanbanBoard = ({ data, filters, userType = "tigo" }) => {
  // Inicializar el estado usando los datos recibidos
  const [columns, setColumns] = useState(
    data.columnas.map((col) => ({
      id: col.id,
      title: col.titulo || col.title,
      userTypes: { tigo: true, externo: false },
    }))
  );

  const [tasks, setTasks] = useState(
    data.columnas.reduce((acc, col) => {
      acc[col.id] = (col.tasks || col.tareas || []).map((task) => ({
        id: task.id || Date.now().toString(),
        title: task.titulo || task.title,
        description: task.description || "",
        dueDate: task.fecha || task.dueDate,
        comments: task.comentarios || task.comments || [],
        assignees: task.participantes || task.assignees || [],
        files: task.archivos || task.files || [],
        isCompleted: task.estado === "Completada" || task.isCompleted || false,
        checklist: task.checklist || [],
      }));
      return acc;
    }, {})
  );

  const [modalOpen, setModalOpen] = useState(false);
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [columnModalOpen, setColumnModalOpen] = useState(false);
  const [deleteColumnModalOpen, setDeleteColumnModalOpen] = useState(false);
  const [selectedColumn, setSelectedColumn] = useState(null);
  const [selectedTask, setSelectedTask] = useState(null);
  const [columnToDelete, setColumnToDelete] = useState(null);
  const [editingColumn, setEditingColumn] = useState(null);

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

  const handleSaveComments = (updatedTask) => {
    setTasks((prevTasks) => ({
      ...prevTasks,
      [updatedTask.columnId]: prevTasks[updatedTask.columnId].map((task) =>
        task.id === updatedTask.id ? updatedTask : task
      ),
    }));
  };

  const handleOpenComments = (updatedTask) => {
    handleSaveComments(updatedTask);
    if (viewModalOpen && selectedTask?.id === updatedTask.id) {
      setSelectedTask(updatedTask);
    }
  };

  // Función para abrir el modal de edición de columna
  const handleEditColumn = (column, e) => {
    e.stopPropagation();
    setEditingColumn(column);
    setColumnModalOpen(true);
  };

  // Función para guardar los cambios de la columna
  const handleSaveColumn = (title, initialTasks, userTypes) => {
    if (editingColumn) {
      // Editar columna existente
      setColumns(
        columns.map((col) =>
          col.id === editingColumn.id
            ? {
                ...col,
                title,
                userTypes: userType === "tigo" ? userTypes : col.userTypes,
              }
            : col
        )
      );
      setEditingColumn(null);
    } else {
      // Crear nueva columna
      addColumn(title, initialTasks, { tigo: true, externo: false });
    }
    closeColumnModal();
  };

  const filterTask = (task) => {
    // Filtrar por prioridad si no es "all"
    if (filters.priority !== "all") {
      const priority = getPriorityLevel(task.dueDate);
      if (priority !== filters.priority) return false;
    }

    // Filtrar por fecha si no es "all"
    if (filters.date !== "all") {
      return dayjs(task.dueDate).format("YYYY-MM-DD") === filters.date;
    }

    return true;
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
                          {userType === "tigo" && (
                            <button
                              onClick={(e) => handleEditColumn(column, e)}
                              className="p-1.5 hover:bg-gray-200 rounded-md"
                              title="Editar columna"
                            >
                              ✏️
                            </button>
                          )}
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

                      {/* Línea separadora con color */}
                      <hr
                        className="w-full mb-4 border-t-2"
                        style={{ borderColor: generateColor(index, 60) }}
                      />

                      {/* Lista de tareas con filtro aplicado */}
                      <div className="flex-1 overflow-y-auto scrollbar-hide">
                        {tasks[column.id]?.filter(filterTask).map((task) => (
                          <TaskCard
                            key={task.id}
                            task={{ ...task, columnId: column.id }}
                            onView={openViewModal}
                            onDelete={(taskId) => deleteTask(taskId, column.id)}
                            onOpenComments={handleOpenComments}
                          />
                        ))}
                      </div>

                      {/* Botón para agregar tareas */}
                      <button
                        onClick={() => openModal(column.id)}
                        className="mt-2 w-full py-2 bg-white border border-gray-300 rounded-md hover:bg-gray-50 flex items-center justify-center gap-2"
                      >
                        <AddIcon size={20} />
                        <span>Agregar tarea</span>
                      </button>
                    </div>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>

      {/* Modales */}
      <TaskModal
        isOpen={modalOpen}
        onClose={closeModal}
        onSave={(title) => addTask(title, selectedColumn)}
      />
      <ViewModal
        isOpen={viewModalOpen}
        onClose={closeViewModal}
        task={selectedTask}
        onSave={updateTask}
        onComplete={completeTask}
        onOpenComments={handleOpenComments}
      />
      <ColumnModal
        isOpen={columnModalOpen}
        onClose={() => {
          closeColumnModal();
          setEditingColumn(null);
        }}
        onSave={handleSaveColumn}
        column={editingColumn}
        isTigoUser={userType === "tigo"}
      />
      <DeleteColumnModal
        isOpen={deleteColumnModalOpen}
        onClose={handleCancelDeleteColumn}
        onConfirm={handleConfirmDeleteColumn}
        columnTitle={columnToDelete?.title}
        tasksCount={columnToDelete ? tasks[columnToDelete.id]?.length || 0 : 0}
      />
    </div>
  );
};

export default KanbanBoard;
