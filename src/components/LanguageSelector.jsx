import { useTranslation } from 'react-i18next';

export default function LanguageSelector() {
  const { t, i18n } = useTranslation();

  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
    localStorage.setItem('language', lng);
  };

  return (
    <div className="flex bg-white border border-gray-300 rounded-lg overflow-hidden">
      <button
        onClick={() => changeLanguage('en')}
        className={`px-3 py-1 text-sm font-medium transition-colors ${
          i18n.language === 'en'
            ? 'bg-blue-500 text-white'
            : 'bg-white text-gray-700 hover:bg-gray-100'
        }`}
      >
        ENG
      </button>
      <button
        onClick={() => changeLanguage('vi')}
        className={`px-3 py-1 text-sm font-medium transition-colors ${
          i18n.language === 'vi'
            ? 'bg-blue-500 text-white'
            : 'bg-white text-gray-700 hover:bg-gray-100'
        }`}
      >
        VI
      </button>
    </div>
  );
}
