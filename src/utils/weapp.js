export function escapeHtml(text) {
  text = text.replace(/\\"/g, '\\\\"');
  // TODO: 看看还有没有别的地方没有转义
  text = text.replace(/\\n/g, "\\\\n");
  return text;
}
