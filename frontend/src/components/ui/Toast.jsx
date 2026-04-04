import { createContext, useContext, useState, useCallback } from 'react';
import { X, CheckCircle, AlertCircle, AlertTriangle, Info } from 'lucide-react';

const ToastContext = createContext(null);

let toastIdCounter = 0;

const icons = {
  success: CheckCircle,
  error: AlertCircle,
  warning: AlertTriangle,
  info: Info,
};

const styles = {
  success: 'border-success/30 bg-success-bg',
  error: 'border-error/30 bg-error-bg',
  warning: 'border-warning/30 bg-warning-bg',
  info: 'border-primary/30 bg-primary-bg',
};

const iconColors = {
  success: 'text-success',
  error: 'text-error',
  warning: 'text-warning',
  info: 'text-primary',
};

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const addToast = useCallback((message, type = 'info', duration = 4000) => {
    const id = ++toastIdCounter;
    setToasts((prev) => [...prev, { id, message, type, exiting: false }]);

    if (duration > 0) {
      setTimeout(() => dismissToast(id), duration);
    }

    return id;
  }, []);

  const dismissToast = useCallback((id) => {
    setToasts((prev) =>
      prev.map((t) => (t.id === id ? { ...t, exiting: true } : t))
    );
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 200);
  }, []);

  const toast = useCallback(
    {
      success: (msg, duration) => addToast(msg, 'success', duration),
      error: (msg, duration) => addToast(msg, 'error', duration),
      warning: (msg, duration) => addToast(msg, 'warning', duration),
      info: (msg, duration) => addToast(msg, 'info', duration),
    },
    [addToast]
  );

  return (
    <ToastContext.Provider value={toast}>
      {children}
      {/* Toast Container */}
      <div className="fixed top-4 right-4 z-50 flex flex-col gap-2 max-w-sm w-full pointer-events-none">
        {toasts.map((t) => {
          const Icon = icons[t.type];
          return (
            <div
              key={t.id}
              className={`
                pointer-events-auto
                flex items-start gap-3 p-4
                border rounded-standard
                backdrop-blur-sm
                ${styles[t.type]}
                ${t.exiting ? 'animate-toast-exit' : 'animate-toast-enter'}
              `}
            >
              <Icon size={18} className={`mt-0.5 flex-shrink-0 ${iconColors[t.type]}`} />
              <p className="text-sm text-text-primary flex-1">{t.message}</p>
              <button
                onClick={() => dismissToast(t.id)}
                className="text-text-muted hover:text-text-secondary transition-colors flex-shrink-0 cursor-pointer"
                aria-label="Dismiss"
              >
                <X size={16} />
              </button>
            </div>
          );
        })}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
}
