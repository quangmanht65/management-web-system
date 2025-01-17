import { useState, useEffect } from 'react';
import { X } from 'react-feather';
import api from '../../utils/axios';

export function EditContractModal({ isOpen, onClose, onSubmit, contract }) {
  const [employees, setEmployees] = useState([]);
  const [formData, setFormData] = useState({
    employeeId: '',
    employeeName: '',
    contractType: '',
    startDate: '',
    endDate: '',
    status: '',
    salary: '',
    notes: ''
  });

  useEffect(() => {
    if (isOpen && contract) {
      setFormData({
        employeeId: contract.employee_id,
        employeeName: contract.employee_name,
        contractType: contract.contract_type,
        startDate: contract.start_date,
        endDate: contract.end_date,
        status: contract.status,
        salary: contract.salary,
        notes: contract.notes
      });
      fetchEmployees();
    }
  }, [isOpen, contract]);

  const fetchEmployees = async () => {
    try {
      const response = await api.get('/employee/');
      setEmployees(response.data);
    } catch (error) {
      console.error('Error fetching employees:', error);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const selectedEmployee = employees.find(emp => emp.id === Number(formData.employeeId));
    
    const contractData = {
      employee_id: Number(formData.employeeId),
      employee_name: selectedEmployee?.full_name || formData.employeeName,
      contract_type: formData.contractType,
      start_date: formData.startDate,
      end_date: formData.endDate,
      status: formData.status,
      salary: Number(formData.salary),
      notes: formData.notes
    };
    
    onSubmit(contractData);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    if (name === 'employeeId') {
      const selectedEmployee = employees.find(emp => emp.id === Number(value));
      setFormData(prev => ({
        ...prev,
        employeeId: Number(value),
        employeeName: selectedEmployee?.full_name || ''
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-full max-w-md">
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-lg font-medium">Chỉnh Sửa Hợp Đồng</h2>
          <button 
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <X size={20} />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-4 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Nhân viên
            </label>
            <select
              name="employeeId"
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
              value={formData.employeeId}
              onChange={handleChange}
              required
            >
              <option value="">Chọn nhân viên</option>
              {employees.map(employee => (
                <option key={employee.id} value={employee.id}>
                  {employee.full_name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Loại hợp đồng
            </label>
            <select
              name="contractType"
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
              value={formData.contractType}
              onChange={handleChange}
              required
            >
              <option value="">Chọn loại hợp đồng</option>
              <option value="Nhân viên">Nhân viên</option>
              <option value="Thực tập sinh">Thực tập sinh</option>
              <option value="Giám đốc">Giám đốc</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Ngày bắt đầu
            </label>
            <input
              type="date"
              name="startDate"
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
              value={formData.startDate}
              onChange={handleChange}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Ngày kết thúc
            </label>
            <input
              type="date"
              name="endDate"
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
              value={formData.endDate}
              onChange={handleChange}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Trạng thái
            </label>
            <select
              name="status"
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
              value={formData.status}
              onChange={handleChange}
              required
            >
              <option value="">Chọn trạng thái</option>
              <option value="active">Đang hiệu lực</option>
              <option value="inactive">Hết hiệu lực</option>
              <option value="pending">Chờ duyệt</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Lương
            </label>
            <input
              type="number"
              name="salary"
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
              value={formData.salary}
              onChange={handleChange}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Ghi chú
            </label>
            <textarea
              name="notes"
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
              value={formData.notes}
              onChange={handleChange}
              rows={3}
            />
          </div>

          <div className="mt-6 flex justify-end gap-3">
            <button
              type="button"
              className="px-4 py-2 text-sm text-gray-600 hover:bg-gray-100 rounded-lg"
              onClick={onClose}
            >
              Hủy
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-sm text-white bg-blue-500 rounded-lg hover:bg-blue-600"
            >
              Cập nhật
            </button>
          </div>
        </form>
      </div>
    </div>
  );
} 