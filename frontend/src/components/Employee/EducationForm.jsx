import { useState, useEffect } from 'react'
import { X } from 'react-feather'
import api from '../../utils/axios'
import toast from 'react-hot-toast'

export function EducationForm({ isOpen, onClose, onSubmit, initialData = null, employeeId = null }) {
  const [formData, setFormData] = useState({
    degree_name: '',
    school: '',
    major: '',
    graduation_year: '',
    ranking: '',
    employee_id: employeeId || ''
  })
  const [employees, setEmployees] = useState([])
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    if (initialData) {
      setFormData(initialData)
    } else if (employeeId) {
      setFormData(prev => ({ ...prev, employee_id: employeeId }))
    }
  }, [initialData, employeeId])

  useEffect(() => {
    if (isOpen && !employeeId) {
      fetchEmployees()
    }
  }, [isOpen])

  const fetchEmployees = async () => {
    try {
      setIsLoading(true)
      const response = await api.get('/employee')
      setEmployees(response.data)
    } catch (error) {
      console.error('Error fetching employees:', error)
      toast.error('Không thể tải danh sách nhân viên')
    } finally {
      setIsLoading(false)
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    const submitData = {
      ...formData,
      employee_id: employeeId || formData.employee_id
    }
    onSubmit(submitData)
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-full max-w-md">
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-lg font-medium">
            {initialData ? 'Cập nhật trình độ học vấn' : 'Thêm trình độ học vấn'}
          </h2>
          <button 
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-4 space-y-4">
          {!employeeId && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Nhân viên
              </label>
              <select
                required
                value={formData.employee_id}
                onChange={e => setFormData(prev => ({ 
                  ...prev, 
                  employee_id: e.target.value 
                }))}
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                disabled={isLoading}
              >
                <option value="">Chọn nhân viên</option>
                {employees.map(emp => (
                  <option key={emp.id} value={emp.id}>
                    {emp.employee_code} - {emp.full_name}
                  </option>
                ))}
              </select>
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Bằng cấp
            </label>
            <input
              type="text"
              required
              value={formData.degree_name}
              onChange={e => setFormData(prev => ({ 
                ...prev, 
                degree_name: e.target.value 
              }))}
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Trường
            </label>
            <input
              type="text"
              required
              value={formData.school}
              onChange={e => setFormData(prev => ({ 
                ...prev, 
                school: e.target.value 
              }))}
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Chuyên ngành
            </label>
            <input
              type="text"
              required
              value={formData.major}
              onChange={e => setFormData(prev => ({ 
                ...prev, 
                major: e.target.value 
              }))}
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Năm tốt nghiệp
            </label>
            <input
              type="text"
              required
              value={formData.graduation_year}
              onChange={e => setFormData(prev => ({ 
                ...prev, 
                graduation_year: e.target.value 
              }))}
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Xếp loại
            </label>
            <input
              type="text"
              required
              value={formData.ranking}
              onChange={e => setFormData(prev => ({ 
                ...prev, 
                ranking: e.target.value 
              }))}
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="flex justify-end gap-2 pt-4 border-t">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm text-gray-600 hover:bg-gray-100 rounded-lg"
            >
              Hủy
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-sm text-white bg-blue-500 rounded-lg hover:bg-blue-600"
            >
              {initialData ? 'Cập nhật' : 'Thêm'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
} 