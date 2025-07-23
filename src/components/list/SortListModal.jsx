"use client";

import { useState } from "react";
import Modal from "../ui/Modal";

const SortListModal = ({ isOpen, onClose, onSort }) => {
  const [sortBy, setSortBy] = useState("title");

  const handleSubmit = (e) => {
    e.preventDefault();
    onSort(sortBy);
  };

  const sortOptions = [
    { value: "title", label: "Title (A-Z)" },
    { value: "dueDate", label: "Due Date" },
    { value: "assignee", label: "Assignee" },
  ];

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Sort Cards">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Sort by
          </label>
          <div className="space-y-2">
            {sortOptions.map((option) => (
              <div key={option.value} className="flex items-center">
                <input
                  type="radio"
                  id={option.value}
                  name="sortBy"
                  value={option.value}
                  checked={sortBy === option.value}
                  onChange={() => setSortBy(option.value)}
                  className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 dark:border-gray-600"
                />
                <label
                  htmlFor={option.value}
                  className="ml-2 block text-sm text-gray-700 dark:text-gray-300 cursor-pointer"
                >
                  {option.label}
                </label>
              </div>
            ))}
          </div>
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
            className="px-4 py-2 text-sm font-medium text-white bg-purple-600 border border-transparent rounded-md shadow-sm hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-colors"
          >
            Sort Cards
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default SortListModal;
