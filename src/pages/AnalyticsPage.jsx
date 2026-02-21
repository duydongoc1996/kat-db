import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';
import { METRIC_TYPES, getMetricUnit } from '../constants/metrics';

export default function AnalyticsPage() {
  const { t } = useTranslation();
  const { user } = useAuth();
  const [selectedMetric, setSelectedMetric] = useState('');
  const [chartType, setChartType] = useState('line');
  const [timeRange, setTimeRange] = useState('7days');
  const [data, setData] = useState([]);
  const [todaySummary, setTodaySummary] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (selectedMetric) {
      fetchData();
    }
  }, [selectedMetric, timeRange]);

  const getDateFilter = () => {
    const now = new Date();
    switch (timeRange) {
      case '24hours':
        return new Date(now.getTime() - 24 * 60 * 60 * 1000);
      case '7days':
        return new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      case '30days':
        return new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
      default:
        return null;
    }
  };

  const fetchData = async () => {
    setLoading(true);
    try {
      let query = supabase
        .from('metrics')
        .select('*')
        .eq('user_id', user.id)
        .eq('input_type', selectedMetric)
        .order('recorded_at', { ascending: true });

      const dateFilter = getDateFilter();
      if (dateFilter) {
        query = query.gte('recorded_at', dateFilter.toISOString());
      }

      const { data: records, error } = await query;

      if (error) throw error;

      const formattedData = records.map((record) => ({
        time: new Date(record.recorded_at).toLocaleString(
          undefined,
          timeRange === '24hours'
            ? { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }
            : { month: 'short', day: 'numeric' }
        ),
        value: parseFloat(record.value),
        fullDate: new Date(record.recorded_at),
      }));

      setData(formattedData);

      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const todayRecords = records.filter(
        (r) => new Date(r.recorded_at) >= today
      );

      if (todayRecords.length > 0) {
        const total = todayRecords.reduce((sum, r) => sum + parseFloat(r.value), 0);
        const average = total / todayRecords.length;
        setTodaySummary({
          total: total.toFixed(2),
          average: average.toFixed(2),
          count: todayRecords.length,
        });
      } else {
        setTodaySummary(null);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const selectedUnit = selectedMetric ? getMetricUnit(selectedMetric) : '';

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-2xl shadow-lg p-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">
          {t('analyticsTitle')}
        </h2>

        {/* Controls */}
        <div className="space-y-4">
          {/* Metric Selection */}
          <div>
            <label htmlFor="metric" className="block text-sm font-medium text-gray-700 mb-2">
              {t('selectMetricToView')}
            </label>
            <select
              id="metric"
              value={selectedMetric}
              onChange={(e) => setSelectedMetric(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">{t('selectMetric')}</option>
              {METRIC_TYPES.map((metric) => (
                <option key={metric.value} value={metric.value}>
                  {t(metric.value)}
                </option>
              ))}
            </select>
          </div>

          {selectedMetric && (
            <>
              {/* Chart Type */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t('chartType')}
                </label>
                <div className="flex gap-2">
                  <button
                    onClick={() => setChartType('line')}
                    className={`flex-1 py-2 px-4 rounded-lg font-medium transition-colors ${
                      chartType === 'line'
                        ? 'bg-blue-500 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    📈 {t('lineChart')}
                  </button>
                  <button
                    onClick={() => setChartType('bar')}
                    className={`flex-1 py-2 px-4 rounded-lg font-medium transition-colors ${
                      chartType === 'bar'
                        ? 'bg-blue-500 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    📊 {t('barChart')}
                  </button>
                </div>
              </div>

              {/* Time Range */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t('timeRange')}
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => setTimeRange('24hours')}
                    className={`py-2 px-4 rounded-lg font-medium transition-colors ${
                      timeRange === '24hours'
                        ? 'bg-blue-500 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {t('last24Hours')}
                  </button>
                  <button
                    onClick={() => setTimeRange('7days')}
                    className={`py-2 px-4 rounded-lg font-medium transition-colors ${
                      timeRange === '7days'
                        ? 'bg-blue-500 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {t('last7Days')}
                  </button>
                  <button
                    onClick={() => setTimeRange('30days')}
                    className={`py-2 px-4 rounded-lg font-medium transition-colors ${
                      timeRange === '30days'
                        ? 'bg-blue-500 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {t('last30Days')}
                  </button>
                  <button
                    onClick={() => setTimeRange('all')}
                    className={`py-2 px-4 rounded-lg font-medium transition-colors ${
                      timeRange === 'all'
                        ? 'bg-blue-500 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {t('allTime')}
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Today's Summary */}
      {selectedMetric && todaySummary && (
        <div className="bg-gradient-to-r from-blue-500 to-indigo-600 rounded-2xl shadow-lg p-6 text-white">
          <h3 className="text-lg font-semibold mb-4">{t('todaySummary')}</h3>
          <div className="grid grid-cols-3 gap-4">
            <div className="bg-white bg-opacity-20 rounded-lg p-4">
              <div className="text-sm opacity-90">{t('total')}</div>
              <div className="text-2xl font-bold">
                {todaySummary.total} {t(selectedUnit)}
              </div>
            </div>
            <div className="bg-white bg-opacity-20 rounded-lg p-4">
              <div className="text-sm opacity-90">{t('average')}</div>
              <div className="text-2xl font-bold">
                {todaySummary.average} {t(selectedUnit)}
              </div>
            </div>
            <div className="bg-white bg-opacity-20 rounded-lg p-4">
              <div className="text-sm opacity-90">{t('records')}</div>
              <div className="text-2xl font-bold">{todaySummary.count}</div>
            </div>
          </div>
        </div>
      )}

      {/* Chart */}
      {selectedMetric && (
        <div className="bg-white rounded-2xl shadow-lg p-6">
          {loading ? (
            <div className="text-center py-12 text-gray-500">
              {t('loading')}
            </div>
          ) : data.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              {t('noData')}
            </div>
          ) : (
            <ResponsiveContainer width="100%" height={300}>
              {chartType === 'line' ? (
                <LineChart data={data}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis 
                    dataKey="time" 
                    tick={{ fontSize: 12 }}
                    angle={-45}
                    textAnchor="end"
                    height={60}
                  />
                  <YAxis tick={{ fontSize: 12 }} />
                  <Tooltip />
                  <Line 
                    type="monotone" 
                    dataKey="value" 
                    stroke="#3b82f6" 
                    strokeWidth={2}
                    dot={{ fill: '#3b82f6', r: 4 }}
                  />
                </LineChart>
              ) : (
                <BarChart data={data}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis 
                    dataKey="time" 
                    tick={{ fontSize: 12 }}
                    angle={-45}
                    textAnchor="end"
                    height={60}
                  />
                  <YAxis tick={{ fontSize: 12 }} />
                  <Tooltip />
                  <Bar dataKey="value" fill="#3b82f6" />
                </BarChart>
              )}
            </ResponsiveContainer>
          )}
        </div>
      )}
    </div>
  );
}
