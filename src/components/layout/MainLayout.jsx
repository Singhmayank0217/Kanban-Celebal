"use client";
import Header from "./Header";
import ToastContainer from "../ui/ToastContainer";
import { useToast } from "../../hooks/useToast";

const MainLayout = ({ children }) => {
  const { toasts } = useToast();

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
      <Header />
      <main className="container mx-auto px-4 py-8">{children}</main>
      <ToastContainer toasts={toasts} />
    </div>
  );
};

export default MainLayout;
