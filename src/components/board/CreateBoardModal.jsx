"use client";

import { useState } from "react";
import Modal from "../ui/Modal";

const CreateBoardModal = ({ isOpen, onClose, onCreateBoard }) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [color, setColor] = useState("bg-purple-600");

  const handleSubmit = (e) => {
    e.preventDefault();
    onCreateBoard({
      title,
      description,
      color,
    });
    setTitle("");
    setDescription("");
    setColor("bg-purple-600");
  };

  const colorOptions = [
    { value: "bg-purple-600", label: "Purple" },
    { value: "bg-blue-600", label: "Blue" },
    { value: "bg-emerald-600", label: "Green" },
    { value: "bg-amber-600", label: "Amber" },
    { value: "bg-rose-600", label: "Rose" },
  ];

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Create New Board">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <label
            htmlFor="title"
            className="block text-sm font-medium text-gray-700 dark:text-gray-300"
          >
            Board Title
          </label>
          <input
            id="title"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g. Product Development"
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
            placeholder="What is this board for?"
            rows="3"
            className="block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-purple-500 focus:border-purple-500 dark:bg-gray-700 dark:text-white transition-colors"
          />
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Board Color
          </label>
          <div className="flex flex-wrap gap-3">
            {colorOptions.map((option) => (
              <div key={option.value} className="flex items-center">
                <input
                  type="radio"
                  id={option.value}
                  name="color"
                  value={option.value}
                  checked={color === option.value}
                  onChange={() => setColor(option.value)}
                  className="sr-only"
                />
                <label
                  htmlFor={option.value}
                  className={`
                    w-8 h-8 rounded-full cursor-pointer flex items-center justify-center
                    ${option.value} ${
                    color === option.value
                      ? "ring-2 ring-offset-2 ring-gray-400 dark:ring-gray-700"
                      : ""
                  }
                  `}
                >
                  {color === option.value && (
                    <svg
                      className="w-4 h-4 text-white"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  )}
                </label>
                <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">
                  {option.label}
                </span>
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
            disabled={!title.trim()}
            className="px-4 py-2 text-sm font-medium text-white bg-purple-600 border border-transparent rounded-md shadow-sm hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            Create Board
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default CreateBoardModal;
