import { WEEK_SPACING } from './groups-data.js';

export function generateGroupSVG(groupLetter, group) {
  // ✅ لازم يكون للمجموعة template (إحداثياتها الخاصة)
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

        const cls = typeof cell === 'string' ? cell : (cell.cls || 'o');
        const href = (typeof cell === 'object' && cell.href) ? ` data-hrsf="${cell.href}"` : '';

        out += `<rect x="${c.x}" y="${c.y}" width="${c.w}" height="${c.h}" class="${cls}"${href}/>`;
      });

      out += `</g>`;
    }

    out += `</g>`;
  }

  out += `</g>`;
  return out;
}