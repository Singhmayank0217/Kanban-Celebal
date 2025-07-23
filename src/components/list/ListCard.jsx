"use client";

import { useState } from "react";
import CardItem from "../card/CardItem";
import CreateCardModal from "../card/CreateCardModal";
import RenameListModal from "./RenameListModal";
import SortListModal from "./SortListModal";
import { PlusIcon, MoreIcon } from "../icons/Icons";

const ListCard = ({
  list,
  cards,
  onCardClick,
  onCreateCard,
  onRenameList,
  onDeleteList,
  onSortList,
}) => {
  const [isCreateCardModalOpen, setIsCreateCardModalOpen] = useState(false);
  const [isRenameModalOpen, setIsRenameModalOpen] = useState(false);
  const [isSortModalOpen, setIsSortModalOpen] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);

  const handleCreateCard = (cardData) => {
    onCreateCard(list.id, cardData);
    setIsCreateCardModalOpen(false);
  };

  const handleRename = (newTitle) => {
    onRenameList(list.id, newTitle);
    setIsRenameModalOpen(false);
  };

  const handleSort = (sortBy) => {
    onSortList(list.id, sortBy);
    setIsSortModalOpen(false);
  };

  const handleDelete = () => {
    if (
      window.confirm(
        `Are you sure you want to delete the list "${list.title}" and all its cards?`
      )
    ) {
      onDeleteList(list.id);
    }
    setShowDropdown(false);
  };

  return (
    <div className="shrink-0 w-72">
      <div className="bg-gray-100 dark:bg-gray-700 rounded-md shadow-sm transition-colors">
        <div className="p-2 font-medium flex items-center justify-between">
          <h3 className="text-gray-700 dark:text-gray-200">{list.title}</h3>
          <div className="flex items-center">
            <span className="text-xs text-gray-500 dark:text-gray-400 mr-2">
              {cards.length}
            </span>
            <div className="relative">
              <button
                onClick={() => setShowDropdown(!showDropdown)}
                className="h-8 w-8 p-1.5 rounded-md text-gray-500 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
              >
                <MoreIcon className="h-full w-full" />
              </button>

              {showDropdown && (
                <div className="absolute right-0 mt-1 w-40 bg-white dark:bg-gray-800 rounded-md shadow-lg z-10 py-1 border border-gray-200 dark:border-gray-700 animate-fade-in">
                  <button
                    onClick={() => {
                      setIsRenameModalOpen(true);
                      setShowDropdown(false);
                    }}
                    className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                  >
                    Rename
                  </button>
                  <button
                    onClick={() => {
                      setIsSortModalOpen(true);
                      setShowDropdown(false);
                    }}
                    className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                  >
                    Sort
                  </button>
                  <button
                    onClick={handleDelete}
                    className="w-full text-left px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                  >
                    Delete
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="p-2 min-h-[200px] transition-colors">
          {cards.map((card) => (
            <CardItem
              key={card.id}
              card={card}
              onClick={() => onCardClick(card.id)}
            />
          ))}
        </div>

        <div className="p-2">
          <button
            onClick={() => setIsCreateCardModalOpen(true)}
            className="w-full flex items-center px-3 py-1.5 text-sm text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-md transition-colors"
          >
            <PlusIcon className="h-4 w-4 mr-1" /> Add Card
          </button>
        </div>
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

export default ListCard;
