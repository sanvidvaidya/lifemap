import type {
  ActivityRecord,
  Analytics,
  LifeMapPassport,
  LifeMapPreferences,
  MappingRecipes,
} from './types';

const fields: Array<keyof ActivityRecord> = ['id','date','startTime','endTime','activity','category','subcategory','duration','energy','mood','planned','completed','location','notes'];
const scalar = (value: unknown) => typeof value === 'string' || typeof value === 'number' || typeof value === 'boolean' ? String(value) : value == null ? '' : JSON.stringify(value);
const csvCell = (value: unknown) => `"${scalar(value).replace(/"/g, '""')}"`;
const escapeHtml = (value: unknown) => scalar(value).replace(/[&<>"']/g, (character) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#039;' })[character]!);

function download(name: string, contents: string, type: string) {
  const blob = new Blob([contents], { type }); const url = URL.createObjectURL(blob); const anchor = document.createElement('a');
  anchor.href = url; anchor.download = name; document.body.appendChild(anchor); anchor.click(); anchor.remove(); URL.revokeObjectURL(url);
}

export function normalizedCsv(records: ActivityRecord[]) {
  return [fields.join(','), ...records.map((record) => fields.map((field) => csvCell(record[field])).join(','))].join('\n');
}

export function downloadCsv(records: ActivityRecord[]) { download('lifemap-normalized.csv', normalizedCsv(records), 'text/csv;charset=utf-8'); }

export function passportJson(
  records: ActivityRecord[],
  preferences: LifeMapPreferences,
  mappingRecipes: MappingRecipes,
) {
  const passport: LifeMapPassport = {
    format: 'lifemap-passport',
    version: 1,
    exportedAt: new Date().toISOString(),
    records,
    preferences,
    mappingRecipes,
  };
  return JSON.stringify(passport, null, 2);
}

export function downloadPassport(
  records: ActivityRecord[],
  preferences: LifeMapPreferences,
  mappingRecipes: MappingRecipes,
) {
  download(
    `lifemap-passport-${new Date().toISOString().slice(0, 10)}.lifemap`,
    passportJson(records, preferences, mappingRecipes),
    'application/json;charset=utf-8',
  );
}

export function capsuleHtml(records: ActivityRecord[], analytics: Analytics) {
  const rows = analytics.categories.map((category) => `<tr><td>${escapeHtml(category.category)}</td><td>${(category.minutes / 60).toFixed(1)}h</td><td>${(category.share * 100).toFixed(0)}%</td><td>${category.consistency}</td></tr>`).join('');
  const insights = analytics.insights.map((insight) => `<article><h3>${escapeHtml(insight.title)}</h3><p>${escapeHtml(insight.detail)}</p><small>${escapeHtml(insight.evidence)}</small></article>`).join('');
  return `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width"><title>LifeMap Capsule</title><style>body{margin:0;background:#08191b;color:#f5f2e8;font:16px/1.6 system-ui}main{max-width:900px;margin:auto;padding:48px 24px}h1,h2{font-family:Georgia,serif;font-weight:400}h1{font-size:clamp(3rem,8vw,6rem);margin:.2em 0}.privacy{color:#a9beb9}.metrics{display:grid;grid-template-columns:repeat(3,1fr);gap:12px;margin:32px 0}.metrics div,article{background:#10272a;border:1px solid #294548;border-radius:16px;padding:20px}.metrics b{font-size:1.8rem;color:#e7cc78;display:block}table{width:100%;border-collapse:collapse;background:#10272a}th,td{text-align:left;padding:12px;border-bottom:1px solid #294548}small{color:#9eb2ad}@media(max-width:600px){.metrics{grid-template-columns:1fr}}</style></head><body><main><p class="privacy">LIFEMAP CAPSULE · Generated locally · No tracking</p><h1>See the shape of this period.</h1><p>${escapeHtml(analytics.dateStart)} to ${escapeHtml(analytics.dateEnd)} · ${records.length} normalized records included.</p><section class="metrics"><div><b>${(analytics.totalMinutes/60).toFixed(1)}h</b>tracked time</div><div><b>${analytics.consistency}</b>consistency</div><div><b>${analytics.level}</b>recorded engagement level</div></section><h2>Category summary</h2><table><thead><tr><th>Category</th><th>Time</th><th>Share</th><th>Consistency</th></tr></thead><tbody>${rows}</tbody></table><h2>Supported observations</h2>${insights}<h2>Methodology</h2><p>Tracked time is the sum of normalized duration values. Category share divides category minutes by all tracked minutes. Consistency combines active-day frequency (55%), gap regularity (30%), and longest streak (15%). XP visualizes recorded engagement using duration, session frequency, consistency, and completed planned records. Associations compare observed group means only when each group has at least five observations; they do not imply causation.</p></main></body></html>`;
}

export function downloadCapsule(records: ActivityRecord[], analytics: Analytics) { download('lifemap-capsule.html', capsuleHtml(records, analytics), 'text/html;charset=utf-8'); }
