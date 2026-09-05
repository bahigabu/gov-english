// ========================================
// 取得文章總單字數
// ========================================

function getArticleWordCount(article) {
  const words = extractWords(article.content);

  return words.length;
}

// ========================================
// 取得文章不重複單字數
// ========================================

function getArticleUniqueWordCount(article) {
  const words = extractWords(article.content);

  const uniqueWords = new Set(words.map(normalizeWord));

  return uniqueWords.size;
}

// ========================================
// 分析文章文字
// ========================================

function extractWords(text) {
  /*
        只抓英文文字。

        例如：

        "I ate John's apple."

        會抓出：

        I
        ate
        John's
        apple
    */

  return text.match(/[A-Za-z]+(?:['’-][A-Za-z]+)*/g) || [];
}

// ========================================
// 文章出現單字百分比
// ========================================
function getWordColor(percentage) {
  if (percentage <= 0) {
    return "transparent";
  }

  const hue = (percentage - 1) * (120 / 99);

  return `hsl(${hue}, 80%, 70%)`;
}