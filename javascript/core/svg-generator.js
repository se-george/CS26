// ============================================
// svg-generator.js - توليد SVG ديناميكياً
// ============================================

import { DAY_TEMPLATE, WEEK_SPACING } from './day-template.js';

/**
 * يولّد محتوى SVG كامل لمجموعة معينة.
 * @param {string} groupLetter - A / B / C / D / E / F
 * @param {object} weeksData   - GROUP_DATA[groupLetter]
 * @returns {string}           - HTML string للـ innerHTML
 */
export function generateGroupSVG(groupLetter, weeksData) {
  const weekNums = Object.keys(weeksData).map(Number).sort((a, b) => b - a);
  if (weekNums.length === 0) return '';

  const maxWeek = Math.max(...weekNums);
  const outerX = (maxWeek + 1) * WEEK_SPACING;

  let out = `<g transform="translate(${outerX},0)">`;

  for (const N of weekNums) {
    // الأسبوع N يتحرك -N*1024 داخل outer → موضعه المطلق = 1024*(maxWeek+1-N)
    out += `<g transform="translate(${-N * WEEK_SPACING},0)">`;
    out += `<image data-src="image/${groupLetter}/01.webp" width="1024" height="2454"/>`;
    out += `<text x="512" y="2300" class="m">${N}</text>`;

    const week = weeksData[N] || {};

    for (const [dayName, tpl] of Object.entries(DAY_TEMPLATE)) {
      const dataSlots = week[dayName] || [];
      if (dataSlots.length === 0) continue;

      // اختر بين wideSlots و slots لـ tue
      const coords = (tpl.wideSlots && dataSlots.length === tpl.wideSlots.length)
        ? tpl.wideSlots
        : tpl.slots;

      out += `<g transform="${tpl.transform}">`;

      dataSlots.forEach((cell, i) => {
        const coord = coords[i];
        if (!coord) return;

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