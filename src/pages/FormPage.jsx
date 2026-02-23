import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../contexts/AuthContext';
import { useBaby } from '../contexts/BabyContext';
import { supabase } from '../lib/supabase';
import { METRIC_TYPES, getMetricUnit } from '../constants/metrics';
import BabyInfoBanner from '../components/BabyInfoBanner';

export default function FormPage() {
  const { t } = useTranslation();
  const { user } = useAuth();
  const { currentBaby, loading: babyLoading } = useBaby();
  const [inputType, setInputType] = useState('');
  const [value, setValue] = useState('');
  const [note, setNote] = useState('');
  const [recordedAt, setRecordedAt] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!currentBaby) {
      setMessage({ type: 'error', text: t('pleaseSelectBaby') });
      return;
    }
    
    if (!inputType || !value) {
      setMessage({ type: 'error', text: t('errorMessage') });
      return;
    }

    setLoading(true);
    setMessage({ type: '', text: '' });

    try {
      const recordData = {
        baby_id: currentBaby.id,
        user_id: user.id,
        input_type: inputType,
        value: parseFloat(value),
        note: note.trim() || null,
      };

      if (recordedAt) {
        recordData.recorded_at = new Date(recordedAt).toISOString();
      }

      const { error } = await supabase
        .from('metrics')
        .insert([recordData]);

      if (error) throw error;

      setMessage({ type: 'success', text: t('successMessage') });
      setValue('');
      setNote('');
      setRecordedAt('');
      
      setTimeout(() => {
        setMessage({ type: '', text: '' });
      }, 3000);
    } catch (error) {
      console.error('Error inserting record:', error);
      setMessage({ type: 'error', text: t('errorMessage') });
    } finally {
      setLoading(false);
    }
  };

  const selectedUnit = inputType ? getMetricUnit(inputType) : '';

  if (babyLoading) {
    return (
      <div className="max-w-md mx-auto">
        <div className="bg-white rounded-2xl shadow-lg p-6 text-center">
          <p className="text-gray-600">{t('loading')}</p>
        </div>
      </div>
    );
  }

  if (!currentBaby) {
    return (
      <div className="max-w-md mx-auto">
        <div className="bg-yellow-50 border border-yellow-200 rounded-2xl shadow-lg p-6">
          <h3 className="text-lg font-semibold text-yellow-900 mb-2">
            {t('noBabySelected')}
          </h3>
          <p className="text-yellow-800 mb-4">
            {t('pleaseCreateOrSelectBaby')}
          </p>
          <a
            href="/babies"
            className="inline-block px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white font-medium rounded-lg transition-colors"
          >
            {t('manageBabies')}
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto space-y-6">
      {/* Baby Info Banner */}
      <BabyInfoBanner />

      {/* Form */}
      <div className="bg-white rounded-2xl shadow-lg p-6">

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Metric Type Dropdown */}
          <div>
            <label htmlFor="inputType" className="block text-sm font-medium text-gray-700 mb-2">
              {t('inputType')}
            </label>
            <select
              id="inputType"
              value={inputType}
              onChange={(e) => setInputType(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              required
            >
              <option value="">{t('selectMetric')}</option>
              {METRIC_TYPES.map((metric) => (
                <option key={metric.value} value={metric.value}>
                  {t(metric.value)} ({t(metric.unit)})
                </option>
              ))}
            </select>
          </div>

          {/* Value Input */}
          <div>
            <label htmlFor="value" className="block text-sm font-medium text-gray-700 mb-2">
              {t('value')} {selectedUnit && `(${t(selectedUnit)})`}
            </label>
            <input
              type="number"
              id="value"
              value={value}
              onChange={(e) => setValue(e.target.value)}
              placeholder={t('enterValue')}
              step="0.01"
              min="0"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              required
            />
          </div>

          {/* Date/Time Input (Optional) */}
          <div>
            <label htmlFor="recordedAt" className="block text-sm font-medium text-gray-700 mb-2">
              {t('recordedTime')} <span className="text-gray-500 text-xs">({t('optional')})</span>
            </label>
            <input
              type="datetime-local"
              id="recordedAt"
              value={recordedAt}
              onChange={(e) => setRecordedAt(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            />
            <p className="text-xs text-gray-500 mt-1">
              {t('recordedTimeHelper')}
            </p>
          </div>

          {/* Note Input */}
          <div>
            <label htmlFor="note" className="block text-sm font-medium text-gray-700 mb-2">
              {t('note')}
            </label>
            <textarea
              id="note"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder={t('enterNote')}
              rows="3"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none"
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3 px-6 rounded-lg transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed shadow-md hover:shadow-lg"
          >
            {loading ? t('submitting') : t('submit')}
          </button>
        </form>

        {/* Success/Error Message */}
        {message.text && (
          <div
            className={`mt-4 p-4 rounded-lg ${
              message.type === 'success'
                ? 'bg-green-100 text-green-700 border border-green-200'
                : 'bg-red-100 text-red-700 border border-red-200'
            }`}
          >
            {message.text}
          </div>
        )}
      </div>
    </div>
  );
}
