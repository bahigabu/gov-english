// ========================================
// 顯示單字庫
// ========================================

function renderVocabulary() {
  const container = document.getElementById("vocabulary-list");

  const totalArticles = articles.length;

  container.innerHTML = vocabulary
    .map((wordData) => {

      const articleCount =
        (wordArticleIndex[wordData.id] || []).length;

      const percentage =
        totalArticles === 0
          ? 0
          : Math.round(
              (articleCount / totalArticles) * 100
            );

      const backgroundColor =
        getWordColor(percentage);

      return `
        <div class="word-card">

          <button
            class="open-word"
            data-word-id="${wordData.id}"
            data-percentage="${percentage}%"
            style="background-color: ${backgroundColor};"
          >
            <span class="word-text">
              ${escapeHtml(wordData.word)}
            </span>

            <span class="word-percentage">
              ${percentage}%
            </span>

          </button>

        </div>
      `;
    })
    .join("");
// ========================================
// 單字按鈕點擊事件
// ========================================

  container.querySelectorAll(".open-word").forEach((button) => {
    button.addEventListener("click", () => {
      openWord(button.dataset.wordId);
    });
  });
}
