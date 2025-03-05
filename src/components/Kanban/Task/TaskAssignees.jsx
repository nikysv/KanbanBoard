import { useState } from "react";
import UserInitials from "./UserInitials";

const TaskAssignees = ({
  assignees,
  setAssignees,
  newAssignee,
  setNewAssignee,
  handleAddAssignee,
}) => {
  const handleRemoveAssignee = (assignee) => {
    setAssignees(assignees.filter((a) => a !== assignee));
  };

  return (
    <div className="border-t pt-4">
      <label className="block text-sm font-medium mb-2">
        Responsables de la tarea
      </label>

      <div className="flex flex-wrap gap-2 mb-3">
        {assignees.map((assignee) => (
          <div
            key={assignee}
            className="flex items-center gap-2 bg-gray-100 px-3 py-1.5 rounded-full"
          >
            <UserInitials name={assignee} size="small" />
            <span className="text-sm">{assignee}</span>
            <button
              onClick={() => handleRemoveAssignee(assignee)}
              className="text-gray-500 hover:text-red-500"
            >
              ×
            </button>
          </div>
        ))}
      </div>

      <div className="flex gap-2">
        <input
          type="text"
          value={newAssignee}
          onChange={(e) => setNewAssignee(e.target.value)}
          placeholder="Nombre del responsable..."
          className="flex-1 p-2 border rounded-md"
        />
        <button
          onClick={handleAddAssignee}
          disabled={!newAssignee.trim()}
          className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Asignar
        </button>
      </div>
    </div>
  );
};

export default TaskAssignees;
