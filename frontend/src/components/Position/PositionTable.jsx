import { Edit, Trash2 } from 'react-feather';
import { useState } from 'react';
import { ConfirmDialog } from '../UI/ConfirmDialog';
import { Dialog } from '@headlessui/react';
import { X } from 'react-feather';

export function PositionTable({ positions, isLoading, onDelete, onEdit }) {
  const [deletingPosition, setDeletingPosition] = useState(null);
  const [editingPosition, setEditingPosition] = useState(null);
  const [editForm, setEditForm] = useState({
    position_code: '',
    title: ''
  });

  const handleDelete = () => {
    onDelete(deletingPosition.id);
    setDeletingPosition(null);
  };

  const handleEditClick = (position) => {
    setEditingPosition(position);
    setEditForm({
      position_code: position.position_code,
      title: position.name
    });
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    onEdit(editingPosition.id, editForm);
    setEditingPosition(null);
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  if (isLoading) {
    return (
      <div className="animate-pulse space-y-4">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="h-16 bg-gray-100 rounded-lg" />
        ))}
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Mã Chức Vụ</th>
            <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Tên Chức Vụ</th>
            <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Số Nhân Viên</th>
            <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Mô Tả</th>
            <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Thao Tác</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {positions.map((position) => (
            <tr key={position.id} className="hover:bg-gray-50">
              <td className="px-4 py-3 text-sm">{position.position_code}</td>
              <td className="px-4 py-3 text-sm font-medium text-gray-900">{position.name}</td>
              <td className="px-4 py-3">
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                  {position.employee_count || 0} nhân viên
                </span>
              </td>
              <td className="px-4 py-3 text-sm text-gray-500">{position.description || '-'}</td>
              <td className="px-4 py-3">
                <div className="flex gap-2">
                  <button 
                    onClick={() => handleEditClick(position)}
                    className="p-1 text-blue-500 hover:bg-blue-50 rounded"
                  >
                    <Edit size={16} />
                  </button>
                  <button 
                    onClick={() => setDeletingPosition(position)}
                    className="p-1 text-red-500 hover:bg-red-50 rounded"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <ConfirmDialog
        isOpen={!!deletingPosition}
        onClose={() => setDeletingPosition(null)}
        onConfirm={handleDelete}
        title="Xóa Chức Vụ"
        message={`Bạn có chắc chắn muốn xóa chức vụ "${deletingPosition?.name}"?`}
      />

      <Dialog
        open={!!editingPosition}
        onClose={() => setEditingPosition(null)}
        className="fixed inset-0 z-50 flex items-center justify-center p-4"
      >
        <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
        
        <Dialog.Panel className="relative bg-white rounded-lg max-w-md w-full">
          <div className="flex items-center justify-between p-4 border-b">
            <Dialog.Title className="text-lg font-medium">
              Chỉnh Sửa Chức Vụ
            </Dialog.Title>
            <button 
              onClick={() => setEditingPosition(null)}
              className="text-gray-500 hover:text-gray-700"
            >
              <X size={20} />
            </button>
          </div>

          <form onSubmit={handleEditSubmit} className="p-4 space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Mã chức vụ
              </label>
              <input
                type="text"
                name="position_code"
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
                value={editForm.position_code}
                onChange={handleEditChange}
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
                value={editForm.title}
                onChange={handleEditChange}
                required
              />
            </div>

            <div className="mt-6 flex justify-end gap-3">
              <button
                type="button"
                className="px-4 py-2 text-sm text-gray-600 hover:bg-gray-100 rounded-lg"
                onClick={() => setEditingPosition(null)}
              >
                Hủy
              </button>
              <button
                type="submit"
                className="px-4 py-2 text-sm text-white bg-blue-500 rounded-lg hover:bg-blue-600"
              >
                Lưu thay đổi
              </button>
            </div>
          </form>
        </Dialog.Panel>
      </Dialog>
    </div>
  );
} 