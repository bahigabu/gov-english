// ========================================
// LocalStorage：取得學習狀態
// ========================================

function getWordStatuses() {
  const data = localStorage.getItem(WORD_STATUS_KEY);

  if (!data) {
    return {};
  }

  try {
    const statuses = JSON.parse(data);

    if (
      typeof statuses !== "object" ||
      statuses === null ||
      Array.isArray(statuses)
    ) {
      return {};
    }

    return statuses;
  } catch (error) {
    console.error("單字狀態資料讀取失敗：", error);

    return {};
  }
}

// ========================================
// LocalStorage：取得單字狀態
// ========================================

function getWordStatus(wordId) {
  const statuses = getWordStatuses();

  return statuses[wordId] || WORD_STATUS.UNLEARNED;
}

// ========================================
// LocalStorage：設定單字狀態
// ========================================

function setWordStatus(wordId, status) {
  const validStatuses = Object.values(WORD_STATUS);

  if (!validStatuses.includes(status)) {
    console.error("無效的單字狀態：", status);

    return false;
  }

  const statuses = getWordStatuses();

  statuses[wordId] = status;

  localStorage.setItem(WORD_STATUS_KEY, JSON.stringify(statuses));

  return true;
}

// ========================================
// LocalStorage：取得收藏
// ========================================

function getWordFavorites() {
  const data = localStorage.getItem(WORD_FAVORITES_KEY);

  if (!data) {
    return [];
  }

  try {
    const favorites = JSON.parse(data);

    return Array.isArray(favorites) ? favorites : [];
  } catch (error) {
    console.error("收藏資料讀取失敗：", error);

    return [];
  }
}

// ========================================
// 判斷收藏
// ========================================

function isWordFavorite(wordId) {
  const favorites = getWordFavorites();

  return favorites.includes(wordId);
}

// ========================================
// 收藏
// ========================================

function addWordFavorite(wordId) {
  const favorites = getWordFavorites();

  if (favorites.includes(wordId)) {
    return;
  }

  favorites.push(wordId);

  localStorage.setItem(WORD_FAVORITES_KEY, JSON.stringify(favorites));
}

// ========================================
// 取消收藏
// ========================================

function removeWordFavorite(wordId) {
  const favorites = getWordFavorites();

  const newFavorites = favorites.filter((id) => id !== wordId);

  localStorage.setItem(WORD_FAVORITES_KEY, JSON.stringify(newFavorites));
}

// ========================================
// 收藏切換
// ========================================

function toggleWordFavorite(wordId) {
  if (isWordFavorite(wordId)) {
    removeWordFavorite(wordId);

    return false;
  }

  addWordFavorite(wordId);

  return true;
}
