import { useState, useEffect } from 'react'
import { X } from 'react-feather'
import api from '../../utils/axios'
import toast from 'react-hot-toast'

export function CreateEmployeeModal({ isOpen, onClose, onSuccess }) {
  const [formData, setFormData] = useState({
    employee_code: '',
    position_id: 0,
    department_id: 0,
    salary: 1,
    gender: 'Male',
    contract_id: '',
    full_name: '',
    birth_date: '',
    birth_place: '',
    id_number: '',
    phone: '',
    address: '',
    email: '',
    marital_status: 'Single',
    ethnicity: 'Kinh',
    education_level_id: '',
    id_card_date: '',
    id_card_place: '',
    health_insurance_number: '',
    social_insurance_number: '',
    profile_image_path: 'none_image_profile'
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [positions, setPositions] = useState([])
  const [departments, setDepartments] = useState([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (isOpen) {
      fetchPositionsAndDepartments()
    }
  }, [isOpen])

  const fetchPositionsAndDepartments = async () => {
    try {
      setIsLoading(true)
      const [positionsRes, departmentsRes] = await Promise.all([
        api.get('/position/'),
        api.get('/department/')
      ])
      setPositions(positionsRes.data)
      setDepartments(departmentsRes.data)
    } catch (error) {
      console.error('Error fetching data:', error)
      toast.error('Không thể tải dữ liệu chức vụ và phòng ban')
    } finally {
      setIsLoading(false)
    }
  }

  const parseFormData = (data) => {
    return {
      ...data,
      // Convert IDs to numbers
      position_id: parseInt(data.position_id) || 0,
      department_id: parseInt(data.department_id) || 0,
      education_level_id: parseInt(data.education_level_id) || 0,
      
      // Convert salary to number
      salary: parseFloat(data.salary) || 0,
      
      // Format dates to ISO string
      birth_date: data.birth_date ? new Date(data.birth_date).toISOString().split('T')[0] : null,
      id_card_date: data.id_card_date ? new Date(data.id_card_date).toISOString().split('T')[0] : null,
      
      // Ensure strings
      employee_code: String(data.employee_code),
      full_name: String(data.full_name),
      birth_place: String(data.birth_place),
      id_number: String(data.id_number),
      phone: String(data.phone),
      address: String(data.address),
      email: String(data.email),
      id_card_place: String(data.id_card_place),
      health_insurance_number: String(data.health_insurance_number),
      social_insurance_number: String(data.social_insurance_number),
      
      // Ensure valid gender value
      gender: ['Male', 'Female'].includes(data.gender) ? data.gender : 'Male',
      
      // Ensure valid marital status
      marital_status: ['Single', 'Married'].includes(data.marital_status) ? data.marital_status : 'Single',
      
      // Default values for optional fields
      contract_id: data.contract_id || null,
      ethnicity: data.ethnicity || 'Kinh',
      profile_image_path: data.profile_image_path || 'none_image_profile'
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      setIsSubmitting(true)
      
      // Parse form data before sending
      const parsedData = parseFormData(formData)
      console.log('Sending data:', parsedData)
      
      await api.post('/employee/', parsedData)
      toast.success('Tạo nhân viên thành công')
      onSuccess()
      onClose()
    } catch (error) {
      console.error('Error creating employee:', error)
      toast.error('Không thể tạo nhân viên: ' + (error.response?.data?.detail || error.message))
    } finally {
      setIsSubmitting(false)
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-4 border-b sticky top-0 bg-white">
          <h2 className="text-lg font-medium">Tạo mới nhân viên</h2>
          <button 
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-4 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Mã nhân viên
              </label>
              <input
                type="text"
                required
                value={formData.EmployeeID}
                onChange={e => setFormData(prev => ({ 
                  ...prev, 
                  EmployeeID: e.target.value 
                }))}
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Họ và tên
              </label>
              <input
                type="text"
                required
                value={formData.EmployeeName}
                onChange={e => setFormData(prev => ({ 
                  ...prev, 
                  EmployeeName: e.target.value 
                }))}
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Giới tính
              </label>
              <select
                value={formData.Gender}
                onChange={e => setFormData(prev => ({ 
                  ...prev, 
                  Gender: e.target.value 
                }))}
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="Male">Nam</option>
                <option value="Female">Nữ</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Ngày sinh
              </label>
              <input
                type="date"
                required
                value={formData.DateOfBirth}
                onChange={e => setFormData(prev => ({ 
                  ...prev, 
                  DateOfBirth: e.target.value 
                }))}
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Nơi sinh
              </label>
              <input
                type="text"
                required
                value={formData.PlaceOfBirth}
                onChange={e => setFormData(prev => ({ 
                  ...prev, 
                  PlaceOfBirth: e.target.value 
                }))}
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Số CMND/CCCD
              </label>
              <input
                type="text"
                required
                value={formData.IDNumber}
                onChange={e => setFormData(prev => ({ 
                  ...prev, 
                  IDNumber: e.target.value 
                }))}
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Ngày cấp
              </label>
              <input
                type="date"
                required
                value={formData.IDCardDate}
                onChange={e => setFormData(prev => ({ 
                  ...prev, 
                  IDCardDate: e.target.value 
                }))}
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Nơi cấp
              </label>
              <input
                type="text"
                required
                value={formData.IDCardPlace}
                onChange={e => setFormData(prev => ({ 
                  ...prev, 
                  IDCardPlace: e.target.value 
                }))}
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Số điện thoại
              </label>
              <input
                type="tel"
                required
                value={formData.Phone}
                onChange={e => setFormData(prev => ({ 
                  ...prev, 
                  Phone: e.target.value 
                }))}
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <input
                type="email"
                required
                value={formData.Email}
                onChange={e => setFormData(prev => ({ 
                  ...prev, 
                  Email: e.target.value 
                }))}
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Địa chỉ
              </label>
              <input
                type="text"
                required
                value={formData.Address}
                onChange={e => setFormData(prev => ({ 
                  ...prev, 
                  Address: e.target.value 
                }))}
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Tình trạng hôn nhân
              </label>
              <select
                value={formData.MaritalStatus}
                onChange={e => setFormData(prev => ({ 
                  ...prev, 
                  MaritalStatus: e.target.value 
                }))}
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="Single">Độc thân</option>
                <option value="Married">Đã kết hôn</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Dân tộc
              </label>
              <input
                type="text"
                required
                value={formData.Ethnicity}
                onChange={e => setFormData(prev => ({ 
                  ...prev, 
                  Ethnicity: e.target.value 
                }))}
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Chức vụ
              </label>
              <select
                required
                disabled={isLoading}
                value={formData.PositionID}
                onChange={e => setFormData(prev => ({ 
                  ...prev, 
                  PositionID: e.target.value 
                }))}
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
              >
                <option value="">Chọn chức vụ</option>
                {positions.map(position => (
                  <option key={position.id} value={position.id}>
                    {position.title}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Phòng ban
              </label>
              <select
                required
                disabled={isLoading}
                value={formData.DepartmentID}
                onChange={e => setFormData(prev => ({ 
                  ...prev, 
                  DepartmentID: e.target.value 
                }))}
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
              >
                <option value="">Chọn phòng ban</option>
                {departments.map(department => (
                  <option key={department.id} value={department.id}>
                    {department.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Lương
              </label>
              <input
                type="number"
                min="0"
                step="100000"
                required
                value={formData.Salary}
                onChange={e => setFormData(prev => ({ 
                  ...prev, 
                  Salary: e.target.value 
                }))}
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Số BHXH
              </label>
              <input
                type="text"
                required
                value={formData.SocialInsurance}
                onChange={e => setFormData(prev => ({ 
                  ...prev, 
                  SocialInsurance: e.target.value 
                }))}
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Số BHYT
              </label>
              <input
                type="text"
                required
                value={formData.HealthInsurance}
                onChange={e => setFormData(prev => ({ 
                  ...prev, 
                  HealthInsurance: e.target.value 
                }))}
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm text-gray-600 hover:bg-gray-100 rounded-lg"
            >
              Hủy
            </button>
            <button
              type="submit"
              disabled={isSubmitting || isLoading}
              className="px-4 py-2 text-sm text-white bg-blue-500 rounded-lg hover:bg-blue-600 disabled:opacity-50"
            >
              {isSubmitting ? 'Đang tạo...' : 'Tạo nhân viên'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
} 