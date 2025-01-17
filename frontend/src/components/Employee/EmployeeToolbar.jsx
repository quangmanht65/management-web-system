import { Plus, FileText, Download, Printer, File, RefreshCw, Trash2 } from 'react-feather'
import { useState } from 'react'
import { ImportEmployeeModal } from './ImportEmployeeModal'
import { printEmployeeData } from '../../utils/printUtils'
import { exportToExcel, exportToPDF } from '../../utils/exportUtils'
import toast from 'react-hot-toast'

export function EmployeeToolbar({ 
  selectedCount, 
  onRefresh,
  searchQuery,
  onSearchChange,
  onCreateClick,
  onViewEducationClick,
  employees,
  onFilterChange
}) {
  const [isImportModalOpen, setIsImportModalOpen] = useState(false)
  const [showHidden, setShowHidden] = useState(false)

  const handlePrint = () => {
    if (!employees || employees.length === 0) {
      toast.error('Không có dữ liệu để in')
      return
    }
    printEmployeeData(employees)
  }

  const handleExportExcel = () => {
    if (!employees || employees.length === 0) {
      toast.error('Không có dữ liệu để xuất')
      return
    }
    try {
      exportToExcel(employees)
      toast.success('Xuất file Excel thành công')
    } catch (error) {
      console.error('Error exporting to Excel:', error)
      toast.error('Có lỗi xảy ra khi xuất file Excel')
    }
  }

  const handleExportPDF = () => {
    if (!employees || employees.length === 0) {
      toast.error('Không có dữ liệu để xuất')
      return
    }
    try {
      exportToPDF(employees)
      toast.success('Xuất file PDF thành công')
    } catch (error) {
      console.error('Error exporting to PDF:', error)
      toast.error('Có lỗi xảy ra khi xuất file PDF')
    }
  }

  const handleShowHiddenChange = (e) => {
    setShowHidden(e.target.checked)
    onFilterChange({ showHidden: e.target.checked })
  }

  return (
    <div className="mb-6 space-y-4">
      <div className="flex flex-wrap gap-3">
        <button 
          onClick={onCreateClick}
          className="flex items-center gap-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
        >
          <Plus size={20} />
          <span>Tạo mới nhân viên</span>
        </button>

        <button 
          onClick={onViewEducationClick}
          className="flex items-center gap-2 px-4 py-2 text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors"
        >
          <FileText size={20} />
          <span>Xem các trình độ học vấn</span>
        </button>

        <button 
          onClick={() => setIsImportModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2 text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors"
        >
          <Download size={20} />
          <span>Tải từ file</span>
        </button>

        <button 
          onClick={handlePrint}
          className="flex items-center gap-2 px-4 py-2 text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors"
        >
          <Printer size={20} />
          <span>In dữ liệu</span>
        </button>

        <button 
          onClick={handleExportExcel}
          className="flex items-center gap-2 px-4 py-2 text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors"
        >
          <File size={20} />
          <span>Xuất Excel</span>
        </button>

        <button 
          onClick={handleExportPDF}
          className="flex items-center gap-2 px-4 py-2 text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors"
        >
          <File size={20} />
          <span>Xuất PDF</span>
        </button>

        {selectedCount > 0 && (
          <button className="flex items-center gap-2 px-4 py-2 text-red-600 bg-red-50 rounded-lg hover:bg-red-100 transition-colors">
            <Trash2 size={20} />
            <span>Xóa phần tử đã chọn</span>
          </button>
        )}

        <button 
          onClick={onRefresh}
          className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <RefreshCw size={20} />
        </button>
      </div>

      <div className="flex justify-between items-center">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-500">Hiện</span>
            <select className="px-2 py-1 border rounded-lg">
              <option value="10">10</option>
              <option value="20">20</option>
              <option value="50">50</option>
            </select>
            <span className="text-sm text-gray-500">dòng</span>
          </div>

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="showHidden"
              checked={showHidden}
              onChange={handleShowHiddenChange}
              className="rounded border-gray-300"
            />
            <label htmlFor="showHidden" className="text-sm text-gray-600">
              Hiện nhân viên đã ẩn
            </label>
          </div>
        </div>

        <div className="relative">
          <input
            type="text"
            placeholder="Tìm kiếm..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-80 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      <ImportEmployeeModal 
        isOpen={isImportModalOpen}
        onClose={() => setIsImportModalOpen(false)}
        onSuccess={onRefresh}
      />
    </div>
  )
} 