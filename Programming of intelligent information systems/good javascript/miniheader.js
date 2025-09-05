const axios = require("axios");
const cheerio = require("cheerio");
const fs = require("fs");

// Функція для отримання підзаголовків новин з однієї сторінки
async function getNewsSubheadlinesFromPage(page) {
  try {
    // Формуємо URL для кожної сторінки
    const url = `https://pestrecy-rt.ru/news/tag/list/specoperaciia/page/${page}`;
    const { data } = await axios.get(url);
    const $ = cheerio.load(data);

    // Знаходимо підзаголовки новин
    const subheadlines = [];
    $(".all-news__list_text-container p.oneNews__link").each(
      (index, element) => {
        const subheadline = $(element).text().trim();
        subheadlines.push(subheadline); // Додаємо всі підзаголовки
      }
    );

    return subheadlines;
  } catch (error) {
    console.error(
      `Помилка при отриманні підзаголовків з сторінки ${page}:`,
      error
    );
    return [];
  }
}

// Основна функція для збору підзаголовків з кількох сторінок
async function getAllNewsSubheadlines() {
  const allSubheadlines = [];

  // Проходимо по перших 19 сторінках
  for (let page = 1; page <= 19; page++) {
    console.log(`Отримуємо підзаголовки зі сторінки ${page}...`);
    const subheadlines = await getNewsSubheadlinesFromPage(page);
    allSubheadlines.push(...subheadlines);
  }

  // Записуємо підзаголовки у файл
  const filePath = "subheadlines.txt";
  fs.writeFile(filePath, allSubheadlines.join("\n"), (err) => {
    if (err) {
      console.error("Помилка при записі у файл:", err);
    } else {
      console.log(`Підзаголовки успішно записані у файл: ${filePath}`);
    }
  });
}

getAllNewsSubheadlines();
