import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { useState, useEffect } from 'react';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/auth/ProtectedRoute';
import Login from './components/auth/Login';
import Register from './components/auth/Register';
import InvoiceList from './components/InvoiceList';
import InvoiceForm from './components/InvoiceForm';
import PrintInvoice from './components/PrintInvoice';
import Dashboard from './components/Dashboard';
import Navbar from './components/Navbar';
import Analytics from './components/Analytics';
import Settings from './components/Settings';
import Footer from './components/Footer';

function App() {
  const [darkMode, setDarkMode] = useState(() => {
    const savedMode = localStorage.getItem('darkMode');
    return savedMode ? JSON.parse(savedMode) : false;
  });

  useEffect(() => {
    localStorage.setItem('darkMode', JSON.stringify(darkMode));
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  const toggleDarkMode = () => setDarkMode(!darkMode);

  return (
    <AuthProvider>
      <Router>
        <div className={`min-h-screen ${darkMode ? 'dark' : ''}`}>
          <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors">
            <Toaster position="top-right" />
            <div className="min-h-screen pb-16">
              <Navbar darkMode={darkMode} toggleDarkMode={toggleDarkMode} />
              <main className="max-w-7xl mx-auto py-20 px-4 sm:px-6 lg:px-8">
                <Routes>
                  {/* Public Routes */}
                  <Route path="/login" element={<Login />} />
                  <Route path="/register" element={<Register />} />
                  
                  {/* Protected Routes */}
                  <Route path="/" element={<Navigate to="/dashboard" replace />} />
                  <Route
                    path="/dashboard"
                    element={
                      <ProtectedRoute>
                        <Dashboard />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/invoices"
                    element={
                      <ProtectedRoute>
                        <InvoiceList />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/create-invoice"
                    element={
                      <ProtectedRoute>
                        <InvoiceForm />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/edit-invoice/:id"
                    element={
                      <ProtectedRoute>
                        <InvoiceForm />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/invoice/print/:id"
                    element={
                      <ProtectedRoute>
                        <PrintInvoice />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/analytics"
                    element={
                      <ProtectedRoute>
                        <Analytics />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/settings"
                    element={
                      <ProtectedRoute>
                        <Settings />
                      </ProtectedRoute>
                    }
                  />
                </Routes>
              </main>
            </div>
            <Footer />
          </div>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
