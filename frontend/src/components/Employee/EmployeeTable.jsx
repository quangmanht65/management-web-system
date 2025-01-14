import { Eye, Edit, FileText } from 'react-feather'

export function EmployeeTable({ 
  employees = [],
  isLoading,
  selectedEmployees,
  onSelectEmployees,
  itemsPerPage,
  onViewEducation
}) {
  const handleSelectAll = (e) => {
    if (e.target.checked) {
      onSelectEmployees(employees.map(emp => emp.id))
    } else {
      onSelectEmployees([])
    }
  }

  const handleSelectOne = (id) => {
    if (selectedEmployees.includes(id)) {
      onSelectEmployees(selectedEmployees.filter(empId => empId !== id))
    } else {
      onSelectEmployees([...selectedEmployees, id])
    }
  }

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A'
    return new Date(dateString).toLocaleDateString('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    })
  }

  if (isLoading) {
    return (
      <div className="animate-pulse space-y-4">
        {[...Array(itemsPerPage)].map((_, i) => (
          <div key={i} className="h-16 bg-gray-100 rounded-lg" />
        ))}
      </div>
    )
  }

  if (!employees.length) {
    return (
      <div className="bg-white rounded-lg border border-gray-200 p-8 text-center text-gray-500">
        Không có nhân viên nào
      </div>
    )
  }

  return (
    <div className="bg-white rounded-lg border border-gray-200 overflow-x-auto">
      <table className="w-full">
        <thead className="bg-gray-50">
          <tr>
            <th className="w-12 px-4 py-3">
              <input 
                type="checkbox"
                checked={selectedEmployees.length === employees.length}
                onChange={handleSelectAll}
                className="rounded border-gray-300"
              />
            </th>
            <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">ID nhân viên</th>
            <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Họ và tên</th>
            <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Ảnh thẻ</th>
            <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Địa chỉ</th>
            <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Ngày sinh</th>
            <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Giới tính</th>
            <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">SĐT</th>
            <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Chức vụ</th>
            <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Phòng ban</th>
            <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Tính năng</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {employees.map(employee => (
            <tr key={employee.id} className="hover:bg-gray-50">
              <td className="px-4 py-3">
                <input 
                  type="checkbox"
                  checked={selectedEmployees.includes(employee.id)}
                  onChange={() => handleSelectOne(employee.id)}
                  className="rounded border-gray-300"
                />
              </td>
              <td className="px-4 py-3 text-sm">{employee.employee_code}</td>
              <td className="px-4 py-3 text-sm">{employee.full_name}</td>
              <td className="px-4 py-3">
                <img 
                  src={employee.avatar_url || '/default-avatar.png'} 
                  alt={employee.full_name}
                  className="w-10 h-10 rounded-full object-cover"
                />
              </td>
              <td className="px-4 py-3 text-sm">{employee.address}</td>
              <td className="px-4 py-3 text-sm">{formatDate(employee.date_of_birth)}</td>
              <td className="px-4 py-3 text-sm">{employee.gender}</td>
              <td className="px-4 py-3 text-sm">{employee.phone}</td>
              <td className="px-4 py-3 text-sm">{employee.Position}</td>
              <td className="px-4 py-3 text-sm">{employee.Department}</td>
              <td className="px-4 py-3">
                <div className="flex items-center gap-2">
                  <button className="p-1 text-red-500 hover:bg-red-50 rounded">
                    <Edit size={16} />
                  </button>
                  <button className="p-1 text-gray-500 hover:bg-gray-100 rounded">
                    <Eye size={16} />
                  </button>
                  <button 
                    onClick={() => onViewEducation(employee.id)}
                    className="p-1 text-blue-500 hover:bg-blue-50 rounded"
                    title="Xem trình độ học vấn"
                  >
                    <FileText size={16} />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
} 