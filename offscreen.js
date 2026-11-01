// Offscreen document: service workers can't play audio, so the background asks this page to.
chrome.runtime.onMessage.addListener((message) => {
  if (message.type === 'PLAY_SOUND') playAlertSound(message.sound, message.volume);
});
