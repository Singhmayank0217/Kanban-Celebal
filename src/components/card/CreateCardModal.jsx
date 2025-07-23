"use client";

import { useState } from "react";
import Modal from "../ui/Modal";
import DatePicker from "../ui/DatePicker";
import AttachmentUpload from "./AttachmentUpload";
import FileAttachment from "./FileAttachment";
import { AttachmentIcon } from "../icons/Icons";

const CreateCardModal = ({ isOpen, onClose, onCreateCard }) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [labels, setLabels] = useState([]);
  const [date, setDate] = useState(null);
  const [assignee, setAssignee] = useState("");
  const [attachments, setAttachments] = useState([]);
  const [showAttachmentUpload, setShowAttachmentUpload] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (title.trim()) {
      onCreateCard({
        title,
        description,
        labels,
        dueDate: date ? date.toISOString().split("T")[0] : null,
        assignee,
        attachments,
      });
      resetForm();
    }
  };

  const resetForm = () => {
    setTitle("");
    setDescription("");
    setLabels([]);
    setDate(null);
    setAssignee("");
    setAttachments([]);
  };

  const handleClose = () => {
    resetForm();
    onClose();
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

  const labelOptions = [
    { value: "design,medium", label: "Design (Medium)" },
    { value: "research,high", label: "Research (High)" },
    { value: "backend,high", label: "Backend (High)" },
    { value: "frontend,medium", label: "Frontend (Medium)" },
    { value: "testing,low", label: "Testing (Low)" },
    { value: "documentation,low", label: "Documentation (Low)" },
  ];

  return (
    <>
      <Modal isOpen={isOpen} onClose={handleClose} title="Create New Card">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label
              htmlFor="title"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              Title
            </label>
            <input
              id="title"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter card title"
              autoFocus
              required
              className="block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-purple-500 focus:border-purple-500 dark:bg-gray-700 dark:text-white transition-colors"
            />
          </div>

          <div className="space-y-2">
            <label
              htmlFor="description"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              Description
            </label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Add a more detailed description..."
              rows="3"
              className="block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-purple-500 focus:border-purple-500 dark:bg-gray-700 dark:text-white transition-colors"
            />
          </div>

          <div className="space-y-2">
            <label
              htmlFor="labels"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              Labels
            </label>
            <select
              id="labels"
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
            <label
              htmlFor="dueDate"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              Due Date
            </label>
            <DatePicker
              selected={date}
              onChange={setDate}
              placeholderText="Select a date"
            />
          </div>

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
            <div className="flex items-center justify-between">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Attachments{" "}
                {attachments.length > 0 && `(${attachments.length})`}
              </label>
              <button
                type="button"
                onClick={() => setShowAttachmentUpload(true)}
                className="flex items-center gap-1 px-2 py-1 text-xs font-medium text-purple-600 dark:text-purple-400 hover:bg-purple-50 dark:hover:bg-purple-900/20 rounded transition-colors"
              >
                <AttachmentIcon className="h-3 w-3" />
                Attach Files
              </button>
            </div>

            {attachments.length > 0 && (
              <div className="space-y-2 max-h-32 overflow-y-auto">
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

          <div className="flex justify-end space-x-2 pt-4">
            <button
              type="button"
              onClick={handleClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!title.trim()}
              className="px-4 py-2 text-sm font-medium text-white bg-purple-600 border border-transparent rounded-md shadow-sm hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Create Card
            </button>
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

export default CreateCardModal;
