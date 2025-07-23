"use client";

import { useState, useCallback } from "react";

export const useToast = () => {
  const [toasts, setToasts] = useState([]);

  const showToast = useCallback(
    ({ title, message, type = "success", duration = 5000 }) => {
      const id = Date.now().toString();
      const newToast = { id, title, message, type };

      setToasts((prev) => [...prev, newToast]);

      setTimeout(() => {
        setToasts((prev) => prev.filter((toast) => toast.id !== id));
      }, duration);
    },
    []
  );

  const clearToasts = useCallback(() => {
    setToasts([]);
  }, []);

  return { toasts, showToast, clearToasts };
};
