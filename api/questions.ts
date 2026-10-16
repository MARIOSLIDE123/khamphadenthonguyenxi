import { getSanitizedQuestions } from './_lib/questions';

export default async function handler(req: any, res: any) {
  if (res && res.setHeader) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  }

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    const questions = getSanitizedQuestions();
    return res.status(200).json({
      success: true,
      data: {
        questions,
        total: questions.length
      },
      message: 'OK'
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      data: null,
      message: error?.message || 'Có lỗi xảy ra khi tải ngân hàng câu hỏi.'
    });
  }
}
