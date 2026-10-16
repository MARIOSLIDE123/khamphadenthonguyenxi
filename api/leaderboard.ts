import { globalStore } from './_lib/store';

export default async function handler(req: any, res: any) {
  try {
    const studentId = (req.query?.studentId || req.body?.studentId || '') as string;
    const schoolFilter = (req.query?.school || req.body?.school || '') as string;

    let leaderboard = globalStore.getLeaderboard(studentId);

    if (schoolFilter && typeof schoolFilter === 'string' && schoolFilter.trim()) {
      const q = schoolFilter.trim().toLowerCase();
      leaderboard = leaderboard.filter((item) => item.schoolName.toLowerCase().includes(q));
    }

    return res.status(200).json({
      success: true,
      data: {
        leaderboard,
        totalLearners: leaderboard.length,
        updatedAt: new Date().toISOString()
      },
      message: 'Tải bảng xếp hạng thành công.'
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      data: null,
      message: error?.message || 'Có lỗi xảy ra khi truy xuất bảng xếp hạng.'
    });
  }
}
