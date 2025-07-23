"use client";

import { createContext, useState, useEffect } from "react";
import { useAuth } from "../hooks/useAuth";

export const BoardContext = createContext();

const initialBoards = [
  {
    id: "1",
    title: "Product Development",
    description: "Track product features and bugs",
    color: "bg-purple-600",
    updatedAt: "2 days ago",
  },
  {
    id: "2",
    title: "Marketing Campaign",
    description: "Q3 marketing initiatives",
    color: "bg-blue-600",
    updatedAt: "5 hours ago",
  },
  {
    id: "3",
    title: "Personal Tasks",
    description: "Daily to-dos and reminders",
    color: "bg-emerald-600",
    updatedAt: "1 week ago",
  },
];

export const BoardProvider = ({ children }) => {
  const { user } = useAuth();
  const [boards, setBoards] = useState([]);
  const [boardData, setBoardData] = useState({});

  useEffect(() => {
    if (user) {
      const storedBoards = localStorage.getItem(`kanban-boards-${user.id}`);
      if (storedBoards) {
        setBoards(JSON.parse(storedBoards));
      } else {
        setBoards(initialBoards);
        localStorage.setItem(
          `kanban-boards-${user.id}`,
          JSON.stringify(initialBoards)
        );
      }
    } else {
      setBoards([]);
    }
  }, [user]);

  useEffect(() => {
    if (user) {
      const storedBoardData = localStorage.getItem(
        `kanban-board-data-${user.id}`
      );
      if (storedBoardData) {
        setBoardData(JSON.parse(storedBoardData));
      }
    } else {
      setBoardData({});
    }
  }, [user]);

  const createBoard = (newBoard) => {
    const boardWithId = {
      ...newBoard,
      id: Date.now().toString(),
      updatedAt: "Just now",
    };

    const updatedBoards = [...boards, boardWithId];
    setBoards(updatedBoards);

    if (user) {
      localStorage.setItem(
        `kanban-boards-${user.id}`,
        JSON.stringify(updatedBoards)
      );
    }

    return boardWithId;
  };

  const getBoard = (boardId) => {
    return boards.find((board) => board.id === boardId);
  };

  const getBoardData = (boardId) => {
    return boardData[boardId] || null;
  };

  const updateBoardData = (boardId, data) => {
    const updatedBoardData = {
      ...boardData,
      [boardId]: data,
    };

    setBoardData(updatedBoardData);

    if (user) {
      localStorage.setItem(
        `kanban-board-data-${user.id}`,
        JSON.stringify(updatedBoardData)
      );
    }
  };

  return (
    <BoardContext.Provider
      value={{
        boards,
        createBoard,
        getBoard,
        getBoardData,
        updateBoardData,
      }}
    >
      {children}
    </BoardContext.Provider>
  );
};
