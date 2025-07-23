"use client";

import { useState } from "react";
import BoardList from "../components/board/BoardList";
import CreateBoardModal from "../components/board/CreateBoardModal";
import { useBoard } from "../hooks/useBoard";
import { PlusIcon } from "../components/icons/Icons";

const DashboardPage = () => {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const { boards, createBoard } = useBoard();

  const handleCreateBoard = (newBoard) => {
    createBoard(newBoard);
    setIsCreateModalOpen(false);
  };

  return (
    <>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
            My Boards
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            Manage and organize your projects
          </p>
        </div>
        <button
          onClick={() => setIsCreateModalOpen(true)}
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 transition-colors"
        >
          <PlusIcon className="h-4 w-4 mr-2" /> Create Board
        </button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <BoardList boards={boards} />
      </div>
      <CreateBoardModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onCreateBoard={handleCreateBoard}
      />
      {" "}
    </>
  );
};

export default DashboardPage;
