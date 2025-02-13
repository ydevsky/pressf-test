import {test, expect} from "playwright/test";

const data = {
    PAGE_LINK: "https://pressf.com/product/7d46f8ad-2665-4db3-be8e-1e7712b8dab5-google-play-500-try-kod-popolneniya-google-play-tr",
}

test.describe('Модальное окно продавца', function () {
    test.beforeEach(async ({page}) => {
        await page.goto(data.PAGE_LINK);
        await page.waitForLoadState("networkidle")
        await page.waitForTimeout(2500);
    });

    test("Открытие модального окна продавца", async ({page}) => {
        try {
            const sellerInfoButton = await page.locator(".flex.flex-col-reverse.gap-2\\.5");
            const sellerInfoLink = sellerInfoButton.locator("a");
            await sellerInfoLink.click();
            await page.waitForTimeout(1500);
            const modalWindow = await page.locator(".absolute.w-full.h-full.overflow-auto.flex.items-center.p-5");
            expect(await modalWindow.isVisible()).toBeTruthy();
            await page.waitForTimeout(1500);
        } catch (err) {
            console.log(err.message);
            throw new Error(err.message);
        }
    });

    test("Закрытие модального окна продавца", async ({page}) => {
        try {
            const sellerInfoButton = await page.locator(".flex.flex-col-reverse.gap-2\\.5");
            const sellerInfoLink = sellerInfoButton.locator("a");
            await sellerInfoLink.click();
            await page.waitForTimeout(1500);
            const modalWindow = await page.locator(".absolute.w-full.h-full.overflow-auto.flex.items-center.p-5");
            const closeButton = modalWindow.locator("button");
            await closeButton.click();
            await expect(modalWindow).toBeHidden();
            await page.waitForTimeout(1500);
        } catch (err) {
            console.log(err.message);
            throw new Error(err.message);
        }
    });

    test("Отображение данных о продавце", async ({page}) => {
        try {
            const sellerInfoButton = await page.locator(".flex.flex-col-reverse.gap-2\\.5");
            const sellerInfoLink = sellerInfoButton.locator("a");
            await sellerInfoLink.click();
            await page.waitForTimeout(1500);
            const modalWindow = await page.locator(".absolute.w-full.h-full.overflow-auto.flex.items-center.p-5");
            const sellerName = await modalWindow.locator(".ui-text__heading__xl.theme-pressf.ui-text.font-semibold");
            await expect(sellerName).toHaveText(/\S+/);
            const sellerVerificationStatus = await modalWindow.locator(".ui-text__description__l.theme-pressf.ui-text.text-light-500");
            await expect(sellerVerificationStatus).toHaveText(/\S+/);
            const sellerRatings = await modalWindow.locator(".flex.items-center.gap-md").all();
            const sellerRatingOnThePlatform = sellerRatings[0];
            await expect(sellerRatingOnThePlatform).toHaveText(/^\d\.\d$/);
            const sellerRatingOnTheOtherPlatforms = sellerRatings[0];
            await expect(sellerRatingOnTheOtherPlatforms).toHaveText(/^\d\.\d$/);
            const sellerAdditionalInfo = await modalWindow.locator(".bg-dark-400.p-md.rounded-xl.flex.items-center.gap-lg").all();
            const sellerLevel = await sellerAdditionalInfo[0].locator(".ui-text__body__l.theme-pressf.ui-text.font-semibold");
            await expect(sellerLevel).toHaveText(/\S+/);
            const sellerOnThePlatform = await sellerAdditionalInfo[1].locator(".ui-text__body__l.theme-pressf.ui-text.font-semibold");
            await expect(sellerOnThePlatform).toHaveText(/\S+/);
            const sellerSoldItems = await sellerAdditionalInfo[2].locator(".ui-text__body__l.theme-pressf.ui-text.font-semibold");
            await expect(sellerSoldItems).toHaveText(/\S+/);
        } catch (err) {
            console.log(err.message);
            throw new Error(err.message);
        }
    });
});