"use client";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import ThemeToggle from "../ui/ThemeToggle";
import UserMenu from "../ui/UserMenu";

const Header = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  return (
    <header className="border-b bg-white dark:bg-gray-800 dark:border-gray-700 transition-colors duration-200">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <Link to="/" className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-md bg-purple-600 flex items-center justify-center">
              <span className="text-white font-bold">K</span>
            </div>
            <h1 className="text-xl font-bold text-gray-800 dark:text-white">
              KanbanFlow
            </h1>
          </Link>
        </div>

        <div className="flex items-center gap-4">
          {user && (
            <Link
              to="/dashboard"
              className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors"
            >
              Dashboard
            </Link>
          )}
          <ThemeToggle />
          {user ? (
            <UserMenu user={user} />
          ) : (
            <div className="flex items-center gap-2">
              <button
                onClick={() => navigate("/login")}
                className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-200 hover:text-gray-900 dark:hover:text-white transition-colors"
              >
                Log in
              </button>
              <button
                onClick={() => navigate("/register")}
                className="px-4 py-2 text-sm font-medium text-white bg-purple-600 rounded-md hover:bg-purple-700 transition-colors"
              >
                Sign up
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
