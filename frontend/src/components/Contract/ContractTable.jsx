import { Edit, Eye, Trash2 } from 'react-feather';

export function ContractTable({ 
  contracts = [],
  isLoading,
  selectedContracts,
  onSelectContracts,
  itemsPerPage,
  onDelete
}) {
  const handleSelectAll = (e) => {
    if (e.target.checked) {
      onSelectContracts(contracts.map(contract => contract.id));
    } else {
      onSelectContracts([]);
    }
  };

  const handleSelectOne = (id) => {
    if (selectedContracts.includes(id)) {
      onSelectContracts(selectedContracts.filter(contractId => contractId !== id));
    } else {
      onSelectContracts([...selectedContracts, id]);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
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

  if (!contracts.length) {
    return (
      <div className="bg-white rounded-lg border border-gray-200 p-8 text-center text-gray-500">
        Không có hợp đồng nào
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
                checked={selectedContracts.length === contracts.length}
                onChange={handleSelectAll}
                className="rounded border-gray-300"
              />
            </th>
            <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Mã Hợp Đồng</th>
            <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Tên Nhân Viên</th>
            <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Loại Hợp Đồng</th>
            <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Ngày Bắt Đầu</th>
            <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Ngày Kết Thúc</th>
            <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Ghi Chú</th>
            <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Thao tác</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {contracts.map(contract => (
            <tr key={contract.id} className="hover:bg-gray-50">
              <td className="px-4 py-3">
                <input 
                  type="checkbox"
                  checked={selectedContracts.includes(contract.id)}
                  onChange={() => handleSelectOne(contract.id)}
                  className="rounded border-gray-300"
                />
              </td>
              <td className="px-4 py-3 text-sm">{contract.id}</td>
              <td className="px-4 py-3 text-sm">{contract.employee_name}</td>
              <td className="px-4 py-3 text-sm">{contract.contract_type}</td>
              <td className="px-4 py-3 text-sm">{formatDate(contract.start_date)}</td>
              <td className="px-4 py-3 text-sm">{formatDate(contract.end_date)}</td>
              <td className="px-4 py-3 text-sm">{contract.notes}</td>
              <td className="px-4 py-3">
                <div className="flex items-center gap-2">
                  <button className="p-1 text-blue-500 hover:bg-blue-50 rounded">
                    <Edit size={16} />
                  </button>
                  <button className="p-1 text-gray-500 hover:bg-gray-100 rounded">
                    <Eye size={16} />
                  </button>
                  <button 
                    onClick={() => onDelete(contract.id)}
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