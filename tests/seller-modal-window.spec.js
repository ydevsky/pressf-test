import { test, expect } from "playwright/test";

// Объект с данными для тестирования
const data = {
    PAGE_LINK: "https://pressf.com/product/7d46f8ad-2665-4db3-be8e-1e7712b8dab5-google-play-500-try-kod-popolneniya-google-play-tr",
};

// Группа тестов для проверки модального окна продавца
test.describe('Модальное окно продавца', function () {

    // Перед каждым тестом выполняем подготовительные шаги
    test.beforeEach(async ({ page }) => {
        await page.goto(data.PAGE_LINK); // Переход на страницу товара
        await page.waitForLoadState("networkidle"); // Ожидание полной загрузки страницы
        await page.waitForTimeout(2500); // Дополнительная задержка

        // Находим кнопку продавца и кликаем по ней для открытия модального окна
        const sellerInfoButton = await page.locator(".flex.flex-col-reverse.gap-2\\.5");
        const sellerInfoLink = sellerInfoButton.locator("a");
        await sellerInfoLink.click();
        await page.waitForTimeout(1500); // Ожидание перед началом теста
    });

    // Тест на открытие модального окна продавца
    test("Открытие модального окна продавца", async ({ page }) => {
        try {
            // Проверяем, что модальное окно появилось
            const modalWindow = await page.locator(".absolute.w-full.h-full.overflow-auto.flex.items-center.p-5");
            expect(await modalWindow.isVisible()).toBeTruthy();
            await page.waitForTimeout(1500); // Задержка после открытия окна
        } catch (err) {
            console.log(err.message); // Логирование ошибки
            throw new Error(err.message); // Выбрасывание ошибки для прерывания теста
        }
    });

    // Тест на закрытие модального окна продавца через кнопку
    test("Закрытие модального окна продавца", async ({ page }) => {
        try {
            // Находим модальное окно и кнопку закрытия
            const modalWindow = await page.locator(".absolute.w-full.h-full.overflow-auto.flex.items-center.p-5");
            const closeButton = modalWindow.locator("button");
            await closeButton.click(); // Кликаем по кнопке закрытия

            // Проверяем, что модальное окно закрылось
            await expect(modalWindow).toBeHidden();
            await page.waitForTimeout(1500); // Задержка после закрытия окна
        } catch (err) {
            console.log(err.message);
            throw new Error(err.message);
        }
    });

    // Тест на закрытие модального окна при клике вне его
    test("Закрытие модального окна продавца при клике вне модального окна", async ({ page }) => {
        try {
            // Находим модальное окно
            const modalWindow = await page.locator(".absolute.w-full.h-full.overflow-auto.flex.items-center.p-5");
            await page.mouse.click(10, 10); // Кликаем вне модального окна
            await page.waitForTimeout(1500);
            await expect(modalWindow).toBeHidden();
        } catch (err) {
            console.log(err.message);
            throw new Error(err.message);
        }
    });

    // Тест на проверку отображения данных о продавце
    test("Отображение данных о продавце", async ({ page }) => {
        try {
            const modalWindow = await page.locator(".absolute.w-full.h-full.overflow-auto.flex.items-center.p-5");

            // Проверяем, что у продавца отображается имя
            const sellerName = await modalWindow.locator(".ui-text__heading__xl.theme-pressf.ui-text.font-semibold");
            await expect(sellerName).toHaveText(/\S+/);

            // Проверяем отображение статуса верификации продавца
            const sellerVerificationStatus = await modalWindow.locator(".ui-text__description__l.theme-pressf.ui-text.text-light-500");
            await expect(sellerVerificationStatus).toHaveText(/\S+/);

            // Получаем все блоки с рейтингами продавца
            const sellerRatings = await modalWindow.locator(".flex.items-center.gap-md").all();

            // Рейтинг продавца на платформе
            const sellerRatingOnThePlatform = sellerRatings[0];
            await expect(sellerRatingOnThePlatform).toHaveText(/^\d\.\d$/);

            // Рейтинг продавца на других платформах
            const sellerRatingOnTheOtherPlatforms = sellerRatings[1];
            await expect(sellerRatingOnTheOtherPlatforms).toHaveText(/^\d\.\d$/);

            // Получаем дополнительные сведения о продавце
            const sellerAdditionalInfo = await modalWindow.locator(".bg-dark-400.p-md.rounded-xl.flex.items-center.gap-lg").all();

            // Уровень продавца
            const sellerLevel = await sellerAdditionalInfo[0].locator(".ui-text__body__l.theme-pressf.ui-text.font-semibold");
            await expect(sellerLevel).toHaveText(/\S+/);

            // Время работы продавца на платформе
            const sellerOnThePlatform = await sellerAdditionalInfo[1].locator(".ui-text__body__l.theme-pressf.ui-text.font-semibold");
            await expect(sellerOnThePlatform).toHaveText(/\S+/);

            // Количество проданных товаров продавцом
            const sellerSoldItems = await sellerAdditionalInfo[2].locator(".ui-text__body__l.theme-pressf.ui-text.font-semibold");
            await expect(sellerSoldItems).toHaveText(/\S+/);
        } catch (err) {
            console.log(err.message);
            throw new Error(err.message);
        }
    });
});