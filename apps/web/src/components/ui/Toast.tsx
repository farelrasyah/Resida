import React, { createContext, useContext, useState } from 'react';
import { CheckCircle2, AlertTriangle, XCircle, Info, X } from 'lucide-react';

export type ToastType = 'success' | 'error' | 'warning' | 'info';

export interface ToastItem {
  id: string;
  type: ToastType;
  message: string;
}

interface ToastContextType {
  showToast: (message: string, type?: ToastType) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  const showToast = (message: string, type: ToastType = 'success') => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { id, type, message }]);

    setTimeout(() => {
      removeToast(id);
    }, 4000);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-3 max-w-md pointer-events-none">
        {toasts.map((toast) => {
          const icons = {
            success: <CheckCircle2 className="text-emerald-600 shrink-0" size={22} />,
            error: <XCircle className="text-red-600 shrink-0" size={22} />,
            warning: <AlertTriangle className="text-amber-600 shrink-0" size={22} />,
            info: <Info className="text-sky-600 shrink-0" size={22} />,
          };

          const borders = {
            success: 'border-emerald-200 bg-white text-emerald-950',
            error: 'border-red-200 bg-white text-red-950',
            warning: 'border-amber-200 bg-white text-amber-950',
            info: 'border-sky-200 bg-white text-sky-950',
          };

          return (
            <div
              key={toast.id}
              className={`pointer-events-auto flex items-center justify-between gap-4 p-4 rounded-2xl border shadow-xl animate-in slide-in-from-bottom-5 duration-300 font-medium text-[1.4rem] ${borders[toast.type]}`}
            >
              <div className="flex items-center gap-3">
                {icons[toast.type]}
                <span>{toast.message}</span>
              </div>
              <button
                onClick={() => removeToast(toast.id)}
                className="text-neutral-400 hover:text-neutral-700 cursor-pointer p-1 rounded-full"
              >
                <X size={16} />
              </button>
            </div>
          );
        })}
      </div>
    </ToastContext.Provider>
  );
};

export const useToast = (): ToastContextType => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within ToastProvider');
  }
  return context;
};
