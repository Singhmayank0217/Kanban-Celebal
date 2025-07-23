"use client";

import { useState, useEffect } from "react";
import Modal from "../ui/Modal";

const RenameListModal = ({ isOpen, onClose, onRename, currentTitle }) => {
  const [title, setTitle] = useState(currentTitle || "");

  useEffect(() => {
    setTitle(currentTitle || "");
  }, [currentTitle]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (title.trim() && title.trim() !== currentTitle) {
      onRename(title.trim());
    } else {
      onClose();
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Rename List">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <label
            htmlFor="title"
            className="block text-sm font-medium text-gray-700 dark:text-gray-300"
          >
            List Title
          </label>
          <input
            id="title"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Enter new list title"
            autoFocus
            required
            className="block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-purple-500 focus:border-purple-500 dark:bg-gray-700 dark:text-white transition-colors"
          />
        </div>

        <div className="flex justify-end space-x-2 pt-4">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={!title.trim() || title.trim() === currentTitle}
            className="px-4 py-2 text-sm font-medium text-white bg-purple-600 border border-transparent rounded-md shadow-sm hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            Rename
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default RenameListModal;
