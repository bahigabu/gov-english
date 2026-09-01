// ========================================
// 全域資料
// ========================================

let vocabulary = [];
let articles = [];

// 詞形 → 單字 ID
let wordIndex = {};

// 單字 ID → 單字資料
let vocabularyMap = {};

// 文章 ID → 單字 ID[]
let articleWordIndex = {};

// 單字 ID → 文章 ID[]
let wordArticleIndex = {};

// ========================================
// LocalStorage
// ========================================

const WORD_STATUS_KEY = "wordStatuses";
const WORD_FAVORITES_KEY = "wordFavorites";

// ========================================
// 學習狀態
// ========================================

const WORD_STATUS = {
  UNLEARNED: "unlearned",
  LEARNING: "learning",
  MASTERED: "mastered",
};

// ========================================
// 分類名稱
// ========================================

function getCategoryName(category) {
  const names = {
    junior: "國中單字",

    "high-basic": "高中基礎單字",

    "high-advanced": "高中進階單字",

    adult: "社會人士單字",
  };

  return names[category] || "未知分類";
}

