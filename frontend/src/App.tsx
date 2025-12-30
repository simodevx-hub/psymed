import { Routes, Route, Navigate } from 'react-router-dom'
import { Navbar } from './components/layout/Navbar'
import Login from './pages/Login'
import Admin from './pages/Admin'
import Booking from './pages/Booking'

export default function App() {
  return (
    <div className="min-h-screen bg-background font-sans text-gray-900">
      <Navbar />
      <main>
        <Routes>
          <Route path="/" element={<Navigate to="/rdv" replace />} />
          <Route path="/rdv" element={<Booking />} />
          <Route path="/admin" element={<Login />} />
          <Route path="/admin/dashboard" element={<Admin />} />
        </Routes>
      </main>
    </div>
  )
}
