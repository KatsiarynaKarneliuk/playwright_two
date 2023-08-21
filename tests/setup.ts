import { test as setup, expect } from '@playwright/test';
import { STORAGE_STATE } from '../playwright.config';
import dotenv from 'dotenv'
dotenv.config({ path: '.env.local' });

setup('do login', async ({ page }) => {
  console.log("Loaded USER:", process.env.APP_USER);
  console.log("Loaded PASSWORD:", process.env.APP_PASSWORD);
  if (!process.env.APP_USER ||!process.env.APP_PASSWORD) {
    throw new Error("USER environment variable is not set.");
  }
  await page.goto('https://www.saucedemo.com/');
  await page.getByPlaceholder('Username').fill(process.env.APP_USER);
  await page.getByPlaceholder('Password').fill(process.env.APP_PASSWORD);
  await page.locator('[data-test="login-button"]').click();
  await page.context().storageState({ path: STORAGE_STATE });
});