import { test, expect } from '@playwright/test';
import { normalizeString } from '../../../utils/normaliser';
import { readCSV } from '../../../utils/gathering_data_for_Pict'
import { loadTotalParts } from '../../../utils/count_parts';


let totalParts: number;

test.beforeAll(async () => {
  totalParts = await loadTotalParts();
}) 

test(`Use pict files in a test`, async({ page })=>{
  await page.setViewportSize({ width: 1280, height: 1200 });
  
  await page.goto('https://www.beliani.pl/meble-ogrodowe/wszystkie+produkty/?Material=Beton&Typ=Duzy_zestaw_wypoczynkowy,Domek_narzedziowy&Kolor=Bialy&Cechy=Blat_z_otworem_na_parasol&sort=default');
  await page.getByRole('button', { name: 'Akceptuj wszystkie cookies' }).click();
  for (let partIndex = 0; partIndex < totalParts; partIndex++) {
    const csvData = await readCSV(partIndex);
    console.log(`Working file is: ${partIndex}`);
    for (const row of csvData){
      console.log(`Working with row: ${JSON.stringify(row)}`);  
      // clean filters
      await page.locator('.offers-chosen-filters__filter__title').first();
      let labelsCount = await page.locator('.offers-chosen-filters__filter__title').count();
      while (labelsCount > 0) {
        await expect(async () => {
          await page.locator('.offers-chosen-filters__filter__title').first().click();

          labelsCount = await page.locator('.offers-chosen-filters__filter__title').count();
        }).toPass();   
      }

      // choose new filters
      if (row.Type && row.Material){
        try{
          await expect(async () => {
            await page.locator('.top-filter-item',{hasText: 'Typ'}).click();
            await page
              .locator('.filter-toggle.filter-toggle-529 .filter-label')
              .getByText(`${row.Type}`, {exact:true})
              .check();
            await page.locator('.top-filter-item',{hasText: 'Materiał'}).click();
            await page
              .locator('.filter-toggle.filter-toggle-517 .filter-label')
              .getByText(`${row.Material}`, {exact:true})
              .check();
          }).toPass();   
        }catch(error){
          console.error('error during checking two itmes', error)
        }
        // check url
        const expectedPattern = new RegExp(
            `.*${normalizeString(row.Type)}.*${normalizeString(row.Material)}|` + 
            `.*${normalizeString(row.Material)}.*${normalizeString(row.Type)}`
        );

        // check visibility
        await expect(async () => {
          const visibleFilters = page.locator('.offers-chosen-filters__filter__title');

          const typeVisibleFilter = visibleFilters.getByText(`${row.Type}`, {exact:true});
          await expect(typeVisibleFilter).toBeVisible();

          const materialVisibleFilter = visibleFilters.getByText(`${row.Material}`, {exact:true})
          await expect(materialVisibleFilter ).toBeVisible();
        }).toPass(); 
      }
    }
  }
});
