import { Link } from "react-router-dom";
import MainLayout from "../components/layout/MainLayout";

const NotFoundPage = () => {
  return (
    <MainLayout>
      <div className="flex flex-col items-center justify-center min-h-[calc(100vh-200px)]">
        <h1 className="text-6xl font-bold text-gray-900 dark:text-white mb-4">
          404
        </h1>
        <p className="text-xl text-gray-600 dark:text-gray-300 mb-8">
          Page not found
        </p>
        <Link
          to="/"
          className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-colors"
        >
          Go back home
        </Link>
      </div>
    </MainLayout>
  );
};

export default NotFoundPage;
