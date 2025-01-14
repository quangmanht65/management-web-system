import { useNavigate, Link, useLocation } from 'react-router-dom'
import { 
  Users, 
  BarChart2,
  UserPlus,
  Briefcase,
  FileText,
  DollarSign,
  Clock,
  Settings,
  LogOut,
  Grid
} from 'react-feather'

const menuItems = [
  {
    icon: Users,
    text: 'Quản lý',
    to: '/admin'
  },
  {
    icon: BarChart2,
    text: 'Bảng điều khiển',
    to: '/dashboard'
  },
  {
    icon: UserPlus,
    text: 'Quản lý nhân viên',
    to: '/employees'
  },
  {
    icon: Briefcase,
    text: 'Quản lý chức vụ',
    to: '/positions'
  },
  {
    icon: FileText,
    text: 'Danh sách hợp đồng',
    to: '/contracts'
  },
  {
    icon: DollarSign,
    text: 'Bảng kê lương',
    to: '/payroll'
  },
  {
    icon: Clock,
    text: 'Danh sách chấm công',
    to: '/attendance'
  },
  {
    icon: Clock,
    text: 'Thời gian công tác',
    to: '/working-time'
  },
  {
    icon: Grid,
    text: 'Phòng ban',
    to: '/departments'
  },
  {
    icon: Settings,
    text: 'Cài đặt',
    to: '/settings'
  }
]

function SidebarItem({ icon: Icon, text, to, isActive }) {
  return (
    <Link
      to={to}
      className={`flex items-center gap-3 px-6 py-3 text-sm transition-colors
                ${isActive 
                  ? 'text-white bg-white/10' 
                  : 'text-white/80 hover:text-white hover:bg-white/5'}`}
    >
      <Icon size={20} />
      <span>{text}</span>
    </Link>
  )
}

export function Sidebar() {
  const navigate = useNavigate()
  const location = useLocation()
  const user = JSON.parse(localStorage.getItem('user') || '{}')

  const handleLogout = () => {
    localStorage.clear()
    navigate('/login')
  }

  return (
    <aside className="fixed left-0 top-0 w-64 h-screen bg-[#2F6BFF] text-white flex flex-col">
      <div className="p-6">
        <h2 className="text-xl font-semibold">Quản lý nhân sự</h2>
      </div>

      <div className="px-6 py-2 mb-6">
        <p className="text-sm opacity-80">Xin chào,</p>
        <p className="font-medium">{user.username}</p>
      </div>

      <nav className="flex-1 space-y-1">
        {menuItems.map((item) => (
          <SidebarItem
            key={item.to}
            icon={item.icon}
            text={item.text}
            to={item.to}
            isActive={location.pathname === item.to}
          />
        ))}
      </nav>

      <div className="p-6">
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 px-4 py-2 w-full text-sm text-white/80 
                   hover:text-white hover:bg-white/5 rounded-lg transition-colors"
        >
          <LogOut size={20} />
          <span>Đăng xuất</span>
        </button>
      </div>
    </aside>
  )
} 