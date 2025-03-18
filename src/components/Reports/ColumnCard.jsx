import TaskDetails from "./TaskDetails";

const ColumnCard = ({ columna }) => {
  return (
    <div className="mb-6 p-4 border rounded-lg shadow-md">
      <h2 className="text-xl font-semibold mb-2">{columna.titulo}</h2>
      <hr className="mb-4" />

      {!columna.tareas || columna.tareas.length === 0 ? (
        <p className="text-gray-500">No hay tareas en esta columna.</p>
      ) : (
        <div className="space-y-4">
          {columna.tareas.map((tarea, index) => (
            <TaskDetails key={tarea.id || index} tarea={tarea} />
          ))}
        </div>
      )}
    </div>
  );
};

export default ColumnCard;
