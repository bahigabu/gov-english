// ========================================
// 顯示單字庫
// ========================================

function renderVocabulary() {
  const container =
    document.getElementById("vocabulary-list");

  const countElement =
    document.getElementById("vocabulary-count");

  const totalArticles = articles.length;

  // =========================
  // 先依照篩選條件過濾
  // =========================

  const filteredVocabulary =
    vocabulary.filter((wordData) => {

      // -------------------------
      // 第一層：收藏
      // -------------------------

      if (
        vocabularyFilters.favorite === "favorite"
      ) {
        if (!isWordFavorite(wordData.id)) {
          return false;
        }
      }


      // -------------------------
      // 第二層：分類
      // -------------------------

      if (
        vocabularyFilters.category !== "all"
      ) {
        if (
          wordData.category !==
          vocabularyFilters.category
        ) {
          return false;
        }
      }


      // -------------------------
      // 第三層：學習狀態
      // -------------------------

      if (
        vocabularyFilters.status !== "all"
      ) {
        if (
          getWordStatus(wordData.id) !==
          vocabularyFilters.status
        ) {
          return false;
        }
      }


      // 通過所有條件
      return true;
    });


  // =========================
  // 顯示目前篩選後的單字數量
  // =========================

  countElement.textContent =
    filteredVocabulary.length;


  // =========================
  // A-Z 排序
  // =========================

  filteredVocabulary.sort((a, b) => {
    return a.word.localeCompare(b.word);
  });


  // =========================
  // 產生單字卡片
  // =========================

  container.innerHTML =
    filteredVocabulary
      .map((wordData) => {

        const articleCount =
          (
            wordArticleIndex[wordData.id] ||
            []
          ).length;


        const percentage =
          totalArticles === 0
            ? 0
            : Math.round(
                (articleCount / totalArticles) *
                  100
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


  // =========================
  // 單字按鈕事件
  // =========================

  container
    .querySelectorAll(".open-word")
    .forEach((button) => {

      button.addEventListener("click", () => {

        openWord(
          button.dataset.wordId
        );

      });

    });
}

function setupVocabularyFilters() {

  document
    .querySelectorAll(
      ".vocabulary-filter-button"
    )
    .forEach((button) => {

      button.addEventListener(
        "click",
        () => {

          const filterGroup =
            button.dataset.filterGroup;

          const filterValue =
            button.dataset.filterValue;


          // -------------------------
          // 更新目前篩選條件
          // -------------------------

          vocabularyFilters[
            filterGroup
          ] = filterValue;


          // -------------------------
          // 同一層的按鈕取消 active
          // -------------------------

          document
            .querySelectorAll(
              `.vocabulary-filter-button[data-filter-group="${filterGroup}"]`
            )
            .forEach((otherButton) => {

              otherButton.classList.remove(
                "active"
              );

            });


          // -------------------------
          // 目前按鈕加入 active
          // -------------------------

          button.classList.add("active");


          // -------------------------
          // 重新渲染單字
          // -------------------------

          renderVocabulary();

        }
      );

    });
}
