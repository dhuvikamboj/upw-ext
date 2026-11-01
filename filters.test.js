// Run: node filters.test.js
const assert = require('assert');
const { parseBudget, passesBudget, isExcluded, inQuietHours } = require('./filters');

assert.deepStrictEqual(parseBudget('Hourly: $20-$40'), { type: 'hourly', max: 40 });
assert.deepStrictEqual(parseBudget('Fixed-price: $1,500'), { type: 'fixed', max: 1500 });
assert.strictEqual(parseBudget('Competitive').type, null);

assert.ok(!passesBudget({ budget: 'Hourly: $10-$15' }, { minHourly: 20 }));
assert.ok(passesBudget({ budget: 'Hourly: $10-$25' }, { minHourly: 20 }));
assert.ok(!passesBudget({ budget: '$100' }, { minFixed: 500 }));
assert.ok(passesBudget({ budget: '$100' }, { minHourly: 50 })); // hourly floor doesn't hit fixed
assert.ok(passesBudget({ budget: 'Competitive' }, { minHourly: 50, minFixed: 500 }));

assert.ok(isExcluded({ title: 'Fix my WordPress site' }, { excludeKeywords: 'wordpress, php' }));
assert.ok(!isExcluded({ title: 'React app' }, { excludeKeywords: 'wordpress' }));
assert.ok(isExcluded({ title: 'x', country: 'India' }, { excludeCountries: 'india' }));
assert.ok(!isExcluded({ title: 'x' }, { excludeCountries: 'india' })); // unknown country passes

const q = { quietHoursEnabled: true, quietStart: '22:00', quietEnd: '07:00' };
const at = (h, m = 0) => new Date(2026, 0, 1, h, m);
assert.ok(inQuietHours(q, at(23)) && inQuietHours(q, at(3)) && !inQuietHours(q, at(7)) && !inQuietHours(q, at(12)));
assert.ok(!inQuietHours({ ...q, quietHoursEnabled: false }, at(23)));

console.log('filters ok');
