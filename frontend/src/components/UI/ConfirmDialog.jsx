import { Dialog } from '@headlessui/react';
import { AlertTriangle } from 'react-feather';

export function ConfirmDialog({ isOpen, onClose, onConfirm, title, message }) {
  return (
    <Dialog
      open={isOpen}
      onClose={onClose}
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
    >
      <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
      
      <Dialog.Panel className="relative bg-white rounded-lg max-w-md w-full p-6">
        <div className="flex items-start gap-4">
          <div className="flex-shrink-0">
            <AlertTriangle className="h-6 w-6 text-red-600" />
          </div>
          <div>
            <Dialog.Title className="text-lg font-medium text-gray-900">
              {title}
            </Dialog.Title>
            <Dialog.Description className="mt-2 text-sm text-gray-500">
              {message}
            </Dialog.Description>
          </div>
        </div>

        <div className="mt-6 flex justify-end gap-3">
          <button
            type="button"
            className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-lg"
            onClick={onClose}
          >
            Hủy
          </button>
          <button
            type="button"
            className="px-4 py-2 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded-lg"
            onClick={onConfirm}
          >
            Xác nhận
          </button>
        </div>
      </Dialog.Panel>
    </Dialog>
  );
} 