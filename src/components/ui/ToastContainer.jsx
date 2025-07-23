const ToastContainer = ({ toasts }) => {
  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`p-4 rounded-md shadow-lg max-w-xs animate-slide-up ${
            toast.type === "error"
              ? "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
              : toast.type === "warning"
              ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
              : "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
          }`}
        >
          {toast.title && <h4 className="font-medium">{toast.title}</h4>}
          {toast.message && <p className="text-sm">{toast.message}</p>}
        </div>
      ))}
    </div>
  );
};

export default ToastContainer;
