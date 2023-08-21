import { test, expect } from '@playwright/test';
import * as csv from 'fast-csv';
const { execSync } = require('child_process');
const fs = require('fs');
import { Page } from '@playwright/test';

export async function getTextsFromFilterGroup(page:Page, filterGroup:string): Promise<string[]>{
    const items = await page
        .locator(`[data-filters-group=${filterGroup}]`)
        .filter({ has: page.locator('[data-testid="filters-group-label-content"]')})
        .elementHandles()
    const texts:string[] = [];
    for(let item of items){
        const text = await item.textContent();
        if(text!==null){
            let cleanText =text.replace(/\s+\d+\+?\s+\d+$/, '');
            if(cleanText.startsWith('Facilities')){
                let splitText = cleanText.split(/(Facilities)(.+)/).filter(Boolean);
                if(splitText.length===2){
                    texts.push(splitText[0].trim())
                    cleanText = splitText[1].trim()
                }
            }
            texts.push(cleanText);
        }
    }
    return texts;
}

test('to gather a text from a filters',async({ page })=>{
    await page.goto('https://www.booking.com/searchresults.html?ss=Karpacz%2C+Poland&label=gog235jc-1DCAEoggI46AdIM1gDaLYBiAEBmAExuAEHyAEM2AED6AEB-AECiAIBqAIDuAKNqIenBsACAdICJGY1MDAxZmU4LTgwOWUtNDJmMC1iMTk0LTUzYWJiOTM1MDBmYtgCBOACAQ&aid=397594&lang=en-us&sb=1&src_elem=sb&src=index&dest_id=-507063&dest_type=city&group_adults=2&no_rooms=1&group_children=0&sb_travel_purpose=leisure');
    await page.getByRole('button', { name: 'Accept' }).click()
    
    const reviewScoreTexts = await getTextsFromFilterGroup(page, 'review_score');
    const reviewArr = reviewScoreTexts.map(item => [item]);

    const hotelFacilityTexts = await getTextsFromFilterGroup(page, 'hotelfacility');
    const facArr = hotelFacilityTexts.map(item => [item]);
    const allData = [
        [`${ reviewArr.join(' , ').trim()}`],
        [`${ facArr.join(' , ')}`]
]
    if(!fs.existsSync('test_data/new_model.csv')){
        csv.writeToPath('test_data/new_model.csv',allData);
    }else{
        console.log("The file already exist")
    }
});

// test('generate model', async()=>{
//     execSync('pict test_data/new_model.csv > result.csv');
//     //pict model.txt > result.csv 
// })

async function readCSV():Promise<any[]> {
    return new Promise((resolve)=>{
        let dataArray: JSON[] =[];
        csv
            .parseFile('test_data/result.csv', {headers:true })
            .on('data', data=>{
                dataArray.push(data);
            })
            .on('end',()=>{
                resolve(dataArray);
            })
    })
}

test.skip('Use csv data in a test', async({ page })=>{
    const csvData = await readCSV();
    await page.goto('https://www.booking.com/searchresults.html?ss=Karpacz%2C+Poland&label=gog235jc-1DCAEoggI46AdIM1gDaLYBiAEBmAExuAEHyAEM2AED6AEB-AECiAIBqAIDuAKNqIenBsACAdICJGY1MDAxZmU4LTgwOWUtNDJmMC1iMTk0LTUzYWJiOTM1MDBmYtgCBOACAQ&aid=397594&lang=en-us&sb=1&src_elem=sb&src=index&dest_id=-507063&dest_type=city&group_adults=2&no_rooms=1&group_children=0&sb_travel_purpose=leisure');
    for (const row of csvData){
        await page.fill('.username', row.username)
        await page.fill('.surename', row.surename)
        await expect(await page.locator('.username')).toHaveValue(row.username)
    }
    
})