import { Edit, Trash2 } from 'react-feather';
import { useState } from 'react';
import { EditDepartmentModal } from './EditDepartmentModal';
import { ConfirmDialog } from '../UI/ConfirmDialog';

export function DepartmentTable({ departments, isLoading, onDelete, onEdit }) {
  const [editingDepartment, setEditingDepartment] = useState(null);
  const [deletingDepartment, setDeletingDepartment] = useState(null);

  const handleDelete = () => {
    onDelete(deletingDepartment.id);
    setDeletingDepartment(null);
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
            <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Mã Phòng Ban</th>
            <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Tên Phòng Ban</th>
            <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Số Nhân Viên</th>
            <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Trạng Thái</th>
            <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Thao Tác</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {departments.map((department) => (
            <tr key={department.id} className="hover:bg-gray-50">
              <td className="px-4 py-3 text-sm">{department.department_code}</td>
              <td className="px-4 py-3 text-sm font-medium text-gray-900">{department.name}</td>
              <td className="px-4 py-3">
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                  {department.employee_count || 0} nhân viên
                </span>
              </td>
              <td className="px-4 py-3">
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                  Hoạt động
                </span>
              </td>
              <td className="px-4 py-3">
                <div className="flex gap-2">
                  <button 
                    onClick={() => setEditingDepartment(department)}
                    className="p-1 text-blue-500 hover:bg-blue-50 rounded"
                    title="Chỉnh sửa"
                  >
                    <Edit size={16} />
                  </button>
                  <button 
                    onClick={() => setDeletingDepartment(department)}
                    className="p-1 text-red-500 hover:bg-red-50 rounded"
                    title="Xóa"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <EditDepartmentModal
        department={editingDepartment}
        isOpen={!!editingDepartment}
        onClose={() => setEditingDepartment(null)}
        onSubmit={onEdit}
      />

      <ConfirmDialog
        isOpen={!!deletingDepartment}
        onClose={() => setDeletingDepartment(null)}
        onConfirm={handleDelete}
        title="Xóa Phòng Ban"
        message={`Bạn có chắc chắn muốn xóa phòng ban "${deletingDepartment?.name}"?`}
      />
    </div>
  );
} 