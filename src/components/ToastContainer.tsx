/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { useAppState, Toast } from '../context/StateContext';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export const ToastContainer: React.FC = () => {
  const { toasts, removeToast } = useAppState();

  const getIcon = (type: Toast['type']) => {
    switch (type) {
      case 'success':
        return <CheckCircle2 className="text-emerald-500 shrink-0" size={20} />;
      case 'error':
        return <AlertCircle className="text-rose-500 shrink-0" size={20} />;
      case 'info':
      default:
        return <Info className="text-blue-500 shrink-0" size={20} />;
    }
  };

  const borderColors = {
    success: 'border-emerald-500/30 bg-emerald-50/95 dark:bg-emerald-950/90 text-emerald-900 dark:text-emerald-50',
    error: 'border-rose-500/30 bg-rose-50/95 dark:bg-rose-950/90 text-rose-900 dark:text-rose-50',
    info: 'border-blue-500/30 bg-blue-50/95 dark:bg-blue-950/90 text-blue-900 dark:text-blue-50',
  };

  return (
    <div className="fixed bottom-5 right-5 z-55 flex flex-col items-end space-y-3 pointer-events-none max-w-sm w-full p-4">
      <AnimatePresence>
        {toasts.map((toast) => (
          <motion.div
            key={toast.id}
            initial={{ opacity: 0, y: 30, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.85, transition: { duration: 0.15 } }}
            className={`pointer-events-auto flex items-center justify-between shadow-lg border p-4 rounded-xl gap-3 w-full backdrop-blur-md ${borderColors[toast.type]}`}
          >
            <div className="flex items-center space-x-2.5">
              {getIcon(toast.type)}
              <span className="text-xs font-semibold font-sans">{toast.message}</span>
            </div>
            <button
              onClick={() => removeToast(toast.id)}
              className="p-1 leading-none rounded hover:bg-stone-500/10 cursor-pointer"
            >
              <X size={14} className="opacity-60 hover:opacity-100" />
            </button>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};
