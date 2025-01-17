import { useState, useEffect } from 'react';
import { MainLayout } from '../components/Layout/MainLayout';
import { PageHeader } from '../components/UI/PageHeader';
import { PayrollTable } from '../components/Payroll/PayrollTable';
import { PayrollToolbar } from '../components/Payroll/PayrollToolbar';
import { CreatePayrollModal } from '../components/Payroll/CreatePayrollModal';
import toast from 'react-hot-toast';
import api from '../utils/axios';

function Payroll() {
  const [payrolls, setPayrolls] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedPayrolls, setSelectedPayrolls] = useState([]);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [searchQuery, setSearchQuery] = useState('');
  const [error, setError] = useState(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  useEffect(() => {
    fetchPayrolls();
  }, []);

  const fetchPayrolls = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await api.get('/payroll/');
      setPayrolls(response.data);
    } catch (error) {
      console.error('Error fetching payrolls:', error);
      setError(error.response?.data?.message || 'Failed to fetch payroll data');
      toast.error('Không thể tải danh sách bảng lương');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (payrollId) => {
    try {
      setIsLoading(true);
      await api.delete(`/payroll/${payrollId}`);
      toast.success('Xóa bảng lương thành công');
      fetchPayrolls();
    } catch (error) {
      console.error('Delete error:', error);
      const errorMessage = error.response?.data?.message || 'Có lỗi xảy ra khi xóa bảng lương';
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  // Filter payrolls based on search query
  const filteredPayrolls = payrolls.filter(payroll => 
    payroll.id?.toString().includes(searchQuery.toLowerCase()) ||
    payroll.employee_name?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleCreateClick = () => {
    setIsCreateModalOpen(true);
  };

  if (error) {
    return (
      <MainLayout>
        <div className="text-center text-red-500">
          Error: {error}
          <button 
            onClick={fetchPayrolls}
            className="ml-4 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
          >
            Retry
          </button>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <PageHeader title="Bảng Kê Lương" />
      
      <PayrollToolbar 
        selectedCount={selectedPayrolls.length}
        onRefresh={fetchPayrolls}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        onCreateClick={handleCreateClick}
        payrolls={payrolls}
      />

      <PayrollTable 
        payrolls={filteredPayrolls}
        isLoading={isLoading}
        selectedPayrolls={selectedPayrolls}
        onSelectPayrolls={setSelectedPayrolls}
        itemsPerPage={itemsPerPage}
        onDelete={handleDelete}
      />

      <CreatePayrollModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSuccess={fetchPayrolls}
      />
    </MainLayout>
  );
}

export default Payroll; 