import { useState, useEffect } from 'react';
import { MainLayout } from '../components/Layout/MainLayout';
import { PageHeader } from '../components/UI/PageHeader';
import { PositionTable } from '../components/Position/PositionTable';
import { PositionToolbar } from '../components/Position/PositionToolbar';
import { CreatePositionModal } from '../components/Position/CreatePositionModal';
import toast from 'react-hot-toast';
import api from '../utils/axios';

function Positions() {
  const [positions, setPositions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchPositions();
  }, []);

  const fetchPositions = async () => {
    try {
      setIsLoading(true);
      const response = await api.get('/employee/positions/');
      setPositions(response.data);
    } catch (error) {
      console.error('Error fetching positions:', error);
      toast.error('Không thể tải danh sách chức vụ');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreate = async (data) => {
    try {
      await api.post('/position/', data);
      toast.success('Tạo chức vụ thành công');
      fetchPositions();
      setShowCreateModal(false);
    } catch (error) {
      console.error('Create error:', error);
      toast.error('Có lỗi xảy ra khi tạo chức vụ');
    }
  };

  const handleDelete = async (positionId) => {
    try {
      await api.delete(`/position/${positionId}`);
      toast.success('Xóa chức vụ thành công');
      fetchPositions();
    } catch (error) {
      console.error('Delete error:', error);
      toast.error('Có lỗi xảy ra khi xóa chức vụ');
    }
  };

  return (
    <MainLayout>
      <PageHeader title="Quản Lý Chức Vụ" />
      
      <PositionToolbar 
        onCreateClick={() => setShowCreateModal(true)}
        onRefresh={fetchPositions}
      />

      <PositionTable 
        positions={positions}
        isLoading={isLoading}
        onDelete={handleDelete}
      />

      <CreatePositionModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onSubmit={handleCreate}
      />
    </MainLayout>
  );
}

export default Positions; 