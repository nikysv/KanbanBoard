import { useState } from "react";

const useTaskModal = (task) => {
  const initialTask = task || {};

  const [title, setTitle] = useState(initialTask.title || "");
  const [description, setDescription] = useState(initialTask.description || "");
  const [dueDate, setDueDate] = useState(initialTask.dueDate || "");
  const [isCompleted, setIsCompleted] = useState(
    initialTask.isCompleted || false
  );
  const [comments, setComments] = useState(initialTask.comments || []);
  const [newComment, setNewComment] = useState("");
  const [checklist, setChecklist] = useState(initialTask.checklist || []);
  const [newChecklistItem, setNewChecklistItem] = useState("");
  const [assignees, setAssignees] = useState(initialTask.assignees || []);
  const [newAssignee, setNewAssignee] = useState("");

  const handleToggleChecklistItem = (index) => {
    setChecklist((prevChecklist) => {
      const updatedChecklist = [...prevChecklist];
      updatedChecklist[index] = {
        ...updatedChecklist[index],
        completed: !updatedChecklist[index].completed,
      };
      return updatedChecklist;
    });
  };

  const handleAddChecklistItem = () => {
    if (!newChecklistItem.trim()) return;

    setChecklist((prev) => [
      ...prev,
      {
        id: `checklist-${Date.now()}`,
        text: newChecklistItem,
        completed: false,
      },
    ]);
    setNewChecklistItem("");
  };

  const handleAddComment = (commentText) => {
    const newCommentObj = {
      id: Date.now().toString(),
      text: commentText,
      author: "Usuario",
      timestamp: new Date().toISOString(),
    };
    setComments((prev) => [...prev, newCommentObj]);
  };

  const handleAddAssignee = () => {
    if (!newAssignee.trim()) return;
    setAssignees((prev) => [...prev, newAssignee]);
    setNewAssignee("");
  };

  return {
    title,
    setTitle,
    description,
    setDescription,
    dueDate,
    setDueDate,
    isCompleted,
    setIsCompleted,
    comments,
    newComment,
    setNewComment,
    handleAddComment,
    checklist,
    newChecklistItem,
    setNewChecklistItem,
    handleToggleChecklistItem,
    handleAddChecklistItem,
    assignees,
    setAssignees,
    newAssignee,
    setNewAssignee,
    handleAddAssignee,
  };
};

export default useTaskModal;
