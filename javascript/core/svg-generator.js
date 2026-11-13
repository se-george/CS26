// ============================================
// svg-generator.js - توليد SVG مع دعم قوالب لكل مجموعة
// ============================================

import { DAY_TEMPLATE as DEFAULT_TEMPLATE, WEEK_SPACING, DAY_ORDER } from './day-template.js';

/**
 * دمج القالب الافتراضي مع القالب المخصص للمجموعة.
 * - الأيام اللي مش موجودة في groupTemplate → تستخدم الافتراضي
 * - الأيام اللي موجودة → تستبدل بالكامل
 */
function resolveTemplate(groupTemplate = {}) {
  const merged = {};
  for (const day of DAY_ORDER) {
    merged[day] = groupTemplate[day]
      ? { ...DEFAULT_TEMPLATE[day], ...groupTemplate[day] }
      : DEFAULT_TEMPLATE[day];
  }
  return merged;
}

/**
 * يختار إحداثيات كل slot بناءً على عدد العناصر في البيانات.
 * - لو البيانات 5 عناصر → slots
 * - لو البيانات 4 عناصر و يوجد wideSlots → wideSlots
 * - لو غير ذلك → slots (أول N عنصر)
 */
function pickSlots(dayTpl, dataLength) {
  if (dayTpl.wideSlots && dataLength === dayTpl.wideSlots.length) {
    return dayTpl.wideSlots;
  }
  return dayTpl.slots;
}

/**
 * يولّد محتوى SVG كامل لمجموعة.
 * @param {string} groupLetter - A..F
 * @param {object} weeksData   - GROUP_DATA[letter]
 */
export function generateGroupSVG(groupLetter, weeksData) {
  // استخرج أرقام الأسابيع (مع تجاهل مفتاح `template`)
  const weekNums = Object.keys(weeksData)
    .filter(k => k !== 'template')
    .map(Number)
    .sort((a, b) => b - a);

  if (weekNums.length === 0) return '';

  // ✅ حل القالب: الافتراضي + override للمجموعة
  const template = resolveTemplate(weeksData.template);

  const maxWeek = Math.max(...weekNums);
  const outerX = (maxWeek + 1) * WEEK_SPACING;

  let out = `<g transform="translate(${outerX},0)">`;

  for (const N of weekNums) {
    // نضع كل أسبوع بإزاحة سالبة داخل outerG
    out += `<g transform="translate(${-N * WEEK_SPACING},0)">`;
    out += `<image data-src="image/${groupLetter}/01.webp" width="1024" height="2454"/>`;
    out += `<text x="512" y="2300" class="m">${N}</text>`;

    const week = weeksData[N] || {};

    for (const dayName of DAY_ORDER) {
      const dataSlots = week[dayName] || [];
      if (dataSlots.length === 0) continue;

      const dayTpl = template[dayName];
      const coords = pickSlots(dayTpl, dataSlots.length);

      out += `<g transform="${dayTpl.transform}">`;

      dataSlots.forEach((cell, i) => {
        const coord = coords[i];
        if (!coord) {
          console.warn(`⚠️ ${groupLetter} - أسبوع ${N} - ${dayName} - slot ${i} ليس له إحداثيات (البيانات أطول من القالب)`);
          return;
        }

        const cls = (typeof cell === 'string') ? cell : (cell.cls || 'o');
        const href = (typeof cell === 'object' && cell.href)
          ? ` data-hrsf="${cell.href}"`
          : '';

        out += `<rect x="${coord.x}" y="${coord.y}" width="${coord.w}" height="${coord.h}" class="${cls}"${href}/>`;
      });

      out += `</g>`;
    }

    out += `</g>`;
  }

  out += `</g>`;
  return out;
}