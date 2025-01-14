import { useState, useEffect } from 'react'
import { MainLayout } from '../components/Layout/MainLayout'
import { PageHeader } from '../components/UI/PageHeader'
import { DepartmentTable } from '../components/Department/DepartmentTable'
import { DepartmentToolbar } from '../components/Department/DepartmentToolbar'
import { CreateDepartmentModal } from '../components/Department/CreateDepartmentModal'
import { Card } from '../components/UI/Card'
import toast from 'react-hot-toast'
import api from '../utils/axios'

export default function Departments() {
  const [departments, setDepartments] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [showCreateModal, setShowCreateModal] = useState(false)

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

  const handleDelete = async (id) => {
    try {
      await api.delete(`/department/${id}`)
      toast.success('Xóa phòng ban thành công')
      fetchDepartments()
    } catch (error) {
      console.error('Error deleting department:', error)
      toast.error('Không thể xóa phòng ban')
    }
  }

  const handleEdit = async (id, data) => {
    try {
      await api.put(`/department/${id}`, data)
      toast.success('Cập nhật phòng ban thành công')
      fetchDepartments()
    } catch (error) {
      console.error('Error updating department:', error)
      toast.error('Không thể cập nhật phòng ban')
    }
  }

  const handleCreate = async (department) => {
    try {
      await api.post('/department/', department)
      fetchDepartments()
    } catch (error) {
      console.error('Error creating department:', error)
      toast.error('Không thể tạo phòng ban')
    }
  }

  return (
    <MainLayout>
      <div className="space-y-6">
        <PageHeader 
          title="Quản Lý Phòng Ban" 
          subtitle="Quản lý thông tin và nhân sự các phòng ban"
        />
        
        <Card>
          <DepartmentToolbar 
            onCreateClick={() => setShowCreateModal(true)}
            onRefresh={fetchDepartments}
            totalDepartments={departments.length}
          />

          <DepartmentTable 
            departments={departments}
            isLoading={isLoading}
            onDelete={handleDelete}
            onEdit={handleEdit}
          />
        </Card>
      </div>

      <CreateDepartmentModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onSubmit={handleCreate}
      />
    </MainLayout>
  )
} 