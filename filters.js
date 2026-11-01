// filters.js - Pure job filtering & alert-gating helpers (service worker + node self-check)

// "Hourly: $20-$40" -> {type:'hourly', max:40}; "$500" / "Fixed-price: $500" -> {type:'fixed', max:500}
function parseBudget(budgetStr) {
  const s = budgetStr || '';
  const nums = (s.replace(/,/g, '').match(/\d+(?:\.\d+)?/g) || []).map(Number);
  if (nums.length === 0) return { type: null, max: 0 };
  return { type: /hr|hourly/i.test(s) ? 'hourly' : 'fixed', max: Math.max(...nums) };
}

// Unknown/unparseable budgets pass (never hide a job we can't judge).
function passesBudget(job, { minHourly = 0, minFixed = 0 } = {}) {
  const { type, max } = parseBudget(job.budget);
  if (type === 'hourly') return max >= minHourly;
  if (type === 'fixed') return max >= minFixed;
  return true;
}

const splitList = (v) => (Array.isArray(v) ? v : String(v || '').split(','))
  .map((s) => s.trim().toLowerCase()).filter(Boolean);

// Excluded keywords match title/description/skills; excluded countries match job.country only.
function isExcluded(job, { excludeKeywords = [], excludeCountries = [] } = {}) {
  const text = [job.title, job.description, (job.skillsRequired || []).join(' ')].join(' ').toLowerCase();
  if (splitList(excludeKeywords).some((k) => text.includes(k))) return true;
  const country = (job.country || '').toLowerCase();
  return !!country && splitList(excludeCountries).some((c) => country.includes(c));
}

// start/end "HH:MM"; window may wrap midnight (22:00 -> 07:00).
function inQuietHours({ quietHoursEnabled, quietStart, quietEnd } = {}, date = new Date()) {
  if (!quietHoursEnabled || !quietStart || !quietEnd) return false;
  const toMin = (t) => { const [h, m] = t.split(':').map(Number); return h * 60 + (m || 0); };
  const now = date.getHours() * 60 + date.getMinutes();
  const a = toMin(quietStart), b = toMin(quietEnd);
  if (a === b) return false;
  return a < b ? now >= a && now < b : now >= a || now < b;
}

if (typeof module !== 'undefined') {
  module.exports = { parseBudget, passesBudget, isExcluded, inQuietHours };
}
