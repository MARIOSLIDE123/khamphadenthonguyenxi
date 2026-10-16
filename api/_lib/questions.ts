import { ClientQuestion, QuestionType } from '../../src/types';

export interface ServerQuestion extends ClientQuestion {
  correctAnswer: any; // secret answer known only on server
  explanation: string;
}

export const SERVER_QUESTIONS: ServerQuestion[] = [
  // 1. Single Choice (Dạng 1)
  {
    id: 'q1',
    type: 'single_choice',
    topicId: 'topic-1',
    topicTitle: 'Nguyễn Xí là ai?',
    title: 'Năm sinh và năm mất của danh thần Nguyễn Xí',
    instruction: 'Chọn một phương án đúng nhất về năm sinh và năm mất của Nguyễn Xí.',
    hint: 'Ông hưởng thọ 68 tuổi trong giai đoạn thế kỷ XV.',
    options: ['1397 – 1465', '1400 – 1468', '1418 – 1485', '1390 – 1450'],
    correctAnswer: '1397 – 1465',
    explanation: 'Nguyễn Xí sinh năm 1397 và qua đời năm 1465, là danh tướng và phụ chính đại thần kiệt xuất thời Hậu Lê.'
  },
  {
    id: 'q2',
    type: 'single_choice',
    topicId: 'topic-1',
    topicTitle: 'Nguyễn Xí là ai?',
    title: 'Quê hương của danh tướng Nguyễn Xí',
    instruction: 'Chọn địa danh là quê hương gốc của danh tướng Nguyễn Xí.',
    hint: 'Thuộc huyện Nghi Lộc xưa của vùng đất xứ Nghệ.',
    options: [
      'Làng Thượng Xá, nay thuộc huyện Nghi Lộc, tỉnh Nghệ An',
      'Lam Sơn, huyện Thọ Xuân, tỉnh Thanh Hóa',
      'Đông Kinh, Thăng Long (Hà Nội)',
      'Làng Vị Xuyên, tỉnh Nam Định'
    ],
    correctAnswer: 'Làng Thượng Xá, nay thuộc huyện Nghi Lộc, tỉnh Nghệ An',
    explanation: 'Nguyễn Xí quê ở làng Thượng Xá, nay thuộc xã Khánh Hợp (trước đây là Nghi Hợp), huyện Nghi Lộc, tỉnh Nghệ An.'
  },
  {
    id: 'q3',
    type: 'single_choice',
    topicId: 'topic-2',
    topicTitle: 'Khởi nghĩa Lam Sơn',
    title: 'Vị thủ lĩnh mà Nguyễn Xí theo phò tá đánh đuổi quân Minh',
    instruction: 'Chọn vị thủ lĩnh đã lãnh đạo cuộc khởi nghĩa Lam Sơn.',
    hint: 'Bình Định Vương sau này sáng lập triều Hậu Lê.',
    options: ['Lê Lợi', 'Trần Hưng Đạo', 'Quang Trung', 'Ngô Quyền'],
    correctAnswer: 'Lê Lợi',
    explanation: 'Nguyễn Xí cùng anh ruột theo chủ tướng Lê Lợi dấy binh khởi nghĩa Lam Sơn từ những ngày đầu năm 1418.'
  },
  {
    id: 'q4',
    type: 'single_choice',
    topicId: 'topic-2',
    topicTitle: 'Khởi nghĩa Lam Sơn',
    title: 'Đội quân tinh nhuệ mà Nguyễn Xí được giao chỉ huy',
    instruction: 'Chọn tên đội quân xung kích tinh nhuệ do Nguyễn Xí thống lĩnh.',
    hint: 'Tên đội quân mang ý nghĩa đột phá tuyến phòng thủ kiên cố của địch.',
    options: ['Quân Thiết đột', 'Quân Cần Vương', 'Quân Phấn Dũng', 'Quân Thần Sách'],
    correctAnswer: 'Quân Thiết đột',
    explanation: 'Lê Lợi rất tin tưởng và giao cho Nguyễn Xí chỉ huy đội quân Thiết đột tinh nhuệ, lập nhiều kỳ tích vang dội.'
  },
  {
    id: 'q5',
    type: 'single_choice',
    topicId: 'topic-4',
    topicTitle: 'Lịch sử hình thành đền',
    title: 'Năm khởi dựng Đền thờ Nguyễn Xí',
    instruction: 'Phân biệt năm mất của danh tướng với năm đền thờ được khởi công xây dựng.',
    hint: 'Đền thờ được xây dựng hai năm sau khi Nguyễn Xí tạ thế.',
    options: ['Năm 1467 (Đinh Hợi)', 'Năm 1465', 'Năm 1428', 'Năm 1475'],
    correctAnswer: 'Năm 1467 (Đinh Hợi)',
    explanation: 'Nguyễn Xí mất năm 1465. Hai năm sau, tức năm Đinh Hợi (1467), vua Lê Thánh Tông ban lệnh xây dựng đền thờ.'
  },
  {
    id: 'q6',
    type: 'single_choice',
    topicId: 'topic-4',
    topicTitle: 'Lịch sử hình thành đền',
    title: 'Vị vua hạ sắc chỉ cho xây dựng Đền thờ Nguyễn Xí',
    instruction: 'Chọn vị hoàng đế anh minh đã ra sắc chỉ dựng đền thờ để tri ân Nguyễn Xí.',
    hint: 'Vị vua gắn với hội Tao Đàn và thời kỳ thịnh trị Hồng Đức.',
    options: ['Vua Lê Thánh Tông', 'Vua Lê Thái Tổ', 'Vua Lê Nhân Tông', 'Vua Lê Hiến Tông'],
    correctAnswer: 'Vua Lê Thánh Tông',
    explanation: 'Vua Lê Thánh Tông vô cùng thương tiếc vị đại thần phụ chính nên năm 1467 đã ban sắc chỉ dựng lăng mộ và đền thờ.'
  },
  {
    id: 'q7',
    type: 'single_choice',
    topicId: 'topic-5',
    topicTitle: 'Khám phá kiến trúc cổ',
    title: 'Bố cục mặt bằng tổng thể của Đền thờ Nguyễn Xí',
    instruction: 'Chọn kiểu bố cục kiến trúc truyền thống của đền.',
    hint: 'Kiểu kiến trúc với các tòa nhà song song được bao bọc bởi hành lang xung quanh.',
    options: ['Nội công ngoại quốc', 'Chữ Đinh', 'Chữ Nhị', 'Chữ Tam đơn lập'],
    correctAnswer: 'Nội công ngoại quốc',
    explanation: 'Đền thờ Nguyễn Xí có mặt bằng kiến trúc kiểu "Nội công ngoại quốc" thâm nghiêm, gồm nghi môn, tiền tế, trung điện và thượng điện.'
  },
  {
    id: 'q8',
    type: 'single_choice',
    topicId: 'topic-6',
    topicTitle: 'Di tích quốc gia đặc biệt',
    title: 'Quyết định xếp hạng Di tích quốc gia đặc biệt',
    instruction: 'Chọn quyết định của Thủ tướng Chính phủ xếp hạng Lăng mộ và Đền thờ Nguyễn Xí.',
    hint: 'Ký vào ngày 31 tháng 12 năm 2020.',
    options: [
      'Quyết định số 2280/QĐ-TTg ngày 31/12/2020',
      'Quyết định số 1234/QĐ-TTg ngày 15/05/2018',
      'Quyết định số 567/QĐ-BVHTTDL ngày 10/10/2010',
      'Quyết định số 3000/QĐ-TTg ngày 01/01/2022'
    ],
    correctAnswer: 'Quyết định số 2280/QĐ-TTg ngày 31/12/2020',
    explanation: 'Ngày 31/12/2020, Thủ tướng Chính phủ ban hành Quyết định số 2280/QĐ-TTg xếp hạng Lăng mộ và Đền thờ Nguyễn Xí là Di tích quốc gia đặc biệt.'
  },

  // 2. Multiple Choice (Dạng 2)
  {
    id: 'q9',
    type: 'multiple_choice',
    topicId: 'topic-1',
    topicTitle: 'Nguyễn Xí là ai?',
    title: 'Các triều vua nhà Lê mà Nguyễn Xí đã phụ chính phụng sự',
    instruction: 'Chọn TẤT CẢ các vị hoàng đế mà Nguyễn Xí đã phụng sự và giữ chức phụ chính đại thần (chọn 4 vị vua).',
    hint: 'Ông phục vụ qua 4 đời hoàng đế Hậu Lê liên tiếp.',
    options: [
      'Vua Lê Thái Tổ (Lê Lợi)',
      'Vua Lê Thái Tông',
      'Vua Lê Nhân Tông',
      'Vua Lê Thánh Tông',
      'Vua Lê Chiêu Thống',
      'Vua Trần Thái Tông'
    ],
    correctAnswer: [
      'Vua Lê Thái Tổ (Lê Lợi)',
      'Vua Lê Thái Tông',
      'Vua Lê Nhân Tông',
      'Vua Lê Thánh Tông'
    ],
    explanation: 'Nguyễn Xí là phụ chính đại thần trải qua 4 triều vua Lê lẫy lừng: Lê Thái Tổ, Lê Thái Tông, Lê Nhân Tông và Lê Thánh Tông.'
  },
  {
    id: 'q10',
    type: 'multiple_choice',
    topicId: 'topic-3',
    topicTitle: 'Người có công với quê hương',
    title: 'Những đóng góp của Nguyễn Xí đối với quê hương trong thời bình',
    instruction: 'Chọn các hoạt động thể hiện công lao của Nguyễn Xí với nhân dân quê hương xứ Nghệ.',
    hint: 'Chọn các việc làm mang lại ấm no, nông nghiệp phát triển và cuộc sống bình an cho dân cư.',
    options: [
      'Khai hoang mở đất lấn biển',
      'Đắp đê ngăn nước mặn',
      'Đào kênh dẫn nước tưới tiêu đồng ruộng',
      'Mở chợ, xây cầu tạo thuận lợi giao thương',
      'Bắt nhân dân nộp nhiều sưu cao thuế nặng'
    ],
    correctAnswer: [
      'Khai hoang mở đất lấn biển',
      'Đắp đê ngăn nước mặn',
      'Đào kênh dẫn nước tưới tiêu đồng ruộng',
      'Mở chợ, xây cầu tạo thuận lợi giao thương'
    ],
    explanation: 'Trong thời bình, ông chỉ đạo dân khai hoang lập ấp, đắp đê ngăn mặn, đào kênh dẫn thủy nhập điền, mở chợ xây cầu đem lại no ấm.'
  },
  {
    id: 'q11',
    type: 'multiple_choice',
    topicId: 'topic-5',
    topicTitle: 'Khám phá kiến trúc cổ',
    title: 'Các công trình và cảnh quan tiêu biểu trong khuôn viên Đền thờ Nguyễn Xí',
    instruction: 'Chọn những hạng mục công trình có mặt tại di tích Đền thờ Nguyễn Xí.',
    hint: 'Từ ngoài vào trong có hồ nước phong thủy, cổng trụ và các tòa điện thờ.',
    options: [
      'Hồ bán nguyệt phía trước đền',
      'Nghi môn tứ trụ uy nghiêm',
      'Khu vực Tiền tế (Hạ điện), Trung điện và Thượng điện',
      'Tháp đồng hồ phong cách châu Âu',
      'Khu vườn tượng xi măng hiện đại'
    ],
    correctAnswer: [
      'Hồ bán nguyệt phía trước đền',
      'Nghi môn tứ trụ uy nghiêm',
      'Khu vực Tiền tế (Hạ điện), Trung điện và Thượng điện'
    ],
    explanation: 'Đền có hồ bán nguyệt phong thủy, nghi môn tứ trụ và ba tòa tiền tế, trung điện, thượng điện theo kiến trúc truyền thống.'
  },
  {
    id: 'q12',
    type: 'multiple_choice',
    topicId: 'topic-7',
    topicTitle: 'Em làm gì để gìn giữ di sản?',
    title: 'Hành vi văn minh của người học khi tham quan di tích lịch sử',
    instruction: 'Chọn tất cả những việc làm đúng đắn thể hiện lòng tôn kính và bảo vệ di sản.',
    hint: 'Gồm giữ vệ sinh, trang phục chỉnh tề, tôn trọng hiện vật và giữ trật tự.',
    options: [
      'Ăn mặc lịch sự, đi nhẹ nói khẽ nơi thờ tự',
      'Không vứt rác bừa bãi, bỏ rác đúng nơi quy định',
      'Tuyệt đối không viết, vẽ hoặc khắc tên lên tường, cột gỗ',
      'Không chạm tay, leo trèo lên linh vật hoặc hiện vật cổ',
      'Tự ý mang đồ gốm, gạch cổ về nhà làm kỷ niệm'
    ],
    correctAnswer: [
      'Ăn mặc lịch sự, đi nhẹ nói khẽ nơi thờ tự',
      'Không vứt rác bừa bãi, bỏ rác đúng nơi quy định',
      'Tuyệt đối không viết, vẽ hoặc khắc tên lên tường, cột gỗ',
      'Không chạm tay, leo trèo lên linh vật hoặc hiện vật cổ'
    ],
    explanation: 'Ứng xử văn minh tại di tích là giữ vệ sinh, ăn mặc lịch sự, tôn trọng hiện vật, không xâm phạm hoặc viết vẽ bậy lên công trình di sản.'
  },

  // 3. Drag Sort (Dạng 3: Sắp xếp theo trình tự thời gian)
  {
    id: 'q13',
    type: 'drag_sort',
    topicId: 'topic-4',
    topicTitle: 'Lịch sử hình thành đền',
    title: 'Sắp xếp các sự kiện cuộc đời và di tích Nguyễn Xí theo thứ tự thời gian',
    instruction: 'Kéo thả hoặc nhấn nút để xếp các sự kiện từ sớm nhất đến muộn nhất.',
    hint: 'Bắt đầu từ năm sinh 1397 đến khi được xếp hạng Di tích quốc gia đặc biệt năm 2020.',
    options: [
      'Nguyễn Xí sinh ra tại làng Thượng Xá (1397)',
      'Gia nhập khởi nghĩa Lam Sơn cùng Lê Lợi (1418)',
      'Nguyễn Xí tạ thế, triều đình tổ chức quốc tang (1465)',
      'Vua Lê Thánh Tông ban sắc chỉ cho xây dựng Đền thờ (1467)',
      'Thủ tướng ký Quyết định xếp hạng Di tích quốc gia đặc biệt (2020)'
    ],
    correctAnswer: [
      'Nguyễn Xí sinh ra tại làng Thượng Xá (1397)',
      'Gia nhập khởi nghĩa Lam Sơn cùng Lê Lợi (1418)',
      'Nguyễn Xí tạ thế, triều đình tổ chức quốc tang (1465)',
      'Vua Lê Thánh Tông ban sắc chỉ cho xây dựng Đền thờ (1467)',
      'Thủ tướng ký Quyết định xếp hạng Di tích quốc gia đặc biệt (2020)'
    ],
    explanation: 'Trình tự chính xác: Sinh năm 1397 → Khởi nghĩa Lam Sơn 1418 → Tạ thế 1465 → Xây dựng đền 1467 → Xếp hạng Di tích quốc gia đặc biệt 2020.'
  },
  {
    id: 'q14',
    type: 'drag_sort',
    topicId: 'topic-2',
    topicTitle: 'Khởi nghĩa Lam Sơn',
    title: 'Sắp xếp diễn biến các mốc son chống quân Minh của nghĩa quân',
    instruction: 'Sắp xếp 4 mốc son lịch sử của cuộc kháng chiến Lam Sơn theo trình tự thời gian.',
    hint: 'Bắt đầu từ Hội thề Lũng Nhai đến ngày giải phóng đất nước lập triều Hậu Lê.',
    options: [
      'Dấy binh khởi nghĩa tại Lam Sơn (1418)',
      'Chiến thắng oanh liệt Tốt Động – Chúc Động (1426)',
      'Đại thắng Chi Lăng – Xương Giang (1427)',
      'Đất nước sạch bóng quân thù, thành lập triều Hậu Lê (1428)'
    ],
    correctAnswer: [
      'Dấy binh khởi nghĩa tại Lam Sơn (1418)',
      'Chiến thắng oanh liệt Tốt Động – Chúc Động (1426)',
      'Đại thắng Chi Lăng – Xương Giang (1427)',
      'Đất nước sạch bóng quân thù, thành lập triều Hậu Lê (1428)'
    ],
    explanation: 'Thứ tự lịch sử: Khởi nghĩa 1418 → Chiến thắng Tốt Động – Chúc Động 1426 → Đại thắng Chi Lăng – Xương Giang 1427 → Thành lập triều Hậu Lê 1428.'
  },
  {
    id: 'q15',
    type: 'drag_sort',
    topicId: 'topic-5',
    topicTitle: 'Khám phá kiến trúc cổ',
    title: 'Sắp xếp không gian kiến trúc Đền thờ Nguyễn Xí từ ngoài vào trong',
    instruction: 'Sắp xếp các khu vực theo lộ trình bước chân của người tham quan từ ngoài cổng vào nơi thâm nghiêm nhất.',
    hint: 'Hồ nước phía trước ngoài cùng, trong cùng là nơi thờ tự linh thiêng.',
    options: [
      'Hồ bán nguyệt tụ thủy',
      'Nghi môn tứ trụ sừng sững',
      'Sân đền và tòa Tiền tế (Hạ điện)',
      'Trung điện',
      'Hậu cung (Thượng điện)'
    ],
    correctAnswer: [
      'Hồ bán nguyệt tụ thủy',
      'Nghi môn tứ trụ sừng sững',
      'Sân đền và tòa Tiền tế (Hạ điện)',
      'Trung điện',
      'Hậu cung (Thượng điện)'
    ],
    explanation: 'Lộ trình tham quan truyền thống: Hồ bán nguyệt → Nghi môn → Hạ điện → Trung điện → Thượng điện (Hậu cung).'
  },

  // 4. Fill in Blank (Dạng 4: Điền từ còn thiếu)
  {
    id: 'q16',
    type: 'fill_blank',
    topicId: 'topic-1',
    topicTitle: 'Nguyễn Xí là ai?',
    title: 'Điền tước vị cao quý của danh thần Nguyễn Xí',
    instruction: 'Nhập từ còn thiếu vào chỗ trống: Sau khi qua đời, ông được vua truy tặng tước hiệu "Thái sư ... Quốc công".',
    hint: 'Từ này có nghĩa là kiên định, mạnh mẽ, quật cường (chữ C).',
    fillPrompt: 'Thái sư [ ... ] Quốc công',
    correctAnswer: 'Cương',
    explanation: 'Nguyễn Xí được truy phong là "Thái sư Cương Quốc công", biểu dương lòng trung dũng và khí phách cương trực.'
  },
  {
    id: 'q17',
    type: 'fill_blank',
    topicId: 'topic-4',
    topicTitle: 'Lịch sử hình thành đền',
    title: 'Điền năm khởi công xây dựng đền',
    instruction: 'Nhập năm Đinh Hợi khi vua Lê Thánh Tông ban chỉ dụ cho xây dựng Đền thờ Nguyễn Xí (chỉ nhập 4 chữ số năm).',
    hint: 'Hai năm sau khi danh tướng Nguyễn Xí mất năm 1465.',
    fillPrompt: 'Năm khởi công xây dựng đền là: [ ... ]',
    correctAnswer: '1467',
    explanation: 'Đền thờ Nguyễn Xí được khởi dựng vào năm 1467, dưới thời trị vì của vua Lê Thánh Tông.'
  },
  {
    id: 'q18',
    type: 'fill_blank',
    topicId: 'topic-5',
    topicTitle: 'Khám phá kiến trúc cổ',
    title: 'Điền tên hồ nước phong thủy trước cổng đền',
    instruction: 'Nhập tên gọi của hồ nước có hình nửa vầng trăng nằm ngay trước cổng đền thờ.',
    hint: 'Hình dáng nửa vầng mặt trăng.',
    fillPrompt: 'Hồ [ ... ] nằm phía trước đền thờ',
    correctAnswer: 'bán nguyệt',
    explanation: 'Hồ bán nguyệt hình nửa vầng trăng trước đền tạo cảnh quan phong thủy tụ thủy sinh cát khí cho toàn bộ di tích.'
  },
  {
    id: 'q19',
    type: 'fill_blank',
    topicId: 'topic-6',
    topicTitle: 'Di tích quốc gia đặc biệt',
    title: 'Điền danh hiệu bảo tồn cao quý của di tích',
    instruction: 'Lăng mộ và Đền thờ Nguyễn Xí được Thủ tướng Chính phủ xếp hạng là Di tích quốc gia [ ... ].',
    hint: 'Hai chữ, cấp bậc xếp hạng di tích cao nhất tại Việt Nam.',
    fillPrompt: 'Di tích quốc gia [ ... ]',
    correctAnswer: 'đặc biệt',
    explanation: 'Năm 2020, di tích vinh dự được xếp hạng là "Di tích quốc gia đặc biệt".'
  },

  // 5. Drag Words into Sentence (Dạng 5: Kéo thả từ vào câu)
  {
    id: 'q20',
    type: 'drag_sentence',
    topicId: 'topic-4',
    topicTitle: 'Lịch sử hình thành đền',
    title: 'Hoàn chỉnh nhận định về thời điểm dựng đền',
    instruction: 'Chọn và điền các từ thích hợp từ ngân hàng từ vào các vị trí trống {1} và {2} trong câu.',
    hint: 'Gắn liền với năm 1467 và vua Lê Thánh Tông.',
    sentenceTemplate: 'Vào năm {blank1}, hoàng đế {blank2} đã ban sắc chỉ cho xuất ngân khố xây dựng đền thờ để tưởng nhớ công đức của danh tướng.',
    wordBank: ['1467', 'Lê Thánh Tông', '1428', 'Trần Nhân Tông'],
    blankCount: 2,
    correctAnswer: ['1467', 'Lê Thánh Tông'],
    explanation: 'Câu hoàn chỉnh: "Vào năm 1467, hoàng đế Lê Thánh Tông đã ban sắc chỉ cho xuất ngân khố xây dựng đền thờ..."'
  },
  {
    id: 'q21',
    type: 'drag_sentence',
    topicId: 'topic-1',
    topicTitle: 'Nguyễn Xí là ai?',
    title: 'Hoàn chỉnh thông tin về quê quán và tước hiệu',
    instruction: 'Điền hai từ thích hợp vào các vị trí trống {1} và {2}.',
    hint: 'Quê hương Nghi Lộc và tước hiệu Nghĩa Vương.',
    sentenceTemplate: 'Danh tướng Nguyễn Xí sinh ra tại vùng đất {blank1} xứ Nghệ và sau này được suy tôn tước hiệu {blank2}.',
    wordBank: ['Nghi Lộc', 'Nghĩa Vương', 'Côn Sơn', 'Đông Đô'],
    blankCount: 2,
    correctAnswer: ['Nghi Lộc', 'Nghĩa Vương'],
    explanation: 'Nguyễn Xí sinh ra tại Nghi Lộc xứ Nghệ và sau này được suy tôn tước hiệu Nghĩa Vương cao quý.'
  },
  {
    id: 'q22',
    type: 'drag_sentence',
    topicId: 'topic-5',
    topicTitle: 'Khám phá kiến trúc cổ',
    title: 'Điền tên họa tiết trang trí truyền thống',
    instruction: 'Điền các từ thích hợp để hoàn thiện câu miêu tả nghệ thuật điêu khắc gỗ.',
    hint: 'Gồm bốn loài linh vật cổ và hồ nước hình vầng trăng.',
    sentenceTemplate: 'Các bức chạm khắc trên gỗ lim tại đền thể hiện hình tượng {blank1} tinh xảo, phía trước đền là {blank2} tụ thủy.',
    wordBank: ['Tứ linh', 'Hồ bán nguyệt', 'Hoa bách hợp', 'Tháp tròn'],
    blankCount: 2,
    correctAnswer: ['Tứ linh', 'Hồ bán nguyệt'],
    explanation: 'Các bức cốn xà chạm khắc Tứ linh (Long, Ly, Quy, Phụng) công phu, phối hợp hài hòa cùng hồ bán nguyệt xanh mát.'
  },

  // 6. Matching Columns (Dạng 6: Ghép cột)
  {
    id: 'q23',
    type: 'matching',
    topicId: 'topic-1',
    topicTitle: 'Nhân vật & Sự kiện',
    title: 'Ghép mốc thời gian với sự kiện tương ứng',
    instruction: 'Nối từng mốc thời gian ở cột bên trái với sự kiện lịch sử chính xác ở cột bên phải.',
    hint: 'Mỗi mốc năm ứng với một dấu ấn không thể phai mờ.',
    matchingPairs: {
      left: [
        { id: 'l1', text: 'Năm 1397' },
        { id: 'l2', text: 'Năm 1418' },
        { id: 'l3', text: 'Năm 1465' },
        { id: 'l4', text: 'Năm 1467' }
      ],
      right: [
        { id: 'r1', text: 'Năm sinh của danh thần Nguyễn Xí' },
        { id: 'r2', text: 'Gia nhập cuộc khởi nghĩa Lam Sơn' },
        { id: 'r3', text: 'Nguyễn Xí tạ thế, triều đình làm quốc tang' },
        { id: 'r4', text: 'Vua Lê Thánh Tông ban lệnh dựng đền thờ' }
      ]
    },
    correctAnswer: {
      l1: 'r1',
      l2: 'r2',
      l3: 'r3',
      l4: 'r4'
    },
    explanation: 'Ghép đúng: 1397 (Năm sinh) - 1418 (Gia nhập Lam Sơn) - 1465 (Tạ thế) - 1467 (Xây dựng đền thờ).'
  },
  {
    id: 'q24',
    type: 'matching',
    topicId: 'topic-5',
    topicTitle: 'Khám phá kiến trúc cổ',
    title: 'Ghép các hạng mục kiến trúc với đặc điểm nhận biết',
    instruction: 'Nối tên hạng mục kiến trúc ở cột trái với vị trí và đặc điểm ở cột phải.',
    hint: 'Quan sát bố cục không gian từ ngoài cổng vào hậu cung.',
    matchingPairs: {
      left: [
        { id: 'l1', text: 'Hồ bán nguyệt' },
        { id: 'l2', text: 'Nghi môn tứ trụ' },
        { id: 'l3', text: 'Thượng điện' },
        { id: 'l4', text: 'Nội công ngoại quốc' }
      ],
      right: [
        { id: 'r1', text: 'Nằm phía trước đền, có hình nửa vầng trăng' },
        { id: 'r2', text: 'Cổng vào uy nghi với 4 cột trụ đắp câu đối' },
        { id: 'r3', text: 'Tòa nhà thâm nghiêm trong cùng thờ tượng danh tướng' },
        { id: 'r4', text: 'Bố cục mặt bằng tổng thể của khu đền' }
      ]
    },
    correctAnswer: {
      l1: 'r1',
      l2: 'r2',
      l3: 'r3',
      l4: 'r4'
    },
    explanation: 'Ghép đúng: Hồ bán nguyệt (phía trước đền) - Nghi môn tứ trụ (cổng vào) - Thượng điện (nơi thờ tự trong cùng) - Nội công ngoại quốc (bố cục đền).'
  },
  {
    id: 'q25',
    type: 'matching',
    topicId: 'topic-7',
    topicTitle: 'Gìn giữ di sản',
    title: 'Ghép hành động bảo tồn với ý nghĩa giáo dục',
    instruction: 'Nối từng hành vi bảo vệ di tích với giá trị mang lại cho cộng đồng.',
    hint: 'Mỗi hành động văn minh đều bồi đắp văn hóa truyền thống.',
    matchingPairs: {
      left: [
        { id: 'l1', text: 'Không viết, vẽ bậy lên cột gỗ' },
        { id: 'l2', text: 'Giữ gìn vệ sinh, không vứt rác' },
        { id: 'l3', text: 'Đi nhẹ, nói khẽ, trang phục chỉnh tề' },
        { id: 'l4', text: 'Kể cho bạn bè nghe về Nguyễn Xí' }
      ],
      right: [
        { id: 'r1', text: 'Bảo vệ nguyên vẹn các hiện vật điêu khắc cổ' },
        { id: 'r2', text: 'Giữ gìn cảnh quan di tích luôn sạch đẹp' },
        { id: 'r3', text: 'Thể hiện sự tôn kính nơi thờ tự trang nghiêm' },
        { id: 'r4', text: 'Lan tỏa niềm tự hào lịch sử dân tộc' }
      ]
    },
    correctAnswer: {
      l1: 'r1',
      l2: 'r2',
      l3: 'r3',
      l4: 'r4'
    },
    explanation: 'Tất cả các hành động văn minh trên đều góp phần thiết thực vào việc giữ gìn và phát huy giá trị của di tích quốc gia đặc biệt.'
  },

  // Additional diverse historical questions to reach 32 high quality questions
  {
    id: 'q26',
    type: 'single_choice',
    topicId: 'topic-1',
    topicTitle: 'Nguyễn Xí là ai?',
    title: 'Thụy hiệu được phong tặng cho Nguyễn Xí',
    instruction: 'Chọn thụy hiệu tôn vinh tấm lòng ngay thẳng, trung nghĩa vẹn toàn của Nguyễn Xí.',
    hint: 'Chữ Nghĩa gắn liền với phẩm chất trung trinh.',
    options: ['Nghĩa Vương', 'Trung Vương', 'Dũng Vương', 'Văn Vương'],
    correctAnswer: 'Nghĩa Vương',
    explanation: 'Với những cống hiến lớn lao cho giang sơn xã tắc, Nguyễn Xí được triều đình tôn vinh với thụy hiệu Nghĩa Vương.'
  },
  {
    id: 'q27',
    type: 'single_choice',
    topicId: 'topic-3',
    topicTitle: 'Người có công với quê hương',
    title: 'Vùng đất ven biển xứ Nghệ ghi đậm dấu ấn khai hoang của Nguyễn Xí',
    instruction: 'Chọn vùng đất địa đầu duyên hải xứ Nghệ gắn với công lao khai hoang lập ấp của danh tướng.',
    hint: 'Nổi tiếng với bãi biển đẹp và khu di tích Lăng mộ Đền thờ ngày nay.',
    options: ['Vùng duyên hải Nghi Lộc – Cửa Lò', 'Vùng Ba Bể', 'Vùng đất mũi Cà Mau', 'Vùng vịnh Hạ Long'],
    correctAnswer: 'Vùng duyên hải Nghi Lộc – Cửa Lò',
    explanation: 'Nguyễn Xí đã có công lớn quy tụ dân chúng, khai hoang lấn biển, biến vùng đất đầm lầy ven biển Nghi Lộc – Cửa Lò thành xóm làng trù phú.'
  },
  {
    id: 'q28',
    type: 'single_choice',
    topicId: 'topic-2',
    topicTitle: 'Khởi nghĩa Lam Sơn',
    title: 'Trận chiến lừng lẫy năm 1426 mà Nguyễn Xí tham gia chỉ huy',
    instruction: 'Chọn trận quyết chiến mở đường giải phóng Đông Quan năm 1426.',
    hint: 'Gắn liền với địa danh Ninh Kiều, Chúc Động.',
    options: ['Trận Tốt Động – Chúc Động', 'Trận Hàm Tử', 'Trận Chương Dương', 'Trận Như Nguyệt'],
    correctAnswer: 'Trận Tốt Động – Chúc Động',
    explanation: 'Trận Tốt Động – Chúc Động (1426) là chiến công vang dội, nơi Nguyễn Xí chỉ huy quân thiết đột tiêu diệt và bắt sống nhiều tướng giặc Minh.'
  },
  {
    id: 'q29',
    type: 'fill_blank',
    topicId: 'topic-1',
    topicTitle: 'Nguyễn Xí là ai?',
    title: 'Số đời vua Lê mà Nguyễn Xí đã phò tá',
    instruction: 'Nhập số lượng triều vua nhà Lê mà danh tướng Nguyễn Xí đã giữ vai trò phụ chính đại thần (nhập số hoặc chữ).',
    hint: 'Gồm Lê Thái Tổ, Lê Thái Tông, Lê Nhân Tông, Lê Thánh Tông.',
    fillPrompt: 'Số đời vua là: [ ... ]',
    correctAnswer: '4',
    explanation: 'Nguyễn Xí đã tận tụy phụng sự qua 4 đời hoàng đế thời Hậu Lê.'
  },
  {
    id: 'q30',
    type: 'multiple_choice',
    topicId: 'topic-6',
    topicTitle: 'Di tích quốc gia đặc biệt',
    title: 'Giá trị nổi bật của Lăng mộ và Đền thờ Nguyễn Xí',
    instruction: 'Chọn các giá trị tiêu biểu khiến di tích được công nhận là Di tích quốc gia đặc biệt.',
    hint: 'Gồm giá trị lịch sử, kiến trúc, văn hóa tâm linh và giáo dục truyền thống.',
    options: [
      'Giá trị lịch sử gắn liền với danh tướng khai quốc công thần thời Lê',
      'Giá trị kiến trúc nghệ thuật điêu khắc gỗ tinh xảo thời Hậu Lê và Nguyễn',
      'Giá trị giáo dục truyền thống yêu nước và đạo lý uống nước nhớ nguồn',
      'Nơi diễn ra các trận không chiến thời hiện đại',
      'Khu vui chơi giải trí cảm giác mạnh'
    ],
    correctAnswer: [
      'Giá trị lịch sử gắn liền với danh tướng khai quốc công thần thời Lê',
      'Giá trị kiến trúc nghệ thuật điêu khắc gỗ tinh xảo thời Hậu Lê và Nguyễn',
      'Giá trị giáo dục truyền thống yêu nước và đạo lý uống nước nhớ nguồn'
    ],
    explanation: 'Di tích mang trọn vẹn giá trị lịch sử kiệt xuất, kiến trúc điêu khắc cổ xưa và là địa chỉ đỏ giáo dục đạo lý truyền thống cho thế hệ trẻ.'
  },
  {
    id: 'q31',
    type: 'drag_sentence',
    topicId: 'topic-6',
    topicTitle: 'Di tích quốc gia đặc biệt',
    title: 'Hoàn thiện thông tin quyết định xếp hạng di tích',
    instruction: 'Điền ngày tháng năm và danh hiệu đúng vào câu.',
    hint: 'Ngày cuối cùng của năm 2020 và danh hiệu cao nhất.',
    sentenceTemplate: 'Vào ngày {blank1}, di tích đã chính thức được công nhận danh hiệu {blank2}.',
    wordBank: ['31/12/2020', 'Di tích quốc gia đặc biệt', '01/01/2000', 'Bảo vật cấp tỉnh'],
    blankCount: 2,
    correctAnswer: ['31/12/2020', 'Di tích quốc gia đặc biệt'],
    explanation: 'Ngày 31/12/2020, di tích được công nhận là Di tích quốc gia đặc biệt theo Quyết định số 2280/QĐ-TTg.'
  },
  {
    id: 'q32',
    type: 'single_choice',
    topicId: 'topic-7',
    topicTitle: 'Gìn giữ di sản',
    title: 'Lễ hội Đền thờ Nguyễn Xí thường được tổ chức vào dịp nào?',
    instruction: 'Chọn thời điểm diễn ra lễ hội truyền thống tưởng nhớ ngày mất của danh tướng.',
    hint: 'Vào những ngày đầu xuân năm mới, khoảng cuối tháng Giêng - đầu tháng Hai âm lịch.',
    options: [
      'Tháng Giêng – tháng Hai âm lịch hàng năm',
      'Vào dịp Tết Trung thu rằm tháng Tám',
      'Vào giữa mùa đông lạnh giá',
      'Chỉ tổ chức 10 năm một lần'
    ],
    correctAnswer: 'Tháng Giêng – tháng Hai âm lịch hàng năm',
    explanation: 'Lễ hội Đền thờ Nguyễn Xí được tổ chức trang trọng vào dịp đầu xuân (tháng Giêng - tháng Hai âm lịch) với các nghi lễ rước kiệu, tế lễ và trò chơi dân gian đặc sắc.'
  }
];

// Helper to sanitize questions for client (removes secret answers)
export function getSanitizedQuestions(): ClientQuestion[] {
  return SERVER_QUESTIONS.map((q) => {
    const { correctAnswer, explanation, ...clientQuestion } = q;
    return clientQuestion;
  });
}

// Verification function running only on server
export function verifyAnswer(
  questionId: string,
  userAnswer: any,
  attemptNumber: number
): { isCorrect: boolean; explanation: string; correctAnswer?: any } {
  const q = SERVER_QUESTIONS.find((item) => item.id === questionId);
  if (!q) {
    return { isCorrect: false, explanation: 'Câu hỏi không tồn tại.' };
  }

  let isCorrect = false;

  switch (q.type) {
    case 'single_choice': {
      isCorrect =
        typeof userAnswer === 'string' &&
        userAnswer.trim().toLowerCase() === String(q.correctAnswer).trim().toLowerCase();
      break;
    }

    case 'multiple_choice': {
      if (Array.isArray(userAnswer) && Array.isArray(q.correctAnswer)) {
        const sortedUser = [...userAnswer].map((s) => String(s).trim()).sort();
        const sortedCorrect = [...q.correctAnswer].map((s) => String(s).trim()).sort();
        isCorrect =
          sortedUser.length === sortedCorrect.length &&
          sortedUser.every((val, idx) => val === sortedCorrect[idx]);
      }
      break;
    }

    case 'drag_sort': {
      if (Array.isArray(userAnswer) && Array.isArray(q.correctAnswer)) {
        isCorrect =
          userAnswer.length === q.correctAnswer.length &&
          userAnswer.every((val, idx) => String(val).trim() === String(q.correctAnswer[idx]).trim());
      }
      break;
    }

    case 'fill_blank': {
      if (typeof userAnswer === 'string') {
        const normalize = (s: string) =>
          s
            .trim()
            .toLowerCase()
            .replace(/\s+/g, ' ')
            .normalize('NFC');
        isCorrect = normalize(userAnswer) === normalize(String(q.correctAnswer));
      }
      break;
    }

    case 'drag_sentence': {
      if (Array.isArray(userAnswer) && Array.isArray(q.correctAnswer)) {
        const normalize = (s: string) =>
          String(s)
            .trim()
            .toLowerCase()
            .normalize('NFC');
        isCorrect =
          userAnswer.length === q.correctAnswer.length &&
          userAnswer.every((val, idx) => normalize(val) === normalize(q.correctAnswer[idx]));
      }
      break;
    }

    case 'matching': {
      if (userAnswer && typeof userAnswer === 'object' && !Array.isArray(userAnswer)) {
        const expectedKeys = Object.keys(q.correctAnswer);
        isCorrect =
          expectedKeys.length === Object.keys(userAnswer).length &&
          expectedKeys.every((k) => String(userAnswer[k]).trim() === String(q.correctAnswer[k]).trim());
      }
      break;
    }
  }

  // Answer is revealed if correct OR if attemptNumber >= 2
  const shouldReveal = isCorrect || attemptNumber >= 2;

  return {
    isCorrect,
    explanation: q.explanation,
    correctAnswer: shouldReveal ? q.correctAnswer : undefined
  };
}
