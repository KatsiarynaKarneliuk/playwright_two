const { execSync } = require('child_process');

function generatePictModel(inputFile: string, outputFile:string){
    execSync(`pict ${inputFile} > ${outputFile}`);
}
generatePictModel('test_data/furniture_model.csv', 'test_data/result.csv');