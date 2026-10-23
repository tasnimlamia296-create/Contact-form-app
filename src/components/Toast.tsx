import { useEffect, useState, useCallback } from 'react';
import { CheckCircle2, XCircle, X } from 'lucide-react';

type ToastType = 'success' | 'error';

interface ToastState {
  message: string;
  type: ToastType;
}

export function useToast() {
  const [toast, setToast] = useState<ToastState | null>(null);

  const showToast = useCallback((message: string, type: ToastType) => {
    setToast({ message, type });
  }, []);

  const dismissToast = useCallback(() => setToast(null), []);

  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(() => setToast(null), 4000);
    return () => clearTimeout(timer);
  }, [toast]);

  return { toast, showToast, dismissToast };
}

interface ToastProps {
  toast: ToastState | null;
  onDismiss: () => void;
}

export function Toast({ toast, onDismiss }: ToastProps) {
  if (!toast) return null;

  const isSuccess = toast.type === 'success';

  return (
    <div className="fixed top-6 right-6 z-50 animate-[slideIn_0.3s_ease-out]">
      <div
        className={`flex items-center gap-3 rounded-2xl border px-5 py-4 shadow-2xl backdrop-blur-xl ${
          isSuccess
            ? 'border-emerald-400/30 bg-emerald-500/15 text-emerald-100'
            : 'border-red-400/30 bg-red-500/15 text-red-100'
        }`}
        role="alert"
      >
        {isSuccess ? (
          <CheckCircle2 className="h-5 w-5 shrink-0 text-emerald-400" />
        ) : (
          <XCircle className="h-5 w-5 shrink-0 text-red-400" />
        )}
        <span className="text-sm font-medium">{toast.message}</span>
        <button
          onClick={onDismiss}
          className="ml-2 text-white/60 transition-colors hover:text-white"
          aria-label="Dismiss"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
