import React from 'react';
import ThemeToggle from './ThemeToggle';
import { useTheme } from '../context/ThemeContext';

const Layout = ({ children }) => {
  const { isDarkMode } = useTheme();

  return (
    <div className={`min-h-screen ${isDarkMode ? 'dark' : ''}`}>
      <div className="bg-background text-text transition-colors duration-200">
        <header className="sticky top-0 z-50 bg-white dark:bg-gray-800 shadow-sm">
          <nav className="responsive-container py-4">
            <div className="flex items-center justify-between">
              <h1 className="text-xl font-bold">Invoice Generator</h1>
              <div className="flex items-center space-x-4">
                <button className="btn btn-primary">New Invoice</button>
                <ThemeToggle />
              </div>
            </div>
          </nav>
        </header>

        <main className="responsive-container py-8">
          {children}
        </main>

        <footer className="bg-gray-50 dark:bg-gray-900 py-6">
          <div className="responsive-container">
            <p className="text-center text-gray-600 dark:text-gray-400">
              © {new Date().getFullYear()} Invoice Generator. All rights reserved.
            </p>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default Layout;
