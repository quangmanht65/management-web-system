import { useState, useEffect } from 'react'
import { Plus } from 'react-feather'
import { MainLayout } from '../components/Layout/MainLayout'
import { PageHeader } from '../components/UI/PageHeader'
import { DepartmentCard } from '../components/Department/DepartmentCard'
import api from '../utils/axios'
import toast from 'react-hot-toast'
import { CreateDepartmentModal } from '../components/Department/CreateDepartmentModal'

export default function Departments() {
  const [departments, setDepartments] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)

  useEffect(() => {
    fetchDepartments()
  }, [])

  const fetchDepartments = async () => {
    try {
      setIsLoading(true)
      const response = await api.get('/department/')
      const sortedDepartments = response.data.sort((a, b) => b.employee_count - a.employee_count)
      setDepartments(sortedDepartments)
    } catch (error) {
      console.error('Error fetching departments:', error)
      toast.error('Không thể tải danh sách phòng ban')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <MainLayout>
      <div className="flex justify-between items-center mb-6">
        <PageHeader title="Phòng Ban" />
        <button 
          className="flex items-center gap-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
          onClick={() => setIsCreateModalOpen(true)}
        >
          <Plus size={20} />
          <span>Tạo mới phòng ban</span>
        </button>
      </div>

      {isLoading ? (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="animate-pulse bg-white rounded-lg p-6 h-32" />
          ))}
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {departments.map(department => (
            <DepartmentCard 
              key={department.id}
              department={department}
              onUpdate={() => fetchDepartments()}
            />
          ))}
        </div>
      )}

      <CreateDepartmentModal 
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSuccess={fetchDepartments}
      />
    </MainLayout>
  )
} 