import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../contexts/AuthContext';
import BabySelector from './BabySelector';
import LanguageSelector from './LanguageSelector';

export default function Layout({ children }) {
  const { t } = useTranslation();
  const { user, signOut } = useAuth();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);

  const isActive = (path) => location.pathname === path;

  const handleSignOut = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  const closeMenu = () => {
    setMenuOpen(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-3">
              <img 
                src="/logo.png" 
                alt="Kat's Tracker" 
                className="h-10 w-10 object-contain"
              />
              <div>
                <h1 className="text-xl font-bold text-gray-800">Kat's Tracker</h1>
                {user && (
                  <p className="text-xs text-gray-500 mt-1">
                    {user.email}
                  </p>
                )}
              </div>
            </div>
            {/* Menu Button */}
            <button
              onClick={toggleMenu}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              aria-label="Menu"
            >
              <svg className="h-6 w-6 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
          
          {/* Navigation */}
          <nav className="flex gap-2 overflow-x-auto">
            <Link
              to="/"
              className={`flex-1 py-2 px-3 rounded-lg text-center font-medium transition-colors whitespace-nowrap ${
                isActive('/')
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              📝 {t('form')}
            </Link>
            <Link
              to="/history"
              className={`flex-1 py-2 px-3 rounded-lg text-center font-medium transition-colors whitespace-nowrap ${
                isActive('/history')
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              📋 {t('history')}
            </Link>
            <Link
              to="/analytics"
              className={`flex-1 py-2 px-3 rounded-lg text-center font-medium transition-colors whitespace-nowrap ${
                isActive('/analytics')
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              📊 {t('analytics')}
            </Link>
            <Link
              to="/babies"
              className={`flex-1 py-2 px-3 rounded-lg text-center font-medium transition-colors whitespace-nowrap ${
                isActive('/babies')
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              👶 {t('babies')}
            </Link>
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 py-6">
        {children}
      </main>

      {/* Overlay */}
      {menuOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 transition-opacity"
          onClick={closeMenu}
        />
      )}

      {/* Slide-in Menu */}
      <div
        className={`fixed top-0 right-0 h-full w-80 bg-white shadow-2xl z-50 transform transition-transform duration-300 ease-in-out ${
          menuOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Menu Header */}
          <div className="flex items-center justify-between p-4 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-800">{t('menu')}</h3>
            <button
              onClick={closeMenu}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              aria-label="Close menu"
            >
              <svg className="h-6 w-6 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Menu Content */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            {/* User Info */}
            {user && (
              <div className="pb-4 border-b border-gray-200">
                <p className="text-sm text-gray-500 mb-1">{t('signedInAs')}</p>
                <p className="text-sm font-medium text-gray-800 break-all">{user.email}</p>
              </div>
            )}

            {/* Baby Selector */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t('selectBaby')}
              </label>
              <BabySelector />
            </div>

            {/* Language Selector */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t('language')}
              </label>
              <LanguageSelector />
            </div>
          </div>

          {/* Menu Footer - Logout */}
          <div className="p-4 border-t border-gray-200">
            <button
              onClick={() => {
                handleSignOut();
                closeMenu();
              }}
              className="w-full flex items-center justify-center gap-3 px-4 py-3 bg-red-50 hover:bg-red-100 text-red-600 font-medium rounded-lg transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              <span>{t('signOut')}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
