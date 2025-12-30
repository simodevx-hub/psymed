import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Leaf, Calendar, LogIn } from 'lucide-react';

export const Navbar: React.FC = () => {
  const location = useLocation();
  const isAdmin = location.pathname.startsWith('/admin');

  return (
    <nav className="sticky top-0 z-50 glass-panel border-b border-white/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <Link to="/" className="flex items-center gap-2 group">
            <div className="p-2 bg-healing-100 rounded-lg group-hover:bg-healing-200 transition-colors">
              <Leaf className="h-6 w-6 text-healing-600" />
            </div>
            <span className="font-display font-bold text-xl text-gray-900 tracking-tight">
              Therapie<span className="text-healing-600">Maroc</span>
            </span>
          </Link>

          <div className="flex items-center gap-4">
            {!isAdmin ? (
               <Link 
               to="/admin" 
               className="text-sm font-medium text-gray-500 hover:text-healing-600 transition-colors flex items-center gap-1"
             >
               <LogIn className="w-4 h-4" />
               <span className="hidden sm:inline">Admin</span>
             </Link>
            ) : (
              <Link 
                to="/rdv" 
                className="text-sm font-medium text-gray-500 hover:text-healing-600 transition-colors flex items-center gap-1"
              >
                <Calendar className="w-4 h-4" />
                <span className="hidden sm:inline">Booking View</span>
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};