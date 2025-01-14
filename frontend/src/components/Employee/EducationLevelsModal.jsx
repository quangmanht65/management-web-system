import { useState, useEffect } from 'react'
import { X, Plus, Edit, Trash2, Upload } from 'react-feather'
import api from '../../utils/axios'
import toast from 'react-hot-toast'
import { EducationForm } from './EducationForm'
import { ImportEducationModal } from './ImportEducationModal'

export function EducationLevelsModal({ isOpen, onClose, employeeId }) {
  const [educationLevels, setEducationLevels] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [selectedEducation, setSelectedEducation] = useState(null)
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [isImportModalOpen, setIsImportModalOpen] = useState(false)

  useEffect(() => {
    if (isOpen) {
      fetchEducationLevels()
    }
  }, [isOpen, employeeId])

  const fetchEducationLevels = async () => {
    try {
      setIsLoading(true)
      const response = await api.get(employeeId ? `/education/${employeeId}` : '/education')
      setEducationLevels(response.data)
    } catch (error) {
      console.error('Error fetching education levels:', error)
      toast.error('Không thể tải thông tin trình độ học vấn')
    } finally {
      setIsLoading(false)
    }
  }

  const handleDelete = async (educationId) => {
    if (!confirm('Bạn có chắc chắn muốn xóa trình độ học vấn này?')) return

    try {
      await api.delete(`/education/${educationId}`)
      toast.success('Xóa trình độ học vấn thành công')
      fetchEducationLevels()
    } catch (error) {
      console.error('Error deleting education:', error)
      toast.error('Không thể xóa trình độ học vấn')
    }
  }

  const handleFormSubmit = async (formData) => {
    try {
      if (selectedEducation) {
        await api.put(`/education/${selectedEducation.id}`, formData)
        toast.success('Cập nhật trình độ học vấn thành công')
      } else {
        await api.post(`/education/${employeeId}`, formData)
        toast.success('Thêm trình độ học vấn thành công')
      }
      fetchEducationLevels()
      setIsFormOpen(false)
      setSelectedEducation(null)
    } catch (error) {
      console.error('Error saving education:', error)
      toast.error(selectedEducation 
        ? 'Không thể cập nhật trình độ học vấn'
        : 'Không thể thêm trình độ học vấn'
      )
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-full max-w-3xl">
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-lg font-medium">Trình độ học vấn</h2>
          <button 
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <X size={20} />
          </button>
        </div>

        <div className="p-4">
          <div className="flex justify-end gap-2 mb-4">
            <button
              onClick={() => setIsImportModalOpen(true)}
              className="flex items-center gap-2 px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600"
            >
              <Upload size={20} />
              <span>Tải từ file</span>
            </button>
            <button
              onClick={() => {
                setSelectedEducation(null)
                setIsFormOpen(true)
              }}
              className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
            >
              <Plus size={20} />
              <span>Thêm trình độ học vấn</span>
            </button>
          </div>

          {isLoading ? (
            <div className="space-y-4">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="animate-pulse h-16 bg-gray-100 rounded-lg" />
              ))}
            </div>
          ) : educationLevels.length === 0 ? (
            <div className="text-center text-gray-500 py-8">
              Không có thông tin trình độ học vấn
            </div>
          ) : (
            <div className="space-y-4">
              {educationLevels.map((edu) => (
                <div 
                  key={edu.id}
                  className="p-4 border rounded-lg space-y-2"
                >
                  <div className="flex justify-between">
                    <h3 className="font-medium">{edu.degree_name}</h3>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => {
                          setSelectedEducation(edu)
                          setIsFormOpen(true)
                        }}
                        className="p-1 text-blue-500 hover:bg-blue-50 rounded"
                      >
                        <Edit size={16} />
                      </button>
                      <button
                        onClick={() => handleDelete(edu.id)}
                        className="p-1 text-red-500 hover:bg-red-50 rounded"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                  <p className="text-gray-600">Trường: {edu.school}</p>
                  <p className="text-gray-600">Chuyên ngành: {edu.major}</p>
                  <p className="text-gray-600">Năm tốt nghiệp: {edu.graduation_year}</p>
                  <p className="text-gray-600">Xếp loại: {edu.ranking}</p>
                </div>
              ))}
            </div>
          )}
        </div>

        <EducationForm 
          isOpen={isFormOpen}
          onClose={() => {
            setIsFormOpen(false)
            setSelectedEducation(null)
          }}
          onSubmit={handleFormSubmit}
          initialData={selectedEducation}
          employeeId={employeeId}
        />

        <ImportEducationModal 
          isOpen={isImportModalOpen}
          onClose={() => setIsImportModalOpen(false)}
          onSuccess={fetchEducationLevels}
        />

        <div className="flex justify-end p-4 border-t">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm text-gray-600 hover:bg-gray-100 rounded-lg"
          >
            Đóng
          </button>
        </div>
      </div>
    </div>
  )
} 