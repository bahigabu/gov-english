// ========================================
// Escape HTML
// ========================================

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

// ========================================
// 單字標準化
// ========================================

function normalizeWord(word) {
  return word.toLowerCase().trim();
}

function normalizeArticleWord(word) {
  return word
    .toLowerCase()
    .trim()
    .replace(/['’]s$/, "");
}