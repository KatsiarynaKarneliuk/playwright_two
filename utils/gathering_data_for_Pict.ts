import { test, expect } from '@playwright/test';
import * as csv from 'fast-csv';
const { execSync } = require('child_process');
const fs = require('fs');

test('data gathering for pict', async ({ page }) => {
    await page.goto('https://www.beliani.pl/meble-ogrodowe/wszystkie+produkty/?Material=Beton&Typ=Duzy_zestaw_wypoczynkowy,Domek_narzedziowy&Kolor=Bialy&Cechy=Blat_z_otworem_na_parasol&sort=default');
    await page.getByRole('button', { name: 'Akceptuj wszystkie cookies' }).click();

    const typeItems = await page.locator('.filter-toggle.filter-toggle-529 .filter-label').allTextContents();
    const typeArr:any = Array.from(typeItems);
    const cleanedTypeItems = typeArr.map(item => item.trim());

    const mateialItems = await page.locator('.filter-toggle.filter-toggle-517 .filter-label').allTextContents();
    const materialArr:any = Array.from(mateialItems);
    const cleanedMaterialItems = materialArr.map(item => item.trim());

    const typeString = `Type: ${cleanedTypeItems.join(', ')}`;
    const materialString = `Material: ${cleanedMaterialItems.join(', ')}`;
    const allData = [
        [typeString],
        [materialString]
    ];
    const options = {
    headers: true,
    quote: false
};

if(!fs.existsSync('test_data/furniture_model.csv')){
    csv.writeToPath('test_data/furniture_model.csv', allData, options);
}else{
    console.log("The file already exist")
}
});