
// ========================================
// 初始化
// ========================================

async function init() {
  try {
    const [vocabularyResponse, articlesResponse] = await Promise.all([
      fetch("./data/vocabulary.json"),

      fetch("./data/articles.json"),
    ]);

    vocabulary = await vocabularyResponse.json();

    articles = await articlesResponse.json();

    buildVocabularyMaps();

    buildWordIndex();

    buildArticleWordIndex();

    renderVocabulary();

    renderArticles();

    setupNavigation();
  } catch (error) {
    console.error("網站資料載入失敗：", error);
  }
}

// ========================================
// 建立單字 Map
// ========================================

function buildVocabularyMaps() {
  vocabularyMap = {};

  for (const wordData of vocabulary) {
    vocabularyMap[wordData.id] = wordData;
  }
}

// ========================================
// 建立「詞形 → 單字 ID」索引
// ========================================

function buildWordIndex() {
  wordIndex = {};

  for (const wordData of vocabulary) {
    const wordId = wordData.id;

    // 主單字
    addWordToIndex(wordData.word, wordId);

    // 動詞 / 其他詞形
    if (wordData.forms) {
      for (const form of Object.values(wordData.forms)) {
        if (!form) {
          continue;
        }

        addWordToIndex(form, wordId);
      }
    }
  }
}

// ========================================
// 將詞形加入索引
// ========================================

function addWordToIndex(word, wordId) {
  const normalizedWord = normalizeWord(word);

  if (!normalizedWord) {
    return;
  }

  wordIndex[normalizedWord] = wordId;
}



// ========================================
// 建立文章 ↔ 單字索引
// ========================================

function buildArticleWordIndex() {
  articleWordIndex = {};

  wordArticleIndex = {};

  for (const article of articles) {
    const words = extractWords(article.content);

    const articleWordIds = [];

    for (const word of words) {
      const normalizedWord = normalizeArticleWord(word);

      const wordId = wordIndex[normalizedWord];

      // 單字庫沒有這個單字
      if (!wordId) {
        continue;
      }

      // 文章 → 單字
      if (!articleWordIds.includes(wordId)) {
        articleWordIds.push(wordId);
      }

      // 單字 → 文章
      if (!wordArticleIndex[wordId]) {
        wordArticleIndex[wordId] = [];
      }

      if (!wordArticleIndex[wordId].includes(article.id)) {
        wordArticleIndex[wordId].push(article.id);
      }
    }

    articleWordIndex[article.id] = articleWordIds;
  }
}






// ========================================
// 頁面切換
// ========================================

function showPage(pageName) {
  document.querySelectorAll(".page").forEach((page) => {
    page.hidden = true;
  });

  const target = document.getElementById(`page-${pageName}`);

  if (target) {
    target.hidden = false;
  }
}

// ========================================
// 導覽列
// ========================================

function setupNavigation() {
  document.querySelectorAll("[data-page]").forEach((button) => {
    button.addEventListener("click", () => {
      showPage(button.dataset.page);
    });
  });

  document.getElementById("back-to-articles").addEventListener("click", () => {
    showPage("articles");
  });

  document.getElementById("back-to-vocabulary").addEventListener("click", () => {
    showPage("vocabulary");
  });
}

// ========================================
// 啟動
// ========================================

init();
