export const printEmployeeData = (employees) => {
  // Create a new window for printing
  const printWindow = window.open('', '_blank')
  
  // Generate the HTML content
  const html = `
    <!DOCTYPE html>
    <html>
      <head>
        <title>Danh sách nhân viên</title>
        <style>
          body {
            font-family: Arial, sans-serif;
            margin: 20px;
          }
          table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 20px;
          }
          th, td {
            border: 1px solid #ddd;
            padding: 8px;
            text-align: left;
          }
          th {
            background-color: #f5f5f5;
          }
          .header {
            text-align: center;
            margin-bottom: 20px;
          }
          .print-date {
            text-align: right;
            margin-bottom: 20px;
            font-style: italic;
          }
          @media print {
            .no-print {
              display: none;
            }
          }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>Danh sách nhân viên</h1>
        </div>
        <div class="print-date">
          Ngày in: ${new Date().toLocaleDateString('vi-VN')}
        </div>
        <table>
          <thead>
            <tr>
              <th>Mã NV</th>
              <th>Họ và tên</th>
              <th>Ngày sinh</th>
              <th>Giới tính</th>
              <th>SĐT</th>
              <th>Email</th>
              <th>Địa chỉ</th>
              <th>Chức vụ</th>
              <th>Phòng ban</th>
            </tr>
          </thead>
          <tbody>
            ${employees.map(emp => `
              <tr>
                <td>${emp.employee_code}</td>
                <td>${emp.full_name}</td>
                <td>${new Date(emp.date_of_birth).toLocaleDateString('vi-VN')}</td>
                <td>${emp.gender}</td>
                <td>${emp.phone}</td>
                <td>${emp.email}</td>
                <td>${emp.address}</td>
                <td>${emp.Position}</td>
                <td>${emp.Department}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
        <div class="no-print" style="margin-top: 20px; text-align: center;">
          <button onclick="window.print()">In</button>
        </div>
      </body>
    </html>
  `

  // Write the HTML content to the new window
  printWindow.document.write(html)
  printWindow.document.close()
} 