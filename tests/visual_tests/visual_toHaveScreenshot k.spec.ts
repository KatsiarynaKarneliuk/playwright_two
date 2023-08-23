import { expect,test } from '@playwright/test';

function urlToFilename(url:string) {
    return url.replace(/[^a-z0-9]/gi, '_').replace(/^https?_/, '');
}
test('Create baseScreenshots for several pages @baseScreenshot', async({ page }, testinfo) => {
    const urls = [
        'https://playwright.dev/',
        'https://playwright.dev/docs/intro'
    ]
    for (let url of urls) {
        const path = `screenshots_base/base${urlToFilename(url)}.png`
        await page.goto(url);
        if(url==='https://playwright.dev/'){
            await page.screenshot({
                path: path,
                mask: [page.getByRole('link', { name: /\d+k\+/})]
            });
        }
        else{
            await page.screenshot({
            path: path,
        });
        }
    }
});

test('Check presence of screenshots of main page @smoke', async({ page })=>{
    // to run twice, firstly for creating base screen and sacondly - to compare
    const urls = [
        'https://playwright.dev/',
        'https://playwright.dev/docs/intro'
    ]
    for (let url of urls) {
        await page.goto(url);
        if(url==='https://playwright.dev/'){ 
            await expect(page).toHaveScreenshot({
            mask: [page.getByRole('link', { name: /\d+k\+/})]
            });
        }
        else{
            await expect(page).toHaveScreenshot();
            }
    }
})