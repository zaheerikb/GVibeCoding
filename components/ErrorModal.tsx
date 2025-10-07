
import React from 'react';
import { AlertTriangleIcon } from './icons/AlertTriangleIcon';

interface ErrorModalProps {
  error: string;
  onClose: () => void;
  onRetry: () => void;
}

const ErrorModal: React.FC<ErrorModalProps> = ({ error, onClose, onRetry }) => {
  return (
    <div
      className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      aria-labelledby="error-modal-title"
      role="dialog"
      aria-modal="true"
    >
      <div className="bg-brand-surface border border-brand-border rounded-lg shadow-xl w-full max-w-md p-6">
        <div className="flex items-start">
          <div className="flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-red-900/50 mr-4">
            <AlertTriangleIcon className="h-6 w-6 text-red-400" aria-hidden="true" />
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-bold text-gray-100" id="error-modal-title">
              Generation Failed
            </h3>
            <p className="mt-2 text-sm text-gray-300">
              {error}
            </p>
          </div>
        </div>
        <div className="mt-6 flex justify-end space-x-3">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-gray-200 bg-slate-600 rounded-md hover:bg-slate-500 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-800 focus-visible:ring-cyan-500"
          >
            Close
          </button>
          <button
            type="button"
            onClick={onRetry}
            className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-500 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-800 focus-visible:ring-red-500"
          >
            Retry
          </button>
        </div>
      </div>
    </div>
  );
};

export default ErrorModal;