import React from "react";

const TaskComments = ({
  comments = [],
  onAddComment,
  newComment = "",
  setNewComment,
}) => {
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!newComment?.trim()) return;

    onAddComment(newComment);
    setNewComment("");
  };

  return (
    <div className="mt-4">
      <h3 className="text-sm font-medium mb-2">Comentarios</h3>

      <div className="space-y-4 mb-4 max-h-[200px] overflow-y-auto">
        {comments.length === 0 ? (
          <p className="text-gray-500 text-sm text-center py-4">
            No hay comentarios aún. ¡Sé el primero en comentar!
          </p>
        ) : (
          comments.map((comment, index) => (
            <div key={index} className="bg-gray-50 p-3 rounded-lg">
              <div className="flex items-center gap-2 mb-1">
                <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white font-medium">
                  {comment.author?.[0] || "U"}
                </div>
                <div>
                  <span className="font-medium text-sm">
                    {comment.author || "Usuario"}
                  </span>
                  <span className="text-gray-500 text-xs ml-2">
                    {new Date(comment.timestamp).toLocaleString()}
                  </span>
                </div>
              </div>
              <p className="text-sm text-gray-700 ml-10">{comment.text}</p>
            </div>
          ))
        )}
      </div>

      <form onSubmit={handleSubmit} className="flex gap-2">
        <div className="flex-grow relative">
          <input
            type="text"
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Escribe un comentario..."
            className="w-full p-2 pr-20 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            type="submit"
            className="absolute right-2 top-1/2 -translate-y-1/2 px-4 py-1 bg-blue-500 text-white rounded-md text-sm hover:bg-blue-600 disabled:opacity-50"
            disabled={!newComment?.trim()}
          >
            Comentar
          </button>
        </div>
      </form>
    </div>
  );
};

export default TaskComments;
