import { useState } from 'react'
import { X, Upload } from 'react-feather'
import api from '../../utils/axios'
import toast from 'react-hot-toast'
import Papa from 'papaparse'

export function ImportEducationModal({ isOpen, onClose, onSuccess, employeeId }) {
  const [file, setFile] = useState(null)
  const [isLoading, setIsLoading] = useState(false)

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0]
    if (selectedFile && (selectedFile.type === 'application/json' || selectedFile.type === 'text/csv')) {
      setFile(selectedFile)
    } else {
      toast.error('Vui lòng chọn file JSON hoặc CSV')
      e.target.value = null
    }
  }

  const parseCSV = (file) => {
    return new Promise((resolve, reject) => {
      Papa.parse(file, {
        header: true,
        complete: (results) => {
          if (results.errors.length > 0) {
            reject(new Error('Không thể đọc file CSV'))
            return
          }
          resolve(results.data)
        },
        error: (error) => {
          reject(error)
        }
      })
    })
  }

  const validateData = (data) => {
    if (!Array.isArray(data)) {
      throw new Error('Dữ liệu phải ở dạng mảng các bản ghi')
    }

    const requiredFields = ['degree_name', 'school', 'major', 'graduation_year', 'ranking']
    const isValid = data.every(item =>
      requiredFields.every(field => {
        const value = item[field]
        return value !== undefined && value !== null && value !== ''
      })
    )

    if (!isValid) {
      throw new Error('Dữ liệu không hợp lệ. Vui lòng kiểm tra lại cấu trúc file')
    }

    // Convert graduation_year and ranking to numbers
    return data.map(item => ({
      ...item,
      graduation_year: parseInt(item.graduation_year),
      ranking: parseFloat(item.ranking)
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!file) {
      toast.error('Vui lòng chọn file để tải lên')
      return
    }

    try {
      setIsLoading(true)
      let parsedData

      if (file.type === 'application/json') {
        const text = await file.text()
        parsedData = JSON.parse(text)
      } else if (file.type === 'text/csv') {
        parsedData = await parseCSV(file)
      }

      // Validate and transform data
      const validatedData = validateData(parsedData)

      // Add employee_id if provided
      const dataToImport = employeeId
        ? validatedData.map(item => ({ ...item, employee_id: employeeId }))
        : validatedData

      // Import data
      const response = await api.post('/education/import', {
        data: dataToImport
      })

      if (response.status === 200) {
        toast.success('Nhập dữ liệu thành công')
        onSuccess?.()
        onClose()
      } else {
        throw new Error('Có lỗi xảy ra khi nhập dữ liệu')
      }
    } catch (error) {
      console.error('Error importing data:', error)
      toast.error(error.message || 'Có lỗi xảy ra khi xử lý dữ liệu')
    } finally {
      setIsLoading(false)
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-full max-w-md">
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-lg font-medium">Nhập dữ liệu từ file</h2>
          <button 
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-4 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Chọn file (JSON hoặc CSV)
            </label>
            <input
              type="file"
              accept=".json,.csv"
              onChange={handleFileChange}
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              disabled={isLoading}
            />
          </div>

          <div className="text-sm text-gray-600">
            <p>Lưu ý:</p>
            <ul className="list-disc pl-5 space-y-1">
              <li>Hỗ trợ file định dạng JSON và CSV</li>
              <li>File phải chứa các bản ghi với các trường bắt buộc</li>
              <li>Các trường bắt buộc: degree_name, school, major, graduation_year, ranking</li>
              <li>graduation_year phải là số nguyên (ví dụ: 2023)</li>
              <li>ranking phải là số thập phân (ví dụ: 3.5)</li>
            </ul>
          </div>

          <div className="flex justify-end gap-2 pt-4 border-t">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm text-gray-600 hover:bg-gray-100 rounded-lg"
              disabled={isLoading}
            >
              Hủy
            </button>
            <button
              type="submit"
              className="flex items-center gap-2 px-4 py-2 text-sm text-white bg-blue-500 rounded-lg hover:bg-blue-600 disabled:opacity-50"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <span className="animate-spin">⌛</span>
                  <span>Đang xử lý...</span>
                </>
              ) : (
                <>
                  <Upload size={16} />
                  <span>Tải lên</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
} 