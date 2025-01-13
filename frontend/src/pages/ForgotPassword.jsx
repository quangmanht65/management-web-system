import { useNavigate } from 'react-router-dom'

function ForgotPassword() {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen w-full bg-gradient-to-b from-sky-100 to-sky-600 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-xl shadow-lg">
        <div className="p-8 flex flex-col items-center space-y-6">
          <div className="space-y-3 text-center max-w-sm">
            <h1 className="text-2xl font-medium text-gray-900">
              Quên mật khẩu?
            </h1>
            
            <p className="text-sm text-gray-600">
              Vui lòng liên hệ với bộ phận nhân sự để được hỗ trợ khôi phục mật khẩu
            </p>
          </div>
          
          <button 
            onClick={() => navigate('/login')}
            className="text-sm px-6 py-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
          >
            ← Trở về đăng nhập
          </button>

          <div className="text-xs text-gray-400">
            Quản lý nhân sự © 2025
          </div>
        </div>
      </div>
    </div>
  )
}

export default ForgotPassword 