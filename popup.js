chrome.storage.sync.get('keywords', ({ keywords }) => {
  if (!keywords || keywords.length === 0) return;
  document.getElementById('keywords').value = keywords.join('\n')
});

document.getElementById('save').addEventListener('click', () => {
  const keywords = document.getElementById('keywords').value.split('\n').filter(Boolean);
  chrome.storage.sync.set({ keywords }, () => console.log('keywords saved', keywords));
});
