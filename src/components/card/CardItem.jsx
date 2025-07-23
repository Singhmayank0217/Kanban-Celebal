"use client";
import { Draggable } from "react-beautiful-dnd";
import { CalendarIcon } from "../icons/Icons";

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

const CardItem = ({ card, index, onClick }) => {
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  };

  return (
    <Draggable draggableId={card.id} index={index}>
      {(provided, snapshot) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          className="mb-2 transform transition-transform duration-200"
          style={{
            ...provided.draggableProps.style,
            transform: snapshot.isDragging
              ? provided.draggableProps.style.transform + " rotate(2deg)"
              : provided.draggableProps.style.transform,
          }}
        >
          <div
            onClick={onClick}
            className="bg-white dark:bg-gray-800 hover:shadow-md cursor-pointer transition-all rounded-md border border-gray-200 dark:border-gray-700"
          >
            <div className="p-3">
              <h4 className="font-medium text-gray-800 dark:text-gray-200 mb-2">
                {card.title}
              </h4>

              {card.labels && card.labels.length > 0 && (
                <div className="flex flex-wrap gap-1 mb-2">
                  {card.labels.map((label) => (
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
              )}

              <div className="flex items-center justify-between mt-3 text-xs text-gray-500 dark:text-gray-400">
                {card.dueDate && (
                  <div className="flex items-center">
                    <CalendarIcon className="h-3 w-3 mr-1" />
                    <span>{formatDate(card.dueDate)}</span>
                  </div>
                )}

                {card.assignee && (
                  <div className="flex items-center">
                    <div className="h-5 w-5 rounded-full bg-gray-200 dark:bg-gray-700 mr-1 flex items-center justify-center text-[10px] font-medium">
                      {card.assignee
                        .split(" ")
                        .map((name) => name[0])
                        .join("")}
                    </div>
                    <span className="truncate max-w-[100px]">
                      {card.assignee}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </Draggable>
  );
};

export default CardItem;
