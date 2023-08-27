import { chromium } from 'playwright';
import * as csv from 'fast-csv';
import { promises as fs } from 'fs';
import * as path from 'path';


async function fetchDataFromSite() {
    const browser = await chromium.launch();
    const page = await browser.newPage();
    await page.goto('https://www.beliani.pl/meble-ogrodowe/wszystkie+produkty/?Material=Beton&Typ=Duzy_zestaw_wypoczynkowy,Domek_narzedziowy&Kolor=Bialy&Cechy=Blat_z_otworem_na_parasol&sort=default');
    await page.getByRole('button', { name: 'Akceptuj wszystkie cookies' }).click();

    const typeItems = await page.locator('.filter-toggle.filter-toggle-529 .filter-label').allTextContents();
    const mateialItems = await page.locator('.filter-toggle.filter-toggle-517 .filter-label').allTextContents();
    await browser.close();
    return {
        cleanedTypeItems: typeItems.map(item => item.trim()),
        cleanedMaterialItems: mateialItems.map(item => item.trim())
    };
}

async function saveDataToCSV(data) {
    const dirPath = 'test_data/filters';
    const filePath = path.join(dirPath, 'original.csv');
    try {
        await fs.access(dirPath);
    } catch (error) {
        await fs.mkdir(dirPath);
    }

    const typeString = `Type: ${data.cleanedTypeItems.join(', ')}`;
    const materialString = `Material: ${data.cleanedMaterialItems.join(', ')}`;
    const allData = [
        [typeString],
        [materialString],
    ];
    const options = {
        headers: true,
        quote: false
    };
    
    try {
        await fs.stat(filePath);
        console.log("The file already exists");
    } catch {
        // File doesn't exist, write new file
        return new Promise<void>((resolve, reject) => {
            try {
                csv.writeToPath(filePath, allData, options)
                    .on('finish', resolve)
                    .on('error', reject);
            } catch (error) {
                console.error("Error while writing to file:", error);
                reject(error);
            }
        });
    }
}

export async function saveGatheringData() {
    const data = await fetchDataFromSite();
    await saveDataToCSV(data);
};

export async function readCSV(partIndex: number): Promise<any[]> {
    return new Promise((resolve) => {
        let dataArray: any[] = [];
        const partFileName = `test_data/filters/parts/handled_part_${partIndex}.csv`;
        csv
        .parseFile(partFileName, { headers: true, delimiter: '\t' })
        .on('data', (data) => {
            dataArray.push(data);
        })
        .on('end', () => {
            resolve(dataArray);
        });
    });
}


