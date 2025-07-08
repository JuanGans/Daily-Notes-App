import React from 'react'

interface ConfirmationModalProps {
  isOpen: boolean
  title?: string
  message: string
  onCancel: () => void
  onConfirm: () => void
  confirmText?: string
  cancelText?: string
}

export default function ConfirmationModal({
  isOpen,
  title = 'Konfirmasi',
  message,
  onCancel,
  onConfirm,
  confirmText = 'Ya, Hapus',
  cancelText = 'Batal',
}: ConfirmationModalProps) {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center">
      <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-sm">
        <h2 className="text-lg font-semibold mb-4">{title}</h2>
        <p className="mb-6 text-gray-700">{message}</p>
        <div className="flex justify-end space-x-3">
          <button
            onClick={onCancel}
            className="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300"
          >
            {cancelText}
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  )
}
