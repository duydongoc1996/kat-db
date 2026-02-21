import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useBaby } from '../contexts/BabyContext';

export default function BabySelector() {
  const { t } = useTranslation();
  const { babies, currentBaby, switchBaby } = useBaby();
  const [isOpen, setIsOpen] = useState(false);

  if (!currentBaby && babies.length === 0) {
    return null;
  }

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-1.5 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
      >
        <span className="text-sm font-medium text-gray-700">
          {currentBaby ? currentBaby.name : t('selectBaby')}
        </span>
        <svg
          className={`w-4 h-4 text-gray-500 transition-transform ${isOpen ? 'rotate-180' : ''}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isOpen && babies.length > 1 && (
        <div className="absolute top-full left-0 mt-1 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-50">
          {babies.map((baby) => (
            <button
              key={baby.id}
              onClick={() => {
                switchBaby(baby);
                setIsOpen(false);
              }}
              className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-50 transition-colors first:rounded-t-lg last:rounded-b-lg ${
                currentBaby?.id === baby.id ? 'bg-blue-50 text-blue-700 font-medium' : 'text-gray-700'
              }`}
            >
              {baby.name}
              {baby.role === 'owner' && (
                <span className="ml-2 text-xs text-gray-500">({t('owner')})</span>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
