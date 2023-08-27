import { execSync } from 'child_process';

export async function executePictOnFiles() {
        try{
            execSync('pict test_data/filters/original.csv > test_data/filters/handled.csv');
        }
        catch(error){
            console.log('Error executing pict file')
        }       
    }

