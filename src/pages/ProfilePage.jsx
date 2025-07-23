"use client";
import { useState, useEffect } from "react";
import MainLayout from "../components/layout/MainLayout";
import { useAuth } from "../hooks/useAuth";
import { useBoard } from "../hooks/useBoard";
import {
  CalendarIcon,
  UserIcon,
  EmailIcon,
  CheckIcon,
  ZapIcon,
  UsersIcon,
  ClockIcon,
  ArrowRightIcon,
  SettingsIcon,
} from "../components/icons/Icons";
import { Link } from "react-router-dom";

const ProfilePage = () => {
  const { user } = useAuth();
  const { boards } = useBoard();
  const [stats, setStats] = useState({
    totalBoards: 0,
    totalCards: 0,
    completedCards: 0,
    activeProjects: 0,
  });

  useEffect(() => {
    if (boards && user) {
      // Calculate user statistics
      let totalCards = 0;
      let completedCards = 0;

      boards.forEach((board) => {
        const boardData = JSON.parse(
          localStorage.getItem(`kanban-board-data-${user.id}`) || "{}"
        );
        if (boardData[board.id]) {
          const cards = Object.values(boardData[board.id].cards || {});
          totalCards += cards.length;

          // Count completed cards (assuming cards in "Done" lists are completed)
          const doneLists = Object.values(
            boardData[board.id].lists || {}
          ).filter(
            (list) =>
              list.title.toLowerCase().includes("done") ||
              list.title.toLowerCase().includes("complete")
          );
          doneLists.forEach((list) => {
            completedCards += list.cardIds?.length || 0;
          });
        }
      });

      setStats({
        totalBoards: boards.length,
        totalCards,
        completedCards,
        activeProjects: boards.length,
      });
    }
  }, [boards, user]);

  // Get user registration date from localStorage
  const getUserRegistrationDate = () => {
    try {
      const users = JSON.parse(localStorage.getItem("kanban-users") || "[]");
      const currentUser = users.find((u) => u.id === user.id);
      if (currentUser && currentUser.createdAt) {
        return new Date(currentUser.createdAt).toLocaleDateString("en-US", {
          year: "numeric",
          month: "long",
          day: "numeric",
        });
      }
      return "Unknown";
    } catch (error) {
      console.error("Error getting registration date:", error);
      return "Unknown";
    }
  };

  const getInitials = (name) => {
    return name
      .split(" ")
      .map((part) => part[0])
      .join("")
      .toUpperCase();
  };

  const getCompletionRate = () => {
    if (stats.totalCards === 0) return 0;
    return Math.round((stats.completedCards / stats.totalCards) * 100);
  };

  const achievements = [
    {
      icon: ZapIcon,
      title: "Quick Starter",
      description: "Created your first board",
      earned: stats.totalBoards > 0,
      color: "text-yellow-500",
    },
    {
      icon: UsersIcon,
      title: "Team Player",
      description: "Assigned tasks to team members",
      earned: stats.totalCards > 5,
      color: "text-blue-500",
    },
    {
      icon: CheckIcon,
      title: "Task Master",
      description: "Completed 10+ tasks",
      earned: stats.completedCards >= 10,
      color: "text-green-500",
    },
  ];

  return (
    <>
      <div className="max-w-6xl mx-auto space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              Profile
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              Manage your account and view your progress
            </p>
          </div>
          <Link
            to="/settings"
            className="inline-flex items-center px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors shadow-md hover:shadow-lg"
          >
            <SettingsIcon className="h-4 w-4 mr-2" />
            Settings
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-gradient-to-br from-purple-500 to-blue-600 rounded-2xl p-6 text-white shadow-xl">
              <div className="flex flex-col items-center text-center">
                <div className="relative mb-4">
                  <div className="h-24 w-24 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center text-2xl font-bold border-4 border-white/30">
                    {getInitials(user.name)}
                  </div>
                  <div className="absolute -bottom-2 -right-2 h-8 w-8 bg-green-500 rounded-full flex items-center justify-center border-4 border-white">
                    <div className="h-2 w-2 bg-white rounded-full"></div>
                  </div>
                </div>
                <h2 className="text-2xl font-bold mb-1">{user.name}</h2>
                <p className="text-purple-100 mb-4">{user.email}</p>
                <div className="flex items-center text-purple-100 text-sm">
                  <CalendarIcon className="h-4 w-4 mr-2" />
                  <span>Member since {getUserRegistrationDate()}</span>
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Quick Stats
              </h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-gray-600 dark:text-gray-400">
                    Completion Rate
                  </span>
                  <div className="flex items-center">
                    <div className="w-16 h-2 bg-gray-200 dark:bg-gray-700 rounded-full mr-2">
                      <div
                        className="h-2 bg-green-500 rounded-full transition-all duration-500"
                        style={{ width: `${getCompletionRate()}%` }}
                      ></div>
                    </div>
                    <span className="text-sm font-medium text-gray-900 dark:text-white">
                      {getCompletionRate()}%
                    </span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600 dark:text-gray-400">
                    Account Type
                  </span>
                  <span className="px-2 py-1 bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-200 rounded-full text-xs font-medium">
                    Free Plan
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600 dark:text-gray-400">
                    Status
                  </span>
                  <div className="flex items-center">
                    <div className="h-2 w-2 bg-green-500 rounded-full mr-2"></div>
                    <span className="text-sm text-green-600 dark:text-green-400 font-medium">
                      Active
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-2 space-y-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-700 hover:shadow-xl transition-shadow">
                <div className="flex items-center">
                  <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                    <UsersIcon className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div className="ml-4">
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">
                      {stats.totalBoards}
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Boards
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-700 hover:shadow-xl transition-shadow">
                <div className="flex items-center">
                  <div className="p-3 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
                    <ClockIcon className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                  </div>
                  <div className="ml-4">
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">
                      {stats.totalCards}
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Total Cards
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-700 hover:shadow-xl transition-shadow">
                <div className="flex items-center">
                  <div className="p-3 bg-green-100 dark:bg-green-900/30 rounded-lg">
                    <CheckIcon className="h-6 w-6 text-green-600 dark:text-green-400" />
                  </div>
                  <div className="ml-4">
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">
                      {stats.completedCards}
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Completed
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-700 hover:shadow-xl transition-shadow">
                <div className="flex items-center">
                  <div className="p-3 bg-amber-100 dark:bg-amber-900/30 rounded-lg">
                    <ZapIcon className="h-6 w-6 text-amber-600 dark:text-amber-400" />
                  </div>
                  <div className="ml-4">
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">
                      {stats.activeProjects}
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Active
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                  Achievements
                </h3>
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  {achievements.filter((a) => a.earned).length} of{" "}
                  {achievements.length} earned
                </span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {achievements.map((achievement, index) => (
                  <div
                    key={index}
                    className={`p-4 rounded-lg border-2 transition-all ${
                      achievement.earned
                        ? "border-green-200 dark:border-green-800 bg-green-50 dark:bg-green-900/20"
                        : "border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50"
                    }`}
                  >
                    <div className="flex items-start">
                      <div
                        className={`p-2 rounded-lg ${
                          achievement.earned
                            ? "bg-white dark:bg-gray-800"
                            : "bg-gray-200 dark:bg-gray-700"
                        }`}
                      >
                        <achievement.icon
                          className={`h-5 w-5 ${
                            achievement.earned
                              ? achievement.color
                              : "text-gray-400"
                          }`}
                        />
                      </div>
                      <div className="ml-3 flex-1">
                        <h4
                          className={`font-medium ${
                            achievement.earned
                              ? "text-gray-900 dark:text-white"
                              : "text-gray-500 dark:text-gray-400"
                          }`}
                        >
                          {achievement.title}
                        </h4>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                          {achievement.description}
                        </p>
                        {achievement.earned && (
                          <div className="flex items-center mt-2">
                            <CheckIcon className="h-4 w-4 text-green-500 mr-1" />
                            <span className="text-xs text-green-600 dark:text-green-400 font-medium">
                              Earned
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                  Account Information
                </h3>
                <Link
                  to="/settings"
                  className="text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300 text-sm font-medium flex items-center"
                >
                  Edit Profile
                  <ArrowRightIcon className="h-4 w-4 ml-1" />
                </Link>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
                      Full Name
                    </label>
                    <div className="flex items-center p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                      <UserIcon className="h-5 w-5 text-gray-400 mr-3" />
                      <span className="text-gray-900 dark:text-white">
                        {user.name}
                      </span>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
                      Email Address
                    </label>
                    <div className="flex items-center p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                      <EmailIcon className="h-5 w-5 text-gray-400 mr-3" />
                      <span className="text-gray-900 dark:text-white">
                        {user.email}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
                      Member Since
                    </label>
                    <div className="flex items-center p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                      <CalendarIcon className="h-5 w-5 text-gray-400 mr-3" />
                      <span className="text-gray-900 dark:text-white">
                        {getUserRegistrationDate()}
                      </span>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
                      Plan Type
                    </label>
                    <div className="flex items-center p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                      <ZapIcon className="h-5 w-5 text-gray-400 mr-3" />
                      <span className="text-gray-900 dark:text-white">
                        Free Plan
                      </span>
                      <span className="ml-auto px-2 py-1 bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-200 rounded-full text-xs font-medium">
                        Active
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ProfilePage;
