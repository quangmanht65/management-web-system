import { useState, useEffect } from 'react'
import { MainLayout } from '../components/Layout/MainLayout'
import { PageHeader } from '../components/UI/PageHeader'
import { EmployeeTable } from '../components/Employee/EmployeeTable'
import { EmployeeToolbar } from '../components/Employee/EmployeeToolbar'
import { CreateEmployeeModal } from '../components/Employee/CreateEmployeeModal'
import { EducationLevelsModal } from '../components/Employee/EducationLevelsModal'
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
        gender: emp.gender === 'M' ? 'Nam' : 'Nữ'
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

  // Filter employees based on search query
  const filteredEmployees = employees.filter(emp => 
    emp.full_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    emp.employee_code?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    emp.phone?.includes(searchQuery)
  )

  const handleViewEducation = (employeeId) => {
    setSelectedEmployeeId(employeeId)
    setIsEducationModalOpen(true)
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
      />

      <EmployeeTable 
        employees={filteredEmployees}
        isLoading={isLoading}
        selectedEmployees={selectedEmployees}
        onSelectEmployees={setSelectedEmployees}
        itemsPerPage={itemsPerPage}
        onItemsPerPageChange={setItemsPerPage}
        onViewEducation={handleViewEducation}
      />

      <CreateEmployeeModal 
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSuccess={fetchEmployees}
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