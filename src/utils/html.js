const jsdom = require("jsdom");
const { JSDOM } = jsdom;

function parse(node) {
  // img
  const imgs = node.querySelectorAll("img");
  const imgAttributes = [
    "data-copyright",
    "data-ratio",
    "data-s",
    "data-src",
    "data-type",
    "data-w"
  ];
  imgs.forEach(img => {
    const src = img.getAttribute("data-src");
    const parentNode = img.parentNode;
    // parentNode 只有一个 img 元素
    parentNode.innerHTML = `<image src="${src}" class="rich-text__img" mode="widthFix" />`;
    // 不能用 document.createElement("image")
    // 这样创建的不是一个 self closing 的 <image /> 而是 <image></image>
    // 这个标签在小程序中显示不出来

    // 宽度撑满，高度自适应
    // https://developers.weixin.qq.com/miniprogram/dev/component/image.html
  });
  // 个人小程序不支持 iframe，显示不出来
  const iframes = node.querySelectorAll("iframe");
  iframes.forEach(iframe => {
    const dataSrc = iframe.getAttribute("data-src");
    const vid = dataSrc
      .split("?")[1]
      .split("vid=")[1]
      .split("&")[0];
    iframe.src = `//v.qq.com/txp/iframe/player.html?vid=${vid}`;
  });
}

export function formatHTML(html) {
  if (!html) return "";
  html = `<div>${html}</div>`;
  const { document } = new JSDOM(html).window;
  const root = document.querySelector("div");
  parse(root);
  const innerText = root.textContent;
  const innerHTML = root.innerHTML;
  return { text: innerText, html: innerHTML };
}
