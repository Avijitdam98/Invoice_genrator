import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useDarkMode } from '../context/DarkModeContext';
import { FaSun, FaMoon } from 'react-icons/fa';
import Logo from './Logo';

const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const { darkMode, toggleDarkMode } = useDarkMode();
  const [isOpen, setIsOpen] = useState(false);

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  return (
    <nav className={`fixed w-full top-0 z-50 shadow-md ${darkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-900'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo and Brand */}
          <div className="flex items-center">
            <Link to="/dashboard" className="flex items-center gap-3">
              <Logo />
              <span className="text-2xl font-bold bg-gradient-to-r from-indigo-500 to-purple-600 bg-clip-text text-transparent"></span>
            </Link>
          </div>

          {/* Navigation Links - Desktop */}
          <div className="hidden md:flex items-center space-x-8">
            <Link
              to="/dashboard"
              className={`px-3 py-2 rounded-md text-sm font-medium ${
                location.pathname === '/dashboard'
                  ? 'text-indigo-600'
                  : darkMode
                  ? 'text-gray-200 hover:text-white'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Dashboard
            </Link>
            <Link
              to="/invoices"
              className={`px-3 py-2 rounded-md text-sm font-medium ${
                location.pathname.includes('/invoices')
                  ? 'text-indigo-600'
                  : darkMode
                  ? 'text-gray-200 hover:text-white'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Invoices
            </Link>
            <Link
              to="/analytics"
              className={`px-3 py-2 rounded-md text-sm font-medium ${
                location.pathname === '/analytics'
                  ? 'text-indigo-600'
                  : darkMode
                  ? 'text-gray-200 hover:text-white'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Analytics
            </Link>
          </div>

          {/* Right Side Items */}
          <div className="flex items-center space-x-4">
            {/* Dark Mode Toggle Button */}
            <button
              onClick={toggleDarkMode}
              className={`p-2 rounded-lg transition-colors duration-200 ${
                darkMode 
                  ? 'bg-gray-700 hover:bg-gray-600 text-yellow-300' 
                  : 'bg-gray-100 hover:bg-gray-200 text-gray-600'
              }`}
              aria-label="Toggle dark mode"
            >
              {darkMode ? <FaSun className="w-5 h-5" /> : <FaMoon className="w-5 h-5" />}
            </button>

            {/* Create Invoice Button */}
            <Link
              to="/invoices/create"
              className="hidden sm:flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-md shadow-sm transition-colors"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 4v16m8-8H4"
                />
              </svg>
              New Invoice
            </Link>

            {/* User Menu */}
            <div className="relative">
              <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center text-sm rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                <span className="sr-only">Open user menu</span>
                <div className="h-8 w-8 rounded-full bg-indigo-600 flex items-center justify-center text-white">
                  {user?.email?.charAt(0).toUpperCase()}
                </div>
              </button>

              {/* Dropdown Menu */}
              {isOpen && (
                <div className={`origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg ${
                  darkMode ? 'bg-gray-700' : 'bg-white'
                } ring-1 ring-black ring-opacity-5`}>
                  <div className="py-1">
                    <Link
                      to="/settings"
                      className={`block px-4 py-2 text-sm ${
                        darkMode
                          ? 'text-gray-200 hover:bg-gray-600'
                          : 'text-gray-700 hover:bg-gray-100'
                      }`}
                      onClick={() => setIsOpen(false)}
                    >
                      Settings
                    </Link>
                    <button
                      onClick={() => {
                        setIsOpen(false);
                        handleLogout();
                      }}
                      className={`block w-full text-left px-4 py-2 text-sm ${
                        darkMode
                          ? 'text-gray-200 hover:bg-gray-600'
                          : 'text-gray-700 hover:bg-gray-100'
                      }`}
                    >
                      Sign out
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className={`md:hidden ${darkMode ? 'bg-gray-800' : 'bg-white'} border-t ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
          <div className="px-2 pt-2 pb-3 space-y-1">
            <Link
              to="/dashboard"
              className={`block px-3 py-2 rounded-md text-base font-medium ${
                location.pathname === '/dashboard'
                  ? 'text-indigo-600'
                  : darkMode
                  ? 'text-gray-200 hover:text-white hover:bg-gray-700'
                  : 'text-gray-700 hover:text-gray-900 hover:bg-gray-50'
              }`}
              onClick={() => setIsOpen(false)}
            >
              Dashboard
            </Link>
            <Link
              to="/invoices"
              className={`block px-3 py-2 rounded-md text-base font-medium ${
                location.pathname.includes('/invoices')
                  ? 'text-indigo-600'
                  : darkMode
                  ? 'text-gray-200 hover:text-white hover:bg-gray-700'
                  : 'text-gray-700 hover:text-gray-900 hover:bg-gray-50'
              }`}
              onClick={() => setIsOpen(false)}
            >
              Invoices
            </Link>
            <Link
              to="/analytics"
              className={`block px-3 py-2 rounded-md text-base font-medium ${
                location.pathname === '/analytics'
                  ? 'text-indigo-600'
                  : darkMode
                  ? 'text-gray-200 hover:text-white hover:bg-gray-700'
                  : 'text-gray-700 hover:text-gray-900 hover:bg-gray-50'
              }`}
              onClick={() => setIsOpen(false)}
            >
              Analytics
            </Link>
            
            {/* Mobile Create Invoice Button */}
            <Link
              to="/invoices/create"
              className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-md shadow-sm transition-colors"
              onClick={() => setIsOpen(false)}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 4v16m8-8H4"
                />
              </svg>
              Create New Invoice
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
