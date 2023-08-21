//import * as faker from '../../../node_modules/faker';
const faker = require('faker');

(faker as any).locale = 'en';
export const randomData = {
    randomName : faker.name.findName(),
    randomPrice :faker.commerce.price({ min: 100, max: 200 }),
}
