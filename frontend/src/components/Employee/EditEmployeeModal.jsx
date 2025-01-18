import { useState, useEffect } from 'react'
import toast from 'react-hot-toast'
import { X, Upload } from 'react-feather'
import api from '../../utils/axios'
import { Avatar } from '../UI/Avatar'

export function EditEmployeeModal({ isOpen, onClose, onSuccess, employeeData }) {
  const [formData, setFormData] = useState({
    EmployeeID: '',
    PositionID: '',
    DepartmentID: '',
    Salary: '',
    Gender: '',
    ContractID: '',
    EmployeeName: '',
    DateOfBirth: '',
    PlaceOfBirth: '',
    IDNumber: '',
    Phone: '',
    Address: '',
    Email: '',
    MaritalStatus: '',
    Ethnicity: '',
    EducationLevelID: '',
    IDCardDate: '',
    IDCardPlace: '',
    HealthInsurance: '',
    SocialInsurance: ''
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [positions, setPositions] = useState([])
  const [departments, setDepartments] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [imagePreview, setImagePreview] = useState(null)
  const [selectedImage, setSelectedImage] = useState(null)

  useEffect(() => {
    if (isOpen && employeeData) {
      // Transform API data to form format
      setFormData({
        EmployeeID: employeeData.employee_code || '',
        PositionID: employeeData.position_id?.toString() || '',
        DepartmentID: employeeData.department_id?.toString() || '',
        Salary: employeeData.salary?.toString() || '',
        // Convert display gender back to API format
        Gender: employeeData.gender === 'Nam' ? 'Male' : 'Female',
        ContractID: employeeData.contract_id || '',
        EmployeeName: employeeData.full_name || '',
        DateOfBirth: employeeData.birth_date ? new Date(employeeData.birth_date).toISOString().split('T')[0] : '',
        PlaceOfBirth: employeeData.birth_place || '',
        IDNumber: employeeData.id_number || '',
        Phone: employeeData.phone || '',
        Address: employeeData.address || '',
        Email: employeeData.email || '',
        MaritalStatus: employeeData.marital_status || '',
        Ethnicity: employeeData.ethnicity || '',
        EducationLevelID: employeeData.education_level_id || '',
        IDCardDate: employeeData.id_card_date ? new Date(employeeData.id_card_date).toISOString().split('T')[0] : '',
        IDCardPlace: employeeData.id_card_place || '',
        HealthInsurance: employeeData.health_insurance_number || '',
        SocialInsurance: employeeData.social_insurance_number || ''
      })
      fetchPositionsAndDepartments()
      setImagePreview(employeeData.profile_image_path)
    }
  }, [isOpen, employeeData])

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
      employee_code: data.EmployeeID,
      full_name: data.EmployeeName,
      position_id: parseInt(data.PositionID) || 0,
      department_id: parseInt(data.DepartmentID) || 0,
      salary: data.Salary ? parseFloat(data.Salary).toFixed(2) : "0.00",
      gender: data.Gender,
      contract_id: data.ContractID,
      birth_date: data.DateOfBirth,
      birth_place: data.PlaceOfBirth,
      id_number: data.IDNumber,
      phone: data.Phone,
      address: data.Address,
      email: data.Email,
      marital_status: data.MaritalStatus,
      ethnicity: data.Ethnicity,
      education_level_id: data.EducationLevelID || null,
      id_card_date: data.IDCardDate,
      id_card_place: data.IDCardPlace,
      health_insurance_number: data.HealthInsurance,
      social_insurance_number: data.SocialInsurance,
    }
  }

  const handleImageChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error('Kích thước ảnh không được vượt quá 5MB')
        return
      }
      
      if (!file.type.startsWith('image/')) {
        toast.error('Vui lòng chọn file ảnh')
        return
      }

      setSelectedImage(file)
      const reader = new FileReader()
      reader.onloadend = () => {
        setImagePreview(reader.result)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      setIsSubmitting(true)
      
      const parsedData = parseFormData(formData)
      
      // If there's a new image, use FormData
      if (selectedImage) {
        const formData = new FormData()
        formData.append('profile_image', selectedImage)
        
        // Add other form data
        Object.entries(parsedData).forEach(([key, value]) => {
          if (value !== null && value !== undefined) {
            formData.append(key, value)
          }
        })
        
        await api.patch(`/employee/${employeeData.id}/`, formData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        })
      } else {
        // If no new image, send JSON data
        await api.patch(`/employee/${employeeData.id}/`, parsedData, {
          headers: {
            'Content-Type': 'application/json'
          }
        })
      }
      
      toast.success('Cập nhật nhân viên thành công')
      onSuccess()
      onClose()
    } catch (error) {
      console.error('Error updating employee:', error)
      const errorMessage = error.response?.data?.detail 
        ? Array.isArray(error.response.data.detail)
          ? error.response.data.detail.map(e => e.msg).join(', ')
          : error.response.data.detail
        : error.message
      toast.error('Không thể cập nhật nhân viên: ' + errorMessage)
    } finally {
      setIsSubmitting(false)
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-4 border-b sticky top-0 bg-white">
          <h2 className="text-lg font-medium">Chỉnh sửa thông tin nhân viên</h2>
          <button 
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-4 space-y-4">
          <div className="flex justify-center mb-6">
            <div className="relative">
              <div className="w-32 h-32 border-2 border-dashed border-gray-300 rounded-full overflow-hidden flex items-center justify-center">
                {!imagePreview ? (
                  <div className="text-center">
                    <Upload className="mx-auto h-12 w-12 text-gray-400" />
                    <span className="mt-2 block text-xs text-gray-600">
                      Tải ảnh lên
                    </span>
                  </div>
                ) : (
                  <Avatar 
                    src={imagePreview}
                    alt="Preview"
                    className="w-32 h-32"
                  />
                )}
              </div>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              />
            </div>
          </div>

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
                <option value="Other">Khác</option>
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
                step="0.01"
                required
                value={formData.Salary}
                onChange={e => setFormData(prev => ({ 
                  ...prev, 
                  Salary: e.target.value 
                }))}
                onBlur={e => {
                  const value = e.target.value
                  if (value) {
                    setFormData(prev => ({
                      ...prev,
                      Salary: parseFloat(value).toFixed(2)
                    }))
                  }
                }}
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

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Mã hợp đồng
              </label>
              <input
                type="text"
                required
                value={formData.ContractID}
                onChange={e => setFormData(prev => ({ 
                  ...prev, 
                  ContractID: e.target.value 
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
              {isSubmitting ? 'Đang cập nhật...' : 'Cập nhật'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
} 