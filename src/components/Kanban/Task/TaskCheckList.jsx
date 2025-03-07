const TaskChecklist = ({
  checklist,
  handleToggleChecklistItem,
  newChecklistItem,
  setNewChecklistItem,
  handleAddChecklistItem,
}) => {
  return (
    <div className="space-y-2">
      <h3 className="font-medium">Checklist</h3>

      {/* Lista de items */}
      <div className="space-y-2">
        {checklist?.map((item, index) => (
          <div
            key={`checklist-${index}-${item.text}`}
            className="flex items-center gap-2"
          >
            <input
              type="checkbox"
              checked={item.completed}
              onChange={() => handleToggleChecklistItem(index)}
              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <span
              className={item.completed ? "line-through text-gray-500" : ""}
            >
              {item.text}
            </span>
          </div>
        ))}
      </div>

      {/* Input para nuevo item */}
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
