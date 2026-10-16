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
    const { fullName, schoolName, className } = body || {};

    if (!fullName || typeof fullName !== 'string' || fullName.trim().length < 2) {
      return res.status(400).json({ success: false, data: null, message: 'Vui lòng nhập họ và tên hợp lệ (tối thiểu 2 ký tự).' });
    }

    if (!schoolName || typeof schoolName !== 'string' || schoolName.trim().length < 2) {
      return res.status(400).json({ success: false, data: null, message: 'Vui lòng nhập tên trường hợp lệ.' });
    }

    if (!className || typeof className !== 'string' || className.trim().length < 1) {
      return res.status(400).json({ success: false, data: null, message: 'Vui lòng nhập lớp học.' });
    }

    // Check suspicious characters
    if (/[<>{}$]/.test(fullName) || /[<>{}$]/.test(schoolName)) {
      return res.status(400).json({ success: false, data: null, message: 'Thông tin chứa ký tự không hợp lệ.' });
    }

    const { student, session } = globalStore.register(fullName, schoolName, className);

    // Forward async to Google Apps Script
    forwardToGoogleAppsScript('registerStudent', {
      studentId: student.studentId,
      createdAt: student.createdAt,
      fullName: student.fullName,
      schoolName: student.schoolName,
      className: student.className,
      publicDisplayName: student.publicDisplayName,
      sessionId: session.sessionId
    }).catch(() => {});

    return res.status(200).json({
      success: true,
      data: {
        student,
        session
      },
      message: 'Đăng ký thành công! Bắt đầu hành trình khám phá di sản.'
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      data: null,
      message: error?.message || 'Có lỗi xảy ra trong quá trình đăng ký.'
    });
  }
}
