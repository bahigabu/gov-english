// ========================================
// 顯示文章列表
// ========================================

function renderArticles() {
  const container = document.getElementById("article-list");

  container.className = "article-list";

  container.innerHTML = articles
    .map((article) => {
      const wordCount = getArticleWordCount(article);

      const uniqueWordCount = getArticleUniqueWordCount(article);

      return `
                <article
                    class="article-card"
                >

                    <h3>
                        ${escapeHtml(article.title)}
                    </h3>

                    <p>
                        單字數：
                        ${wordCount}
                    </p>

                    <p>
                        不重複單字：
                        ${uniqueWordCount}
                    </p>

                    <button
                        data-article-id="${article.id}"
                        class="open-article"
                    >
                        開啟文章
                    </button>

                </article>
            `;
    })
    .join("");

  container.querySelectorAll(".open-article").forEach((button) => {
    button.addEventListener("click", () => {
      openArticle(button.dataset.articleId);
    });
  });
}
