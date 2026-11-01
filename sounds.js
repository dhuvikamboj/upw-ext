// sounds.js - Synthesized alert sounds (no audio files). Used by the settings preview and the offscreen player.

const ALERT_SOUNDS = {
  chime:   { label: 'Chime',          notes: [{ f: 587.33, s: 0, d: 0.15, g: 0.5 }, { f: 880, s: 0.12, d: 0.35, g: 0.5 }] },
  bell:    { label: 'Bell',           notes: [{ f: 1318.5, s: 0, d: 1.2, g: 0.5 }, { f: 2637, s: 0, d: 0.7, g: 0.15 }, { f: 3951, s: 0, d: 0.35, g: 0.08 }] },
  radar:   { label: 'Radar ping',     notes: [{ f: 1000, s: 0, d: 0.5, g: 0.5 }, { f: 1000, s: 0.7, d: 0.5, g: 0.2 }] },
  kaching: { label: 'Cash register',  notes: [{ f: 1568, s: 0, d: 0.12, g: 0.4, t: 'triangle' }, { f: 2093, s: 0.09, d: 0.7, g: 0.45, t: 'triangle' }, { f: 4186, s: 0.09, d: 0.4, g: 0.1 }] },
  pop:     { label: 'Soft pop',       notes: [{ f: 440, s: 0, d: 0.14, g: 0.6 }] }
};

// volume 0-100
function playAlertSound(name, volume = 70) {
  const sound = ALERT_SOUNDS[name];
  const AudioCtx = typeof window !== 'undefined' && (window.AudioContext || window.webkitAudioContext);
  if (!sound || !AudioCtx) return;
  const level = Math.max(0, Math.min(100, Number(volume))) / 100;
  const ctx = new AudioCtx();
  const now = ctx.currentTime;
  sound.notes.forEach(({ f, s, d, g, t }) => {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = t || 'sine';
    osc.frequency.setValueAtTime(f, now + s);
    gain.gain.setValueAtTime(Math.max(0.0001, g * level), now + s);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + s + d);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(now + s);
    osc.stop(now + s + d + 0.05);
  });
  setTimeout(() => ctx.close().catch(() => {}), 2500);
}

if (typeof module !== 'undefined') {
  module.exports = { ALERT_SOUNDS };
}
