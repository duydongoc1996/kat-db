import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useBaby } from '../contexts/BabyContext';

export default function BabyManagementPage() {
  const { t } = useTranslation();
  const { babies, currentBaby, createBaby } = useBaby();
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newBabyName, setNewBabyName] = useState('');
  const [newBabyDOB, setNewBabyDOB] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  const handleCreateBaby = async (e) => {
    e.preventDefault();
    
    if (!newBabyName.trim()) {
      setMessage({ type: 'error', text: t('babyNameRequired') });
      return;
    }

    setLoading(true);
    setMessage({ type: '', text: '' });

    const { error } = await createBaby({
      name: newBabyName.trim(),
      date_of_birth: newBabyDOB || null,
    });

    if (error) {
      setMessage({ type: 'error', text: t('errorCreatingBaby') });
    } else {
      setMessage({ type: 'success', text: t('babyCreatedSuccessfully') });
      setNewBabyName('');
      setNewBabyDOB('');
      setShowCreateForm(false);
      
      setTimeout(() => {
        setMessage({ type: '', text: '' });
      }, 3000);
    }

    setLoading(false);
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Header */}
      <div className="bg-white rounded-2xl shadow-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold text-gray-800">
            {t('manageBabies')}
          </h2>
          <button
            onClick={() => setShowCreateForm(!showCreateForm)}
            className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white font-medium rounded-lg transition-colors"
          >
            {showCreateForm ? t('cancel') : t('addBaby')}
          </button>
        </div>

        {/* Create Baby Form */}
        {showCreateForm && (
          <form onSubmit={handleCreateBaby} className="space-y-4 border-t pt-4">
            <div>
              <label htmlFor="babyName" className="block text-sm font-medium text-gray-700 mb-2">
                {t('babyName')} *
              </label>
              <input
                type="text"
                id="babyName"
                value={newBabyName}
                onChange={(e) => setNewBabyName(e.target.value)}
                placeholder={t('enterBabyName')}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>

            <div>
              <label htmlFor="babyDOB" className="block text-sm font-medium text-gray-700 mb-2">
                {t('dateOfBirth')} <span className="text-gray-500 text-xs">({t('optional')})</span>
              </label>
              <input
                type="date"
                id="babyDOB"
                value={newBabyDOB}
                onChange={(e) => setNewBabyDOB(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3 px-6 rounded-lg transition-colors disabled:bg-gray-400"
            >
              {loading ? t('creating') : t('createBaby')}
            </button>

            {message.text && (
              <div
                className={`p-4 rounded-lg ${
                  message.type === 'success'
                    ? 'bg-green-100 text-green-700 border border-green-200'
                    : 'bg-red-100 text-red-700 border border-red-200'
                }`}
              >
                {message.text}
              </div>
            )}
          </form>
        )}
      </div>

      {/* Baby List */}
      <div className="bg-white rounded-2xl shadow-lg p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">
          {t('yourBabies')} ({babies.length})
        </h3>

        {babies.length === 0 ? (
          <p className="text-gray-500 text-center py-8">
            {t('noBabiesYet')}
          </p>
        ) : (
          <div className="space-y-3">
            {babies.map((baby) => (
              <div
                key={baby.id}
                className={`p-4 border-2 rounded-lg transition-colors ${
                  currentBaby?.id === baby.id
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-semibold text-gray-800">
                      {baby.name}
                      {currentBaby?.id === baby.id && (
                        <span className="ml-2 text-xs bg-blue-500 text-white px-2 py-0.5 rounded">
                          {t('current')}
                        </span>
                      )}
                    </h4>
                    {baby.date_of_birth && (
                      <p className="text-sm text-gray-600">
                        {t('born')}: {new Date(baby.date_of_birth).toLocaleDateString()}
                      </p>
                    )}
                    <p className="text-xs text-gray-500 mt-1">
                      {t('yourRole')}: <span className="font-medium">{t(baby.role)}</span>
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Info Box */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h4 className="font-medium text-blue-900 mb-2">{t('multiUserInfo')}</h4>
        <p className="text-sm text-blue-800">
          {t('multiUserDescription')}
        </p>
      </div>
    </div>
  );
}
