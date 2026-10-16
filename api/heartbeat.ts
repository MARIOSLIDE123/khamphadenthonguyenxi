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
    const { sessionId, studentId, seconds = 30 } = body || {};

    if (!sessionId || !studentId) {
      return res.status(400).json({ success: false, data: null, message: 'Thiếu mã phiên hoặc mã người học.' });
    }

    const result = globalStore.heartbeat(sessionId, Number(seconds) || 30);

    if (!result.success) {
      return res.status(200).json({ success: true, data: { activeSeconds: 0 }, message: 'Session noted' });
    }

    forwardToGoogleAppsScript('recordHeartbeat', {
      sessionId,
      studentId,
      activeSeconds: result.activeSeconds,
      timestamp: new Date().toISOString()
    }).catch(() => {});

    return res.status(200).json({
      success: true,
      data: {
        activeSeconds: result.activeSeconds
      },
      message: 'OK'
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      data: null,
      message: error?.message || 'Có lỗi xảy ra khi cập nhật thời gian học.'
    });
  }
}
