import { useState, useEffect } from "react";
import dayjs from "dayjs";
import useFileManager from "./useFileManager";

const useTaskModal = (task) => {
  const [title, setTitle] = useState(task.title);
  const [description, setDescription] = useState(task.description || "");
  const [dueDate, setDueDate] = useState(task.dueDate || "");
  const [isCompleted, setIsCompleted] = useState(task.isCompleted || false);
  const [newComment, setNewComment] = useState("");
  const [comments, setComments] = useState(task.comments || []);
  const [assignees, setAssignees] = useState(task.assignees || []);
  const [newAssignee, setNewAssignee] = useState("");
  const [checklist, setChecklist] = useState(task.checklist || []);
  const [newChecklistItem, setNewChecklistItem] = useState("");

  const { files, setFiles } = useFileManager(task.files || []);

  useEffect(() => {
    setTitle(task.title);
    setDescription(task.description || "");
    setDueDate(task.dueDate || "");
    setIsCompleted(task.isCompleted || false);
    setComments(task.comments || []);
    setAssignees(task.assignees || []);
    setChecklist(task.checklist || []);
    setFiles(task.files || []);
  }, [task]);

  const handleAddComment = () => {
    if (!newComment.trim()) return;
    setComments([
      ...comments,
      {
        id: Date.now().toString(),
        text: newComment.trim(),
        author: "Usuario Actual",
        createdAt: dayjs().format("YYYY-MM-DD HH:mm:ss"),
      },
    ]);
    setNewComment("");
  };

  const handleToggleChecklistItem = (itemId) => {
    setChecklist(
      checklist.map((item) =>
        item.id === itemId ? { ...item, completed: !item.completed } : item
      )
    );
  };

  const handleAddChecklistItem = () => {
    if (!newChecklistItem.trim()) return;
    setChecklist([
      ...checklist,
      {
        id: Date.now().toString(),
        text: newChecklistItem.trim(),
        completed: false,
        createdAt: dayjs().format("YYYY-MM-DD HH:mm:ss"),
      },
    ]);
    setNewChecklistItem("");
  };

  const handleAddAssignee = () => {
    if (!newAssignee.trim() || assignees.includes(newAssignee.trim())) return;
    setAssignees([...assignees, newAssignee.trim()]);
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
    setComments,
    newComment,
    setNewComment,
    handleAddComment,
    checklist,
    setChecklist,
    newChecklistItem,
    setNewChecklistItem,
    handleToggleChecklistItem,
    handleAddChecklistItem,
    assignees,
    setAssignees,
    newAssignee,
    setNewAssignee,
    handleAddAssignee,
    files,
  };
};

export default useTaskModal;
