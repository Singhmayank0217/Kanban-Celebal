"use client";

import { useState } from "react";
import Modal from "../ui/Modal";
import { useToast } from "../../hooks/useToast";
import { EmailIcon } from "../icons/Icons";

const ForgotPasswordModal = ({ isOpen, onClose }) => {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [step, setStep] = useState("email");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const { showToast } = useToast();

  const handleEmailSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const users = JSON.parse(localStorage.getItem("kanban-users") || "[]");
      const user = users.find((u) => u.email === email);

      if (user) {
        await new Promise((resolve) => setTimeout(resolve, 1500));

        showToast({
          title: "Email found",
          message: "User found! You can now reset your password.",
          type: "success",
        });

        setStep("reset");
      } else {
        showToast({
          title: "Email not found",
          message: "No account found with this email address.",
          type: "error",
        });
      }
    } catch (error) {
      console.error("Error:", error);
      showToast({
        title: "Error",
        message: "An error occurred. Please try again.",
        type: "error",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handlePasswordReset = async (e) => {
    e.preventDefault();

    if (newPassword !== confirmPassword) {
      showToast({
        title: "Passwords don't match",
        message: "Please make sure both passwords match.",
        type: "error",
      });
      return;
    }

    if (newPassword.length < 6) {
      showToast({
        title: "Password too short",
        message: "Password must be at least 6 characters long.",
        type: "error",
      });
      return;
    }

    setIsLoading(true);

    try {
      const users = JSON.parse(localStorage.getItem("kanban-users") || "[]");
      const userIndex = users.findIndex((u) => u.email === email);

      if (userIndex !== -1) {
        users[userIndex].password = newPassword;
        localStorage.setItem("kanban-users", JSON.stringify(users));

        await new Promise((resolve) => setTimeout(resolve, 1000));

        showToast({
          title: "Password reset successful",
          message:
            "Your password has been reset successfully. You can now log in with your new password.",
          type: "success",
        });

        setEmail("");
        setNewPassword("");
        setConfirmPassword("");
        setStep("email");
        onClose();
      }
    } catch (error) {
      console.error("Error:", error);
      showToast({
        title: "Error",
        message:
          "An error occurred while resetting your password. Please try again.",
        type: "error",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    setEmail("");
    setNewPassword("");
    setConfirmPassword("");
    setStep("email");
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="Reset Password">
      {step === "email" ? (
        <form onSubmit={handleEmailSubmit} className="space-y-4">
          <div className="space-y-2">
            <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">
              Enter your email address and we'll help you reset your password.
            </p>
            <label
              htmlFor="reset-email"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              Email Address
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <EmailIcon className="h-5 w-5 text-gray-400" />
              </div>
              <input
                id="reset-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@example.com"
                required
                autoFocus
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-purple-500 focus:border-purple-500 dark:bg-gray-700 dark:text-white transition-colors"
              />
            </div>
          </div>

          <div className="flex justify-end space-x-2 pt-4">
            <button
              type="button"
              onClick={handleClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading || !email.trim()}
              className="px-4 py-2 text-sm font-medium text-white bg-purple-600 border border-transparent rounded-md shadow-sm hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isLoading ? "Checking..." : "Continue"}
            </button>
          </div>
        </form>
      ) : (
        <form onSubmit={handlePasswordReset} className="space-y-4">
          <div className="space-y-2">
            <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">
              Enter your new password for <strong>{email}</strong>
            </p>

            <div className="space-y-2">
              <label
                htmlFor="new-password"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300"
              >
                New Password
              </label>
              <input
                id="new-password"
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Enter new password"
                required
                autoFocus
                className="block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-purple-500 focus:border-purple-500 dark:bg-gray-700 dark:text-white transition-colors"
              />
            </div>

            <div className="space-y-2">
              <label
                htmlFor="confirm-password"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300"
              >
                Confirm Password
              </label>
              <input
                id="confirm-password"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm new password"
                required
                className="block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-purple-500 focus:border-purple-500 dark:bg-gray-700 dark:text-white transition-colors"
              />
            </div>
          </div>

          <div className="flex justify-end space-x-2 pt-4">
            <button
              type="button"
              onClick={() => setStep("email")}
              className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-colors"
            >
              Back
            </button>
            <button
              type="submit"
              disabled={isLoading || !newPassword || !confirmPassword}
              className="px-4 py-2 text-sm font-medium text-white bg-purple-600 border border-transparent rounded-md shadow-sm hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isLoading ? "Resetting..." : "Reset Password"}
            </button>
          </div>
        </form>
      )}
    </Modal>
  );
};

export default ForgotPasswordModal;
