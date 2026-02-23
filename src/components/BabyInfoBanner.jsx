import { useTranslation } from 'react-i18next';
import { useBaby } from '../contexts/BabyContext';

export default function BabyInfoBanner() {
  const { t } = useTranslation();
  const { currentBaby } = useBaby();

  if (!currentBaby) return null;

  return (
    <div className="bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl shadow-lg p-4">
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <p className="text-white text-sm opacity-90">{t('viewing')}</p>
          <h2 className="text-xl font-bold text-white">{currentBaby.name}</h2>
        </div>
        <div className="ml-4">
          <div className="h-12 w-12 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
            <span className="text-2xl">👶</span>
          </div>
        </div>
      </div>
    </div>
  );
}
