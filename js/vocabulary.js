function openWord(wordId) {
  const wordData = vocabulary.find((word) => word.id === wordId);

  if (!wordData) {
    return;
  }

  const container = document.getElementById("word-detail");

  const status = getWordStatus(wordData.id);

  const favorite = isWordFavorite(wordData.id);

  const articleCount = (wordArticleIndex[wordData.id] || []).length;

  container.innerHTML = `

    <h2>
      ${escapeHtml(wordData.word)}
    </h2>

    <p>
      分類：
      ${getCategoryName(wordData.category)}
    </p>

    <p>
      學習狀態：
      ${status}
    </p>

    <p>
      收藏：
      ${favorite ? "是" : "否"}
    </p>

    <p>
      出現文章：
      ${articleCount} 篇
    </p>

  `;

  showPage("word-detail");
}
