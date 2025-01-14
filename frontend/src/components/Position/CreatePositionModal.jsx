import { useState } from 'react';
import { Dialog } from '@headlessui/react';
import { X } from 'react-feather';

export function CreatePositionModal({ isOpen, onClose, onSubmit }) {
  const [formData, setFormData] = useState({
    position_code: '',
    title: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <Dialog
      open={isOpen}
      onClose={onClose}
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
    >
      <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
      
      <Dialog.Panel className="relative bg-white rounded-lg max-w-md w-full">
        <div className="flex items-center justify-between p-4 border-b">
          <Dialog.Title className="text-lg font-medium">
            Thêm Chức Vụ Mới
          </Dialog.Title>
          <button 
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-4 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Mã chức vụ
            </label>
            <input
              type="text"
              name="position_code"
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
              value={formData.position_code}
              onChange={handleChange}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Tên chức vụ
            </label>
            <input
              type="text"
              name="title"
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
              value={formData.title}
              onChange={handleChange}
              required
            />
          </div>

          <div className="mt-6 flex justify-end gap-3">
            <button
              type="button"
              className="px-4 py-2 text-sm text-gray-600 hover:bg-gray-100 rounded-lg"
              onClick={onClose}
            >
              Hủy
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-sm text-white bg-blue-500 rounded-lg hover:bg-blue-600"
            >
              Tạo chức vụ
            </button>
          </div>
        </form>
      </Dialog.Panel>
    </Dialog>
  );
} 