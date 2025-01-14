import { useState } from 'react';
import { Dialog } from '@headlessui/react';
import { X } from 'react-feather';

export function CreateAccountModal({ isOpen, onClose, onSubmit }) {
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    role: 'user',
    is_active: true
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
    setFormData({
      username: '',
      password: '',
      role: 'user',
      is_active: true
    });
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
            Thêm Tài Khoản Mới
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
              Tên người dùng
            </label>
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={(e) => setFormData(prev => ({
                ...prev,
                username: e.target.value
              }))}
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Mật khẩu
            </label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={(e) => setFormData(prev => ({
                ...prev,
                password: e.target.value
              }))}
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Vai trò
            </label>
            <select
              name="role"
              value={formData.role}
              onChange={(e) => setFormData(prev => ({
                ...prev,
                role: e.target.value
              }))}
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
            >
              <option value="user">User</option>
              <option value="admin">Admin</option>
            </select>
          </div>

          <div className="mt-6 flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm text-gray-600 hover:bg-gray-100 rounded-lg"
            >
              Hủy
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-sm text-white bg-blue-500 rounded-lg hover:bg-blue-600"
            >
              Tạo tài khoản
            </button>
          </div>
        </form>
      </Dialog.Panel>
    </Dialog>
  );
} 