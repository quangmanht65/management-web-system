import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import { Toaster, toast } from 'react-hot-toast'

function Login() {
  const navigate = useNavigate()
  const [credentials, setCredentials] = useState({
    username: '',
    password: ''
  })
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const handleChange = (e) => {
    setCredentials({
      ...credentials,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')

    try {
      const response = await axios.post('http://localhost:8000/api/v1/auth/login', credentials, {
        headers: {
          'Content-Type': 'application/json'
        }
      })

      if (response.data.access_token) {
        localStorage.setItem('access_token', response.data.access_token)
        localStorage.setItem('refresh_token', response.data.refresh_token)
        localStorage.setItem('user', JSON.stringify(response.data.user))
        axios.defaults.headers.common['Authorization'] = `Bearer ${response.data.access_token}`
        
        toast.success('Đăng nhập thành công!')
        setTimeout(() => {
          navigate('/dashboard')
        }, 1000)
      }
    } catch (err) {
      console.error('Login error:', err.response?.data)
      const errorMessage = typeof err.response?.data?.detail === 'object' 
        ? 'Tài khoản hoặc mật khẩu không chính xác'
        : err.response?.data?.detail || 'Tài khoản hoặc mật khẩu không chính xác'
      
      setError(errorMessage)
      toast.error('Đăng nhập thất bại!')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen w-full bg-white">
      <Toaster position="top-right" />
      
      <div className="fixed inset-0 flex items-center justify-center">
        <div className="w-full max-w-sm px-8">
          <h1 className="text-[32px] font-medium text-[#1B2559] mb-8">
            Đăng nhập hệ thống
          </h1>

          <form onSubmit={handleSubmit} className="space-y-6">
            {error && typeof error === 'string' && (
              <div className="p-3 text-sm text-red-600 bg-red-50 rounded-lg text-center">
                {error}
              </div>
            )}

            <div>
              <input
                id="username"
                name="username"
                type="text"
                required
                disabled={isLoading}
                className="w-full h-12 px-4 text-base border border-gray-200 rounded-lg
                         focus:outline-none focus:ring-1 focus:ring-gray-300
                         placeholder:text-gray-400 disabled:bg-gray-50 disabled:cursor-not-allowed"
                placeholder="Tài khoản"
                value={credentials.username}
                onChange={handleChange}
              />
            </div>

            <div>
              <input
                id="password"
                name="password"
                type="password"
                required
                disabled={isLoading}
                className="w-full h-12 px-4 text-base border border-gray-200 rounded-lg
                         focus:outline-none focus:ring-1 focus:ring-gray-300
                         placeholder:text-gray-400 disabled:bg-gray-50 disabled:cursor-not-allowed"
                placeholder="Mật khẩu"
                value={credentials.password}
                onChange={handleChange}
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full h-12 text-base font-medium text-white bg-[#1B2559] 
                       hover:bg-[#1B2559]/90 rounded-lg transition-colors
                       disabled:bg-[#1B2559]/50 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Đang đăng nhập...' : 'Đăng nhập'}
            </button>

            <div className="text-center">
              <button
                type="button"
                disabled={isLoading}
                onClick={() => navigate('/forgot-password')}
                className="text-sm text-gray-500 hover:text-gray-700 transition-colors
                         disabled:text-gray-300 disabled:cursor-not-allowed"
              >
                Quên mật khẩu?
              </button>
            </div>
          </form>

          <div className="text-center mt-6">
            <p className="text-sm text-gray-500">
              Quản lý nhân sự © 2025
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Login 