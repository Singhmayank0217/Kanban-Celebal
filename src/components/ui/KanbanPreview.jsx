"use client";

import { useState, useEffect } from "react";

const KanbanPreview = () => {
  const [animationStep, setAnimationStep] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setAnimationStep((prev) => (prev + 1) % 4);
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  const lists = [
    {
      title: "To Do",
      color: "bg-red-100 dark:bg-red-900/30",
      cards: [
        { id: 1, title: "Design mockups", color: "bg-blue-500" },
        { id: 2, title: "User research", color: "bg-green-500" },
      ],
    },
    {
      title: "In Progress",
      color: "bg-yellow-100 dark:bg-yellow-900/30",
      cards: [{ id: 3, title: "Build components", color: "bg-purple-500" }],
    },
    {
      title: "Done",
      color: "bg-green-100 dark:bg-green-900/30",
      cards: [{ id: 4, title: "Setup project", color: "bg-gray-500" }],
    },
  ];

  return (
    <div className="space-y-3">
      <div className="flex gap-3 overflow-hidden">
        {lists.map((list, listIndex) => (
          <div key={listIndex} className="flex-1 min-w-0">
            <div
              className={`${list.color} rounded-lg p-3 transition-all duration-500`}
            >
              <h4 className="text-xs font-medium text-gray-700 dark:text-gray-300 mb-2">
                {list.title}
              </h4>
              <div className="space-y-2">
                {list.cards.map((card, cardIndex) => (
                  <div
                    key={card.id}
                    className={`
                      ${
                        card.color
                      } text-white text-xs p-2 rounded shadow-sm transition-all duration-500 transform
                      ${
                        animationStep === 1 && card.id === 1
                          ? "translate-x-16 opacity-50"
                          : animationStep === 2 && card.id === 1
                          ? "translate-x-32 opacity-75"
                          : animationStep === 3 && card.id === 1
                          ? "translate-x-48"
                          : ""
                      }
                    `}
                  >
                    {card.title}
                  </div>
                ))}

                {animationStep === 3 && listIndex === 1 && (
                  <div className="bg-blue-500 text-white text-xs p-2 rounded shadow-sm animate-pulse">
                    Design mockups
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className="text-center">
        <div className="flex justify-center space-x-1">
          {[0, 1, 2, 3].map((step) => (
            <div
              key={step}
              className={`w-2 h-2 rounded-full transition-colors duration-300 ${
                animationStep === step
                  ? "bg-purple-500"
                  : "bg-gray-300 dark:bg-gray-600"
              }`}
            />
          ))}
        </div>
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
          {animationStep === 0 && "Organize your tasks"}
          {animationStep === 1 && "Drag cards between lists"}
          {animationStep === 2 && "Track progress visually"}
          {animationStep === 3 && "Boost productivity"}
        </p>
      </div>
    </div>
  );
};

export default KanbanPreview;
