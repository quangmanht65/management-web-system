import { Edit, Trash2 } from 'react-feather';
import { useState } from 'react';
import { ConfirmDialog } from '../UI/ConfirmDialog';

export function PositionTable({ positions, isLoading, onDelete }) {
  const [deletingPosition, setDeletingPosition] = useState(null);

  const handleDelete = () => {
    onDelete(deletingPosition.id);
    setDeletingPosition(null);
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
                  <button className="p-1 text-blue-500 hover:bg-blue-50 rounded">
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
    </div>
  );
} 