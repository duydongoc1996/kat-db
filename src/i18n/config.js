import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

const resources = {
  en: {
    translation: {
      // Navigation
      form: 'Record',
      analytics: 'Analytics',
      babies: 'Babies',
      
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
      
      // Baby Management
      manageBabies: 'Manage Babies',
      addBaby: 'Add Baby',
      babyName: 'Baby Name',
      enterBabyName: 'Enter baby name',
      dateOfBirth: 'Date of Birth',
      createBaby: 'Create Baby',
      creating: 'Creating...',
      cancel: 'Cancel',
      yourBabies: 'Your Babies',
      noBabiesYet: 'No babies yet. Create your first baby to start tracking!',
      current: 'Current',
      born: 'Born',
      yourRole: 'Your role',
      mom: 'Mom',
      dad: 'Dad',
      other: 'Other',
      selectBaby: 'Select Baby',
      noBabySelected: 'No Baby Selected',
      pleaseCreateOrSelectBaby: 'Please create or select a baby to continue',
      pleaseSelectBaby: 'Please select a baby first',
      recordingFor: 'Recording for',
      viewingDataFor: 'Viewing data for',
      babyNameRequired: 'Baby name is required',
      errorCreatingBaby: 'Failed to create baby. Please try again.',
      babyCreatedSuccessfully: 'Baby created successfully!',
      multiUserInfo: 'Multi-user Access',
      multiUserDescription: 'You can invite other users (like dad, grandparents) to manage this baby together. This feature is coming soon!',
      inviteUsers: 'Invite Users',
      hideInvite: 'Hide',
      selectUser: 'Select User',
      chooseUser: 'Choose a user',
      role: 'Role',
      inviteUser: 'Invite User',
      inviting: 'Inviting...',
      currentMembers: 'Current Members',
      loadingMembers: 'Loading members...',
      you: 'you',
      remove: 'Remove',
      pleaseSelectUser: 'Please select a user to invite',
      userAlreadyHasAccess: 'This user already has access to this baby',
      errorInvitingUser: 'Failed to invite user. Please try again.',
      userInvitedSuccessfully: 'User invited successfully!',
      errorRemovingUser: 'Failed to remove user. Please try again.',
      userRemovedSuccessfully: 'User removed successfully!',
      confirmRemoveMember: 'Are you sure you want to remove',
      
      // Language
      language: 'Language',
    }
  },
  vi: {
    translation: {
      // Navigation
      form: 'Ghi chép',
      analytics: 'Thống kê',
      babies: 'Bé yêu',
      
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
      
      // Baby Management
      manageBabies: 'Quản lý bé',
      addBaby: 'Thêm bé',
      babyName: 'Tên bé',
      enterBabyName: 'Nhập tên bé',
      dateOfBirth: 'Ngày sinh',
      createBaby: 'Tạo hồ sơ bé',
      creating: 'Đang tạo...',
      cancel: 'Hủy',
      yourBabies: 'Bé của bạn',
      noBabiesYet: 'Chưa có bé nào. Tạo hồ sơ bé đầu tiên để bắt đầu theo dõi!',
      current: 'Hiện tại',
      born: 'Sinh ngày',
      yourRole: 'Vai trò',
      mom: 'Mẹ',
      dad: 'Bố',
      other: 'Khác',
      selectBaby: 'Chọn bé',
      noBabySelected: 'Chưa chọn bé',
      pleaseCreateOrSelectBaby: 'Vui lòng tạo hoặc chọn một bé để tiếp tục',
      pleaseSelectBaby: 'Vui lòng chọn bé trước',
      recordingFor: 'Ghi chép cho',
      viewingDataFor: 'Xem dữ liệu của',
      babyNameRequired: 'Tên bé là bắt buộc',
      errorCreatingBaby: 'Tạo hồ sơ bé thất bại. Vui lòng thử lại.',
      babyCreatedSuccessfully: 'Tạo hồ sơ bé thành công!',
      multiUserInfo: 'Nhiều người quản lý',
      multiUserDescription: 'Bạn có thể mời người khác (như bố, ông bà) cùng quản lý bé. Tính năng này sắp ra mắt!',
      inviteUsers: 'Mời người dùng',
      hideInvite: 'Ẩn',
      selectUser: 'Chọn người dùng',
      chooseUser: 'Chọn một người',
      role: 'Vai trò',
      inviteUser: 'Mời',
      inviting: 'Đang mời...',
      currentMembers: 'Thành viên hiện tại',
      loadingMembers: 'Đang tải...',
      you: 'bạn',
      remove: 'Xóa',
      pleaseSelectUser: 'Vui lòng chọn người để mời',
      userAlreadyHasAccess: 'Người này đã có quyền truy cập bé này',
      errorInvitingUser: 'Mời người dùng thất bại. Vui lòng thử lại.',
      userInvitedSuccessfully: 'Đã mời người dùng thành công!',
      errorRemovingUser: 'Xóa người dùng thất bại. Vui lòng thử lại.',
      userRemovedSuccessfully: 'Đã xóa người dùng thành công!',
      confirmRemoveMember: 'Bạn có chắc muốn xóa',
      
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
