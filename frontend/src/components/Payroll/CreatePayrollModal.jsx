import { useState, useEffect } from 'react';
import { X } from 'react-feather';
import toast from 'react-hot-toast';
import api from '../../utils/axios';

export function CreatePayrollModal({ isOpen, onClose, onSuccess }) {
  const [employees, setEmployees] = useState([]);
  const [formData, setFormData] = useState({
    employee_id: '',
    employee_name: '',
    month: '',
    base_salary: '',
    allowance: '',
    deduction: '',
    net_salary: '',
    notes: ''
  });

  useEffect(() => {
    if (isOpen) {
      fetchEmployees();
    }
  }, [isOpen]);

  const fetchEmployees = async () => {
    try {
      const response = await api.get('/employee/');
      setEmployees(response.data);
    } catch (error) {
      console.error('Error fetching employees:', error);
      toast.error('Không thể tải danh sách nhân viên');
    }
  };

  const handleEmployeeChange = async (e) => {
    const employeeId = e.target.value;
    if (!employeeId) return;

    try {
      const response = await api.get(`/employee/${employeeId}`);
      const employee = response.data;
      
      const now = new Date();
      const month = now.toISOString().slice(0, 7);

      setFormData(prev => ({
        ...prev,
        employee_id: employeeId,
        employee_name: employee.full_name,
        base_salary: parseFloat(employee.salary),
        allowance: '0',
        deduction: '0',
        month: month
      }));
    } catch (error) {
      console.error('Error fetching employee details:', error);
      toast.error('Không thể tải thông tin nhân viên');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const monthDate = new Date(formData.month + '-01');
      const lastDay = new Date(monthDate.getFullYear(), monthDate.getMonth() + 1, 0).getDate();
      const fullDate = `${formData.month}-${lastDay}`;

      const netSalary = (
        parseFloat(formData.base_salary) + 
        parseFloat(formData.allowance) - 
        parseFloat(formData.deduction)
      );

      const payload = {
        ...formData,
        month: fullDate,
        base_salary: parseFloat(formData.base_salary),
        allowance: parseFloat(formData.allowance),
        deduction: parseFloat(formData.deduction),
        net_salary: netSalary
      };

      await api.post('/payroll/', payload);
      toast.success('Tạo bảng lương thành công');
      onSuccess();
      onClose();
    } catch (error) {
      console.error('Error creating payroll:', error);
      toast.error(error.response?.data?.message || 'Có lỗi xảy ra khi tạo bảng lương');
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-full max-w-2xl">
        <div className="flex justify-between items-center p-4 border-b">
          <h2 className="text-lg font-semibold">Tạo Bảng Lương Mới</h2>
          <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-4 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Chọn nhân viên</label>
              <select
                name="employee_id"
                value={formData.employee_id}
                onChange={handleEmployeeChange}
                required
                className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
              >
                <option value="">-- Chọn nhân viên --</option>
                {employees.map(employee => (
                  <option key={employee.id} value={employee.id}>
                    {employee.employee_code} - {employee.full_name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Tháng</label>
              <input
                type="month"
                name="month"
                value={formData.month}
                onChange={handleChange}
                required
                className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Lương cơ bản</label>
              <input
                type="number"
                name="base_salary"
                value={formData.base_salary}
                onChange={handleChange}
                required
                min="0"
                className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Phụ cấp</label>
              <input
                type="number"
                name="allowance"
                value={formData.allowance}
                onChange={handleChange}
                required
                min="0"
                className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Khấu trừ</label>
              <input
                type="number"
                name="deduction"
                value={formData.deduction}
                onChange={handleChange}
                required
                min="0"
                className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Thực lãnh</label>
              <input
                type="number"
                value={
                  Number(formData.base_salary || 0) + 
                  Number(formData.allowance || 0) - 
                  Number(formData.deduction || 0)
                }
                disabled
                className="w-full p-2 border rounded bg-gray-50"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Ghi chú</label>
            <textarea
              name="notes"
              value={formData.notes}
              onChange={handleChange}
              rows="3"
              className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200"
            >
              Hủy
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-white bg-blue-500 rounded-lg hover:bg-blue-600"
            >
              Tạo bảng lương
            </button>
          </div>
        </form>
      </div>
    </div>
  );
} 