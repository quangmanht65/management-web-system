import { useState, useEffect } from 'react';
import { X } from 'react-feather';
import toast from 'react-hot-toast';
import api from '../../utils/axios';

export function EditPayrollModal({ isOpen, onClose, onSuccess, payrollId }) {
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
    if (isOpen && payrollId) {
      fetchPayrollData();
    }
  }, [isOpen, payrollId]);

  const fetchPayrollData = async () => {
    try {
      const response = await api.get(`/payroll/${payrollId}`);
      const payroll = response.data;
      
      // Convert the date to YYYY-MM format for the month input
      const monthDate = new Date(payroll.month);
      const monthString = monthDate.toISOString().slice(0, 7);

      setFormData({
        employee_id: payroll.employee_id,
        employee_name: payroll.employee_name,
        month: monthString,
        base_salary: payroll.base_salary,
        allowance: payroll.allowance,
        deduction: payroll.deduction,
        net_salary: payroll.net_salary,
        notes: payroll.notes || ''
      });
    } catch (error) {
      console.error('Error fetching payroll:', error);
      toast.error('Không thể tải thông tin bảng lương');
      onClose();
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

      await api.put(`/payroll/${payrollId}`, payload);
      toast.success('Cập nhật bảng lương thành công');
      onSuccess();
      onClose();
    } catch (error) {
      console.error('Error updating payroll:', error);
      toast.error(error.response?.data?.message || 'Có lỗi xảy ra khi cập nhật bảng lương');
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
          <h2 className="text-lg font-semibold">Chỉnh Sửa Bảng Lương</h2>
          <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-4 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Tên nhân viên</label>
              <input
                type="text"
                value={formData.employee_name}
                disabled
                className="w-full p-2 border rounded bg-gray-50"
              />
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
              Cập nhật
            </button>
          </div>
        </form>
      </div>
    </div>
  );
} 