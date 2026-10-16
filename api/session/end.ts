import { globalStore } from '../_lib/store';
import { forwardToGoogleAppsScript } from '../_lib/googleSheetsService';

export default async function handler(req: any, res: any) {
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, data: null, message: 'Chỉ chấp nhận phương thức POST.' });
  }

  try {
    const { sessionId, studentId } = req.body || {};

    if (!sessionId) {
      return res.status(400).json({ success: false, data: null, message: 'Thiếu mã phiên làm việc.' });
    }

    const result = globalStore.endSession(sessionId);

    forwardToGoogleAppsScript('endSession', {
      sessionId,
      studentId,
      endedAt: new Date().toISOString(),
      activeSeconds: result.activeSeconds,
      totalScore: result.totalScore
    }).catch(() => {});

    return res.status(200).json({
      success: true,
      data: result,
      message: 'Phiên học đã kết thúc và được lưu lại an toàn.'
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      data: null,
      message: error?.message || 'Có lỗi xảy ra khi kết thúc phiên học.'
    });
  }
}
