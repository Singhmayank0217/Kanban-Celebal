"use client";

import { useState, useEffect } from "react";
import Modal from "../ui/Modal";
import DatePicker from "../ui/DatePicker";
import FileAttachment from "./FileAttachment";
import AttachmentUpload from "./AttachmentUpload";
import { TrashIcon, AttachmentIcon } from "../icons/Icons";

const getLabelColor = (label) => {
  const colors = {
    design: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
    research:
      "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200",
    backend:
      "bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-200",
    frontend:
      "bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200",
    testing: "bg-rose-100 text-rose-800 dark:bg-rose-900 dark:text-rose-200",
    documentation:
      "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200",
    high: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200",
    medium:
      "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200",
    low: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
  };
  return (
    colors[label] ||
    "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200"
  );
};

const CardDetailModal = ({ card, isOpen, onClose, onUpdate, onDelete }) => {
  const [title, setTitle] = useState(card?.title || "");
  const [description, setDescription] = useState(card?.description || "");
  const [labels, setLabels] = useState(card?.labels || []);
  const [date, setDate] = useState(
    card?.dueDate ? new Date(card.dueDate) : null
  );
  const [assignee, setAssignee] = useState(card?.assignee || "");
  const [attachments, setAttachments] = useState(card?.attachments || []);
  const [showAttachmentUpload, setShowAttachmentUpload] = useState(false);

  useEffect(() => {
    if (card) {
      setTitle(card.title || "");
      setDescription(card.description || "");
      setLabels(card.labels || []);
      setDate(card.dueDate ? new Date(card.dueDate) : null);
      setAssignee(card.assignee || "");
      setAttachments(card.attachments || []);
    }
  }, [card]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (title.trim()) {
      onUpdate({
        ...card,
        title,
        description,
        labels,
        dueDate: date ? date.toISOString().split("T")[0] : null,
        assignee,
        attachments,
      });
    }
  };

  const handleDelete = () => {
    if (
      window.confirm(
        `Are you sure you want to delete the card "${card.title}"?`
      )
    ) {
      onDelete(card.id);
    }
  };

  const handleAttachFile = (attachment) => {
    setAttachments((prev) => [...prev, attachment]);
  };

  const handleRemoveAttachment = (attachmentId) => {
    setAttachments((prev) => prev.filter((att) => att.id !== attachmentId));
  };

  const teamMembers = [
    "Alex Johnson",
    "Sam Taylor",
    "Jordan Lee",
    "Morgan Chen",
    "Taylor Swift",
    "Jamie Rodriguez",
  ];

  // Label options
  const labelOptions = [
    { value: "design,medium", label: "Design (Medium)" },
    { value: "research,high", label: "Research (High)" },
    { value: "backend,high", label: "Backend (High)" },
    { value: "frontend,medium", label: "Frontend (Medium)" },
    { value: "testing,low", label: "Testing (Low)" },
    { value: "documentation,low", label: "Documentation (Low)" },
  ];

  if (!card) return null;

  return (
    <>
      <Modal isOpen={isOpen} onClose={onClose} title="">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <div className="flex flex-wrap gap-1 mb-2">
              {labels.map((label) => (
                <span
                  key={label}
                  className={`px-2 py-0.5 rounded-full text-xs font-medium ${getLabelColor(
                    label
                  )}`}
                >
                  {label}
                </span>
              ))}
            </div>

            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="block w-full text-xl font-semibold border-none p-0 focus:ring-0 bg-transparent text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
              placeholder="Card title"
              required
            />
          </div>

          <div className="space-y-4">
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-500 dark:text-gray-400">
                Assignee
              </label>
              <div className="flex items-center gap-2">
                <div className="h-6 w-6 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center text-xs font-medium">
                  {assignee
                    ? assignee
                        .split(" ")
                        .map((name) => name[0])
                        .join("")
                    : "?"}
                </div>
                <input
                  type="text"
                  value={assignee}
                  onChange={(e) => setAssignee(e.target.value)}
                  placeholder="Enter assignee name"
                  className="block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm bg-white dark:bg-gray-700 text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-purple-500 focus:border-purple-500 transition-colors"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-500 dark:text-gray-400">
                Due Date
              </label>
              <DatePicker
                selected={date}
                onChange={setDate}
                placeholderText="No due date"
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-500 dark:text-gray-400">
                Labels
              </label>
              <select
                value={labels.join(",")}
                onChange={(e) =>
                  setLabels(e.target.value ? e.target.value.split(",") : [])
                }
                className="block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500 dark:bg-gray-700 dark:text-white transition-colors"
              >
                <option value="">Select labels</option>
                {labelOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-500 dark:text-gray-400">
                Description
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Add a more detailed description..."
                rows="5"
                className="block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-purple-500 focus:border-purple-500 dark:bg-gray-700 dark:text-white transition-colors resize-none"
              />
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="block text-sm font-medium text-gray-500 dark:text-gray-400">
                  Attachments{" "}
                  {attachments.length > 0 && `(${attachments.length})`}
                </label>
                <button
                  type="button"
                  onClick={() => setShowAttachmentUpload(true)}
                  className="flex items-center gap-1 px-2 py-1 text-xs font-medium text-purple-600 dark:text-purple-400 hover:bg-purple-50 dark:hover:bg-purple-900/20 rounded transition-colors"
                >
                  <AttachmentIcon className="h-3 w-3" />
                  Attach
                </button>
              </div>

              {attachments.length > 0 && (
                <div className="space-y-2 max-h-40 overflow-y-auto">
                  {attachments.map((attachment) => (
                    <FileAttachment
                      key={attachment.id}
                      attachment={attachment}
                      onRemove={handleRemoveAttachment}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="flex justify-between pt-4">
            <button
              type="button"
              onClick={handleDelete}
              className="p-2 rounded-full text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
              title="Delete card"
            >
              <TrashIcon className="h-5 w-5" />
            </button>

            <div className="flex space-x-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 text-sm font-medium text-white bg-purple-600 border border-transparent rounded-md shadow-sm hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-colors"
              >
                Save Changes
              </button>
            </div>
          </div>
        </form>
      </Modal>

      {showAttachmentUpload && (
        <AttachmentUpload
          onAttach={handleAttachFile}
          onClose={() => setShowAttachmentUpload(false)}
        />
      )}
    </>
  );
};

export default CardDetailModal;
