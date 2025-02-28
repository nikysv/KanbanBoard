import { useState } from "react";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd"; // ✅ Drag & Drop funcional
import AddIcon from "../icons/add";
import TrashIcon from "../icons/trash";
import ViewModal from "./ViewModal";
import TaskModal from "./TaskModal";
import TaskCard from "./TaskCard";
import ColumnModal from "./ColumnModal";
import dayjs from "dayjs";

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
        columnId: "1",
        isCompleted: true,
      },
    ],
    2: [
      {
        id: "201",
        title: "Desarrollar API",
        description: "Implementar endpoints de usuario",
        dueDate: dayjs().add(7, "day").format("YYYY-MM-DD"),
      },
    ],
    3: [
      {
        id: "301",
        title: "Publicar reporte final",
        description: "Subir el informe de desempeño",
        dueDate: dayjs().subtract(1, "day").format("YYYY-MM-DD"),
      },
    ],
  });

  const [modalOpen, setModalOpen] = useState(false);
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [columnModalOpen, setColumnModalOpen] = useState(false);
  const [selectedColumn, setSelectedColumn] = useState(null);
  const [selectedTask, setSelectedTask] = useState(null);

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

  const addColumn = (title) => {
    const newColumn = { id: Date.now().toString(), title };
    setColumns([...columns, newColumn]);
    setTasks((prevTasks) => ({ ...prevTasks, [newColumn.id]: [] })); // Initialize empty array for new column
    closeColumnModal();
  };

  const deleteColumn = (columnId) => {
    setColumns((prevColumns) =>
      prevColumns.filter((column) => column.id !== columnId)
    );

    setTasks((prevTasks) => {
      const updatedTasks = { ...prevTasks };
      delete updatedTasks[columnId];
      return updatedTasks;
    });
  };

  const addTask = (taskTitle, columnId) => {
    if (!columnId) return;

    const newTask = {
      id: Date.now().toString(),
      title: taskTitle,
      description: "",
      dueDate: dayjs().format("YYYY-MM-DD"),
      columnId, // Add columnId to the task
      isCompleted: false,
    };

    setTasks((prevTasks) => {
      const columnTasks = prevTasks[columnId] || [];
      return {
        ...prevTasks,
        [columnId]: [...columnTasks, newTask],
      };
    });

    closeModal();
  };

  const updateTask = (updatedTask) => {
    if (!updatedTask || !updatedTask.columnId) return;

    setTasks((prevTasks) => {
      const columnTasks = prevTasks[updatedTask.columnId] || [];
      return {
        ...prevTasks,
        [updatedTask.columnId]: columnTasks.map((task) =>
          task.id === updatedTask.id ? { ...updatedTask } : task
        ),
      };
    });
  };

  const deleteTask = (taskId, columnId) => {
    if (!taskId || !columnId) return;

    setTasks((prevTasks) => {
      const columnTasks = prevTasks[columnId] || [];
      return {
        ...prevTasks,
        [columnId]: columnTasks.filter((task) => task.id !== taskId),
      };
    });
  };

  const onDragEnd = (result) => {
    const { destination, source, draggableId, type } = result;

    if (!destination) return;

    // If dropped in the same position
    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) {
      return;
    }

    // Handle column reordering
    if (type === "column") {
      const reorderedColumns = [...columns];
      const [movedColumn] = reorderedColumns.splice(source.index, 1);
      reorderedColumns.splice(destination.index, 0, movedColumn);
      setColumns(reorderedColumns);
      return;
    }

    // Handle task reordering
    const sourceColumn = source.droppableId;
    const destinationColumn = destination.droppableId;

    // Moving within the same column
    if (sourceColumn === destinationColumn) {
      const columnTasks = [...(tasks[sourceColumn] || [])];
      const [movedTask] = columnTasks.splice(source.index, 1);
      columnTasks.splice(destination.index, 0, {
        ...movedTask,
        columnId: sourceColumn,
      });

      setTasks({
        ...tasks,
        [sourceColumn]: columnTasks,
      });
    } else {
      // Moving to a different column
      const sourceColumnTasks = [...(tasks[sourceColumn] || [])];
      const destinationColumnTasks = [...(tasks[destinationColumn] || [])];
      const [movedTask] = sourceColumnTasks.splice(source.index, 1);

      // Update the task with the new column ID
      const updatedTask = {
        ...movedTask,
        columnId: destinationColumn,
      };

      destinationColumnTasks.splice(destination.index, 0, updatedTask);

      setTasks({
        ...tasks,
        [sourceColumn]: sourceColumnTasks,
        [destinationColumn]: destinationColumnTasks,
      });
    }
  };

  const completeTask = (updatedTask) => {
    if (!updatedTask || !updatedTask.columnId) return;

    setTasks((prevTasks) => {
      const columnTasks = prevTasks[updatedTask.columnId] || [];
      return {
        ...prevTasks,
        [updatedTask.columnId]: columnTasks.map((task) =>
          task.id === updatedTask.id ? { ...task, isCompleted: true } : task
        ),
      };
    });
  };

  return (
    <div className="p-5">
      <button
        onClick={openColumnModal}
        className="mb-4 px-4 py-2 bg-sky-500 text-white rounded-md hover:bg-slate-400"
      >
        + Agregar Columna
      </button>
      <DragDropContext onDragEnd={onDragEnd}>
        <Droppable droppableId="board" direction="horizontal" type="column">
          {(provided) => (
            <div
              className="flex gap-4 p-5 min-h-24 w-full justify-center"
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
                      className="w-80 bg-stone-100 p-4 rounded-lg shadow-md relative flex flex-col"
                    >
                      {/* Header con título, número y eliminar */}
                      <div className="flex justify-between items-center">
                        <h2 className="text-lg font-semibold">
                          {column.title}
                        </h2>
                        <div className="flex items-center gap-2">
                          <div
                            className="w-6 h-6 flex items-center justify-center rounded-full text-black text-sm font-bold"
                            style={{
                              backgroundColor: generateColor(index, 80),
                            }}
                          >
                            {(tasks[column.id] || []).length}
                          </div>
                          <button
                            className="p-2 hover:bg-gray-200 rounded-md"
                            onClick={() => deleteColumn(column.id)}
                          >
                            <TrashIcon size={24} color="black" />
                          </button>
                        </div>
                      </div>

                      <hr
                        className="w-full my-3 border-t-2"
                        style={{ borderColor: generateColor(index, 60) }}
                      />

                      <Droppable droppableId={column.id} type="task">
                        {(provided) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.droppableProps}
                            className="max-h-48 overflow-y-auto space-y-2 pr-2 scrollbar-hide px-2"
                          >
                            {(tasks[column.id] || []).map((task, taskIndex) => (
                              <Draggable
                                key={task.id}
                                draggableId={task.id}
                                index={taskIndex}
                              >
                                {(provided) => (
                                  <div
                                    ref={provided.innerRef}
                                    {...provided.draggableProps}
                                    {...provided.dragHandleProps}
                                  >
                                    <TaskCard
                                      task={task}
                                      onView={openViewModal}
                                      onDelete={() =>
                                        deleteTask(task.id, column.id)
                                      }
                                    />
                                  </div>
                                )}
                              </Draggable>
                            ))}
                            {provided.placeholder}
                          </div>
                        )}
                      </Droppable>

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
        onSave={(taskTitle) => addTask(taskTitle, selectedColumn)}
      />
      <ViewModal
        isOpen={viewModalOpen}
        onClose={closeViewModal}
        task={selectedTask}
        onSave={updateTask}
        onComplete={completeTask} // ✅ Asegura que se pasa la función
      />
    </div>
  );
};

export default KanbanBoard;
