import { test, expect } from '@playwright/test';

test('Logged in user can see the item, menu, filtr cart @smoke', async({ page })=>{
    await page.goto('https://www.saucedemo.com/inventory.html');

    const items = page.locator('.inventory_item');
    const menue = page.locator('#react-burger-menu-btn');
    const cart = page.locator('.shopping_cart_link');
    const filter = page.locator('.product_sort_container');
    await expect(items).toHaveCount(6);
    await expect(menue).toBeVisible();
    await expect(filter).toBeVisible();
    await expect(cart).toBeVisible();
})