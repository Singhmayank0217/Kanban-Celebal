"use client";

import { useState } from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Calendar, Paperclip } from "lucide-react";

const SortableCard = ({ card, onEdit, disabled = false }) => {
  const [isDragging, setIsDragging] = useState(false);

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging: sortableIsDragging,
  } = useSortable({
    id: card.id,
    disabled: disabled,
    data: {
      type: "card",
      card,
    },
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const handleClick = (e) => {
    if (!isDragging && !sortableIsDragging && !disabled && onEdit) {
      e.stopPropagation();
      onEdit(card.id);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return null;
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    });
  };

  const getLabelColor = (label) => {
    const colors = {
      design:
        "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200",
      backend:
        "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
      frontend: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
      testing:
        "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200",
      documentation:
        "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200",
      devops:
        "bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-200",
      research: "bg-pink-100 text-pink-800 dark:bg-pink-900 dark:text-pink-200",
      high: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200",
      medium:
        "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200",
      low: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
    };
    return (
      colors[label?.toLowerCase()] ||
      "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200"
    );
  };

  const dragging = isDragging || sortableIsDragging;

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`
        card p-4 mb-3 cursor-pointer hover:shadow-md transition-all duration-200
        ${dragging ? "opacity-50 rotate-2 scale-105 z-50" : ""}
        ${disabled ? "pointer-events-none opacity-75" : ""}
      `}
      onClick={handleClick}
      {...attributes}
      {...listeners}
    >
      <div className="flex items-start justify-between mb-3">
        <h3 className="text-sm font-medium text-gray-900 dark:text-gray-100 line-clamp-2 flex-1 pr-2">
          {card.title}
        </h3>
      </div>

      {card.description && (
        <p className="text-xs text-gray-600 dark:text-gray-400 mb-3 line-clamp-2">
          {card.description}
        </p>
      )}

      {card.labels && card.labels.length > 0 && (
        <div className="flex flex-wrap gap-1 mb-3">
          {card.labels.map((label, index) => (
            <span
              key={index}
              className={`
                inline-flex items-center px-2 py-1 rounded-full text-xs font-medium
                ${getLabelColor(label)}
              `}
            >
              {label}
            </span>
          ))}
        </div>
      )}

      {card.attachments && card.attachments.length > 0 && (
        <div className="flex items-center gap-1 mb-3 text-gray-500 dark:text-gray-400">
          <Paperclip className="w-3 h-3" />
          <span className="text-xs">{card.attachments.length}</span>
        </div>
      )}

      <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
        {card.dueDate && (
          <div className="flex items-center gap-1">
            <Calendar className="w-3 h-3" />
            <span>{formatDate(card.dueDate)}</span>
          </div>
        )}

        {card.assignee && (
          <div className="flex items-center gap-1">
            <div className="w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center text-white text-xs font-medium">
              {typeof card.assignee === "string"
                ? card.assignee.charAt(0).toUpperCase()
                : card.assignee.name?.charAt(0).toUpperCase() ||
                  card.assignee.avatar ||
                  "U"}
            </div>
            <span className="hidden sm:inline text-xs">
              {typeof card.assignee === "string"
                ? card.assignee
                : card.assignee.name}
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

export default SortableCard;
