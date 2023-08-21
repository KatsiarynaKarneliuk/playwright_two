import { test, expect } from '@playwright/test'
import { Eyes, Target, Configuration, BatchInfo, VisualGridRunner} from '@applitools/eyes-playwright'

test.describe('Visual testing with applitool', ()=>{
    const runner = new VisualGridRunner({testConcurrency:1});
    const batch = new BatchInfo({ name: 'inventory page'});
    const config = new Configuration();
    config.setBatch(batch);
    if(!process.env.APPLITOOLS_API_KEY) {
        throw new Error("API key not set in environment variables");
    }
    config.setApiKey(process.env.APPLITOOLS_API_KEY);
    const eyes = new Eyes(runner, config);

    const language = {en: 'English'}
    
    test.beforeEach(async({ page })=>{
        await eyes.open(page,"Inventory",test.info().title)
    })
    test('login', async({ page })=>{
        await page.goto('https://www.saucedemo.com/inventory.html');
        await eyes.check('Name for test', Target.window().fully().layout());
        await expect(page).toHaveURL(/inventory/);
    })
    test.afterEach(async()=>{
        await eyes.closeAsync();
    })
    test.afterAll(async()=>{
        const results = await runner.getAllTestResults();
        console.log('Visual test results: ', results);
    })
})

