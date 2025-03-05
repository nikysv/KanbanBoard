const TaskChecklist = ({ checklist, handleToggleChecklistItem, newChecklistItem, setNewChecklistItem, handleAddChecklistItem }) => {
    const completedItems = checklist.filter(item => item.completed).length;
    const totalItems = checklist.length;
    const progress = totalItems > 0 ? Math.round((completedItems / totalItems) * 100) : 0;
  
    return (
      <div>
        <h3 className="text-sm font-medium mb-2">Checklist ({progress}%)</h3>
        <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
          <div className="bg-blue-500 h-2 rounded-full" style={{ width: `${progress}%` }}></div>
        </div>
        <ul className="space-y-2">
          {checklist.map((item) => (
            <li key={item.id} className="flex items-center gap-2 bg-gray-100 p-2 rounded-md">
              <input type="checkbox" checked={item.completed} onChange={() => handleToggleChecklistItem(item.id)} />
              <span className={item.completed ? "line-through text-gray-500" : "text-gray-800"}>{item.text}</span>
            </li>
          ))}
        </ul>
        <div className="mt-3 flex">
          <input type="text" value={newChecklistItem} onChange={(e) => setNewChecklistItem(e.target.value)} placeholder="Nueva subtarea..." className="flex-1 p-2 border rounded-md" />
          <button onClick={handleAddChecklistItem} className="ml-2 px-4 py-2 bg-blue-500 text-white rounded-md">Agregar</button>
        </div>
      </div>
    );
  };
  
  export default TaskChecklist;
  