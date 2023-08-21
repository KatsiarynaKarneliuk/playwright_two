import { test} from '../support/fixture/basePage';
import { expect } from '@playwright/test';

test('has title', async ({ page }) => {
  await page.goto('https://playwright.dev/');
  await page.pause();
  const one = page.locator('.logosColumn_GJVT',{hasText:'Chosen by companies and open source projects'});
  await expect(page).toHaveTitle(/Playwright/);
  await expect(one).toBeVisible();
});

test('get started link', async ({ page }) => {
  await page.goto('https://playwright.dev/');
  await page.getByRole('link', { name: 'Get started' }).click();
  await expect(page).toHaveURL(/.*intro/);
});

test.use({ locale: 'en-GB' });
test("todo locator @smoke", async({page})=>{
  await page.goto('https://www.google.com');
  await page.getByText('Accept all').last().click();
  await page
    .getByTitle('Search')
    .fill('Subscribe');
  await page.getByLabel('Search', { exact: true }).press('Enter')
})

test("toPass for a specific fliker test", async({productsPage,addProductPage})=>{
  await expect(async()=>{
    await productsPage.goto();
    await productsPage.clickCreateButton()
    await addProductPage.addProductActions()
    await productsPage.isPoductExist()
  }).toPass({
    // competing with timeout in the config file
    timeout:15000,
    intervals:[1000, 2000, 3000]
  })
})

test('get multiple locators', async({page},testinfo)=>{
  await page.goto('https://commitquality.com/');
  console.log(testinfo.title);
  const rows = await page.locator('.product-list-table tbody tr').all();
  for(const row of rows){
    //console.log(await row.getByTestId('name').innerText())
    console.log(await row.getByTestId('name').textContent())
  }
  await page.screenshot({
    path: `screenshots/${testinfo.title.replace(' ','_')}.png`,
    fullPage: true
  })
  testinfo.setTimeout(testinfo.timeout+2000);
})
