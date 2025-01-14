import { Users, UserCheck, UserX, Clock } from 'react-feather';

export function RollupCard({ title, count, icon: Icon, color }) {
  return (
    <div className={`bg-white p-4 rounded-lg border border-gray-200 ${color}`}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-600">{title}</p>
          <p className="text-2xl font-semibold mt-1">{count}</p>
        </div>
        <div className={`p-3 rounded-full ${color.replace('text-', 'bg-').replace('600', '100')}`}>
          <Icon size={20} />
        </div>
      </div>
    </div>
  );
} 