"use client";

import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { DndContext, DragOverlay, closestCorners } from "@dnd-kit/core";
import {
  SortableContext,
  horizontalListSortingStrategy,
} from "@dnd-kit/sortable";
import SortableList from "../components/list/SortableList";
import SortableCard from "../components/card/SortableCard";
import { ArrowLeft, Play, Pause, RotateCcw, Zap } from "lucide-react";

const DemoPage = () => {
  const [isRunning, setIsRunning] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [currentAction, setCurrentAction] = useState("");
  const [activeCard, setActiveCard] = useState(null);
  const intervalRef = useRef(null);

  const initialLists = [
    {
      id: "list-1",
      title: "To Do",
      cards: [
        {
          id: "card-1",
          title: "Design new landing page",
          description: "Create wireframes and mockups for the new homepage",
          labels: ["design", "high"],
          dueDate: "2024-01-25",
          assignee: "Sarah Wilson",
          attachments: [],
        },
        {
          id: "card-2",
          title: "Set up CI/CD pipeline",
          description: "Configure automated testing and deployment",
          labels: ["devops", "medium"],
          dueDate: "2024-01-30",
          assignee: "Mike Chen",
          attachments: [],
        },
        {
          id: "card-3",
          title: "Write API documentation",
          description: "Document all REST API endpoints",
          labels: ["documentation", "medium"],
          dueDate: "2024-01-20",
          assignee: "Alex Johnson",
          attachments: [],
        },
      ],
    },
    {
      id: "list-2",
      title: "In Progress",
      cards: [
        {
          id: "card-4",
          title: "Implement user authentication",
          description: "Add login, register, and password reset functionality",
          labels: ["backend", "high"],
          dueDate: "2024-01-22",
          assignee: "David Kim",
          attachments: [],
        },
      ],
    },
    {
      id: "list-3",
      title: "Review",
      cards: [
        {
          id: "card-5",
          title: "Update documentation",
          description: "Review and update project documentation",
          labels: ["documentation", "low"],
          dueDate: "2024-01-20",
          assignee: "Emma Davis",
          attachments: [],
        },
      ],
    },
    {
      id: "list-4",
      title: "Done",
      cards: [],
    },
  ];

  const [lists, setLists] = useState(initialLists);

  // Animation steps
  const animationSteps = [
    {
      action: 'Moving "Design new landing page" to In Progress',
      from: "list-1",
      to: "list-2",
      cardId: "card-1",
    },
    {
      action: 'Moving "Implement user authentication" to Review',
      from: "list-2",
      to: "list-3",
      cardId: "card-4",
    },
    {
      action: 'Moving "Update documentation" to Done',
      from: "list-3",
      to: "list-4",
      cardId: "card-5",
    },
    {
      action: 'Moving "Set up CI/CD pipeline" to In Progress',
      from: "list-1",
      to: "list-2",
      cardId: "card-2",
    },
    {
      action: 'Moving "Design new landing page" to Review',
      from: "list-2",
      to: "list-3",
      cardId: "card-1",
    },
  ];

  const moveCard = (cardId, fromListId, toListId) => {
    setLists((prevLists) => {
      const newLists = [...prevLists];
      const fromList = newLists.find((list) => list.id === fromListId);
      const toList = newLists.find((list) => list.id === toListId);

      if (fromList && toList) {
        const cardIndex = fromList.cards.findIndex(
          (card) => card.id === cardId
        );
        if (cardIndex !== -1) {
          const [card] = fromList.cards.splice(cardIndex, 1);
          toList.cards.push(card);
        }
      }

      return newLists;
    });
  };

  const startDemo = () => {
    setIsRunning(true);
    setCurrentStep(0);
    setCurrentAction("Starting automated demo...");

    intervalRef.current = setInterval(() => {
      setCurrentStep((prevStep) => {
        if (prevStep >= animationSteps.length) {
          setIsRunning(false);
          setCurrentAction("Demo completed! Click restart to run again.");
          clearInterval(intervalRef.current);
          return prevStep;
        }

        const step = animationSteps[prevStep];
        setCurrentAction(step.action);
        moveCard(step.cardId, step.from, step.to);

        return prevStep + 1;
      });
    }, 2500);
  };

  const pauseDemo = () => {
    setIsRunning(false);
    setCurrentAction("Demo paused. Click start to continue.");
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
  };

  const restartDemo = () => {
    setIsRunning(false);
    setCurrentStep(0);
    setCurrentAction("Demo reset. Click start to begin.");
    setLists(initialLists);
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
  };

  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  const handleDragStart = (event) => {
    if (!isRunning) {
      const { active } = event;
      const card = active.data.current?.card;
      setActiveCard(card);
    }
  };

  const handleDragEnd = (event) => {
    if (isRunning) return;

    const { active, over } = event;
    setActiveCard(null);

    if (!over) return;

    const activeCard = active.data.current?.card;
    const overList = over.data.current?.list;

    if (activeCard && overList) {
      moveCard(activeCard.id, findCardListId(activeCard.id), overList.id);
    }
  };

  const findCardListId = (cardId) => {
    for (const list of lists) {
      if (list.cards.some((card) => card.id === cardId)) {
        return list.id;
      }
    }
    return null;
  };

  const getTotalCards = () => {
    return lists.reduce((total, list) => total + list.cards.length, 0);
  };

  const getProgress = () => {
    if (animationSteps.length === 0) return 0;
    return Math.round((currentStep / animationSteps.length) * 100);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-b border-gray-200 dark:border-gray-700 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              <Link
                to="/"
                className="flex items-center gap-2 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                Back to Home
              </Link>
              <div className="h-6 w-px bg-gray-300 dark:bg-gray-600" />
              <div className="flex items-center gap-2">
                <Zap className="w-5 h-5 text-purple-600" />
                <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  Interactive Demo
                </h1>
              </div>
            </div>

            <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
              <span>{getTotalCards()} cards</span>
              <div className="h-4 w-px bg-gray-300 dark:bg-gray-600" />
              <span>
                Step {currentStep}/{animationSteps.length}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 mb-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div className="flex-1">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                Kanban Board Demo
              </h2>
              <p className="text-gray-600 dark:text-gray-300 text-sm">
                Watch how cards move through different stages of your workflow,
                or interact manually by pausing the demo.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={startDemo}
                disabled={isRunning}
                className="btn btn-primary px-4 py-2 text-sm rounded-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                <Play className="w-4 h-4" />
                Start Demo
              </button>

              <button
                onClick={pauseDemo}
                disabled={!isRunning}
                className="btn btn-secondary px-4 py-2 text-sm rounded-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                <Pause className="w-4 h-4" />
                Pause
              </button>

              <button
                onClick={restartDemo}
                className="btn btn-destructive px-4 py-2 text-sm rounded-lg flex items-center gap-2"
              >
                <RotateCcw className="w-4 h-4" />
                Restart
              </button>
            </div>
          </div>

          <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <div
                  className={`w-2 h-2 rounded-full ${
                    isRunning ? "bg-green-500 animate-pulse" : "bg-gray-400"
                  }`}
                />
                <span className="text-sm font-medium text-gray-900 dark:text-white">
                  {isRunning ? "Running" : "Stopped"}
                </span>
              </div>
              <span className="text-sm text-gray-600 dark:text-gray-300">
                {getProgress()}% Complete
              </span>
            </div>

            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 mb-2">
              <div
                className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full transition-all duration-500"
                style={{ width: `${getProgress()}%` }}
              />
            </div>

            {currentAction && (
              <p className="text-sm text-gray-600 dark:text-gray-300 animate-fade-in">
                <span className="font-medium">Current Action:</span>{" "}
                {currentAction}
              </p>
            )}
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
          <DndContext
            collisionDetection={closestCorners}
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
          >
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <SortableContext
                items={lists.map((list) => list.id)}
                strategy={horizontalListSortingStrategy}
              >
                {lists.map((list) => (
                  <SortableList
                    key={list.id}
                    list={list}
                    cards={list.cards}
                    onEditCard={(card) => {
                      if (!isRunning) {
                        console.log("Edit card:", card);
                      }
                    }}
                    disabled={isRunning}
                  />
                ))}
              </SortableContext>
            </div>

            <DragOverlay>
              {activeCard ? (
                <div className="rotate-2 scale-105">
                  <SortableCard card={activeCard} disabled={true} />
                </div>
              ) : null}
            </DragOverlay>
          </DndContext>
        </div>
      </div>
    </div>
  );
};

export default DemoPage;
