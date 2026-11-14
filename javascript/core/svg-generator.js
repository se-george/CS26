import { WEEK_SPACING } from './groups-data.js';

const DEFAULT_SLOT_CLASS = 'o';

/**
 * استخراج (cls, href) من أي شكل ممكن للـ item:
 *  - null/undefined      → cls = 'o' افتراضي
 *  - 'o' / 'x' (string)  → cls = نفس الـ string
 *  - { cls?, href? }     → cls = item.cls أو 'o' لو مش موجود
 */
function getAttrs(item) {
  if (item == null) return { cls: DEFAULT_SLOT_CLASS, href: '' };
  if (typeof item === 'string') return { cls: item || DEFAULT_SLOT_CLASS, href: '' };
  return {
    cls: item.cls || DEFAULT_SLOT_CLASS,
    href: item.href || '',
  };
}

/** يرسم rect واحدة بصيغة المشروع (data-hrsf بدل <a>) */
function rect(x, y, w, h, cls, href) {
  const attr = href ? ` data-href="${href}"` : '';
  return `<rect x="${x}" y="${y}" width="${w}" height="${h}" class="${cls}"${attr}/>`;
}

/**
 * يرسم slot واحدة.
 *  - لو item مصفوفة → يقسم الـ slot رأسياً بالتساوي بين الأجزاء.
 *  - لو مصفوفة فاضية → يرسم slot الافتراضية بكلاس 'o'.
 *  - غير كده → rect واحدة بالكلاس/الرابط المناسب.
 */
function renderSlot(c, item) {
  // حالة التقسيم
  if (Array.isArray(item)) {
    const n = item.length;
    if (n === 0) {
      return rect(c.x, c.y, c.w, c.h, DEFAULT_SLOT_CLASS, '');
    }
    return item.map((part, i) => {
      const { cls, href } = getAttrs(part);
      const h = c.h / n;
      const y = c.y + i * h;
      return rect(c.x, y, c.w, h, cls, href);
    }).join('');
  }

  // حالة slot واحدة
  const { cls, href } = getAttrs(item);
  return rect(c.x, c.y, c.w, c.h, cls, href);
}

export function generateGroupSVG(groupLetter, group) {
  if (!group || !group.template) {
    console.warn(`⚠️ المجموعة ${groupLetter} مش جاهزة (مفيش template)`);
    return '';
  }

  const template = group.template;

  const weekNums = Object.keys(group)
    .filter(k => k !== 'template')
    .map(Number)
    .sort((a, b) => b - a);

  if (weekNums.length === 0) return '';

  const maxWeek = Math.max(...weekNums);
  const outerX = (maxWeek + 1) * WEEK_SPACING;
  let out = `<g transform="translate(${outerX},0)">`;

  for (const N of weekNums) {
    out += `<g transform="translate(${-N * WEEK_SPACING},0)">`;
    out += `<image data-src="image/${groupLetter}/01.webp" width="1024" height="2454"/>`;
    out += `<text x="512" y="2300" class="m">${N}</text>`;

    const week = group[N] || {};

    for (const [dayName, dayTpl] of Object.entries(template)) {
      const dataSlots = week[dayName] || [];
      if (dataSlots.length === 0) continue;

      const coords = (dayTpl.wideSlots && dataSlots.length === dayTpl.wideSlots.length)
        ? dayTpl.wideSlots
        : dayTpl.slots;

      out += `<g transform="${dayTpl.transform}">`;

      dataSlots.forEach((cell, i) => {
        const c = coords[i];
        if (!c) return;
        out += renderSlot(c, cell);
      });

      out += `</g>`;
    }

    out += `</g>`;
  }

  out += `</g>`;
  return out;
}