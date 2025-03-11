import React from 'react';

const TaskChecklist = ({
  checklist,
  handleToggleChecklistItem,
  newChecklistItem,
  setNewChecklistItem,
  handleAddChecklistItem
}) => {
  return (
    <div className="space-y-2" role="group" aria-label="Lista de subtareas">
      <h4 className="font-medium">Subtareas</h4>
      <div className="space-y-2 mb-3">
        {(checklist || []).map((item, index) => {
          const itemId = `checklist-item-${index}-${item.id || index}`;
          return (
            <div key={itemId} className="flex items-center gap-2 p-2 hover:bg-gray-50 rounded">
              <input
                type="checkbox"
                id={itemId}
                name={itemId}
                checked={item.completed || false}
                onChange={() => handleToggleChecklistItem(index)}
                className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                aria-label={`Marcar subtarea: ${item.text}`}
              />
              <label 
                htmlFor={itemId}
                className={`flex-1 cursor-pointer ${item.completed ? 'line-through text-gray-500' : ''}`}
              >
                {item.text}
              </label>
            </div>
          );
        })}
      </div>
      <div className="flex gap-2 mt-2">
        <input
          type="text"
          value={newChecklistItem}
          onChange={(e) => setNewChecklistItem(e.target.value)}
          placeholder="Agregar nuevo item..."
          className="flex-1 border rounded-md p-1 text-sm"
          onKeyPress={(e) => {
            if (e.key === "Enter" && newChecklistItem.trim()) {
              handleAddChecklistItem();
            }
          }}
        />
        <button
          onClick={handleAddChecklistItem}
          disabled={!newChecklistItem.trim()}
          className="px-3 py-1 bg-blue-500 text-white rounded-md disabled:bg-gray-300"
        >
          +
        </button>
      </div>
    </div>
  );
};

export default TaskChecklist;
