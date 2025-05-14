// A simple toast notification system for the admin panel

import { useState, useEffect } from "react";

type ToastVariant = "default" | "destructive" | "success";

interface ToastProps {
  title?: string;
  description?: string;
  variant?: ToastVariant;
  duration?: number;
}

// Create a simple global toast state
let toastCallback: ((toast: ToastProps) => void) | null = null;

// Toast container component
export function Toaster() {
  const [toasts, setToasts] = useState<(ToastProps & { id: number })[]>([]);
  const [counter, setCounter] = useState(0);

  // Register the toast callback
  useEffect(() => {
    toastCallback = (toast: ToastProps) => {
      const id = counter;
      setCounter((prev) => prev + 1);
      setToasts((prev) => [...prev, { ...toast, id }]);

      // Auto dismiss after duration
      setTimeout(() => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
      }, toast.duration || 5000);
    };

    // Cleanup
    return () => {
      toastCallback = null;
    };
  }, [counter]);

  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-0 right-0 z-50 m-4 flex flex-col gap-2">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`rounded-md p-4 shadow-lg animate-in fade-in slide-in-from-bottom-5 ${
            toast.variant === "destructive"
              ? "bg-red-100 text-red-900"
              : toast.variant === "success"
              ? "bg-green-100 text-green-900"
              : "bg-white text-gray-900 border"
          }`}
        >
          {toast.title && <h4 className="font-medium">{toast.title}</h4>}
          {toast.description && <p className="text-sm">{toast.description}</p>}
          <button
            onClick={() =>
              setToasts((prev) => prev.filter((t) => t.id !== toast.id))
            }
            className="absolute right-2 top-2 text-sm opacity-70 hover:opacity-100"
          >
            ×
          </button>
        </div>
      ))}
    </div>
  );
}

// Hook to trigger toasts
export function toast(props: ToastProps) {
  if (toastCallback) {
    toastCallback(props);
  } else {
    // Fallback if toast system isn't mounted
    console.warn("Toast was called but no toast system is mounted", props);
  }
}
