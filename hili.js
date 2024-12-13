var IsTextNode = (node) => node.nodeType === 3;
var IsScriptTag = (node) => node.parentNode?.nodeName === "SCRIPT";
var IsNoScriptTag = (node) => node.parentNode?.nodeName === "NOSCRIPT";
var IsStyleTag = (node) => node.parentNode?.nodeName === "STYLE";
var IsFormTag = (node) => node.parentNode?.nodeName === "FORM";
var IsMarked = (node) => node.parentNode?.nodeName === "MARK";

var IsNodeValid = (node) =>
  [IsScriptTag, IsNoScriptTag, IsStyleTag, IsFormTag, IsMarked].every(
    (test) => !test(node),
  );

var Span = (html) => {
  const span = document.createElement("span");
  span.innerHTML = html;
  return span;
};

var Walker = ({ matcher, replacer }) => {
  const walk = (node) => {
    if (!IsTextNode(node)) node.childNodes.forEach(walk);
    else if (IsNodeValid(node)) {
      const found = matcher(node);
      if (found) {
        node.replaceWith(Span(replacer(node, `<mark>${found}</mark>`)));
      }
    }
  };

  return {
    walk,
  };
};

function hili(node) {
  chrome.storage.sync.get("keywords", ({ keywords }) => {
    if (keywords?.length === 0) return;
    const regex = new RegExp(`(${keywords.join("|")})`, "gi");
    const replacer = (node, replacement) =>
      node.nodeValue.replace(regex, replacement);
    const matcher = (node) => node.nodeValue.match(regex);
    const walker = Walker({ matcher, replacer });

    walker.walk(node);
  });
}

function onDomChanged(targetNode, callback) {
  const config = { attributes: false, childList: true, subtree: true };
  const observer = new MutationObserver((mutationList, observer) => {
    for (const mutation of mutationList) {
      if (mutation.type === "childList") {
        for (const node of mutation.addedNodes) {
          callback(node);
        }
      }
    }
  });
  observer.observe(targetNode, config);
}

hili(document.body);
onDomChanged(document.body, (node) => hili(node));
