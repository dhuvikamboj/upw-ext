// ai_client.js - Bring-your-own-key LLM client (OpenAI, Anthropic, any OpenAI-compatible endpoint)
// Runs only in the background worker, only on an explicit user click. The key stays in chrome.storage.local.

const AI_DEFAULTS = {
  openai: { baseUrl: 'https://api.openai.com/v1', model: 'gpt-4o-mini' },
  anthropic: { baseUrl: 'https://api.anthropic.com', model: 'claude-haiku-5-5' },
  compatible: { baseUrl: '', model: '' } // OpenRouter, Groq, Ollama, Gemini's OpenAI endpoint, ...
};

function buildAiRequest(cfg, system, user) {
  const d = AI_DEFAULTS[cfg.provider] || AI_DEFAULTS.compatible;
  const base = (cfg.baseUrl || d.baseUrl).replace(/\/+$/, '');
  const model = cfg.model || d.model;
  if (!base || !model) throw new Error('Set a base URL and model for the OpenAI-compatible provider.');

  if (cfg.provider === 'anthropic') {
    return {
      url: `${base}/v1/messages`,
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': cfg.apiKey,
        'anthropic-version': '2023-06-01',
        'anthropic-dangerous-direct-browser-access': 'true'
      },
      body: { model, max_tokens: 1024, system, messages: [{ role: 'user', content: user }] }
    };
  }
  return {
    url: `${base}/chat/completions`,
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${cfg.apiKey}` },
    body: { model, messages: [{ role: 'system', content: system }, { role: 'user', content: user }] }
  };
}

function parseAiResponse(provider, json) {
  const text = provider === 'anthropic'
    ? (json.content || []).filter((b) => b.type === 'text').map((b) => b.text).join('')
    : json.choices?.[0]?.message?.content;
  if (!text) throw new Error(json.error?.message || 'Empty response from the model.');
  return text.trim();
}

async function callAi(cfg, system, user) {
  if (!cfg || !cfg.apiKey) throw new Error('No API key set. Add one in Settings > AI.');
  const req = buildAiRequest(cfg, system, user);
  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), 45000);
  try {
    const res = await fetch(req.url, {
      method: 'POST', headers: req.headers, body: JSON.stringify(req.body), signal: ctrl.signal
    });
    const json = await res.json().catch(() => ({}));
    if (!res.ok) throw new Error(`HTTP ${res.status}: ${json.error?.message || res.statusText}`);
    return parseAiResponse(cfg.provider, json);
  } catch (err) {
    if (err.name === 'AbortError') throw new Error('Request timed out after 45s.');
    throw err;
  } finally {
    clearTimeout(timer);
  }
}

if (typeof module !== 'undefined') {
  module.exports = { AI_DEFAULTS, buildAiRequest, parseAiResponse };
}
