var IsTextNode = node => node.nodeType === 3
var IsScriptTag = node => node.parentNode.nodeName === 'SCRIPT'
var IsNoScriptTag = node => node.parentNode.nodeName === 'NOSCRIPT'
var IsStyleTag = node => node.parentNode.nodeName === 'STYLE'
var IsFormTag = node => node.parentNode.nodeName === 'FORM'

var IsNodeValid = node => [IsScriptTag, IsNoScriptTag, IsStyleTag, IsFormTag].every(test => !test(node))

var Span = (html) => {
  const span = document.createElement('span');
  span.innerHTML = html 
  return span
}

function hili() {
  chrome.storage.sync.get('keywords', ({ keywords }) => {
    console.log('start hili', keywords)
    if (!keywords || keywords.length === 0) return;
    const regex = new RegExp(`(${keywords.join('|')})`, 'gi');
    const walk = (node) => {
      if (!IsTextNode(node)) node.childNodes.forEach(walk)
      else if (IsNodeValid(node)) {
        const found = node.nodeValue.match(regex)
        if (found) {
          let span = Span(node.nodeValue.replace(regex, (match) => `<mark>${match}</mark>`))
          node.replaceWith(span)
        };
      };
    };

    walk(document.body);
  });
}

hili()
setTimeout(() => hili(), 3000)
