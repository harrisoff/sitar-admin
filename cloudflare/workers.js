const authApi = `https://api.weixin.qq.com/cgi-bin/token`;
const wxApi = `https://api.weixin.qq.com/cgi-bin`;
const miniApi = `https://api.weixin.qq.com/tcb`;
const uploadApi = `https://cos.ap-shanghai.myqcloud.com`;
const testApi = `https://yesno.wtf/api`;

const proxyHost = "https://sitar-admin.harrisoff.workers.dev";
const allowOrigin = "https://harrisoff.github.io";

const paths = {
  "/token": authApi,
  "/mini-api": miniApi,
  "/wx-api": wxApi,
  "/myUpload": uploadApi,
  "/test/api": testApi
};
const urlMap = {};
Object.keys(paths).forEach(path => {
  urlMap[proxyHost + path] = paths[path];
});

async function fetchAndApply(request) {
  const { method, url, headers, body } = request;

  if (method === "OPTIONS") {
    return new Response("", {
      status: 200,
      headers: {
        "Access-Control-Allow-Credentials": true,
        "Access-Control-Allow-Origin": allowOrigin,
        "Access-Control-Allow-Headers": "Content-Type",
        "Access-Control-Allow-Methods": "GET, POST, PUT, HEAD, OPTIONS"
      }
    });
  }

  const { href } = new URL(url);
  let newUrl = href;
  Object.keys(urlMap).forEach(basePath => {
    newUrl = newUrl.replace(basePath, urlMap[basePath]);
  });
  let response = null;
  if (newUrl === href) {
    response = await fetch("https://yesno.wtf/api");
  } else if (method === "GET") {
    response = await fetch(newUrl, {
      method,
      headers
    });
  } else {
    response = await fetch(newUrl, {
      method,
      headers,
      body
    });
  }

  let newHeaders = new Headers(response.headers);
  newHeaders.set("access-control-allow-origin", allowOrigin);
  newHeaders.set("access-control-allow-credentials", true);
  newHeaders.delete("content-security-policy");
  newHeaders.delete("content-security-policy-report-only");
  newHeaders.delete("clear-site-data");

  const newResponse = new Response(response.body, {
    status: response.status,
    headers: newHeaders
  });
  return newResponse;
}

addEventListener("fetch", event => {
  event.respondWith(fetchAndApply(event.request));
});
