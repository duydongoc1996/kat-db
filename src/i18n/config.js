import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

const resources = {
  en: {
    translation: {
      // Navigation
      form: 'Record',
      analytics: 'Analytics',
      
      // Authentication
      signInWithGoogle: 'Sign in with Google',
      signOut: 'Sign out',
      signingIn: 'Signing in...',
      loginSubtitle: 'Track your baby\'s daily metrics',
      loginInfo: 'Only authorized Gmail accounts can access this app',
      loginFooter: 'Secure authentication powered by Supabase',
      
      // Form page
      formTitle: 'Record Kat\'s Metrics',
      inputType: 'Metric Type',
      selectMetric: 'Select a metric',
      value: 'Value',
      enterValue: 'Enter value',
      recordedTime: 'Date & Time',
      optional: 'optional',
      recordedTimeHelper: 'Leave empty to use current time, or select a date/time for historical data',
      note: 'Note',
      enterNote: 'Add a note (optional)',
      submit: 'Save Record',
      submitting: 'Saving...',
      successMessage: 'Record saved successfully!',
      errorMessage: 'Failed to save record. Please try again.',
      
      // Metric types
      milk_produced: 'Milk Produced',
      milk_consumed: 'Milk Consumed',
      weight: 'Weight',
      diaper_wet: 'Wet Diapers',
      diaper_dirty: 'Dirty Diapers',
      sleep_duration: 'Sleep Duration',
      feeding_duration: 'Feeding Duration',
      temperature: 'Temperature',
      formula: 'Formula',
      
      // Units
      ml: 'ml',
      grams: 'grams',
      count: 'count',
      minutes: 'minutes',
      celsius: '°C',
      
      // Analytics page
      analyticsTitle: 'Analytics',
      selectMetricToView: 'Select a metric to view',
      chartType: 'Chart Type',
      lineChart: 'Line Chart',
      barChart: 'Bar Chart',
      timeRange: 'Time Range',
      last24Hours: 'Last 24 Hours',
      last7Days: 'Last 7 Days',
      last30Days: 'Last 30 Days',
      allTime: 'All Time',
      todaySummary: 'Today\'s Summary',
      total: 'Total',
      average: 'Average',
      records: 'records',
      noData: 'No data available for the selected metric and time range.',
      loading: 'Loading...',
      
      // Language
      language: 'Language',
    }
  },
  vi: {
    translation: {
      // Navigation
      form: 'Ghi chép',
      analytics: 'Thống kê',
      
      // Authentication
      signInWithGoogle: 'Đăng nhập bằng Google',
      signOut: 'Đăng xuất',
      signingIn: 'Đang đăng nhập...',
      loginSubtitle: 'Theo dõi chỉ số hàng ngày của bé',
      loginInfo: 'Chỉ tài khoản Gmail được ủy quyền mới có thể truy cập',
      loginFooter: 'Xác thực an toàn được cung cấp bởi Supabase',
      
      // Form page
      formTitle: 'Ghi chép chỉ số của Kat',
      inputType: 'Loại chỉ số',
      selectMetric: 'Chọn chỉ số',
      value: 'Giá trị',
      enterValue: 'Nhập giá trị',
      recordedTime: 'Ngày & Giờ',
      optional: 'tùy chọn',
      recordedTimeHelper: 'Để trống để dùng thời gian hiện tại, hoặc chọn ngày/giờ cho dữ liệu quá khứ',
      note: 'Ghi chú',
      enterNote: 'Thêm ghi chú (tùy chọn)',
      submit: 'Lưu',
      submitting: 'Đang lưu...',
      successMessage: 'Đã lưu thành công!',
      errorMessage: 'Lưu thất bại. Vui lòng thử lại.',
      
      // Metric types
      milk_produced: 'Sữa tiết ra',
      milk_consumed: 'Sữa bé uống',
      weight: 'Cân nặng',
      diaper_wet: 'Tã ướt',
      diaper_dirty: 'Tã bẩn',
      sleep_duration: 'Thời gian ngủ',
      feeding_duration: 'Thời gian bú',
      temperature: 'Nhiệt độ',
      formula: 'Sữa công thức',
      
      // Units
      ml: 'ml',
      grams: 'gram',
      count: 'lần',
      minutes: 'phút',
      celsius: '°C',
      
      // Analytics page
      analyticsTitle: 'Thống kê',
      selectMetricToView: 'Chọn chỉ số để xem',
      chartType: 'Loại biểu đồ',
      lineChart: 'Biểu đồ đường',
      barChart: 'Biểu đồ cột',
      timeRange: 'Khoảng thời gian',
      last24Hours: '24 giờ qua',
      last7Days: '7 ngày qua',
      last30Days: '30 ngày qua',
      allTime: 'Tất cả',
      todaySummary: 'Tổng kết hôm nay',
      total: 'Tổng',
      average: 'Trung bình',
      records: 'lần ghi',
      noData: 'Không có dữ liệu cho chỉ số và khoảng thời gian đã chọn.',
      loading: 'Đang tải...',
      
      // Language
      language: 'Ngôn ngữ',
    }
  }
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: localStorage.getItem('language') || 'en',
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false
    }
  });

export default i18n;
