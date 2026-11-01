// Run: node ai_client.test.js
const assert = require('assert');
const { buildAiRequest, parseAiResponse } = require('./ai_client');

const oa = buildAiRequest({ provider: 'openai', apiKey: 'sk-x' }, 'sys', 'usr');
assert.strictEqual(oa.url, 'https://api.openai.com/v1/chat/completions');
assert.strictEqual(oa.headers.Authorization, 'Bearer sk-x');
assert.deepStrictEqual(oa.body.messages.map((m) => m.role), ['system', 'user']);

const an = buildAiRequest({ provider: 'anthropic', apiKey: 'k', model: 'm' }, 'sys', 'usr');
assert.strictEqual(an.url, 'https://api.anthropic.com/v1/messages');
assert.strictEqual(an.headers['x-api-key'], 'k');
assert.strictEqual(an.body.system, 'sys');
assert.strictEqual(an.body.model, 'm');

const cp = buildAiRequest({ provider: 'compatible', apiKey: 'k', baseUrl: 'http://localhost:11434/v1/', model: 'llama3' }, 's', 'u');
assert.strictEqual(cp.url, 'http://localhost:11434/v1/chat/completions');
assert.throws(() => buildAiRequest({ provider: 'compatible', apiKey: 'k' }, 's', 'u'), /base URL and model/);

assert.strictEqual(parseAiResponse('openai', { choices: [{ message: { content: ' hi ' } }] }), 'hi');
assert.strictEqual(parseAiResponse('anthropic', { content: [{ type: 'text', text: 'a' }, { type: 'text', text: 'b' }] }), 'ab');
assert.throws(() => parseAiResponse('openai', { error: { message: 'bad key' } }), /bad key/);

console.log('ai_client ok');
