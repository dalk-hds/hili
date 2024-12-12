
chrome.storage.sync.get('keywords', ({ keywords }) => {
  if (!keywords || keywords.length === 0) return;
  const regex = new RegExp(`(${keywords.join('|')})`, 'gi');
  const walk = (node) => {
    if (node.nodeType === 3) {
      const matches = node.nodeValue.match(regex);
      if (matches) {
        const span = document.createElement('span');
        span.innerHTML = node.nodeValue.replace(regex, (match) => `<mark>${match}</mark>`);
        node.replaceWith(span);
      }
    } else {
      node.childNodes.forEach(walk);
    }
  };
  walk(document.body);
});
