import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useBaby } from '../contexts/BabyContext';
import { supabase } from '../lib/supabase';
import { METRIC_TYPES, getMetricUnit } from '../constants/metrics';

export default function MetricsHistoryPage() {
  const { t } = useTranslation();
  const { currentBaby } = useBaby();
  const [metrics, setMetrics] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterType, setFilterType] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [editValue, setEditValue] = useState('');
  const [editNote, setEditNote] = useState('');
  const [message, setMessage] = useState({ type: '', text: '' });

  useEffect(() => {
    if (currentBaby) {
      fetchMetrics();
    }
  }, [currentBaby, filterType]);

  const fetchMetrics = async () => {
    if (!currentBaby) return;

    setLoading(true);
    try {
      let query = supabase
        .from('metrics')
        .select('*')
        .eq('baby_id', currentBaby.id)
        .order('recorded_at', { ascending: false })
        .limit(100);

      if (filterType) {
        query = query.eq('input_type', filterType);
      }

      const { data, error } = await query;

      if (error) throw error;
      setMetrics(data || []);
    } catch (error) {
      console.error('Error fetching metrics:', error);
      setMessage({ type: 'error', text: t('errorLoadingMetrics') });
    } finally {
      setLoading(false);
    }
  };

  const startEdit = (metric) => {
    setEditingId(metric.id);
    setEditValue(metric.value);
    setEditNote(metric.note || '');
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditValue('');
    setEditNote('');
  };

  const saveEdit = async (id) => {
    try {
      const { error } = await supabase
        .from('metrics')
        .update({
          value: parseFloat(editValue),
          note: editNote.trim() || null,
        })
        .eq('id', id);

      if (error) throw error;

      setMessage({ type: 'success', text: t('recordUpdated') });
      setEditingId(null);
      fetchMetrics();

      setTimeout(() => {
        setMessage({ type: '', text: '' });
      }, 3000);
    } catch (error) {
      console.error('Error updating metric:', error);
      setMessage({ type: 'error', text: t('errorUpdatingRecord') });
    }
  };

  const deleteRecord = async (id) => {
    if (!confirm(t('confirmDelete'))) return;

    try {
      const { error } = await supabase
        .from('metrics')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setMessage({ type: 'success', text: t('recordDeleted') });
      fetchMetrics();

      setTimeout(() => {
        setMessage({ type: '', text: '' });
      }, 3000);
    } catch (error) {
      console.error('Error deleting metric:', error);
      setMessage({ type: 'error', text: t('errorDeletingRecord') });
    }
  };

  if (!currentBaby) {
    return (
      <div className="max-w-6xl mx-auto">
        <div className="bg-yellow-50 border border-yellow-200 rounded-2xl shadow-lg p-6">
          <h3 className="text-lg font-semibold text-yellow-900 mb-2">
            {t('noBabySelected')}
          </h3>
          <p className="text-yellow-800">{t('pleaseSelectBaby')}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div className="bg-white rounded-2xl shadow-lg p-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold text-gray-800">
              {t('metricsHistory')}
            </h2>
            <p className="text-sm text-gray-600 mt-1">
              {t('viewingDataFor')}: <span className="font-medium text-blue-600">{currentBaby.name}</span>
            </p>
          </div>

          {/* Filter */}
          <div className="flex items-center gap-3">
            <label className="text-sm font-medium text-gray-700">
              {t('filterByType')}:
            </label>
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">{t('allTypes')}</option>
              {METRIC_TYPES.map((type) => (
                <option key={type.value} value={type.value}>
                  {t(type.value)}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Message */}
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

      {/* Table */}
      <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
        {loading ? (
          <div className="p-8 text-center">
            <p className="text-gray-600">{t('loading')}</p>
          </div>
        ) : metrics.length === 0 ? (
          <div className="p-8 text-center">
            <p className="text-gray-600">{t('noRecordsFound')}</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {t('dateTime')}
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {t('metricType')}
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {t('value')}
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {t('note')}
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {t('actions')}
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {metrics.map((metric) => (
                  <tr key={metric.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {new Date(metric.recorded_at).toLocaleString(undefined, {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded">
                        {t(metric.input_type)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      {editingId === metric.id ? (
                        <input
                          type="number"
                          value={editValue}
                          onChange={(e) => setEditValue(e.target.value)}
                          className="w-24 px-2 py-1 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
                          step="0.01"
                        />
                      ) : (
                        <span className="font-medium text-gray-900">
                          {metric.value} {t(getMetricUnit(metric.input_type))}
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {editingId === metric.id ? (
                        <input
                          type="text"
                          value={editNote}
                          onChange={(e) => setEditNote(e.target.value)}
                          placeholder={t('enterNote')}
                          className="w-full px-2 py-1 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
                        />
                      ) : (
                        <span>{metric.note || '-'}</span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      {editingId === metric.id ? (
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => saveEdit(metric.id)}
                            className="text-green-600 hover:text-green-900"
                          >
                            ✓ {t('save')}
                          </button>
                          <button
                            onClick={cancelEdit}
                            className="text-gray-600 hover:text-gray-900"
                          >
                            ✕ {t('cancel')}
                          </button>
                        </div>
                      ) : (
                        <div className="flex items-center justify-end gap-3">
                          <button
                            onClick={() => startEdit(metric)}
                            className="text-blue-600 hover:text-blue-900"
                          >
                            ✏️ {t('edit')}
                          </button>
                          <button
                            onClick={() => deleteRecord(metric.id)}
                            className="text-red-600 hover:text-red-900"
                          >
                            🗑️ {t('delete')}
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Info */}
      {metrics.length > 0 && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <p className="text-sm text-blue-800">
            {t('showingRecords', { count: metrics.length })}
          </p>
        </div>
      )}
    </div>
  );
}
