import React from 'react';

interface ConfirmModalProps {
  open: boolean;
  title?: string;
  description?: string;
  confirmText?: string;
  cancelText?: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export default function ConfirmModal({
  open,
  title = 'Onay',
  description = 'Bu işlemi yapmak istediğinize emin misiniz?',
  confirmText = 'Evet',
  cancelText = 'Hayır',
  onConfirm,
  onCancel
}: ConfirmModalProps) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
      <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-sm">
        <h3 className="text-lg font-semibold mb-2">{title}</h3>
        <p className="text-gray-700 mb-6">{description}</p>
        <div className="flex justify-end space-x-3">
          <button
            className="px-4 py-2 rounded bg-gray-200 text-gray-800 hover:bg-gray-300 transition-colors"
            onClick={onCancel}
          >
            {cancelText}
          </button>
          <button
            className="px-4 py-2 rounded bg-red-600 text-white hover:bg-red-700 transition-colors"
            onClick={onConfirm}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
} 