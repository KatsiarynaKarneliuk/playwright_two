import { test } from '@playwright/test';
import { saveGatheringData } from '../../../utils/gathering_data_for_Pict';
import { executePictOnFiles } from '../../../utils/generate_pict_model';
import { promises as fs } from 'fs';
import * as path from 'path';

test('Run the creation of files function', async()=>{
    await saveGatheringData();
    await executePictOnFiles();
    await splitFile('test_data/filters/handled.csv', 5).catch(console.error);
})
async function splitFile(filePath: string, linesPerFile: number) {
    const data = await fs.readFile(filePath, 'utf-8');
    const lines = data.split('\n');

    let currentFileIndex = 0;
    let currentLines: string[] = [];

    for (let i = 0; i < lines.length; i++) {
        currentLines.push(lines[i]);

        if (currentLines.length >= linesPerFile || i === lines.length - 1) {
            const dirName = path.dirname(filePath);
            const newDir = path.join(dirName, 'parts');
            await fs.mkdir(newDir, { recursive: true });
            const newFileName = `${path.basename(filePath, '.csv')}_part_${currentFileIndex}.csv`;
            const newFilePath = path.join(newDir, newFileName);
            await fs.writeFile(newFilePath, currentLines.join('\n'), 'utf-8');
            

            currentLines = [];
            currentFileIndex++;
        }
    }
}

