import { Edit, Eye, Trash2 } from 'react-feather';

export function PayrollTable({ 
  payrolls = [],
  isLoading,
  selectedPayrolls,
  onSelectPayrolls,
  itemsPerPage,
  onDelete
}) {
  const handleSelectAll = (e) => {
    if (e.target.checked) {
      onSelectPayrolls(payrolls.map(payroll => payroll.id));
    } else {
      onSelectPayrolls([]);
    }
  };

  const handleSelectOne = (id) => {
    if (selectedPayrolls.includes(id)) {
      onSelectPayrolls(selectedPayrolls.filter(payrollId => payrollId !== id));
    } else {
      onSelectPayrolls([...selectedPayrolls, id]);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('vi-VN', {
      month: '2-digit',
      year: 'numeric'
    });
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(amount);
  };

  if (isLoading) {
    return (
      <div className="animate-pulse space-y-4">
        {[...Array(itemsPerPage)].map((_, i) => (
          <div key={i} className="h-16 bg-gray-100 rounded-lg" />
        ))}
      </div>
    );
  }

  if (!payrolls.length) {
    return (
      <div className="bg-white rounded-lg border border-gray-200 p-8 text-center text-gray-500">
        Không có bảng lương nào
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg border border-gray-200 overflow-x-auto">
      <table className="w-full">
        <thead className="bg-gray-50">
          <tr>
            <th className="w-12 px-4 py-3">
              <input 
                type="checkbox"
                checked={selectedPayrolls.length === payrolls.length}
                onChange={handleSelectAll}
                className="rounded border-gray-300"
              />
            </th>
            <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Mã Bảng Lương</th>
            <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Tên Nhân Viên</th>
            <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Tháng</th>
            <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Lương Cơ Bản</th>
            <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Phụ Cấp</th>
            <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Khấu Trừ</th>
            <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Thực Lãnh</th>
            <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Thao tác</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {payrolls.map(payroll => (
            <tr key={payroll.id} className="hover:bg-gray-50">
              <td className="px-4 py-3">
                <input 
                  type="checkbox"
                  checked={selectedPayrolls.includes(payroll.id)}
                  onChange={() => handleSelectOne(payroll.id)}
                  className="rounded border-gray-300"
                />
              </td>
              <td className="px-4 py-3 text-sm">{payroll.id}</td>
              <td className="px-4 py-3 text-sm">{payroll.employee_name}</td>
              <td className="px-4 py-3 text-sm">{formatDate(payroll.month)}</td>
              <td className="px-4 py-3 text-sm">{formatCurrency(payroll.base_salary)}</td>
              <td className="px-4 py-3 text-sm">{formatCurrency(payroll.allowance)}</td>
              <td className="px-4 py-3 text-sm">{formatCurrency(payroll.deduction)}</td>
              <td className="px-4 py-3 text-sm font-medium text-green-600">
                {formatCurrency(payroll.net_salary)}
              </td>
              <td className="px-4 py-3">
                <div className="flex items-center gap-2">
                  <button className="p-1 text-blue-500 hover:bg-blue-50 rounded">
                    <Edit size={16} />
                  </button>
                  <button className="p-1 text-gray-500 hover:bg-gray-100 rounded">
                    <Eye size={16} />
                  </button>
                  <button 
                    onClick={() => onDelete(payroll.id)}
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
    </div>
  );
} 