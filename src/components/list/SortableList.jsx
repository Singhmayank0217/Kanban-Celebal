"use client";

import { useState } from "react";
import { useDroppable } from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import SortableCard from "../card/SortableCard";
import CreateCardModal from "../card/CreateCardModal";
import RenameListModal from "./RenameListModal";
import SortListModal from "./SortListModal";
import { Plus, MoreHorizontal } from "lucide-react";

const SortableList = ({
  list,
  cards = [],
  onEditCard,
  onRenameList,
  onCreateCard,
  onSortCards,
  disabled = false,
}) => {
  const [isCreateCardModalOpen, setIsCreateCardModalOpen] = useState(false);
  const [isRenameModalOpen, setIsRenameModalOpen] = useState(false);
  const [isSortModalOpen, setIsSortModalOpen] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);

  const { setNodeRef } = useDroppable({
    id: list.id,
    data: {
      type: "list",
      list,
    },
  });

  const listCards = cards || list.cards || [];

  const handleCreateCard = (cardData) => {
    console.log("Create card with data:", cardData);
    onCreateCard(list.id, cardData);
    setIsCreateCardModalOpen(false);
  };

  const handleRename = (newTitle) => {
    const updatedList = {
      ...list,
      title: newTitle,
    };

    if (typeof onRenameList === "function") {
      onRenameList(list.id, updatedList);
    }

    setIsRenameModalOpen(false);
  };

  const handleSort = (sortBy) => {
    if (typeof onSortCards === "function") {
      onSortCards(list.id, sortBy);
    }
    setIsSortModalOpen(false);
  };

  const handleDelete = () => {
    if (
      window.confirm(
        `Are you sure you want to delete the list "${list.title}" and all its cards?`
      )
    ) {
      console.log("Delete list with id:", list.id);
    }
    setShowDropdown(false);
  };

  return (
    <div className="w-full max-w-sm">
      <div className="bg-gray-100 dark:bg-gray-700 rounded-lg p-3">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-medium text-gray-800 dark:text-gray-200 text-sm">
            {list.title}
          </h3>
          <div className="flex items-center gap-2">
            <span className="text-xs text-gray-500 dark:text-gray-400 bg-gray-200 dark:bg-gray-600 px-2 py-1 rounded-full">
              {listCards.length}
            </span>
            <div className="relative">
              <button
                onClick={() => setShowDropdown(!showDropdown)}
                className="p-1 rounded hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                disabled={disabled}
              >
                <MoreHorizontal className="w-4 h-4 text-gray-500 dark:text-gray-400" />
              </button>

              {showDropdown && (
                <div className="absolute right-0 mt-1 w-32 bg-white dark:bg-gray-800 rounded-md shadow-lg z-10 py-1 border border-gray-200 dark:border-gray-700">
                  <button
                    onClick={() => {
                      setShowDropdown(false);
                      setIsRenameModalOpen(true);
                    }}
                    className="w-full text-left px-3 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
                  >
                    Rename
                  </button>
                  <button
                    onClick={() => {
                      setShowDropdown(false);
                      setIsSortModalOpen(true);
                    }}
                    className="w-full text-left px-3 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
                  >
                    Sort
                  </button>
                  <button
                    onClick={handleDelete}
                    className="w-full text-left px-3 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-gray-100 dark:hover:bg-gray-700"
                  >
                    Delete
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        <div ref={setNodeRef} className="min-h-[200px] space-y-2">
          <SortableContext
            items={listCards.map((card) => card.id)}
            strategy={verticalListSortingStrategy}
          >
            {listCards.map((card) => (
              <SortableCard
                key={card.id}
                card={card}
                onEdit={onEditCard}
                disabled={disabled}
              />
            ))}
          </SortableContext>
        </div>

        {!disabled && (
          <button
            className="w-full flex items-center justify-center gap-2 p-2 mt-2 text-sm text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-md transition-colors"
            onClick={() => setIsCreateCardModalOpen(true)}
          >
            <Plus className="w-4 h-4" />
            Add Card
          </button>
        )}
      </div>

      <CreateCardModal
        isOpen={isCreateCardModalOpen}
        onClose={() => setIsCreateCardModalOpen(false)}
        onCreateCard={handleCreateCard}
      />

      <RenameListModal
        isOpen={isRenameModalOpen}
        onClose={() => setIsRenameModalOpen(false)}
        onRename={handleRename}
        currentTitle={list.title}
      />

      <SortListModal
        isOpen={isSortModalOpen}
        onClose={() => setIsSortModalOpen(false)}
        onSort={handleSort}
      />
    </div>
  );
};

export default SortableList;
