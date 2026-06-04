"use client";

import { useState, useEffect } from "react";
import { CheckCircle, XCircle, X } from "lucide-react";

export type ToastType = "success" | "error";

interface ToastMessage {
  id: string;
  type: ToastType;
  message: string;
}

let toastHandlers: ((msg: ToastMessage) => void)[] = [];

export function showToast(type: ToastType, message: string) {
  const id = Math.random().toString(36).slice(2);
  toastHandlers.forEach((h) => h({ id, type, message }));
}

export function ToastContainer() {
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  useEffect(() => {
    const handler = (msg: ToastMessage) => {
      setToasts((prev) => [...prev, msg]);
      setTimeout(() => {
        setToasts((prev) => prev.filter((t) => t.id !== msg.id));
      }, 4000);
    };
    toastHandlers.push(handler);
    return () => {
      toastHandlers = toastHandlers.filter((h) => h !== handler);
    };
  }, []);

  return (
    <div className="fixed bottom-6 right-6 z-[100] flex flex-col gap-3 pointer-events-none">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`pointer-events-auto flex items-center gap-3 px-4 py-3 rounded-xl border shadow-2xl backdrop-blur-xl text-sm font-medium min-w-72 max-w-sm animate-in slide-in-from-right-full fade-in duration-300 ${
            toast.type === "success"
              ? "bg-emerald-950/90 border-emerald-500/30 text-emerald-300"
              : "bg-red-950/90 border-red-500/30 text-red-300"
          }`}
        >
          {toast.type === "success" ? (
            <CheckCircle className="w-5 h-5 text-emerald-400 flex-shrink-0" />
          ) : (
            <XCircle className="w-5 h-5 text-red-400 flex-shrink-0" />
          )}
          <span className="flex-1">{toast.message}</span>
          <button
            onClick={() => setToasts((prev) => prev.filter((t) => t.id !== toast.id))}
            className="opacity-60 hover:opacity-100 transition-opacity"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      ))}
    </div>
  );
}
