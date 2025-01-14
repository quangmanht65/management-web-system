import { useState, useEffect } from 'react';
import { MainLayout } from '../components/Layout/MainLayout';
import { PageHeader } from '../components/UI/PageHeader';
import { AttendanceTable } from '../components/Attendance/AttendanceTable';
import { AttendanceToolbar } from '../components/Attendance/AttendanceToolbar';
import toast from 'react-hot-toast';
import api from '../utils/axios';

function Attendance() {
  const [attendance, setAttendance] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchEmployees();
    fetchAttendance();
  }, [selectedDate]);

  const fetchEmployees = async () => {
    try {
      const response = await api.get('/employee/');
      setEmployees(response.data);
    } catch (error) {
      console.error('Error fetching employees:', error);
      toast.error('Không thể tải danh sách nhân viên');
    }
  };

  const fetchAttendance = async () => {
    try {
      setIsLoading(true);
      const response = await api.get('/attendance/', {
        params: {
          date: selectedDate.toISOString().split('T')[0]
        }
      });
      setAttendance(response.data);
    } catch (error) {
      console.error('Error fetching attendance:', error);
      setError(error.response?.data?.message || 'Failed to fetch attendance data');
      toast.error('Không thể tải dữ liệu điểm danh');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAttendanceUpdate = async (employeeId, status) => {
    try {
      await api.post('/attendance/', {
        employee_id: employeeId,
        date: selectedDate.toISOString().split('T')[0],
        status
      });
      toast.success('Cập nhật điểm danh thành công');
      fetchAttendance();
    } catch (error) {
      console.error('Update error:', error);
      toast.error('Có lỗi xảy ra khi cập nhật điểm danh');
    }
  };

  return (
    <MainLayout>
      <PageHeader title="Điểm Danh" />
      
      <AttendanceToolbar 
        selectedDate={selectedDate}
        onDateChange={setSelectedDate}
        onRefresh={fetchAttendance}
        rollupData={{
          total: employees.length,
          present: attendance.filter(a => a.status === 'present').length,
          absent: attendance.filter(a => a.status === 'absent').length,
          late: attendance.filter(a => a.status === 'late').length
        }}
      />

      <AttendanceTable 
        attendance={attendance}
        employees={employees}
        isLoading={isLoading}
        onStatusUpdate={handleAttendanceUpdate}
      />
    </MainLayout>
  );
}

export default Attendance; 