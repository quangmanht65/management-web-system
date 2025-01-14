import { Plus, RefreshCw } from 'react-feather';

export function PositionToolbar({ onCreateClick, onRefresh }) {
  return (
    <div className="mb-6 flex justify-between items-center">
      <button
        onClick={onCreateClick}
        className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
      >
        <Plus size={20} />
        <span>Thêm Chức Vụ</span>
      </button>

      <button
        onClick={onRefresh}
        className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg"
      >
        <RefreshCw size={20} />
      </button>
    </div>
  );
} 