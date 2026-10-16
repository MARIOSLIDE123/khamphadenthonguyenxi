import { Badge } from '../types';

export interface ArenaRoundConfig {
  roundNumber: number;
  title: string;
  subtitle: string;
  questionIds: string[];
  timeLimitSeconds: number;
  passingScore: number;
  badgeAwarded: string;
}

export const ARENA_ROUNDS: ArenaRoundConfig[] = [
  {
    roundNumber: 1,
    title: 'Vòng 1: Khởi động',
    subtitle: 'Nhận biết các mốc lịch sử cốt lõi về danh thần Nguyễn Xí',
    questionIds: ['q1', 'q2', 'q3', 'q4'],
    timeLimitSeconds: 120,
    passingScore: 30,
    badgeAwarded: 'badge-khoi-dong'
  },
  {
    roundNumber: 2,
    title: 'Vòng 2: Khám phá',
    subtitle: 'Tìm hiểu sâu về công lao đánh giặc cứu nước và 4 đời vua Lê',
    questionIds: ['q9', 'q10', 'q26', 'q28'],
    timeLimitSeconds: 150,
    passingScore: 30,
    badgeAwarded: 'badge-kham-pha'
  },
  {
    roundNumber: 3,
    title: 'Vòng 3: Giải mã di sản',
    subtitle: 'Khám phá kiến trúc cổ thâm nghiêm và giá trị di tích quốc gia',
    questionIds: ['q5', 'q6', 'q7', 'q8', 'q11'],
    timeLimitSeconds: 180,
    passingScore: 35,
    badgeAwarded: 'badge-giai-ma'
  },
  {
    roundNumber: 4,
    title: 'Vòng 4: Thử thách lịch sử',
    subtitle: 'Thao tác sắp xếp thời gian, ghép nối cặp sự kiện và điền khuyết',
    questionIds: ['q13', 'q14', 'q16', 'q20', 'q23'],
    timeLimitSeconds: 210,
    passingScore: 40,
    badgeAwarded: 'badge-thu-thach'
  },
  {
    roundNumber: 5,
    title: 'Vòng 5: Chinh phục di sản',
    subtitle: 'Đỉnh cao trí tuệ: Tổng hợp kiến trúc, giá trị bảo tồn và hành động văn minh',
    questionIds: ['q15', 'q18', 'q22', 'q24', 'q25', 'q30'],
    timeLimitSeconds: 240,
    passingScore: 45,
    badgeAwarded: 'badge-chinh-phuc'
  }
];

export const BADGES_LIST: Badge[] = [
  {
    id: 'badge-nhap-mon',
    name: 'Sứ Giả Khởi Hành',
    description: 'Hoàn tất thủ tục ghi danh vào hành trình khám phá di tích Đền thờ Nguyễn Xí.',
    iconName: 'Scroll',
    requirement: 'Đăng ký thành công',
    category: 'exploration'
  },
  {
    id: 'badge-tour-360',
    name: 'Nhà Thám Hiểm Không Gian',
    description: 'Khám phá và hoàn thành chuyến tham quan thực tế ảo 360 độ tại di tích.',
    iconName: 'Compass',
    requirement: 'Hoàn thành tham quan 360°',
    category: 'exploration'
  },
  {
    id: 'badge-hoc-gia',
    name: 'Sĩ Tử Uyên Bác',
    description: 'Đọc và hoàn thành toàn bộ 7 chủ đề tìm hiểu di tích lịch sử.',
    iconName: 'BookOpen',
    requirement: 'Hoàn thành 7 chủ đề di tích',
    category: 'historical'
  },
  {
    id: 'badge-khoi-dong',
    name: 'Chiến Binh Lam Sơn',
    description: 'Vượt qua Vòng 1 Đấu trường trí tuệ với số điểm xuất sắc.',
    iconName: 'Shield',
    requirement: 'Hoàn thành Vòng 1 Đấu trường',
    category: 'arena'
  },
  {
    id: 'badge-kham-pha',
    name: 'Thần Đột Tiên Phong',
    description: 'Chiến thắng Vòng 2 với kiến thức sâu sắc về công lao của Thái sư Cương Quốc công.',
    iconName: 'Award',
    requirement: 'Hoàn thành Vòng 2 Đấu trường',
    category: 'arena'
  },
  {
    id: 'badge-giai-ma',
    name: 'Chuyên Gia Di Sản',
    description: 'Giải mã chuẩn xác kiến trúc cổ và thời khắc vinh danh di tích quốc gia đặc biệt.',
    iconName: 'Landmark',
    requirement: 'Hoàn thành Vòng 3 Đấu trường',
    category: 'arena'
  },
  {
    id: 'badge-thu-thach',
    name: 'Bậc Thầy Trí Tuệ',
    description: 'Hoàn tất các thử thách ghép cột, sắp xếp và điền từ lịch sử phức tạp.',
    iconName: 'Zap',
    requirement: 'Hoàn thành Vòng 4 Đấu trường',
    category: 'arena'
  },
  {
    id: 'badge-chinh-phuc',
    name: 'Hộ Thần Di Tích Quốc Gia',
    description: 'Chinh phục toàn diện Đấu trường trí tuệ và bảo tồn văn hóa ngàn năm.',
    iconName: 'Crown',
    requirement: 'Vượt qua cả 5 vòng thi Đấu trường',
    category: 'arena'
  },
  {
    id: 'badge-chuyen-can',
    name: 'Ngọn Lửa Hiếu Học',
    description: 'Tích lũy trên 15 phút học tập chủ động tại ứng dụng.',
    iconName: 'Flame',
    requirement: 'Học tập liên tục trên 15 phút',
    category: 'dedication'
  }
];
