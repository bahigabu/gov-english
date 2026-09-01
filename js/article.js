// ========================================
// 文章內容轉成 HTML
// ========================================

// function renderArticleContent(article) {
//   const text = article.content;

//   const tokens = text.split(/([A-Za-z]+(?:['’-][A-Za-z]+)*)/);

//   return tokens
//     .map((token) => {
//       const wordId = wordIndex[normalizeWord(token)];

//       // 不是英文單字
//       if (!wordId) {
//         return escapeHtml(token);
//       }

//       const wordData = vocabularyMap[wordId];

//       const category = wordData.category;

//       return `
//             <span
//                 class="article-word word-${category}"
//                 data-word-id="${wordId}"
//                 title="${escapeHtml(wordData.word)}"
//             >
//                 ${escapeHtml(token)}
//             </span>
//         `;
//     })
//     .join("");
// }

// ========================================
// 中文數字
// ========================================
function numberToChinese(number) {
  const digits = ["零", "一", "二", "三", "四", "五", "六", "七", "八", "九"];

  if (number < 10) {
    return digits[number];
  }

  if (number < 20) {
    return "十" + (number % 10 === 0 ? "" : digits[number % 10]);
  }

  if (number < 100) {
    const tens = Math.floor(number / 10);
    const ones = number % 10;

    return digits[tens] + "十" + (ones === 0 ? "" : digits[ones]);
  }

  if (number < 1000) {
    const hundreds = Math.floor(number / 100);
    const remainder = number % 100;

    let result = digits[hundreds] + "百";

    if (remainder === 0) {
      return result;
    }

    if (remainder < 10) {
      return result + "零" + digits[remainder];
    }

    if (remainder < 20) {
      return (
        result + "零十" + (remainder % 10 === 0 ? "" : digits[remainder % 10])
      );
    }

    const tens = Math.floor(remainder / 10);
    const ones = remainder % 10;

    return result + digits[tens] + "十" + (ones === 0 ? "" : digits[ones]);
  }

  return String(number);
}
// ========================================
function renderArticleContent(article) {
  const paragraphs = article.content.split(/\n\s*\n/);

  return paragraphs
    .map((paragraph, index) => {
      const tokens = paragraph.split(/([A-Za-z]+(?:['’-][A-Za-z]+)*)/);

      const content = tokens
        .map((token) => {
          const wordId = wordIndex[normalizeArticleWord(token)];

          // 不是單字庫裡的單字
          if (!wordId) {
            return escapeHtml(token);
          }

          const wordData = vocabularyMap[wordId];

          const category = wordData.category;

          return `
            <span
              class="article-word word-${category}"
              data-word-id="${wordId}"
              title="${escapeHtml(wordData.word)}"
            >
              ${escapeHtml(token)}
            </span>
          `;
        })
        .join("");

      const paragraphNumber = numberToChinese(index + 1);

      return `
        <p>
          <span class="paragraph-number">
            ${paragraphNumber}、
          </span>

          ${content}
        </p>
      `;
    })
    .join("");
}
// ========================================
// 開啟文章
// ========================================

function openArticle(articleId) {
  const article = articles.find((article) => article.id === articleId);

  if (!article) {
    return;
  }

  const container = document.getElementById("article-detail");

  const wordCount = getArticleWordCount(article);

  const uniqueWordCount = getArticleUniqueWordCount(article);

  const relatedWordIds = articleWordIndex[article.id] || [];

  container.innerHTML = `

    <h2>
      ${escapeHtml(article.title)}
    </h2>

    <div class="article-stat">

      <p>
        文章單字數：
        <strong>${wordCount}</strong>
      </p>

      <p>
        不重複單字：
        <strong>${uniqueWordCount}</strong>
      </p>

      <p>
        單字庫收錄：
        <strong>${relatedWordIds.length}</strong>
      </p>

    </div>

    <div class="article-content">

      ${renderArticleContent(article)}

    </div>

    <div class="questions">

      <h3>
        測驗題
      </h3>

      ${renderQuestions(article.questions)}

      <div class="question-actions">

        <button id="submit-quiz">
          交卷
        </button>

        <button id="clear-quiz">
          清空
        </button>

      </div>

    </div>
  `;

  // ========================================
  // 選項點擊
  // ========================================

  container.querySelectorAll(".question-option").forEach((option) => {
    option.addEventListener("click", () => {
      const questionCard = option.closest(".question-card");

      // 如果這一題已經答對，不再允許修改
      if (questionCard.classList.contains("answered-correct")) {
        return;
      }

      // 清除同一題其他選項的選取狀態
      questionCard
        .querySelectorAll(".question-option")
        .forEach((otherOption) => {
          otherOption.classList.remove("selected");
        });

      // 標記目前選擇的選項
      option.classList.add("selected");

      // JavaScript 記錄選擇
      const questionId = questionCard.dataset.questionId;

      const optionIndex = Number(option.dataset.optionIndex);

      console.log("選擇的題目：", questionId);

      console.log("選擇的選項：", optionIndex + 1);
    });
  });

  // ========================================
  // 交卷
  // ========================================

  document.getElementById("submit-quiz").addEventListener("click", () => {
    const questionCards = container.querySelectorAll(".question-card");

    questionCards.forEach((questionCard) => {
      // ====================================
      // 已經答對
      // ====================================

      if (questionCard.classList.contains("answered-correct")) {
        return;
      }

      // ====================================
      // 找到這一題的資料
      // ====================================

      const questionId = questionCard.dataset.questionId;

      const question = article.questions.find(
        (question) => question.id === questionId,
      );

      if (!question) {
        return;
      }

      // ====================================
      // 找使用者選擇的答案
      // ====================================

      const selectedOption = questionCard.querySelector(
        ".question-option.selected",
      );

      // 沒有作答
      if (!selectedOption) {
        return;
      }

      // ====================================
      // 取得使用者選項
      // ====================================

      const selectedIndex = Number(selectedOption.dataset.optionIndex);

      const selectedAnswer = selectedIndex + 1;

      // ====================================
      // 答對
      // ====================================

      if (selectedAnswer === question.answer) {
        selectedOption.classList.remove("selected");

        selectedOption.classList.add("correct");

        // 標記這一題已經答對
        questionCard.classList.add("answered-correct");

        console.log("答對：", questionId);

        return;
      }

      // ====================================
      // 答錯
      // ====================================

      selectedOption.classList.remove("selected");

      selectedOption.classList.add("wrong");

      // ====================================
      // 找到正確答案
      // ====================================

      const correctOption = questionCard.querySelector(
        `.question-option[data-option-index="${question.answer - 1}"]`,
      );

      if (correctOption) {
        correctOption.classList.add("correct");
      }

      console.log("答錯：", questionId);
    });
  });
  // ========================================
  // 清空測驗
  // ========================================

  document.getElementById("clear-quiz").addEventListener("click", () => {
    const questionCards = container.querySelectorAll(".question-card");

    questionCards.forEach((questionCard) => {
      // 移除題目的答對鎖定狀態
      questionCard.classList.remove("answered-correct");

      // 找到這一題所有選項
      const options = questionCard.querySelectorAll(".question-option");

      options.forEach((option) => {
        // 清除選擇
        option.classList.remove("selected");

        // 清除答對
        option.classList.remove("correct");

        // 清除答錯
        option.classList.remove("wrong");
      });
    });

    console.log("測驗已清空");
  });
  // ========================================
  // 顯示文章詳細頁面
  // ========================================

  showPage("article-detail");
}
// ========================================
// 渲染測驗題
// ========================================

function renderQuestions(questions) {
  if (!questions || questions.length === 0) {
    return "<p>本篇沒有測驗題。</p>";
  }

  return questions
    .map((question, index) => {
      return `
        <div
          class="question-card"
          data-question-id="${question.id}"
        >

          <h4>
            第 ${index + 1} 題
          </h4>

          <p>
            ${escapeHtml(question.question)}
          </p>

          <div>

            ${question.options
              .map((option, optionIndex) => {
                return `
                  <div
                    class="question-option"
                    data-option-index="${optionIndex}"
                  >
                    ${optionIndex + 1}.
                    ${escapeHtml(option)}
                  </div>
                `;
              })
              .join("")}

          </div>

        </div>
      `;
    })
    .join("");
}
