"use client";

import { useState } from "react";
import MainLayout from "../components/layout/MainLayout";
import { useAuth } from "../hooks/useAuth";
import { useToast } from "../hooks/useToast";

const SettingsPage = () => {
  const { user, updateUser } = useAuth();
  const { showToast } = useToast();
  const [name, setName] = useState(user?.name || "");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isUpdatingName, setIsUpdatingName] = useState(false);
  const [isUpdatingPassword, setIsUpdatingPassword] = useState(false);

  const handleUpdateName = async (e) => {
    e.preventDefault();
    setIsUpdatingName(true);

    try {
      // Get users from localStorage
      const users = JSON.parse(localStorage.getItem("kanban-users") || "[]");
      const userIndex = users.findIndex((u) => u.id === user.id);

      if (userIndex !== -1) {
        // Update user name in localStorage
        users[userIndex].name = name;
        localStorage.setItem("kanban-users", JSON.stringify(users));

        // Update user in context
        updateUser({ name });

        showToast({
          title: "Name updated",
          message: "Your name has been updated successfully.",
          type: "success",
        });
      }
    } catch (error) {
      console.error("Error updating name:", error);
      showToast({
        title: "Error",
        message: "Failed to update name. Please try again.",
        type: "error",
      });
    } finally {
      setIsUpdatingName(false);
    }
  };

  const handleUpdatePassword = async (e) => {
    e.preventDefault();

    if (newPassword !== confirmPassword) {
      showToast({
        title: "Passwords don't match",
        message: "New password and confirm password must match.",
        type: "error",
      });
      return;
    }

    setIsUpdatingPassword(true);

    try {
      const users = JSON.parse(localStorage.getItem("kanban-users") || "[]");
      const userIndex = users.findIndex((u) => u.id === user.id);

      if (userIndex !== -1) {
        if (users[userIndex].password !== currentPassword) {
          showToast({
            title: "Incorrect password",
            message: "Your current password is incorrect.",
            type: "error",
          });
          setIsUpdatingPassword(false);
          return;
        }

        users[userIndex].password = newPassword;
        localStorage.setItem("kanban-users", JSON.stringify(users));

        showToast({
          title: "Password updated",
          message: "Your password has been updated successfully.",
          type: "success",
        });

        // Reset password fields
        setCurrentPassword("");
        setNewPassword("");
        setConfirmPassword("");
      }
    } catch (error) {
      console.error("Error updating password:", error);
      showToast({
        title: "Error",
        message: "Failed to update password. Please try again.",
        type: "error",
      });
    } finally {
      setIsUpdatingPassword(false);
    }
  };

  return (
    <>
      <div className="max-w-3xl mx-auto">
        <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-6">
          Settings
        </h2>

        <div className="space-y-6">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 border border-gray-200 dark:border-gray-700 transition-colors">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Profile Information
            </h3>
            <form onSubmit={handleUpdateName} className="space-y-4">
              <div className="space-y-2">
                <label
                  htmlFor="name"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                >
                  Name
                </label>
                <input
                  id="name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  className="block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-purple-500 focus:border-purple-500 dark:bg-gray-700 dark:text-white transition-colors"
                />
              </div>
              <div className="space-y-2">
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                >
                  Email
                </label>
                <input
                  id="email"
                  type="email"
                  value={user.email}
                  disabled
                  className="block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm bg-gray-50 dark:bg-gray-600 text-gray-500 dark:text-gray-400 transition-colors"
                />
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Email cannot be changed
                </p>
              </div>
              <div>
                <button
                  type="submit"
                  disabled={isUpdatingName || name === user.name}
                  className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {isUpdatingName ? "Saving..." : "Save Changes"}
                </button>
              </div>
            </form>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 border border-gray-200 dark:border-gray-700 transition-colors">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Update Password
            </h3>
            <form onSubmit={handleUpdatePassword} className="space-y-4">
              <div className="space-y-2">
                <label
                  htmlFor="current_password"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                >
                  Current Password
                </label>
                <input
                  id="current_password"
                  type="password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  required
                  className="block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-purple-500 focus:border-purple-500 dark:bg-gray-700 dark:text-white transition-colors"
                />
              </div>
              <div className="space-y-2">
                <label
                  htmlFor="new_password"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                >
                  New Password
                </label>
                <input
                  id="new_password"
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  required
                  className="block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-purple-500 focus:border-purple-500 dark:bg-gray-700 dark:text-white transition-colors"
                />
              </div>
              <div className="space-y-2">
                <label
                  htmlFor="confirm_password"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                >
                  Confirm Password
                </label>
                <input
                  id="confirm_password"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  className="block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-purple-500 focus:border-purple-500 dark:bg-gray-700 dark:text-white transition-colors"
                />
              </div>
              <div>
                <button
                  type="submit"
                  disabled={
                    isUpdatingPassword ||
                    !currentPassword ||
                    !newPassword ||
                    !confirmPassword
                  }
                  className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {isUpdatingPassword ? "Updating..." : "Update Password"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default SettingsPage;
