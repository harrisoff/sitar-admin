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
    "data-w",
    "style"
  ];
  // 小程序 rich-text 组件支持的 tag 见文档
  // https://developers.weixin.qq.com/miniprogram/dev/component/rich-text.html
  imgs.forEach(img => {
    const src = img.getAttribute("data-src");
    img.src = src;
    img.className = "rich-text__img";
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

// FIXME: formatHTML 调用方式还得改一下，外层捕捉不到 error
export function formatHTML(html) {
  if (!html) return "";
  html = `<div>${html}</div>`;
  try {
    const { document } = new JSDOM(html).window;
    const root = document.querySelector("div");
    parse(root, document);
    const innerText = root.textContent;
    const innerHTML = root.innerHTML;
    return { text: innerText, html: innerHTML };
  } catch (err) {
    console.error(err);
  }
}
