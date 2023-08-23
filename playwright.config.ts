import { defineConfig, devices } from '@playwright/test';
const path = require('path');
import dotenv from 'dotenv'
dotenv.config({ path: '.env.local' });


export const STORAGE_STATE = path.join(__dirname, '.auth/user.json');
/**
 * Read environment variables from file.
 * https://github.com/motdotla/dotenv
 */
/**
 * See https://playwright.dev/docs/test-configuration.
 */
export default defineConfig({
  testDir: './tests',
  /* Run tests in files in parallel */
  fullyParallel: true,
  /* Fail the build on CI if you accidentally left test.only in the source code. */
  forbidOnly: !!process.env.CI,
  /* Retry on CI only */
  //retries: process.env.CI ? 2 : 0,
  /* Opt out of parallel tests on CI. */
  workers: process.env.CI ? 1 : undefined,
  /* Reporter to use. See https://playwright.dev/docs/test-reporters */
  reporter: 'html',
  /* Shared settings for all the projects below. See https://playwright.dev/docs/api/class-testoptions. */
  use: {
    locale: 'en-GB',
    /* Base URL to use in actions like `await page.goto('/')`. */
    // baseURL: 'http://127.0.0.1:3000',

    /* Collect trace when retrying the failed test. See https://playwright.dev/docs/trace-viewer */
    //trace: 'on-first-retry',
    //video: /*'retain-on-failure'*/ 'on',
    //screenshot: /*'only-on-failure',*/'on'
  },

  /* Configure projects for major browsers */
  projects: [
    {
      name: 'setup',
      testMatch: /setup\.ts/,
    },
    {
      name: 'authUser',
      testMatch: '**/loggedin.spec.ts',
      dependencies: ['setup'],
      use: {
        ...devices['Desktop Chrome'],
        storageState: STORAGE_STATE,
      },
    },
    {
      name: 'smoketest',
      use: { ...devices['Desktop Chrome'] },
      testIgnore: ['**/loggedin.spec.ts'],
      testMatch: '**/bunch_of_tests.spec.ts',
      grep: /@smoke/,
    },

    {
      name: 'ordinary',
      use: { ...devices['Desktop Chrome'] },
      testIgnore: ['**/loggedin.spec.ts'],
      testMatch:'**/tests/not_auth_tests/**',
    },

    {
      name: 'baseScreenshot',
      use: { ...devices['Desktop Chrome'] },
      grep: /@baseScreenshot/,
    }
    
    // {
    //   name: 'setup db',
    //   testMatch: /global\.setup\.ts/,
    //   teardown: 'cleanup db',
    // },
    // {
    //   name: 'cleanup db',
    //   testMatch: /global\.teardown\.ts/,
    // },
    // {
    //   name: 'firefox',
    //   use: { ...devices['Desktop Firefox'] },
    // },

    // {
    //   name: 'webkit',
    //   use: { ...devices['Desktop Safari'] },
    // },

    /* Test against mobile viewports. */
    // {
    //   name: 'Mobile Chrome',
    //   use: { ...devices['Pixel 5'] },
    // },
    // {
    //   name: 'Mobile Safari',
    //   use: { ...devices['iPhone 12'] },
    // },

    /* Test against branded browsers. */
    // {
    //   name: 'Microsoft Edge',
    //   use: { ...devices['Desktop Edge'], channel: 'msedge' },
    // },
    // {
    //   name: 'Google Chrome',
    //   use: { ...devices['Desktop Chrome'], channel: 'chrome' },
    // },
  ],

  /* Run your local dev server before starting the tests */
  // webServer: {
  //   command: 'npm run start',
  //   url: 'http://127.0.0.1:3000',
  //   reuseExistingServer: !process.env.CI,
  // },
});
