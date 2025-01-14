import { useState, useEffect } from 'react';
import { MainLayout } from '../components/Layout/MainLayout';
import { PageHeader } from '../components/UI/PageHeader';
import { AdminTable } from '../components/Admin/AdminTable';
import { AdminToolbar } from '../components/Admin/AdminToolbar';
import { CreateAccountModal } from '../components/Admin/CreateAccountModal';
import { Card } from '../components/UI/Card';
import toast from 'react-hot-toast';
import api from '../utils/axios';

export default function Admin() {
  const [accounts, setAccounts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);

  useEffect(() => {
    fetchAccounts();
  }, []);

  const fetchAccounts = async () => {
    try {
      setIsLoading(true);
      const response = await api.get('/auth/users/');
      setAccounts(response.data);
    } catch (error) {
      console.error('Error fetching accounts:', error);
      toast.error('Không thể tải danh sách tài khoản');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreate = async (data) => {
    try {
      await api.post('/auth/signup', data);
      toast.success('Tạo tài khoản thành công');
      fetchAccounts();
      setShowCreateModal(false);
    } catch (error) {
      console.error('Create error:', error);
      if (error.response?.data?.detail === "User already exists") {
        toast.error('Tên người dùng đã tồn tại');
      } else {
        toast.error('Có lỗi xảy ra khi tạo tài khoản');
      }
    }
  };

  const handleDelete = async (id) => {
    try {
      await api.delete(`/users/${id}`);
      toast.success('Xóa tài khoản thành công');
      fetchAccounts();
    } catch (error) {
      console.error('Delete error:', error);
      toast.error('Có lỗi xảy ra khi xóa tài khoản');
    }
  };

  const handleToggleStatus = async (id, isActive) => {
    try {
      await api.patch(`/auth/users/${id}/verify`);
      toast.success('Cập nhật trạng thái thành công');
      fetchAccounts();
    } catch (error) {
      console.error('Status update error:', error);
      toast.error('Có lỗi xảy ra khi cập nhật trạng thái');
    }
  };

  return (
    <MainLayout>
      <div className="space-y-6">
        <PageHeader 
          title="Quản Lý Tài Khoản" 
          subtitle="Quản lý tài khoản người dùng trong hệ thống"
        />
        
        <Card>
          <AdminToolbar 
            onCreateClick={() => setShowCreateModal(true)}
            onRefresh={fetchAccounts}
            totalAccounts={accounts.length}
          />

          <AdminTable 
            accounts={accounts}
            isLoading={isLoading}
            onDelete={handleDelete}
            onToggleStatus={handleToggleStatus}
          />
        </Card>
      </div>

      <CreateAccountModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onSubmit={handleCreate}
      />
    </MainLayout>
  );
} 