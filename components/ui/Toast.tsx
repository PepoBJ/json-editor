'use client';

import { useEffect, useState } from 'react';
import { useJsonStore } from '@/store/useJsonStore';
import { clsx } from 'clsx';
import { X } from 'lucide-react';

export function ToastContainer() {
  const { toasts, removeToast } = useJsonStore();

  return (
    <div className="fixed top-4 right-4 z-50 flex flex-col gap-2 pointer-events-none">
      {toasts.map((toast) => (
        <Toast key={toast.id} {...toast} onClose={() => removeToast(toast.id)} />
      ))}
    </div>
  );
}

function Toast({ id, message, type, onClose }: { id: string; message: string; type: 'success' | 'error' | 'info'; onClose: () => void }) {
  const [show, setShow] = useState(false);

  useEffect(() => {
    setShow(true);
  }, []);

  const handleClose = () => {
    setShow(false);
    setTimeout(onClose, 300);
  };

  const getColors = () => {
    switch (type) {
      case 'success': return 'border-l-emerald-500 dark:border-l-emerald-500';
      case 'error': return 'border-l-red-500 dark:border-l-red-500';
      default: return 'border-l-blue-500 dark:border-l-blue-500';
    }
  };

  return (
    <div
      className={clsx(
        'pointer-events-auto min-w-[200px] max-w-[350px] bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 border-l-4 rounded shadow-lg p-3 transition-all duration-300',
        getColors(),
        show ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'
      )}
    >
      <div className="flex items-start justify-between gap-2">
        <p className="text-[0.7rem] font-mono text-gray-900 dark:text-gray-100">{message}</p>
        <button
          onClick={handleClose}
          className="flex-shrink-0 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
        >
          <X size={14} />
        </button>
      </div>
    </div>
  );
}
