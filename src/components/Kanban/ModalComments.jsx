import { useState } from "react";
import dayjs from "dayjs";

const ModalComments = ({ isOpen, onClose, task, onSave }) => {
  if (!isOpen) return null;

  const [newComment, setNewComment] = useState("");
  const [comments, setComments] = useState(task.comments || []);

  const handleAddComment = () => {
    if (!newComment.trim()) return;

    const comment = {
      id: Date.now().toString(),
      text: newComment.trim(),
      author: "Usuario", // Esto podría venir de un sistema de autenticación
      createdAt: dayjs().format("YYYY-MM-DD HH:mm:ss"),
      avatar: "https://i.pravatar.cc/30?img=1", // Avatar temporal
    };

    const updatedComments = [...comments, comment];
    setComments(updatedComments);
    onSave({ ...task, comments: updatedComments });
    setNewComment("");
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleAddComment();
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white rounded-lg shadow-lg w-[500px] max-h-[600px] flex flex-col">
        {/* Header */}
        <div className="p-4 border-b border-gray-200">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold">Comentarios</h3>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700"
            >
              ✕
            </button>
          </div>
          <p className="text-sm text-gray-600 mt-1">Tarea: {task.title}</p>
        </div>

        {/* Lista de comentarios */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {comments.length === 0 ? (
            <p className="text-gray-500 text-center py-4">
              No hay comentarios aún. ¡Sé el primero en comentar!
            </p>
          ) : (
            comments.map((comment) => (
              <div
                key={comment.id}
                className="flex gap-3 bg-gray-50 p-3 rounded-lg"
              >
                <img
                  src={comment.avatar}
                  alt={comment.author}
                  className="w-8 h-8 rounded-full"
                />
                <div className="flex-1">
                  <div className="flex justify-between items-start">
                    <h4 className="font-semibold text-sm">{comment.author}</h4>
                    <span className="text-xs text-gray-500">
                      {dayjs(comment.createdAt).format("DD/MM/YY HH:mm")}
                    </span>
                  </div>
                  <p className="text-sm text-gray-700 mt-1 whitespace-pre-wrap">
                    {comment.text}
                  </p>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Input para nuevo comentario */}
        <div className="border-t border-gray-200 p-4">
          <div className="flex gap-3">
            <img
              src="https://i.pravatar.cc/30?img=1"
              alt="Usuario actual"
              className="w-8 h-8 rounded-full"
            />
            <div className="flex-1">
              <textarea
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Escribe un comentario..."
                className="w-full p-2 border rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
                rows="2"
              />
              <div className="flex justify-end mt-2">
                <button
                  onClick={handleAddComment}
                  disabled={!newComment.trim()}
                  className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Comentar
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ModalComments;
