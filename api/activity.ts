import { globalStore } from './_lib/store';
import { forwardToGoogleAppsScript } from './_lib/googleSheetsService';

export default async function handler(req: any, res: any) {
  if (res && res.setHeader) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  }

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, data: null, message: 'Chỉ chấp nhận phương thức POST.' });
  }

  try {
    let body = req.body;
    if (typeof body === 'string') {
      try {
        body = JSON.parse(body);
      } catch {}
    }
    const { sessionId, studentId, activityId, activityType, transactionId } = body || {};

    if (!sessionId || !studentId || !activityId || !activityType || !transactionId) {
      return res.status(400).json({
        success: false,
        data: null,
        message: 'Thiếu thông tin hoạt động hoặc mã giao dịch.'
      });
    }

    const result = globalStore.recordActivity(
      sessionId,
      studentId,
      activityId,
      activityType,
      transactionId
    );

    // Sync to Google Apps Script
    forwardToGoogleAppsScript('recordActivity', {
      eventId: transactionId,
      sessionId,
      studentId,
      activityId,
      activityType,
      pointsAwarded: result.pointsAwarded,
      totalScore: result.totalScore,
      createdAt: new Date().toISOString()
    }).catch(() => {});

    return res.status(200).json({
      success: true,
      data: result,
      message: result.message
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      data: null,
      message: error?.message || 'Có lỗi xảy ra khi ghi nhận hoạt động.'
    });
  }
}
