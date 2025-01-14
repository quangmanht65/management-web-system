import { Plus, RefreshCw, Search } from 'react-feather';

export function AdminToolbar({ onCreateClick, onRefresh, totalAccounts }) {
  return (
    <div className="p-4 border-b border-gray-200">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-lg font-medium text-gray-900">Danh Sách Tài Khoản</h2>
          <p className="text-sm text-gray-500">
            Tổng số {totalAccounts} tài khoản
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={onRefresh}
            className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg"
            title="Làm mới"
          >
            <RefreshCw size={20} />
          </button>
          <button
            onClick={onCreateClick}
            className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
          >
            <Plus size={20} />
            <span>Thêm Tài Khoản</span>
          </button>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <div className="relative flex-1 max-w-md">
          <input
            type="text"
            placeholder="Tìm kiếm tài khoản..."
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <Search className="absolute left-3 top-2.5 text-gray-400" size={20} />
        </div>
      </div>
    </div>
  );
} 