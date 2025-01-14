import { Trash2, ToggleLeft, ToggleRight } from 'react-feather';
import { useState } from 'react';
import { ConfirmDialog } from '../UI/ConfirmDialog';

export function AdminTable({ accounts, isLoading, onDelete, onToggleStatus }) {
  const [deletingAccount, setDeletingAccount] = useState(null);

  const handleDelete = () => {
    onDelete(deletingAccount.id);
    setDeletingAccount(null);
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
            <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Tên người dùng</th>
            <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Email</th>
            <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Vai trò</th>
            <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Trạng thái</th>
            <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Thao tác</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {accounts.map((account) => (
            <tr key={account.id} className="hover:bg-gray-50">
              <td className="px-4 py-3 text-sm font-medium">{account.username}</td>
              <td className="px-4 py-3 text-sm">{account.email}</td>
              <td className="px-4 py-3">
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                  {account.role}
                </span>
              </td>
              <td className="px-4 py-3">
                <span 
                  className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    account.is_verified 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-red-100 text-red-800'
                  }`}
                >
                  {account.is_verified ? 'Hoạt động' : 'Vô hiệu'}
                </span>
              </td>
              <td className="px-4 py-3">
                <div className="flex gap-2">
                  <button
                    onClick={() => onToggleStatus(account.id, account.is_verified)}
                    className={`p-1 ${
                      account.is_verified 
                        ? 'text-green-500 hover:bg-green-50' 
                        : 'text-gray-500 hover:bg-gray-50'
                    } rounded`}
                    title={account.is_verified ? 'Vô hiệu hóa' : 'Kích hoạt'}
                  >
                    {account.is_verified ? <ToggleRight size={16} /> : <ToggleLeft size={16} />}
                  </button>
                  <button 
                    onClick={() => setDeletingAccount(account)}
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

      <ConfirmDialog
        isOpen={!!deletingAccount}
        onClose={() => setDeletingAccount(null)}
        onConfirm={handleDelete}
        title="Xóa Tài Khoản"
        message={`Bạn có chắc chắn muốn xóa tài khoản "${deletingAccount?.username}"?`}
      />
    </div>
  );
} 