import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AdminRoute } from './components/Auth/AdminRoute'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import ForgotPassword from './pages/ForgotPassword'
import Employees from './pages/Employees'
import Positions from './pages/Positions'
import Contracts from './pages/Contracts'
import Payroll from './pages/Payroll'
import Attendance from './pages/Attendance'
import Departments from './pages/Departments'
import Settings from './pages/Settings'
import Admin from './pages/Admin'
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/employees" element={<Employees />} />
        <Route path="/positions" element={<Positions />} />
        <Route path="/contracts" element={<Contracts />} />
        <Route path="/payroll" element={<Payroll />} />
        <Route path="/attendance" element={<Attendance />} />
        <Route path="/departments" element={<Departments />} />
        <Route path="/settings" element={<Settings />} />
        <Route 
          path="/admin" 
          element={
            <AdminRoute>
              <Admin />
            </AdminRoute>
          } 
        />
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
      </Routes>
      <ToastContainer 
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
    </BrowserRouter>
  )
}

export default App
