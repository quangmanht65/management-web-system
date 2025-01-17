import { useState, useEffect } from 'react'
import { MainLayout } from '../components/Layout/MainLayout'
import { PageHeader } from '../components/UI/PageHeader'
import { EmployeeTable } from '../components/Employee/EmployeeTable'
import { EmployeeToolbar } from '../components/Employee/EmployeeToolbar'
import { CreateEmployeeModal } from '../components/Employee/CreateEmployeeModal'
import { EducationLevelsModal } from '../components/Employee/EducationLevelsModal'
import { EditEmployeeModal } from '../components/Employee/EditEmployeeModal'
import api from '../utils/axios'
import toast from 'react-hot-toast'

function Employees() {
  console.log('Employees component mounting')
  const [employees, setEmployees] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [selectedEmployees, setSelectedEmployees] = useState([])
  const [itemsPerPage, setItemsPerPage] = useState(10)
  const [searchQuery, setSearchQuery] = useState('')
  const [error, setError] = useState(null)
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [isEducationModalOpen, setIsEducationModalOpen] = useState(false)
  const [selectedEmployeeId, setSelectedEmployeeId] = useState(null)
  const [filters, setFilters] = useState({
    showHidden: false
  })
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [selectedEmployee, setSelectedEmployee] = useState(null)

  useEffect(() => {
    fetchEmployees()
  }, [])

  const fetchEmployees = async () => {
    try {
      setIsLoading(true)
      setError(null)
      const response = await api.get('/employee/')
      console.log('Employee data:', response.data)
      
      if (!response.data) {
        throw new Error('No data received from server')
      }

      // Transform data if needed
      const formattedEmployees = response.data.map(emp => ({
        ...emp,
        gender: emp.gender === 'Male' ? 'Nam' : 'Nữ'
      }))
      
      setEmployees(formattedEmployees)
    } catch (error) {
      console.error('Error fetching employees:', error)
      setError(error.message)
      toast.error('Không thể tải danh sách nhân viên')
    } finally {
      setIsLoading(false)
    }
  }

  // Filter employees based on search query and filters
  const filteredEmployees = employees.filter(emp => {
    const matchesSearch = 
      emp.full_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      emp.employee_code?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      emp.phone?.includes(searchQuery)

    const matchesHidden = filters.showHidden || !emp.is_hidden
    
    return matchesSearch && matchesHidden
  })

  const handleFilterChange = (newFilters) => {
    setFilters(prev => ({
      ...prev,
      ...newFilters
    }))
  }

  const handleViewEducation = (employeeId) => {
    setSelectedEmployeeId(employeeId)
    setIsEducationModalOpen(true)
  }

  const handleEditEmployee = (employee) => {
    setSelectedEmployee(employee)
    setIsEditModalOpen(true)
  }

  const handleToggleHide = async (employeeId) => {
    try {
      const employee = employees.find(emp => emp.id === employeeId)
      if (!employee) return

      await api.patch(`/employee/${employeeId}/toggle-hide/`)
      
      toast.success(
        employee.is_hidden 
          ? 'Đã hiện nhân viên' 
          : 'Đã ẩn nhân viên'
      )
      
      // Refresh the employee list
      fetchEmployees()
    } catch (error) {
      console.error('Error toggling employee visibility:', error)
      toast.error('Không thể thay đổi trạng thái hiển thị của nhân viên')
    }
  }

  if (error) {
    return (
      <MainLayout>
        <div className="text-center text-red-500">
          Error: {error}
          <button 
            onClick={fetchEmployees}
            className="ml-4 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
          >
            Retry
          </button>
        </div>
      </MainLayout>
    )
  }

  return (
    <MainLayout>
      <PageHeader title="Danh Sách Nhân Viên" />
      
      <EmployeeToolbar 
        selectedCount={selectedEmployees.length}
        onRefresh={fetchEmployees}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        onCreateClick={() => setIsCreateModalOpen(true)}
        onViewEducationClick={() => setIsEducationModalOpen(true)}
        employees={employees}
        onFilterChange={handleFilterChange}
      />

      <EmployeeTable 
        employees={filteredEmployees}
        isLoading={isLoading}
        selectedEmployees={selectedEmployees}
        onSelectEmployees={setSelectedEmployees}
        itemsPerPage={itemsPerPage}
        onItemsPerPageChange={setItemsPerPage}
        onViewEducation={handleViewEducation}
        onEditEmployee={handleEditEmployee}
        onToggleHide={handleToggleHide}
      />

      <CreateEmployeeModal 
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSuccess={fetchEmployees}
      />

      <EditEmployeeModal
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false)
          setSelectedEmployee(null)
        }}
        onSuccess={fetchEmployees}
        employeeData={selectedEmployee}
      />

      <EducationLevelsModal 
        isOpen={isEducationModalOpen}
        onClose={() => {
          setIsEducationModalOpen(false)
          setSelectedEmployeeId(null)
        }}
        employeeId={selectedEmployeeId}
      />
    </MainLayout>
  )
}

export default Employees 