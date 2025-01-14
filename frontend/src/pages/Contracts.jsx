import { useState, useEffect } from 'react';
import { MainLayout } from '../components/Layout/MainLayout';
import { PageHeader } from '../components/UI/PageHeader';
import { ContractTable } from '../components/Contract/ContractTable';
import { ContractToolbar } from '../components/Contract/ContractToolbar';
import { CreateContractModal } from '../components/Contract/CreateContractModal';
import { contractService } from '../utils/contractService';
import toast from 'react-hot-toast';

function Contracts() {
  const [contracts, setContracts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedContracts, setSelectedContracts] = useState([]);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [searchQuery, setSearchQuery] = useState('');
  const [error, setError] = useState(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  useEffect(() => {
    fetchContracts();
  }, []);

  const fetchContracts = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await contractService.getContracts();
      setContracts(data);
    } catch (error) {
      console.error('Error fetching contracts:', error);
      setError(error.message);
      toast.error('Không thể tải danh sách hợp đồng');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateContract = async (contractData) => {
    try {
      setIsLoading(true);
      await contractService.createContract(contractData);
      toast.success('Tạo hợp đồng thành công');
      setIsCreateModalOpen(false);
      fetchContracts();
    } catch (error) {
      toast.error('Có lỗi xảy ra khi tạo hợp đồng');
      console.error('Create error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (contractId) => {
    try {
      setIsLoading(true);
      await contractService.deleteContract(contractId);
      toast.success('Xóa hợp đồng thành công');
      fetchContracts();
    } catch (error) {
      toast.error('Có lỗi xảy ra khi xóa hợp đồng');
      console.error('Delete error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Filter contracts based on search query
  const filteredContracts = contracts.filter(contract => 
    contract.id?.toString().includes(searchQuery.toLowerCase()) ||
    contract.contract_type?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    contract.notes?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (error) {
    return (
      <MainLayout>
        <div className="text-center text-red-500">
          Error: {error}
          <button 
            onClick={fetchContracts}
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
      <PageHeader title="Danh Sách Hợp Đồng" />
      
      <ContractToolbar 
        selectedCount={selectedContracts.length}
        onRefresh={fetchContracts}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        onCreateClick={() => setIsCreateModalOpen(true)}
        contracts={contracts}
      />

      <ContractTable 
        contracts={filteredContracts}
        isLoading={isLoading}
        selectedContracts={selectedContracts}
        onSelectContracts={setSelectedContracts}
        itemsPerPage={itemsPerPage}
        onDelete={handleDelete}
      />

      <CreateContractModal 
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSubmit={handleCreateContract}
      />
    </MainLayout>
  );
}

export default Contracts; 