const axios = require("axios");
const cheerio = require("cheerio");
const fs = require("fs");

// Функція для отримання заголовків новин з однієї сторінки
async function getNewsHeadlinesFromPage(page) {
  try {
    // Формуємо URL для кожної сторінки
    const url = `https://pestrecy-rt.ru/news/tag/list/specoperaciia/page/${page}`;
    const { data } = await axios.get(url);
    const $ = cheerio.load(data);

    // Знаходимо заголовки новин
    const headlines = [];
    $(".all-news__list_text-container h2").each((index, element) => {
      const headline = $(element).text().trim();
      headlines.push(headline); // Додаємо всі заголовки
    });

    return headlines;
  } catch (error) {
    console.error(`Помилка при отриманні новин з сторінки ${page}:`, error);
    return [];
  }
}

// Основна функція для збору заголовків з кількох сторінок
async function getAllNewsHeadlines() {
  const allHeadlines = [];

  // Проходимо по перших 19 сторінках
  for (let page = 1; page <= 19; page++) {
    console.log(`Отримуємо заголовки зі сторінки ${page}...`);
    const headlines = await getNewsHeadlinesFromPage(page);
    allHeadlines.push(...headlines);
  }

  // Записуємо заголовки у файл
  const filePath = "headlines.txt";
  fs.writeFile(filePath, allHeadlines.join("\n"), (err) => {
    if (err) {
      console.error("Помилка при записі у файл:", err);
    } else {
      console.log(`Заголовки успішно записані у файл: ${filePath}`);
    }
  });
}

getAllNewsHeadlines();
