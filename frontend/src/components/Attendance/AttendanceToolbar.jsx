import { RefreshCw, Download } from 'react-feather';

export function AttendanceToolbar({ selectedDate, onDateChange, onRefresh, rollupData }) {
  return (
    <div className="mb-6 flex flex-wrap items-center justify-between">
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <label className="text-sm text-gray-600">Ngày:</label>
          <input
            type="date"
            value={selectedDate.toISOString().split('T')[0]}
            onChange={(e) => onDateChange(new Date(e.target.value))}
            className="px-3 py-2 border rounded-lg"
          />
        </div>

        <button
          onClick={onRefresh}
          className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg"
        >
          <RefreshCw size={20} />
        </button>
      </div>

      <div className="flex items-center gap-2">
        <button
          onClick={() => window.print()}
          className="flex items-center gap-2 px-4 py-2 text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100"
        >
          <Download size={20} />
          <span>Xuất Báo Cáo</span>
        </button>
      </div>
    </div>
  );
} 