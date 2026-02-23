import { useTranslation } from 'react-i18next';
import { useBaby } from '../contexts/BabyContext';

export default function BabyInfoBanner() {
  const { t } = useTranslation();
  const { currentBaby } = useBaby();

  if (!currentBaby) return null;

  return (
    <div className="bg-gradient-to-r from-blue-500 to-indigo-600 rounded-2xl shadow-lg p-6">
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <h2 className="text-2xl font-bold text-white mb-2">
            {currentBaby.name}
          </h2>
          <p className="text-blue-100 text-sm">
            {t('viewingDataFor')}: <span className="font-medium text-white">{currentBaby.name}</span>
          </p>
          {currentBaby.date_of_birth && (
            <p className="text-blue-100 text-sm mt-1">
              {t('born')}: {new Date(currentBaby.date_of_birth).toLocaleDateString()}
            </p>
          )}
        </div>
        <div className="ml-4">
          <div className="h-16 w-16 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
            <span className="text-4xl">👶</span>
          </div>
        </div>
      </div>
    </div>
  );
}
