import { test, expect } from '@playwright/test';
import * as csv from 'fast-csv';
const { execSync } = require('child_process');
const fs = require('fs');
import { normalizeString } from './../../utils/normaliser';


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


test.only('Use pict data in a test', async({ page })=>{
  await page.setViewportSize({ width: 1280, height: 1200 });
  const csvData = await readCSV();
  await page.goto('https://www.beliani.pl/meble-ogrodowe/wszystkie+produkty/?Material=Beton&Typ=Duzy_zestaw_wypoczynkowy,Domek_narzedziowy&Kolor=Bialy&Cechy=Blat_z_otworem_na_parasol&sort=default');
  await page.getByRole('button', { name: 'Akceptuj wszystkie cookies' }).click();

    for (const row of csvData){  
      // clean filters
      await page.waitForTimeout(1000)
      await page.locator('.offers-chosen-filters__filter__title').first().scrollIntoViewIfNeeded();
      let labelsCount = await page.locator('.offers-chosen-filters__filter__title').count();
      while (labelsCount > 0) {
        await expect(async () => {
          await page.locator('.offers-chosen-filters__filter__title').first().click();
          
            labelsCount = await page.locator('.offers-chosen-filters__filter__title').count();
          }).toPass();   
      }
      await page.waitForTimeout(1000)
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
        await page.waitForTimeout(1000)
        //await expect(page).toHaveURL(expectedPattern);
        await page.waitForURL(expectedPattern);

        // check visibility
        await expect(async () => {
          await expect(page.locator('.offers-chosen-filters__filter__title').and(page.getByText(`${row.Type}`, {exact:true}))).toBeVisible();  
          await expect(page.locator('.offers-chosen-filters__filter__title').and(page.getByText(`${row.Material}`, {exact:true}))).toBeVisible();
        }).toPass(); 
      }
  } 
})
