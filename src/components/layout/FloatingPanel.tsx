import React, { useState } from 'react';
import { useTheme } from '../../contexts/ThemeContext';
import { Link } from 'react-router-dom';

const FloatingPanel: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { theme, toggleTheme } = useTheme();

  return (
    <>
      {/* Hamburger Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed top-4 right-4 z-50 flex flex-col gap-1.5 p-2 hover:opacity-70 transition"
        aria-label="Menu"
      >
        <span className="w-6 h-0.5 bg-current block"></span>
        <span className="w-6 h-0.5 bg-current block"></span>
        <span className="w-6 h-0.5 bg-current block"></span>
      </button>

      {/* Overlay backdrop */}
      {isOpen && (
        <div
          onClick={() => setIsOpen(false)}
          className="fixed inset-0 bg-blue-500/20 z-30 transition-opacity"
        />
      )}

      {/* Floating Side Panel - 25% width */}
      <div
        className={`fixed top-0 right-0 h-screen bg-white dark:bg-slate-900 shadow-xl z-40 transition-all duration-300 ease-in-out ${
          isOpen ? 'w-1/4 translate-x-0' : 'w-1/4 translate-x-full'
        }`}
      >
        <div className="p-6 h-full flex flex-col">
          <div className="mb-8">
            <h2 className="text-lg font-bold mb-2">Menu</h2>
            <button
              onClick={() => setIsOpen(false)}
              className="text-xs text-gray-500 hover:text-gray-700 dark:text-gray-400"
            >
              ✕ Close
            </button>
          </div>

          <nav className="flex-1 space-y-4">
            {/* Theme Toggle */}
            <div className="border-b pb-4">
              <h3 className="text-xs font-semibold uppercase text-gray-600 dark:text-gray-400 mb-3">
                Theme
              </h3>
              <button
                onClick={toggleTheme}
                className="w-full px-4 py-2 bg-gray-200 dark:bg-slate-800 rounded-lg text-sm font-medium hover:bg-gray-300 dark:hover:bg-slate-700 transition"
              >
                {theme === 'dark' ? '☀️ Light Mode' : '🌙 Dark Mode'}
              </button>
            </div>

            {/* Admin Login */}
            <div className="border-b pb-4">
              <h3 className="text-xs font-semibold uppercase text-gray-600 dark:text-gray-400 mb-3">
                Admin
              </h3>
              <Link
                to="/admin/login"
                onClick={() => setIsOpen(false)}
                className="block w-full px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition text-center"
              >
                Admin Login
              </Link>
            </div>

            {/* Help & Info */}
            <div>
              <h3 className="text-xs font-semibold uppercase text-gray-600 dark:text-gray-400 mb-3">
                Help
              </h3>
              <div className="space-y-2 text-sm">
                <a href="#" className="block text-blue-600 hover:underline">
                  Terms of Service
                </a>
                <a href="#" className="block text-blue-600 hover:underline">
                  Privacy Policy
                </a>
                <a href="#" className="block text-blue-600 hover:underline">
                  Contact Support
                </a>
              </div>
            </div>
          </nav>

          <div className="border-t pt-4 text-xs text-gray-500 dark:text-gray-400">
            <p>yoloracer pet v1.0</p>
            <p>© 2025 All rights reserved</p>
          </div>
        </div>
      </div>
    </>
  );
};

export default FloatingPanel;
