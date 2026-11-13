export const GROUP_DATA = {
A: emptyWeeks(),
B: emptyWeeks(),
C: emptyWeeks(),
D: emptyWeeks(),
E: emptyWeeks(),
F: { template: {
  sat: {
    transform: 'translate(0,277)',
    slots: [
      { x: 827.200, y: 0, w: 125.660, h: 414.500 },
      { x: 679.788, y: 0, w: 145.688, h: 414.553 },
      { x: 534.546, y: 0, w: 145.165, h: 415.493 }
    ]
  },

  sun: {
    transform: 'translate(0,695)',
    slots: [
      { x: 408.034, y: 2, w: 125.939, h: 585.690 },
      { x: 148.370, y: 1, w: 258.447, h: 584.394 },
      { x: 0,       y: -4, w: 146.612, h: 590.059 }
    ]
  },

  tue: {
    transform: 'translate(0,1353)',
    slots: [
      { x: 827.649, y: 0, w: 124.751, h: 473.707 },
      { x: 534.547, y: 0, w: 144.607, h: 477.881 },
      { x: 409.566, y: 3, w: 122.531, h: 471.443 },
      { x: 280.077, y: 2, w: 125.407, h: 468.206 },
      { x: 148.754, y: 2, w: 127.537, h: 468.701 }
    ],
    // بديل: 4 slots (slot 3 عريض) — يُستخدم تلقائياً لو البيانات 4 عناصر
    wideSlots: [
      { x: 827.649, y: 0, w: 124.751, h: 473.707 },
      { x: 534.547, y: 0, w: 144.607, h: 477.881 },
      { x: 409.566, y: 3, w: 122.531, h: 471.443 },
      { x: 148.754, y: 2, w: 252.937, h: 468.701 }
    ]
  },

  wed: {
    transform: 'translate(0,1828)',
    slots: [
      { x: 828.759, y: 0, w: 123.080, h: 417.683 },
      { x: 680.349, y: 0, w: 148.764, h: 416.255 }
    ]
  }
};
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