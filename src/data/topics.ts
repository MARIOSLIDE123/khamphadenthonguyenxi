import { TopicItem } from '../types';

export const TOPICS_DATA: TopicItem[] = [
  {
    id: 'topic-1',
    number: 1,
    title: 'Nguyễn Xí là ai?',
    shortDesc: 'Vị danh tướng khai quốc tài ba, phụ chính đại thần qua bốn triều vua thời Hậu Lê.',
    period: 'Thời kỳ Hậu Lê (1397 – 1465)',
    imageUrl: '/images/topics/topic-1.jpg',
    imageCaption: 'Tượng đồng thờ Thái sư Cương Quốc công Nguyễn Xí uy nghiêm tại đền thờ.',
    audioUrl: '/audio/topics/topic-1.wav',
    contentParagraphs: [
      'Nguyễn Xí (1397 – 1465) sinh ra tại làng Thượng Xá, nay thuộc xã Khánh Hợp (trước đây là xã Nghi Hợp), huyện Nghi Lộc, tỉnh Nghệ An. Từ nhỏ, ông đã nổi tiếng thông minh, nhanh nhẹn, giàu lòng quả cảm và có chí lớn.',
      'Ông là một trong những vị khai quốc công thần kiệt xuất nhất của triều đại Hậu Lê. Với tài thao lược quân sự và lòng trung kiên bất khuất, Nguyễn Xí đã phụng sự và giữ trọng trách phụ chính đại thần qua bốn đời vua Lê: Lê Thái Tổ, Lê Thái Tông, Lê Nhân Tông và vua Lê Thánh Tông.',
      'Sau khi qua đời, ông được triều đình truy tặng nhiều tước hiệu cao quý, trong đó có Thái sư Cương Quốc công, và về sau được suy tôn tước Nghĩa Vương. Lòng trung nghĩa và tài năng của ông trở thành tấm gương sáng ngời trong lịch sử dựng nước và giữ nước của dân tộc Việt Nam.'
    ],
    keyFacts: [
      'Sinh năm 1397 – Mất năm 1465 tại Nghệ An.',
      'Phụng sự xuất sắc qua 4 đời vua nhà Lê.',
      'Tước vị danh xưng cao quý: Thái sư Cương Quốc công, Nghĩa Vương.',
      'Là danh tướng văn võ song toàn, một lòng vì nước vì dân.'
    ],
    interactivePrompt: {
      question: 'Danh tướng Nguyễn Xí sinh vào năm nào và mất vào năm nào?',
      options: ['1397 – 1465', '1400 – 1470', '1390 – 1455', '1428 – 1467'],
      correctIndex: 0,
      explanation: 'Chính xác! Nguyễn Xí sinh năm 1397 và qua đời năm 1465, hưởng thọ 68 tuổi.'
    },
    mindMapKey: 'nguyen-xi'
  },
  {
    id: 'topic-2',
    number: 2,
    title: 'Nguyễn Xí và khởi nghĩa Lam Sơn',
    shortDesc: 'Người gắn bó từ những ngày đầu nếm mật nằm gai cùng Bình Định Vương Lê Lợi.',
    period: 'Giai đoạn khởi nghĩa (1418 – 1427)',
    imageUrl: '/images/topics/topic-2.png',
    imageCaption: 'Hình ảnh tái hiện nghĩa sĩ Nguyễn Xí yết kiến chủ tướng Lê Lợi, tham gia nghĩa quân Lam Sơn.',
    audioUrl: '/audio/topics/topic-2.wav',
    contentParagraphs: [
      'Khi giặc Minh xâm lược bờ cõi nước ta, gieo rắc bao nỗi lầm than cho nhân dân, Nguyễn Xí cùng anh trai là Nguyễn Biện đã sớm tìm đến Lam Sơn (Thanh Hóa) theo phò tá chủ tướng Lê Lợi dấy binh cứu nước.',
      'Nguyễn Xí được Lê Lợi đặc biệt tin yêu, coi như con nuôi và giao trọng trách chỉ huy đội quân thiết đột tinh nhuệ. Ông nổi tiếng mưu lược, huấn luyện đội quân thiện chiến lập nên những kỳ tích vang dội.',
      'Trong các trận đánh quyết định như trận Tốt Động – Chúc Động (1426) và trận Chi Lăng – Xương Giang (1427), Nguyễn Xí đã lập nhiều chiến công hiển hách, bắt sống nhiều tướng giặc, góp phần đập tan quân xâm lược Minh và mở ra nền độc lập cho Đại Việt.'
    ],
    keyFacts: [
      'Sớm gia nhập nghĩa quân Lam Sơn từ những ngày đầu gian khó.',
      'Được vua Lê Lợi hết mực tin cậy và trao quyền chỉ huy đội quân thiết đột.',
      'Góp công đầu trong các chiến thắng lịch sử Tốt Động – Chúc Động, Chi Lăng – Xương Giang.',
      'Biểu tượng cho tinh thần dũng cảm, mưu trí và lòng yêu nước sâu sắc.'
    ],
    interactivePrompt: {
      question: 'Trận đánh lớn nào ghi dấu công lao hiển hách của Nguyễn Xí trong việc đánh tan quân Minh?',
      options: [
        'Trận Bạch Đằng năm 938',
        'Trận Tốt Động – Chúc Động và Chi Lăng – Xương Giang',
        'Trận Rạch Gầm – Xoài Mút',
        'Trận Ngọc Hồi – Đống Đa'
      ],
      correctIndex: 1,
      explanation: 'Rất chuẩn xác! Nguyễn Xí lập đại công trong trận Tốt Động – Chúc Động (1426) và Chi Lăng – Xương Giang (1427) trong khởi nghĩa Lam Sơn.'
    },
    mindMapKey: 'lam-son'
  },
  {
    id: 'topic-3',
    number: 3,
    title: 'Người có công với quê hương',
    shortDesc: 'Vị đại thần khai hoang lập ấp, đắp đê ngăn mặn và đem lại cuộc sống thái bình cho nhân dân.',
    period: 'Thời kỳ kiến thiết đất nước (1428 – 1465)',
    imageUrl: '/images/topics/topic-3.png',
    imageCaption: 'Hình tượng danh tướng Nguyễn Xí cùng đội khuyển binh tinh nhuệ bảo vệ giang sơn (Việt Sử Kiêu Hùng).',
    audioUrl: '/audio/topics/topic-3.wav',
    contentParagraphs: [
      'Người có công với đất nước không chỉ thể hiện ở tài thao lược nơi trận mạc, mà còn ở tình yêu thương đồng bào và những việc làm thiết thực trong hòa bình. Danh tướng Nguyễn Xí là hình mẫu tiêu biểu cho tinh thần ấy.',
      'Về lại quê hương xứ Nghệ, ông đã hướng dẫn nhân dân khai hoang mở đất, lấn biển, lập nên nhiều làng mạc trù phú tại vùng duyên hải Nghi Lộc, Cửa Lò ngày nay.',
      'Ông còn cho đắp đê ngăn nước mặn, khơi thông kênh mương dẫn nước ngọt tưới tiêu đồng ruộng, mở chợ búa giao thương và xây dựng cầu cống đi lại. Nhờ đó, xóm làng trở nên no ấm, mùa màng tươi tốt, nhân dân đời đời ghi nhớ công ơn.'
    ],
    keyFacts: [
      'Chiêu mộ dân nghèo, khai hoang lấn biển tạo lập xóm làng trù phú.',
      'Chỉ đạo đắp đê ngăn mặn, đào kênh dẫn thủy nhập điền phát triển nông nghiệp.',
      'Xây cầu, mở chợ, khuyến khích sản xuất và đời sống bình an cho bà con.',
      'Khắc sâu bài học: Anh hùng không chỉ đánh giặc giỏi mà còn chăm lo đời sống nhân dân.'
    ],
    interactivePrompt: {
      question: 'Đóng góp nổi bật của Nguyễn Xí đối với quê hương trong thời bình là gì?',
      options: [
        'Xây dựng các pháo đài quân sự kiên cố',
        'Khai hoang lấn biển, đắp đê ngăn mặn và chăm lo đời sống người dân',
        'Mở rộng các hầm mỏ khai thác vàng',
        'Thu thuế mùa màng thật nhiều'
      ],
      correctIndex: 1,
      explanation: 'Đúng rồi! Ông luôn đau đáu với đời sống nhân dân, giúp dân khai hoang, đắp đê ngăn mặn và lập làng ấm no.'
    },
    mindMapKey: 'que-huong'
  },
  {
    id: 'topic-4',
    number: 4,
    title: 'Lịch sử hình thành Đền thờ Nguyễn Xí',
    shortDesc: 'Sắc chỉ tôn vinh của vua Lê Thánh Tông dành cho bậc danh thần phụ chính.',
    period: 'Xây dựng năm Đinh Hợi (1467)',
    imageUrl: '/images/topics/topic-4.png',
    imageCaption: 'Tư liệu ảnh xưa quý giá về Lăng mộ và Đền thờ Thái sư Cương Quốc công Nguyễn Xí.',
    audioUrl: '/audio/topics/topic-4.wav',
    contentParagraphs: [
      'Năm 1465, Thái sư Nguyễn Xí tạ thế trong niềm tiếc thương vô hạn của triều đình và trăm họ. Vua Lê Thánh Tông vô cùng thương xót, cho cử quốc tang và truy phong những phẩm hàm cao nhất.',
      'Đến năm Đinh Hợi (1467) – hai năm sau ngày danh tướng qua đời, vua Lê Thánh Tông đã ban sắc chỉ hạ lệnh cho quân dân trích quốc khố và công sức xây dựng khu lăng mộ và đền thờ trang nghiêm ngay trên chính quê hương ông.',
      'Cần ghi nhớ mốc thời gian quan trọng: Danh tướng Nguyễn Xí mất năm 1465, còn Đền thờ được khởi công xây dựng vào năm 1467 theo lệnh vua Lê Thánh Tông. Đây là minh chứng sâu sắc cho sự tri ân của triều đình đối với bậc trung thần kiệt xuất.'
    ],
    keyFacts: [
      'Nguyễn Xí mất năm 1465.',
      'Đền thờ được xây dựng năm 1467 theo sắc chỉ của vua Lê Thánh Tông.',
      'Phân biệt rõ: Năm mất (1465) khác với Năm xây đền (1467).',
      'Được xếp hạng di tích văn hóa lịch sử lâu đời trải qua hơn 550 năm bảo tồn.'
    ],
    interactivePrompt: {
      question: 'Đền thờ Nguyễn Xí được xây dựng vào năm nào theo sắc chỉ của ai?',
      options: [
        'Năm 1465 theo lệnh vua Lê Thái Tổ',
        'Năm 1467 theo lệnh vua Lê Thánh Tông',
        'Năm 1428 theo lệnh vua Lê Thái Tông',
        'Năm 1475 theo lệnh vua Lê Nhân Tông'
      ],
      correctIndex: 1,
      explanation: 'Chính xác! Đền thờ được xây dựng vào năm 1467 theo sắc chỉ của vua Lê Thánh Tông (hai năm sau khi Nguyễn Xí mất năm 1465).'
    },
    mindMapKey: 'lich-su-den'
  },
  {
    id: 'topic-5',
    number: 5,
    title: 'Khám phá kiến trúc cổ',
    shortDesc: 'Chiêm ngưỡng bố cục "Nội công ngoại quốc" và nghệ thuật chạm khắc tinh hoa thời Hậu Lê.',
    period: 'Nghệ thuật kiến trúc truyền thống',
    imageUrl: '/images/topics/topic-5.jpg',
    imageCaption: 'Cổng Nghi môn uy nghi, cổ kính với nghệ thuật kiến trúc đặc trưng tại Đền thờ Nguyễn Xí.',
    audioUrl: '/audio/topics/topic-5.wav',
    contentParagraphs: [
      'Đền thờ Nguyễn Xí được thiết kế theo lối kiến trúc truyền thống "Nội công ngoại quốc" bề thế và thâm nghiêm. Không gian tổng thể được quy hoạch hài hòa giữa cảnh quan thiên nhiên và các công trình thờ tự.',
      'Phía trước đền là hồ bán nguyệt xanh mát, mang ý nghĩa tụ thủy tụ phúc. Tiếp theo là hệ thống nghi môn tứ trụ uy nghi, đắp nổi câu đối và các biểu tượng mây lành.',
      'Khuôn viên gồm Tiền tế (Hạ điện), Trung điện và Hậu cung (Thượng điện). Các vì kèo, xà gỗ đều được bàn tay nghệ nhân chạm khắc kênh bong hình tượng Tứ linh (Long, Ly, Quy, Phụng), hoa sen, lá lật và hoa văn mây lửa vô cùng tinh xảo, phản ánh tài hoa kiến trúc đỉnh cao thời Hậu Lê và triều Nguyễn sau này.'
    ],
    keyFacts: [
      'Bố cục kiến trúc cổ kính theo lối "Nội công ngoại quốc".',
      'Phía trước có hồ bán nguyệt tạo thế phong thủy tụ thủy sinh tài.',
      'Nghi môn tứ trụ sừng sững dẫn vào Hạ điện, Trung điện và Thượng điện.',
      'Nghệ thuật chạm trổ điêu luyện hình tượng Tứ linh, hoa cỏ và mây lửa trên gỗ lim truyền thống.'
    ],
    interactivePrompt: {
      question: 'Bố cục mặt bằng kiến trúc đặc sắc của Đền thờ Nguyễn Xí thuộc dạng nào?',
      options: [
        'Kiểu chữ Nhất đơn lẻ',
        'Kiểu Nội công ngoại quốc',
        'Kiểu nhà sàn phương Nam',
        'Kiểu tháp hình tròn'
      ],
      correctIndex: 1,
      explanation: 'Đúng vậy! Đền thờ Nguyễn Xí được xây dựng theo kiểu "Nội công ngoại quốc" đặc trưng của các công trình đền chùa lớn thời phong kiến.'
    },
    mindMapKey: 'kien-truc'
  },
  {
    id: 'topic-6',
    number: 6,
    title: 'Di tích quốc gia đặc biệt',
    shortDesc: 'Niềm tự hào to lớn của quê hương xứ Nghệ và kho tàng di sản vô giá của dân tộc.',
    period: 'Vinh danh ngày 31/12/2020',
    imageUrl: '/images/topics/topic-6.jpg',
    imageCaption: 'Di tích quốc gia đặc biệt Đền thờ Nguyễn Xí – biểu tượng trường tồn của lòng tri ân và tự hào lịch sử.',
    audioUrl: '/audio/topics/topic-6.wav',
    contentParagraphs: [
      'Trải qua hơn 550 năm với bao thăng trầm của lịch sử và thời gian, di tích Lăng mộ và Đền thờ Nguyễn Xí vẫn được các thế hệ con cháu và nhân dân địa phương nâng niu, giữ gìn gần như nguyên vẹn vẻ trang nghiêm cổ kính.',
      'Ghi nhận giá trị lịch sử, văn hóa và nghệ thuật kiến trúc đặc sắc này, ngày 31/12/2020, Thủ tướng Chính phủ nước Cộng hòa Xã hội Chủ nghĩa Việt Nam đã ký Quyết định số 2280/QĐ-TTg chính thức xếp hạng Lăng mộ và Đền thờ Nguyễn Xí là Di tích quốc gia đặc biệt.',
      'Đây là niềm vinh dự, tự hào lớn lao không chỉ của dòng tộc họ Nguyễn Đình, của nhân dân huyện Nghi Lộc, tỉnh Nghệ An, mà còn là trách nhiệm chung của toàn thể thế hệ trẻ trong việc chung tay bảo tồn di sản.'
    ],
    keyFacts: [
      'Được Thủ tướng Chính phủ ký Quyết định số 2280/QĐ-TTg ngày 31/12/2020.',
      'Xếp hạng Di tích quốc gia đặc biệt – cấp bảo tồn cao nhất của Nhà nước.',
      'Khẳng định giá trị to lớn về lịch sử, kiến trúc nghệ thuật và giáo dục truyền thống.',
      'Là địa chỉ đỏ giáo dục lòng yêu nước cho thế hệ trẻ hôm nay và mai sau.'
    ],
    interactivePrompt: {
      question: 'Lăng mộ và Đền thờ Nguyễn Xí được Thủ tướng Chính phủ xếp hạng Di tích quốc gia đặc biệt vào thời gian nào?',
      options: [
        'Ngày 31/12/2020 (Quyết định số 2280/QĐ-TTg)',
        'Ngày 01/01/2015',
        'Ngày 19/05/2018',
        'Ngày 02/09/2022'
      ],
      correctIndex: 0,
      explanation: 'Chính xác! Di tích được đón nhận danh hiệu Di tích quốc gia đặc biệt vào ngày 31/12/2020 theo Quyết định số 2280/QĐ-TTg.'
    },
    mindMapKey: 'di-tich-dac-biet'
  },
  {
    id: 'topic-7',
    number: 7,
    title: 'Em làm gì để gìn giữ di sản?',
    shortDesc: 'Hành động nhỏ, ý nghĩa lớn – Văn hóa ứng xử văn minh và trách nhiệm với di tích văn hóa.',
    period: 'Hành động của thế hệ trẻ hôm nay',
    imageUrl: '/images/topics/topic-7.jpg',
    imageCaption: 'Không gian thờ tự tôn nghiêm, thanh tịnh cần được trân trọng và gìn giữ cho muôn đời sau.',
    audioUrl: '/audio/topics/topic-7.wav',
    contentParagraphs: [
      'Mỗi di tích lịch sử là một viên ngọc quý chứa đựng linh hồn, trí tuệ và công sức của tổ tiên để lại. Khi đến thăm Đền thờ Nguyễn Xí hay bất kỳ di tích lịch sử nào, chúng ta cần thể hiện văn hóa ứng xử văn minh, tôn trọng và trân quý.',
      'Học sinh và người tham quan cần thực hiện đúng các quy định: mặc trang phục trang nghiêm, lịch sự; giữ trật tự nơi thờ tự, không nô đùa chạy nhảy làm ảnh hưởng không gian tôn nghiêm.',
      'Tuyệt đối không xả rác bừa bãi, không sờ tay hay leo trèo lên các linh vật đá, không viết vẽ bậy lên cột gỗ, tường gạch hay bia đá cổ. Đồng thời, hãy tích cực học tập, tìm hiểu lịch sử và kể cho bạn bè nghe những câu chuyện đẹp về di sản quê hương.'
    ],
    keyFacts: [
      'Trang phục chỉnh tề, giữ thái độ tôn nghiêm, đi nhẹ nói khẽ.',
      'Không xả rác, chung tay giữ gìn vệ sinh và cảnh quan xanh sạch đẹp.',
      'Bảo vệ từng nét chạm khắc, bia đá, không viết vẽ hoặc làm hư hại hiện vật.',
      'Chủ động học hỏi lịch sử và lan tỏa niềm tự hào di sản đến mọi người.'
    ],
    interactivePrompt: {
      question: 'Hành động nào sau đây là văn minh và đúng đắn khi đến thăm Đền thờ Nguyễn Xí?',
      options: [
        'Chạy nhảy, viết tên kỷ niệm lên cột gỗ của đền',
        'Ăn quà vặt và vứt rác ở sân đền',
        'Mặc trang phục lịch sự, đi nhẹ nói khẽ, giữ gìn vệ sinh và không sờ hiện vật',
        'Hái hoa bẻ cành quanh hồ bán nguyệt mang về làm quà'
      ],
      correctIndex: 2,
      explanation: 'Xuất sắc! Luôn ăn mặc lịch sự, đi nhẹ nói khẽ, giữ vệ sinh và bảo vệ hiện vật là hành động chuẩn mực của người yêu di sản.'
    },
    mindMapKey: 'gin-giu-di-san'
  }
];

export const HISTORICAL_SOURCES = [
  {
    title: 'Cục Di sản văn hóa – Bộ Văn hóa, Thể thao và Du lịch',
    url: 'https://dsvh.gov.vn/lang-mo-va-den-tho-nguyen-xi-tinh-nghe-an-3309',
    note: 'Tư liệu chính thức về Lăng mộ và Đền thờ Nguyễn Xí, tỉnh Nghệ An'
  },
  {
    title: 'Cổng thông tin Du lịch Nghệ An (Visit Nghe An)',
    url: 'https://visitnghean.gov.vn/diem-tham-quan/lang-mo-va-den-tho-nguyen-xi',
    note: 'Giới thiệu điểm tham quan Di tích quốc gia đặc biệt'
  },
  {
    title: 'Lễ hội Đền thờ Nguyễn Xí – Du lịch Nghệ An',
    url: 'https://visitnghean.gov.vn/su-kien/le-hoi-den-tho-nguyen-xi.html',
    note: 'Lễ hội truyền thống tưởng nhớ công đức Thái sư Cương Quốc công'
  }
];
