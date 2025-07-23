"use client";

import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import {
  DndContext,
  DragOverlay,
  closestCorners,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
} from "@dnd-kit/sortable";
import MainLayout from "../components/layout/MainLayout";
import SortableList from "../components/list/SortableList";
import SortableCard from "../components/card/SortableCard";
import CreateListModal from "../components/list/CreateListModal";
import CardDetailModal from "../components/card/CardDetailModal";
import { useBoard } from "../hooks/useBoard";
import { useToast } from "../hooks/useToast";
import { PlusIcon, ChevronLeftIcon } from "../components/icons/Icons";

const initialBoardData = {
  lists: {
    "list-1": {
      id: "list-1",
      title: "To Do",
      cardIds: ["card-1", "card-2", "card-3"],
    },
    "list-2": {
      id: "list-2",
      title: "In Progress",
      cardIds: ["card-4", "card-5"],
    },
    "list-3": {
      id: "list-3",
      title: "Done",
      cardIds: ["card-6"],
    },
  },
  cards: {
    "card-1": {
      id: "card-1",
      title: "Research user needs",
      description: "Conduct user interviews and analyze feedback",
      labels: ["research", "high"],
      dueDate: "2023-07-15",
      assignee: "Alex Johnson",
    },
    "card-2": {
      id: "card-2",
      title: "Create wireframes",
      description: "Design initial wireframes for the new feature",
      labels: ["design", "medium"],
      dueDate: "2023-07-20",
      assignee: "Sam Taylor",
    },
    "card-3": {
      id: "card-3",
      title: "Technical specification",
      description: "Write technical documentation for implementation",
      labels: ["documentation", "medium"],
      dueDate: "2023-07-18",
      assignee: "Jordan Lee",
    },
    "card-4": {
      id: "card-4",
      title: "Implement API endpoints",
      description: "Create backend API endpoints for the feature",
      labels: ["backend", "high"],
      dueDate: "2023-07-25",
      assignee: "Morgan Chen",
    },
    "card-5": {
      id: "card-5",
      title: "Frontend development",
      description: "Build UI components for the new feature",
      labels: ["frontend", "high"],
      dueDate: "2023-07-28",
      assignee: "Taylor Swift",
    },
    "card-6": {
      id: "card-6",
      title: "Write unit tests",
      description: "Create comprehensive test suite for the feature",
      labels: ["testing", "medium"],
      dueDate: "2023-07-10",
      assignee: "Jamie Rodriguez",
    },
  },
  listOrder: ["list-1", "list-2", "list-3"],
};

const BoardPage = () => {
  const { id } = useParams();
  const { getBoard, getBoardData, updateBoardData } = useBoard();
  const { showToast } = useToast();
  const [board, setBoard] = useState(null);
  const [boardData, setBoardData] = useState(null);
  const [isCreateListModalOpen, setIsCreateListModalOpen] = useState(false);
  const [selectedCard, setSelectedCard] = useState(null);
  const [activeId, setActiveId] = useState(null);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  useEffect(() => {
    const boardInfo = getBoard(id);
    setBoard(boardInfo);

    const data = getBoardData(id);
    if (data) {
      setBoardData(data);
    } else {
      setBoardData(null);
    }
  }, [id, getBoard, getBoardData, updateBoardData]);

  const findContainer = (id) => {
    if (id in boardData.lists) {
      return id;
    }

    return Object.keys(boardData.lists).find((key) =>
      boardData.lists[key].cardIds.includes(id)
    );
  };

  const handleDragStart = (event) => {
    const { active } = event;
    setActiveId(active.id);
  };

  const handleDragOver = (event) => {
    const { active, over } = event;
    const overId = over?.id;

    if (!overId) return;

    const activeContainer = findContainer(active.id);
    const overContainer = findContainer(overId);

    if (
      !activeContainer ||
      !overContainer ||
      activeContainer === overContainer
    ) {
      return;
    }

    setBoardData((prev) => {
      const activeItems = prev.lists[activeContainer].cardIds;
      const overItems = prev.lists[overContainer].cardIds;

      const activeIndex = activeItems.indexOf(active.id);
      const overIndex = overItems.indexOf(overId);

      let newIndex;
      if (overId in prev.lists) {
        newIndex = overItems.length + 1;
      } else {
        const isBelowOverItem = over && overIndex < overItems.length - 1;
        const modifier = isBelowOverItem ? 1 : 0;
        newIndex = overIndex >= 0 ? overIndex + modifier : overItems.length + 1;
      }

      const newData = {
        ...prev,
        lists: {
          ...prev.lists,
          [activeContainer]: {
            ...prev.lists[activeContainer],
            cardIds: activeItems.filter((item) => item !== active.id),
          },
          [overContainer]: {
            ...prev.lists[overContainer],
            cardIds: [
              ...overItems.slice(0, newIndex),
              active.id,
              ...overItems.slice(newIndex),
            ],
          },
        },
      };

      return newData;
    });
  };

  const handleDragEnd = (event) => {
    const { active, over } = event;
    const overId = over?.id;

    setActiveId(null);

    if (!overId) return;

    const activeContainer = findContainer(active.id);
    const overContainer = findContainer(overId);

    if (!activeContainer || !overContainer) {
      return;
    }

    if (activeContainer === overContainer) {
      const activeIndex = boardData.lists[activeContainer].cardIds.indexOf(
        active.id
      );
      const overIndex = boardData.lists[overContainer].cardIds.indexOf(overId);

      if (activeIndex !== overIndex) {
        setBoardData((prev) => {
          const newData = {
            ...prev,
            lists: {
              ...prev.lists,
              [overContainer]: {
                ...prev.lists[overContainer],
                cardIds: arrayMove(
                  prev.lists[overContainer].cardIds,
                  activeIndex,
                  overIndex
                ),
              },
            },
          };
          updateBoardData(id, newData);
          return newData;
        });
      }
    } else {
      // Save the final state after moving between containers
      updateBoardData(id, boardData);
    }
  };

  const handleCreateList = (newList) => {
    const listId = `list-${Date.now()}`;
    const updatedData = {
      ...boardData,
      lists: {
        ...boardData.lists,
        [listId]: {
          id: listId,
          title: newList.title,
          cardIds: [],
        },
      },
      listOrder: [...boardData.listOrder, listId],
    };

    setBoardData(updatedData);
    updateBoardData(id, updatedData);
    setIsCreateListModalOpen(false);
  };

  const handleCardClick = (cardId) => {
    setSelectedCard(boardData.cards[cardId]);
  };

  const handleUpdateCard = (updatedCard) => {
    const updatedData = {
      ...boardData,
      cards: {
        ...boardData.cards,
        [updatedCard.id]: updatedCard,
      },
    };

    setBoardData(updatedData);
    updateBoardData(id, updatedData);
    setSelectedCard(null);
  };

  const handleDeleteCard = (cardId) => {
    const listId = Object.keys(boardData.lists).find((listId) =>
      boardData.lists[listId].cardIds.includes(cardId)
    );

    if (listId) {
      const updatedList = {
        ...boardData.lists[listId],
        cardIds: boardData.lists[listId].cardIds.filter((id) => id !== cardId),
      };

      const updatedCards = { ...boardData.cards };
      delete updatedCards[cardId];

      const updatedData = {
        ...boardData,
        lists: {
          ...boardData.lists,
          [listId]: updatedList,
        },
        cards: updatedCards,
      };

      setBoardData(updatedData);
      updateBoardData(id, updatedData);
      setSelectedCard(null);

      showToast({
        title: "Card deleted",
        message: "The card has been deleted successfully.",
        type: "success",
      });
    }
  };

  const handleCreateCard = (listId, cardData) => {
    const cardId = `card-${Date.now()}`;
    const newCard = {
      id: cardId,
      ...cardData,
    };

    const updatedList = {
      ...boardData.lists[listId],
      cardIds: [...boardData.lists[listId].cardIds, cardId],
    };

    const updatedData = {
      ...boardData,
      lists: {
        ...boardData.lists,
        [listId]: updatedList,
      },
      cards: {
        ...boardData.cards,
        [cardId]: newCard,
      },
    };

    setBoardData(updatedData);
    updateBoardData(id, updatedData);
  };

  const handleRenameList = (listId, updatedList) => {
    const updatedData = {
      ...boardData,
      lists: {
        ...boardData.lists,
        [listId]: updatedList,
      },
    };

    setBoardData(updatedData);
    updateBoardData(id, updatedData);

    showToast({
      title: "List Renamed",
      message: `List renamed to "${updatedList.title}".`,
      type: "success",
    });
  };

  const handleDeleteList = (listId) => {
    const cardIdsToDelete = boardData.lists[listId].cardIds;
    const updatedCards = { ...boardData.cards };
    cardIdsToDelete.forEach((cardId) => {
      delete updatedCards[cardId];
    });
    const updatedLists = { ...boardData.lists };
    delete updatedLists[listId];
    const updatedListOrder = boardData.listOrder.filter((id) => id !== listId);

    const updatedData = {
      ...boardData,
      lists: updatedLists,
      cards: updatedCards,
      listOrder: updatedListOrder,
    };

    setBoardData(updatedData);
    updateBoardData(id, updatedData);

    showToast({
      title: "List deleted",
      message: "The list and all its cards have been deleted.",
      type: "success",
    });
  };

  const handleSortList = (listId, sortBy) => {
    const list = boardData.lists[listId];
    const cards = list.cardIds.map((id) => boardData.cards[id]);

    let sortedCards = [...cards];
    switch (sortBy) {
      case "title":
        sortedCards.sort((a, b) => a.title.localeCompare(b.title));
        break;
      case "dueDate":
        sortedCards.sort((a, b) => {
          if (!a.dueDate && !b.dueDate) return 0;
          if (!a.dueDate) return 1;
          if (!b.dueDate) return -1;
          return new Date(a.dueDate) - new Date(b.dueDate);
        });
        break;
      case "assignee":
        sortedCards.sort((a, b) =>
          (a.assignee || "").localeCompare(b.assignee || "")
        );
        break;
      default:
        return;
    }

    const sortedCardIds = sortedCards.map((card) => card.id);

    const updatedBoard = {
      ...boardData,
      lists: {
        ...boardData.lists,
        [listId]: {
          ...list,
          cardIds: sortedCardIds, // ✅ this is what triggers visual reorder
        },
      },
    };

    setBoardData(updatedBoard);
    updateBoardData(id, updatedBoard); // optional backend update

    showToast({
      title: "Sorted!",
      message: `List "${list.title}" sorted by ${sortBy}.`,
      type: "success",
    });
  };

  if (!board || !boardData) {
    return (
      <MainLayout>
        <div className="flex justify-center items-center h-64">
          <div className="animate-pulse text-gray-500 dark:text-gray-400">
            Loading board...
          </div>
        </div>
      </MainLayout>
    );
  }

  return (
    <>
      <div className="flex items-center gap-4 mb-6">
        <Link
          to="/dashboard"
          className="flex items-center text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors"
        >
          <ChevronLeftIcon className="h-5 w-5 mr-1" />
          <span>Back to Boards</span>
        </Link>
        <div className="h-6 w-px bg-gray-300 dark:bg-gray-600"></div>
        <h1 className="text-xl font-bold text-gray-800 dark:text-white">
          {board.title}
        </h1>
      </div>

      <div className="overflow-x-auto pb-8">
        <DndContext
          sensors={sensors}
          collisionDetection={closestCorners}
          onDragStart={handleDragStart}
          onDragOver={handleDragOver}
          onDragEnd={handleDragEnd}
        >
          <div className="flex gap-4 min-h-[calc(100vh-200px)]">
            <SortableContext items={boardData.listOrder}>
              {boardData.listOrder.map((listId) => {
                const list = boardData.lists[listId];
                if (!list) return null;
                const cards = list.cardIds
                  .map((cardId) => boardData.cards[cardId])
                  .filter(Boolean);
                return (
                  <SortableList
                    key={list.id}
                    list={list}
                    cards={cards}
                    onCardClick={handleCardClick}
                    onCreateCard={handleCreateCard}
                    onEditCard={handleCardClick}
                    onRenameList={handleRenameList}
                    onDeleteList={handleDeleteList}
                    onSortCards={handleSortList}
                  />
                );
              })}
            </SortableContext>

            <div className="shrink-0 w-72">
              <button
                onClick={() => setIsCreateListModalOpen(true)}
                className="w-full border-2 border-dashed border-gray-300 dark:border-gray-600 h-12 rounded-md flex items-center justify-center text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
              >
                <PlusIcon className="h-5 w-5 mr-2" /> Add List
              </button>
            </div>
          </div>

          <DragOverlay>
            {activeId ? (
              boardData.cards[activeId] ? (
                <SortableCard card={boardData.cards[activeId]} isDragging />
              ) : null
            ) : null}
          </DragOverlay>
        </DndContext>
      </div>

      <CreateListModal
        isOpen={isCreateListModalOpen}
        onClose={() => setIsCreateListModalOpen(false)}
        onCreateList={handleCreateList}
      />

      {selectedCard && (
        <CardDetailModal
          card={selectedCard}
          isOpen={!!selectedCard}
          onClose={() => setSelectedCard(null)}
          onUpdate={handleUpdateCard}
          onDelete={handleDeleteCard}
        />
      )}
    </>
  );
};

export default BoardPage;
