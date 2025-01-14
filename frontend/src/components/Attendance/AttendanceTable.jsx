import { 
  CheckCircle, 
  XCircle, 
  Clock, 
  User, 
  Users,
  UserCheck,
  UserX 
} from 'react-feather';
import { useState } from 'react';
import { RollupCard } from './RollupCard';

export function AttendanceTable({ attendance, employees, isLoading, onStatusUpdate }) {
  const [showRollCall, setShowRollCall] = useState(false);

  const rollupData = {
    total: employees.length,
    present: attendance.filter(a => a.status === 'present').length,
    absent: attendance.filter(a => a.status === 'absent').length,
    late: attendance.filter(a => a.status === 'late').length,
    pending: employees.length - attendance.length
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'present':
        return <CheckCircle className="text-green-500" size={20} />;
      case 'absent':
        return <XCircle className="text-red-500" size={20} />;
      case 'late':
        return <Clock className="text-yellow-500" size={20} />;
      default:
        return <User className="text-gray-400" size={20} />;
    }
  };

  const getEmployeeStatus = (employeeId) => {
    const record = attendance.find(a => a.employee_id === employeeId);
    return record?.status || 'pending';
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
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <RollupCard
          title="Tổng Nhân Viên"
          count={rollupData.total}
          icon={Users}
          color="text-blue-600"
        />
        <RollupCard
          title="Có Mặt"
          count={rollupData.present}
          icon={UserCheck}
          color="text-green-600"
        />
        <RollupCard
          title="Vắng Mặt"
          count={rollupData.absent}
          icon={UserX}
          color="text-red-600"
        />
        <RollupCard
          title="Đi Muộn"
          count={rollupData.late}
          icon={Clock}
          color="text-yellow-600"
        />
      </div>

      <div className="flex justify-between items-center">
        <h2 className="text-lg font-medium text-gray-900">
          {showRollCall ? 'Điểm Danh' : 'Danh Sách Nhân Viên'}
        </h2>
        <button
          onClick={() => setShowRollCall(!showRollCall)}
          className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
        >
          {showRollCall ? 'Xem Danh Sách' : 'Điểm Danh'}
        </button>
      </div>

      <div className="bg-white rounded-lg border border-gray-200">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Mã NV</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Họ Tên</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Bộ Phận</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Trạng Thái</th>
              {showRollCall && (
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Thao Tác</th>
              )}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {employees.map((employee) => {
              const status = getEmployeeStatus(employee.id);
              return (
                <tr key={employee.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 text-sm">{employee.employee_code}</td>
                  <td className="px-4 py-3 text-sm">{employee.full_name}</td>
                  <td className="px-4 py-3 text-sm">{employee.Department}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center">
                      {getStatusIcon(status)}
                      <span className="ml-2 text-sm">
                        {status === 'present' ? 'Có mặt' : 
                         status === 'absent' ? 'Vắng mặt' : 
                         status === 'late' ? 'Đi muộn' : 'Chưa điểm danh'}
                      </span>
                    </div>
                  </td>
                  {showRollCall && (
                    <td className="px-4 py-3">
                      <div className="flex gap-2">
                        <button
                          onClick={() => onStatusUpdate(employee.id, 'present')}
                          className={`p-1 rounded ${
                            status === 'present' 
                              ? 'bg-green-50 text-green-600' 
                              : 'text-green-500 hover:bg-green-50'
                          }`}
                        >
                          <CheckCircle size={20} />
                        </button>
                        <button
                          onClick={() => onStatusUpdate(employee.id, 'absent')}
                          className={`p-1 rounded ${
                            status === 'absent' 
                              ? 'bg-red-50 text-red-600' 
                              : 'text-red-500 hover:bg-red-50'
                          }`}
                        >
                          <XCircle size={20} />
                        </button>
                        <button
                          onClick={() => onStatusUpdate(employee.id, 'late')}
                          className={`p-1 rounded ${
                            status === 'late' 
                              ? 'bg-yellow-50 text-yellow-600' 
                              : 'text-yellow-500 hover:bg-yellow-50'
                          }`}
                        >
                          <Clock size={20} />
                        </button>
                      </div>
                    </td>
                  )}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
} 