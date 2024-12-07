import { RouterProvider, createBrowserRouter, Navigate, Outlet } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import ProtectedRoute from './components/auth/ProtectedRoute';
import Login from './components/auth/Login';
import Register from './components/auth/Register';
import Dashboard from './components/Dashboard';
import InvoiceForm from './components/InvoiceForm';
import PrintInvoice from './components/PrintInvoice';
import InvoiceList from './components/InvoiceList';
import Analytics from './components/Analytics';
import Settings from './components/Settings';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import { AuthProvider } from './context/AuthContext';
import { DarkModeProvider } from './context/DarkModeContext';
import { useState, useEffect } from 'react';

const router = createBrowserRouter([
  {
    path: '/',
    element: <Navigate to="/dashboard" replace />,
  },
  {
    path: '/login',
    element: <Login />,
  },
  {
    path: '/register',
    element: <Register />,
  },
  {
    path: '/',
    element: (
      <ProtectedRoute>
        <>
          <Navbar />
          <main className="min-h-screen bg-gray-50 dark:bg-gray-900 pt-16">
            <Outlet />
          </main>
          <Footer />
        </>
      </ProtectedRoute>
    ),
    children: [
      {
        path: 'dashboard',
        element: <Dashboard />,
      },
      {
        path: 'invoices',
        children: [
          {
            path: '',
            element: <InvoiceList />,
          },
          {
            path: 'create',
            element: <InvoiceForm />,
          },
          {
            path: 'edit/:id',
            element: <InvoiceForm />,
          },
          {
            path: 'print/:id',
            element: <PrintInvoice />,
          },
        ],
      },
      {
        path: 'analytics',
        element: <Analytics />,
      },
      {
        path: 'settings',
        element: <Settings />,
      },
    ],
  },
  {
    path: '*',
    element: <Navigate to="/dashboard" replace />,
  },
]);

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
      <DarkModeProvider>
        <RouterProvider router={router} future={{ v7_startTransition: true }} />
        <Toaster position="top-right" />
        <div className={`min-h-screen ${darkMode ? 'dark' : ''}`}>
          <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors">
            <div className="min-h-screen pb-16">
              <div className="min-h-screen pt-16">
              </div>
            </div>
          </div>
        </div>
      </DarkModeProvider>
    </AuthProvider>
  );
}

export default App;
