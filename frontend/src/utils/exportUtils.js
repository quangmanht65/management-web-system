import * as XLSX from 'xlsx'
import { jsPDF } from 'jspdf'
import 'jspdf-autotable'

// Function to convert Vietnamese characters to ASCII
const removeAccents = (str) => {
  return str.normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/đ/g, 'd')
    .replace(/Đ/g, 'D')
}

export const exportToExcel = (employees) => {
  // Prepare data for Excel
  const excelData = employees.map(emp => ({
    'Mã nhân viên': emp.employee_code,
    'Họ và tên': emp.full_name,
    'Ngày sinh': new Date(emp.date_of_birth).toLocaleDateString('vi-VN'),
    'Giới tính': emp.gender,
    'Số điện thoại': emp.phone,
    'Email': emp.email,
    'Địa chỉ': emp.address,
    'Chức vụ': emp.Position,
    'Phòng ban': emp.Department
  }))

  // Create workbook and worksheet
  const workbook = XLSX.utils.book_new()
  const worksheet = XLSX.utils.json_to_sheet(excelData)

  // Add worksheet to workbook
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Employees')

  // Generate Excel file
  XLSX.writeFile(workbook, 'danh-sach-nhan-vien.xlsx')
}

export const exportToPDF = (employees) => {
  const doc = new jsPDF({
    orientation: 'landscape',
    unit: 'mm',
    format: 'a4'
  })

  // Convert Vietnamese text to ASCII for PDF
  const title = removeAccents('Danh sach nhan vien')
  const dateText = removeAccents(`Ngay xuat: ${new Date().toLocaleDateString('vi-VN')}`)

  // Add title
  doc.setFontSize(16)
  doc.text(title, doc.internal.pageSize.width / 2, 15, { align: 'center' })

  // Add date
  doc.setFontSize(10)
  doc.text(
    dateText,
    doc.internal.pageSize.width - 15,
    22,
    { align: 'right' }
  )

  // Prepare data for PDF table with ASCII conversion
  const tableData = employees.map(emp => [
    emp.employee_code,
    removeAccents(emp.full_name),
    new Date(emp.date_of_birth).toLocaleDateString('vi-VN'),
    removeAccents(emp.gender),
    emp.phone,
    emp.email,
    removeAccents(emp.address),
    removeAccents(emp.Position),
    removeAccents(emp.Department)
  ])

  // Generate table
  doc.autoTable({
    startY: 30,
    head: [[
      'Ma NV',
      'Ho va ten',
      'Ngay sinh',
      'Gioi tinh',
      'SDT',
      'Email',
      'Dia chi',
      'Chuc vu',
      'Phong ban'
    ]],
    body: tableData,
    theme: 'grid',
    styles: {
      fontSize: 8,
      cellPadding: 1
    },
    headStyles: {
      fillColor: [66, 139, 202],
      textColor: 255,
      fontStyle: 'bold'
    },
    columnStyles: {
      0: { cellWidth: 25 }, // Ma NV
      1: { cellWidth: 35 }, // Ho va ten
      2: { cellWidth: 25 }, // Ngay sinh
      3: { cellWidth: 20 }, // Gioi tinh
      4: { cellWidth: 25 }, // SDT
      5: { cellWidth: 35 }, // Email
      6: { cellWidth: 40 }, // Dia chi
      7: { cellWidth: 25 }, // Chuc vu
      8: { cellWidth: 25 }  // Phong ban
    },
    didDrawPage: function(data) {
      // Add page number at the bottom
      doc.setFontSize(8)
      doc.text(
        removeAccents(`Trang ${doc.internal.getCurrentPageInfo().pageNumber}/${doc.internal.getNumberOfPages()}`),
        doc.internal.pageSize.width / 2,
        doc.internal.pageSize.height - 10,
        { align: 'center' }
      )
    }
  })

  // Save PDF
  doc.save('danh-sach-nhan-vien.pdf')
} 