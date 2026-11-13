// ============================================
// groups-data.js - بيانات الأسابيع لكل مجموعة
// ============================================
//
// صيغة كل خلية (cell):
//   'o'                                    → rect شفاف عادي
//   'x'                                    → rect ممتلئ بلون أبيض (شبح)
//   { cls: 'm l', href: 'path/to/file' }   → رابط ملف قابل للضغط
//
// أيام الأسبوع: sat / sun / tue / wed
// الأسبوع: رقم (1 - 9)
// ============================================

// ------------------------------------------------------------------
// ⚠️ للمجموعات A, B, C, D, E: البيانات أدناه Placeholder (كلها 'o')
//    عدّلها بالبيانات الحقيقية متى كانت جاهزة
// ------------------------------------------------------------------

const emptyWeeks = () => ({
  9: { sat: ['o','o','o'], sun: ['o','o','o'], tue: ['o','o','o','o'],     wed: ['o','o'] },
  8: { sat: ['o','o','o'], sun: ['o','o','o'], tue: ['o','o','o','o'],     wed: ['o','o'] },
  7: { sat: ['o','o','o'], sun: ['o','o','o'], tue: ['o','o','o','o'],     wed: ['o','o'] },
  6: { sat: ['o','o','o'], sun: ['o','o','o'], tue: ['o','o','o','o','o'], wed: ['o','o'] },
  5: { sat: ['o','o','o'], sun: ['o','o','o'], tue: ['o','o','o','o','o'], wed: ['o','o'] },
  4: { sat: ['o','o','o'], sun: ['o','o','o'], tue: ['o','o','o','o','o'], wed: ['o','o'] },
  3: { sat: ['o','o','o'], sun: ['o','o','o'], tue: ['o','o','o','o','o'], wed: ['o','o'] },
  2: { sat: ['o','o','o'], sun: ['o','o','o'], tue: ['o','o','o','o','o'], wed: ['o','o'] },
  1: { sat: ['o','o','o'], sun: ['o','o','o'], tue: ['o','o','o','o','o'], wed: ['o','o'] }
});

export const GROUP_DATA = {
  A: emptyWeeks(),
  B: emptyWeeks(),
  C: emptyWeeks(),
  D: emptyWeeks(),
  E: emptyWeeks(),

  // ✅ مجموعة F - بيانات كاملة مستخرجة من SVG الأصلي
  F: {
    9: {
      sat: ['o','o','o'],
      sun: ['o','o','o'],
      tue: ['o','o','o','o'],
      wed: ['o','o']
    },
    8: {
      sat: ['o','o','o'],
      sun: ['o','o','o'],
      tue: ['o','o','o','x'],
      wed: [
        { cls: 'm l', href: './Precalculus/Lecture/Matrix.pdf' },
        { cls: 'm l', href: './Introduction to Computing/Lecture/c_overview-am.pdf' }
      ]
    },
    7: {
      sat: ['o','x','x'],
      sun: ['x','x','x'],
      tue: ['x','x','x','x'],
      wed: [
        { cls: 'm l', href: './Introduction to Computing/Lecture/Problem Solving.pdf' },
        'x'
      ]
    },
    6: {
      sat: ['o','o','o'],
      sun: ['o','o','o'],
      tue: ['o','o','o','o','o'],
      wed: ['o','o']
    },
    5: {
      sat: ['o','o','o'],
      sun: ['o', { cls: 'm l', href: './Business/Lecture/04.pdf' }, 'o'],
      tue: ['o','o','o','o','o'],
      wed: ['o','o']
    },
    4: {
      sat: ['o','o','o'],
      sun: ['o', { cls: 'm l', href: './Business/Lecture/03.pdf' }, 'o'],
      tue: ['o','o','o','o','o'],
      wed: ['o','o']
    },
    3: {
      sat: ['o','o','o'],
      sun: ['o', { cls: 'm l', href: './Business/Lecture/02.pdf' }, 'o'],
      tue: ['o','o','o','o','o'],
      wed: ['o','o']
    },
    2: {
      sat: ['o','o','o'],
      sun: ['o', { cls: 'm l', href: './Business/Lecture/01.pdf' }, 'o'],
      tue: ['o','o','o','o','o'],
      wed: ['o','o']
    },
    1: {
      sat: ['o','o','o'],
      sun: ['o','o','o'],
      tue: ['o','o','o','o','o'],
      wed: ['o','o']
    }
  }
};