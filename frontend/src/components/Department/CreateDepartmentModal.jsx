import { useState } from 'react'
import { X } from 'react-feather'
import api from '../../utils/axios'
import toast from 'react-hot-toast'

export function CreateDepartmentModal({ isOpen, onClose, onSubmit }) {
  const [formData, setFormData] = useState({
    department_code: '',
    name: ''
  })
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      setIsSubmitting(true)
      await api.post('/department/', formData)
      toast.success('Tạo phòng ban thành công')
      onSubmit()
      onClose()
      setFormData({
        department_code: '',
        name: ''
      })
    } catch (error) {
      console.error('Error creating department:', error)
      toast.error('Không thể tạo phòng ban')
    } finally {
      setIsSubmitting(false)
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center">
      <div className="bg-white rounded-lg w-full max-w-md">
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-lg font-medium">Tạo mới phòng ban</h2>
          <button 
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-4 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Mã phòng ban
            </label>
            <input
              type="text"
              required
              value={formData.department_code}
              onChange={e => setFormData(prev => ({ 
                ...prev, 
                department_code: e.target.value 
              }))}
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Tên phòng ban
            </label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={e => setFormData(prev => ({ 
                ...prev, 
                name: e.target.value 
              }))}
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm text-gray-600 hover:bg-gray-100 rounded-lg"
            >
              Hủy
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-4 py-2 text-sm text-white bg-blue-500 rounded-lg hover:bg-blue-600 disabled:opacity-50"
            >
              {isSubmitting ? 'Đang tạo...' : 'Tạo phòng ban'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
} 