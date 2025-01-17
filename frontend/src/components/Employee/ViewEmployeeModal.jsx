import { useState } from 'react'
import { X, Archive, RefreshCw } from 'react-feather'
import api from '../../utils/axios'
import toast from 'react-hot-toast'
import { Avatar } from '../UI/Avatar'

export function ViewEmployeeModal({ isOpen, onClose, employee, onSuccess }) {
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleToggleHide = async () => {
    try {
      setIsSubmitting(true)
      await api.patch(`/employee/${employee.id}/toggle-hide/`)
      
      toast.success(
        employee.is_hidden 
          ? 'Đã hiện nhân viên' 
          : 'Đã ẩn nhân viên'
      )
      
      onSuccess()
      onClose()
    } catch (error) {
      console.error('Error toggling employee visibility:', error)
      toast.error('Không thể thay đổi trạng thái hiển thị của nhân viên')
    } finally {
      setIsSubmitting(false)
    }
  }

  if (!isOpen || !employee) return null

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-lg font-medium">Chi tiết nhân viên</h2>
          <button 
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <X size={20} />
          </button>
        </div>

        <div className="p-4">
          <div className="flex items-center gap-4 mb-6">
            <Avatar 
              src={employee.profile_image_path} 
              alt={employee.full_name}
              className="w-24 h-24"
            />
            <div>
              <h3 className="text-xl font-medium">{employee.full_name}</h3>
              <p className="text-gray-500">Mã nhân viên: {employee.employee_code}</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 mb-6">
            <div>
              <p className="text-sm text-gray-500">Chức vụ</p>
              <p>{employee.Position}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Phòng ban</p>
              <p>{employee.Department}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Email</p>
              <p>{employee.email}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Số điện thoại</p>
              <p>{employee.phone}</p>
            </div>
            {/* Add more employee details as needed */}
          </div>

          <div className="flex justify-end gap-3">
            <button
              onClick={onClose}
              className="px-4 py-2 text-sm text-gray-600 hover:bg-gray-100 rounded-lg"
            >
              Đóng
            </button>
            <button
              onClick={handleToggleHide}
              disabled={isSubmitting}
              className={`px-4 py-2 text-sm text-white rounded-lg flex items-center gap-2 ${
                employee.is_hidden 
                  ? 'bg-green-500 hover:bg-green-600' 
                  : 'bg-rose-400 hover:bg-rose-500'
              }`}
            >
              {employee.is_hidden ? (
                <>
                  <RefreshCw size={16} />
                  <span>Hiện nhân viên</span>
                </>
              ) : (
                <>
                  <Archive size={16} />
                  <span>Ẩn nhân viên</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
} 