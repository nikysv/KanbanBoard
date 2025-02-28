import dayjs from "dayjs"; // Manejo de fechas en JS
import relativeTime from "dayjs/plugin/relativeTime"; // Para calcular tiempos relativos
import "dayjs/locale/es"; // Español
import TrashIcon from "../icons/trash";

dayjs.extend(relativeTime);
dayjs.locale("es");

const TaskCard = ({ task, onView, onDelete }) => {
  // Función para calcular el color de la fecha
  const getDateBadgeColor = () => {
    if (!task.dueDate) return "bg-gray-300"; // Si no hay fecha, gris

    const today = dayjs();
    const dueDate = dayjs(task.dueDate);
    const diffDays = dueDate.diff(today, "day");
    const overdueDays = today.diff(dueDate, "day"); // Días de retraso

    if (diffDays >= 5) return "bg-green-300 text-green-800"; // 📍 Más de una semana → Verde
    if (diffDays >= 3) return "bg-orange-300 text-orange-800"; // 📍 3-4 días → Naranja
    if (diffDays >= 0) return "bg-red-400 text-white"; // 📍 Hoy → Rojo
    if (overdueDays <= 2) return "bg-red-500 text-white"; // 📍 Retrasado hasta 2 días → Rojo fuerte
    return "bg-gray-300 text-gray-800"; // 📍 Más de 2 días de retraso → Gris
  };

  const isOverdue = dayjs(task.dueDate).isBefore(dayjs(), "day");
  const overdueDays = dayjs().diff(dayjs(task.dueDate), "day");
  

  return (
    <div 
      className="bg-white p-4 rounded-lg shadow-md border border-gray-200 flex flex-col gap-2 cursor-pointer hover:bg-gray-100"
      onClick={() => onView(task)}
    >
    

       {/* 📍 Fecha con advertencia de retraso */}
       <div className="flex items-center gap-2">
        <div className={`text-xs font-semibold px-2 py-1 rounded-md w-fit ${getDateBadgeColor()}`}>
          {task.dueDate ? dayjs(task.dueDate).format("DD MMM").toUpperCase() : "SIN FECHA"}
        </div>
        {isOverdue && (
          <span className="text-red-500 text-xs font-bold">
            ⚠ {overdueDays > 2 ? "Vencida" : "Con retraso!"}
          </span>
        )}
      </div>

      {/* Título de la tarea */}
      <h3 className="text-md font-semibold text-gray-900">{task.title}</h3>

      {/* Íconos de usuarios, comentarios y adjuntos (simulados) */}
      <div className="flex items-center justify-between">
        {/* Simulación de avatares (cambiar cuando tengas lógica real) */}
        <div className="flex -space-x-1">
          <img className="w-6 h-6 rounded-full border-2 border-white" src="https://i.pravatar.cc/30?img=1" alt="user1"/>
          <img className="w-6 h-6 rounded-full border-2 border-white" src="https://i.pravatar.cc/30?img=2" alt="user2"/>
          <img className="w-6 h-6 rounded-full border-2 border-white" src="https://i.pravatar.cc/30?img=3" alt="user3"/>
        </div>

        {/* Íconos de acciones */}
        <div className="flex items-center gap-2">
          <button className="text-gray-500 hover:text-gray-700">
            💬 {/* Simula comentarios */}
          </button>
          <button className="text-gray-500 hover:text-gray-700">
            📂 {/* Simula adjuntos */}
          </button>

          {/* ✅ Botón de eliminar SIEMPRE visible */}
          <button 
            className="text-red-500 hover:text-red-700"
            onClick={(e) => { e.stopPropagation(); onDelete(task.id); }}
          >
            <TrashIcon size={20} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default TaskCard;
