export const GROUP_DATA = {
A: emptyWeeks(),
B: emptyWeeks(),
C: emptyWeeks(),
D: emptyWeeks(),
E: emptyWeeks(),
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