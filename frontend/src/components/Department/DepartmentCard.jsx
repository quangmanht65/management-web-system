import { Database, Users } from 'react-feather'

export function DepartmentCard({ department }) {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 hover:shadow-md transition-shadow">
      <div className="flex items-start gap-4">
        <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
          <Database className="w-6 h-6 text-green-600" />
        </div>
        
        <div className="flex-1">
          <h3 className="font-medium text-red-500 uppercase">
            {department.name}
          </h3>
          
          <div className="mt-2 flex items-center gap-2 text-sm text-gray-600">
            <Users size={16} />
            <span>{department.employee_count} nhân viên</span>
          </div>
          
          <div className="mt-1 text-sm text-gray-500">
            Mã phòng: {department.department_code}
          </div>
        </div>
      </div>
    </div>
  )
} 