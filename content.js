var IsTextNode = node => node.nodeType === 3
var Span = (html) => {
  const span = document.createElement('span');
  span.innerHTML = html 
  return span
}

chrome.storage.sync.get('keywords', ({ keywords }) => {
  if (!keywords || keywords.length === 0) return;
  const regex = new RegExp(`(${keywords.join('|')})`, 'gi');
  const walk = (node) => {
    if (!IsTextNode(node)) node.childNodes.forEach(walk)
    else {
      const found = node.nodeValue.match(regex);
      if (found) {
        let span = Span(node.nodeValue.replace(regex, (match) => `<mark>${match}</mark>`))
        node.replaceWith(span)
      };
    };
  };

  walk(document.body);
});
