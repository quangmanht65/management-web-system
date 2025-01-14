import { useState, useEffect } from 'react'
import { Users, Home } from 'react-feather'
import api from '../utils/axios'
import toast from 'react-hot-toast'
import { MainLayout } from '../components/Layout/MainLayout'
import { Card, CardContent } from '../components/UI/Card'
import { PageHeader } from '../components/UI/PageHeader'

export default function Dashboard() {
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
          api.get('/employee/count/'),
          api.get('/department/count/')
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
    <MainLayout>
      <PageHeader title="Bảng Điều Khiển">
        <p className="text-sm text-gray-500">
          {new Date().toLocaleString("vi-VN")}
        </p>
      </PageHeader>

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
    </MainLayout>
  )
} 