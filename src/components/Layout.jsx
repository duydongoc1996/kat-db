import { Link, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../contexts/AuthContext';
import BabySelector from './BabySelector';
import LanguageSelector from './LanguageSelector';

export default function Layout({ children }) {
  const { t } = useTranslation();
  const { user, signOut } = useAuth();
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  const handleSignOut = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between mb-3">
            <div>
              <h1 className="text-xl font-bold text-gray-800">👶 Kat's Tracker</h1>
              {user && (
                <p className="text-xs text-gray-500 mt-1">
                  {user.email}
                </p>
              )}
            </div>
            <div className="flex items-center gap-3">
              <BabySelector />
              <LanguageSelector />
              <button
                onClick={handleSignOut}
                className="text-2xl hover:opacity-70 transition-opacity"
                title={t('signOut') || 'Sign out'}
              >
                🚪
              </button>
            </div>
          </div>
          
          {/* Navigation */}
          <nav className="flex gap-2">
            <Link
              to="/"
              className={`flex-1 py-2 px-4 rounded-lg text-center font-medium transition-colors ${
                isActive('/')
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              📝 {t('form')}
            </Link>
            <Link
              to="/analytics"
              className={`flex-1 py-2 px-4 rounded-lg text-center font-medium transition-colors ${
                isActive('/analytics')
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              📊 {t('analytics')}
            </Link>
            <Link
              to="/babies"
              className={`flex-1 py-2 px-4 rounded-lg text-center font-medium transition-colors ${
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
    </div>
  );
}
