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
    img.src = img.getAttribute("data-src");
    img.style.styleText = "width: 100%";
    img.className = "rich-text__img";
    // 宽度撑满，高度自适应
    // https://developers.weixin.qq.com/miniprogram/dev/component/image.html
    img.setAttribute("mode", "widthFix");
    imgAttributes.forEach(attr => img.removeAttribute(attr));
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
