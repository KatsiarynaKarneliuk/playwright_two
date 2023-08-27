import { promises as fs } from 'fs';
import * as path from 'path';

export async function loadTotalParts(){
    let totalParts: number;
    const parent_dir =  path.dirname(__dirname)
    const target_dir = path.join(parent_dir,'test_data/filters/parts' )
    const files = await fs.readdir(target_dir)
    return totalParts = files.filter(file => file.startsWith('handled_part_')).length;
}