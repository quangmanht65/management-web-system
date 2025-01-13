import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Users, Home } from 'react-feather'
import api from '../utils/axios'
import { toast } from 'react-hot-toast'

function Card({ children, className = '' }) {
  return (
    <div className={`bg-white rounded-lg shadow-sm border border-gray-200 ${className}`}>
      {children}
    </div>
  )
}

function CardContent({ children, className = '' }) {
  return (
    <div className={`p-6 ${className}`}>
      {children}
    </div>
  )
}

function Sidebar() {
  const navigate = useNavigate()
  const user = JSON.parse(localStorage.getItem('user') || '{}')

  const handleLogout = () => {
    localStorage.clear()
    navigate('/login')
  }

  return (
    <aside className="w-64 border-r border-gray-200 min-h-screen bg-white">
      <div className="p-6">
        <h2 className="text-xl font-semibold text-[#1B2559]">Quản lý nhân sự</h2>
      </div>
      <div className="px-6 py-2">
        <p className="text-sm text-gray-500">Xin chào,</p>
        <p className="font-medium text-[#1B2559]">{user.username}</p>
      </div>
      <div className="mt-auto p-6">
        <button
          onClick={handleLogout}
          className="w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors"
        >
          Đăng xuất
        </button>
      </div>
    </aside>
  )
}

function Dashboard() {
  const navigate = useNavigate()
  const [stats, setStats] = useState({
    employeeCount: 0,
    departmentCount: 0
  })
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setIsLoading(true)
        const [employeesRes, departmentsRes] = await Promise.all([
          api.get('/employees/count'),
          api.get('/departments/count')
        ])

        setStats({
          employeeCount: employeesRes.data.count,
          departmentCount: departmentsRes.data.count
        })
      } catch (error) {
        console.error('Error fetching dashboard data:', error)
        toast.error('Không thể tải dữ liệu bảng điều khiển')
      } finally {
        setIsLoading(false)
      }
    }

    fetchDashboardData()
  }, [])

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      
      <main className="flex-1 p-8">
        <div className="max-w-6xl mx-auto">
          <header className="mb-8">
            <h1 className="text-2xl font-semibold text-[#1B2559]">Bảng Điều Khiển</h1>
            <p className="text-sm text-gray-500">
              {new Date().toLocaleString("vi-VN")}
            </p>
          </header>

          <div className="grid md:grid-cols-2 gap-6 mb-8">
            <Card>
              <CardContent className="flex items-center gap-4">
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                  <Users className="w-6 h-6 text-green-600" />
                </div>
                <div>
                  <h3 className="font-medium text-gray-500">TỔNG NHÂN VIÊN</h3>
                  {isLoading ? (
                    <div className="animate-pulse h-8 w-32 bg-gray-200 rounded"></div>
                  ) : (
                    <p className="text-2xl font-bold text-[#1B2559]">{stats.employeeCount} nhân viên</p>
                  )}
                  <p className="text-sm text-gray-500">Tổng số nhân viên được quản lý</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="flex items-center gap-4">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Home className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <h3 className="font-medium text-gray-500">TỔNG PHÒNG BAN</h3>
                  {isLoading ? (
                    <div className="animate-pulse h-8 w-32 bg-gray-200 rounded"></div>
                  ) : (
                    <p className="text-2xl font-bold text-[#1B2559]">{stats.departmentCount} phòng</p>
                  )}
                  <p className="text-sm text-gray-500">Tổng số phòng ban đang quản lý</p>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <span className="font-medium">Tên công ty: </span>
                  <span className="italic">Công ty tư vấn giải pháp phần mềm quản lý nhân sự</span>
                </div>
                <div>
                  <span className="font-medium">Địa chỉ: </span>
                  <span>334 D. Nguyễn Trãi, Thanh Xuân Trung, Thanh Xuân, Hà Nội</span>
                </div>
                <div>
                  <span className="font-medium">Số điện thoại: </span>
                  <span>0986259999</span>
                </div>
                <div>
                  <span className="font-medium">Mã số doanh nghiệp: </span>
                  <span>086986889</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}

export default Dashboard 