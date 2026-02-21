export const METRIC_TYPES = [
  { value: 'milk_produced', unit: 'ml' },
  { value: 'milk_consumed', unit: 'ml' },
  { value: 'weight', unit: 'grams' },
  { value: 'diaper_wet', unit: 'count' },
  { value: 'diaper_dirty', unit: 'count' },
  { value: 'sleep_duration', unit: 'minutes' },
  { value: 'feeding_duration', unit: 'minutes' },
  { value: 'temperature', unit: 'celsius' },
  { value: 'formula', unit: 'ml' },
];

export const getMetricUnit = (metricType) => {
  const metric = METRIC_TYPES.find(m => m.value === metricType);
  return metric ? metric.unit : '';
};
