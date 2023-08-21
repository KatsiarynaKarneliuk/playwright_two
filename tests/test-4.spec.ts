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

test('generate model for pict', async()=>{
    execSync('pict test_data/furniture_model.csv > test_data/result.csv');
})

async function readCSV():Promise<any[]> {
  return new Promise((resolve)=>{
      let dataArray: any[] =[];
      csv
          .parseFile('test_data/result.csv', {headers:true, delimiter: '\t' })
          .on('data', data=>{
              dataArray.push(data);
          })
          .on('end',()=>{
              resolve(dataArray);
          })
  })
}

function normalizeString(str) {
  const replacements = {
    'ą': 'a',
    'ć': 'c',
    'ę': 'e',
    'ł': 'l',
    'ń': 'n',
    'ó': 'o',
    'ś': 's',
    'ź': 'z',
    'ż': 'z',
    'Ą': 'A',
    'Ć': 'C',
    'Ę': 'E',
    'Ł': 'L',
    'Ń': 'N',
    'Ó': 'O',
    'Ś': 'S',
    'Ź': 'Z',
    'Ż': 'Z',
  };

  let normalized = str;
  for (let [original, replacement] of Object.entries(replacements)) {
    normalized = normalized.replace(new RegExp(original, 'g'), replacement);
  }
  return normalized;
}

test.only('Use pict data in a test', async({ page })=>{
  await page.setViewportSize({ width: 1280, height: 720 });
  const csvData = await readCSV();
  await page.goto('https://www.beliani.pl/meble-ogrodowe/wszystkie+produkty/?Material=Beton&Typ=Duzy_zestaw_wypoczynkowy,Domek_narzedziowy&Kolor=Bialy&Cechy=Blat_z_otworem_na_parasol&sort=default');
  await page.getByRole('button', { name: 'Akceptuj wszystkie cookies' }).click();

  let labelsCount = await page.locator('.offers-chosen-filters__filter__title').count();

  while (labelsCount > 0) {
      await page.locator('.offers-chosen-filters__filter__title').first().click();
      await page.waitForTimeout(500);
      labelsCount = await page.locator('.offers-chosen-filters__filter__title').count();
  }

  for (const row of csvData){  
    if (row.Type && row.Material){
      await page.locator('.top-filter-item',{hasText: 'Typ'}).click();
      await page
        .locator('.filter-toggle.filter-toggle-529 .filter-label')
        .filter({ hasText: row.Type })
        .check();

      await page.locator('.top-filter-item',{hasText: 'Materiał'}).click();
      await page
        .locator('.filter-toggle.filter-toggle-517 .filter-label')
        .filter({ hasText: `${row.Material}`})
        .check();
      const expectedPattern = new RegExp(`${normalizeString(row.Type)}.*${normalizeString(row.Material)}|${normalizeString(row.Material)}.*${normalizeString(row.Type)}`);
      await expect(page).toHaveURL(expectedPattern);
      await page.pause()
      await expect(page.locator('.offers-chosen-filters__filter__title').filter({ hasText: row.Type })).toBeVisible();
      await expect(page.locator('.offers-chosen-filters__filter__title').filter({ hasText: row.Material })).toBeVisible();  
    }
  } 
})
