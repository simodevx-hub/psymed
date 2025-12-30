import React from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Navbar } from './components/layout/Navbar';
import { Booking } from './pages/Booking';
import { Admin } from './pages/Admin';
import { Login } from './pages/Login';

function App() {
  return (
    <HashRouter>
      <div className="min-h-screen font-sans text-gray-900 antialiased selection:bg-healing-100 selection:text-healing-900">
        <Navbar />
        <main>
          <Routes>
            <Route path="/" element={<Navigate to="/rdv" replace />} />
            <Route path="/rdv" element={<Booking />} />
            <Route path="/login" element={<Login />} />
            <Route path="/admin" element={<Admin />} />
          </Routes>
        </main>
      </div>
    </HashRouter>
  );
}

export default App;