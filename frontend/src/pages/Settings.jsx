import { useState } from 'react';
import { MainLayout } from '../components/Layout/MainLayout';
import { PageHeader } from '../components/UI/PageHeader';
import { toast } from 'react-hot-toast';
import api from '../utils/axios';

function Settings() {
  const [passwords, setPasswords] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    setPasswords(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (passwords.newPassword !== passwords.confirmPassword) {
      toast.error('Mật khẩu mới không khớp');
      return;
    }

    try {
      setIsLoading(true);
      await api.post('/auth/change-password', {
        current_password: passwords.currentPassword,
        new_password: passwords.newPassword
      });
      
      toast.success('Đổi mật khẩu thành công');
      setPasswords({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
    } catch (error) {
      toast.error(error.response?.data?.detail || 'Đổi mật khẩu thất bại');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <MainLayout>
      <PageHeader title="Cài đặt" />
      
      <div className="max-w-3xl mx-auto">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-medium text-gray-900">Bảo mật tài khoản</h2>
            <p className="mt-1 text-sm text-gray-500">
              Cập nhật mật khẩu để bảo vệ tài khoản của bạn
            </p>
          </div>
        
          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Mật khẩu hiện tại
              </label>
              <div className="mt-1">
                <input
                  type="password"
                  name="currentPassword"
                  value={passwords.currentPassword}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm 
                           focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>
              <p className="mt-1 text-sm text-gray-500">
                Nhập mật khẩu hiện tại của bạn
              </p>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Mật khẩu mới
              </label>
              <div className="mt-1">
                <input
                  type="password"
                  name="newPassword"
                  value={passwords.newPassword}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm 
                           focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>
              <p className="mt-1 text-sm text-gray-500">
                Mật khẩu phải có ít nhất 8 ký tự
              </p>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Xác nhận mật khẩu mới
              </label>
              <div className="mt-1">
                <input
                  type="password"
                  name="confirmPassword"
                  value={passwords.confirmPassword}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm 
                           focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>
            </div>
            
            <div className="pt-4 border-t border-gray-200">
              <button
                type="submit"
                disabled={isLoading}
                className="inline-flex justify-center py-2 px-4 border border-transparent 
                         shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 
                         hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 
                         focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? 'Đang xử lý...' : 'Đổi mật khẩu'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </MainLayout>
  );
}

export default Settings; 