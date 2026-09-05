function openWord(wordId) {
  const statusNames = {
    unlearned: "未學習",
    learning: "模糊中",
    mastered: "已精熟",
  };

  const wordData = vocabulary.find((word) => word.id === wordId);

  if (!wordData) {
    return;
  }

  const container = document.getElementById("word-detail");

  const status = getWordStatus(wordData.id);

  const favorite = isWordFavorite(wordData.id);

  const articleCount = (wordArticleIndex[wordData.id] || []).length;

  const statusName = statusNames[status] || "未學習";

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
<span id="word-status">
  ${statusName}
</span>
    </p>

<div class="word-status-buttons">

  <button
    class="word-status-button ${status === "unlearned" ? "active" : ""}"
    data-status="unlearned"
  >
    未學習
  </button>

  <button
    class="word-status-button ${status === "learning" ? "active" : ""}"
    data-status="learning"
  >
    模糊中
  </button>

  <button
    class="word-status-button ${status === "mastered" ? "active" : ""}"
    data-status="mastered"
  >
    已精熟
  </button>

</div>

    </div>

    <p>
      收藏：
      <span id="word-favorite-status">
        ${favorite ? "是" : "否"}
      </span>
    </p>

    <button id="toggle-word-favorite">
      ${favorite ? "取消收藏" : "收藏"}
    </button>

    <p>
      出現文章：
      ${articleCount} 篇
    </p>

  `;

  // =========================
  // 學習狀態按鈕
  // =========================

  container.querySelectorAll(".word-status-button").forEach((button) => {
    button.addEventListener("click", () => {
      const newStatus = button.dataset.status;

      setWordStatus(wordData.id, newStatus);

      document.getElementById("word-status").textContent =
        statusNames[newStatus];

      // 移除其他按鈕的黑色
      container
        .querySelectorAll(".word-status-button")
        .forEach((otherButton) => {
          otherButton.classList.remove("active");
        });

      // 讓目前點擊的按鈕變黑
      button.classList.add("active");
    });
  });

  // =========================
  // 收藏按鈕
  // =========================

  document
    .getElementById("toggle-word-favorite")
    .addEventListener("click", () => {
      const newFavorite = toggleWordFavorite(wordData.id);

      document.getElementById("word-favorite-status").textContent = newFavorite
        ? "是"
        : "否";

      document.getElementById("toggle-word-favorite").textContent = newFavorite
        ? "取消收藏"
        : "收藏";
    });

  showPage("word-detail");
}
