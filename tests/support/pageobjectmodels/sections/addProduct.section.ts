import { Page, Locator } from '@playwright/test';
import { randomData } from '../../services/generator';

//part of creatProduct.page (in this case only one, efective when there is several sections for 1 page)
export default class ProductActions{
    readonly page:Page;
    readonly productName: Locator;
    readonly price: Locator;
    readonly dateStocked: Locator;
    readonly submitButton: Locator;

    constructor(page:Page){
        this.page = page;
        this.productName= page.getByPlaceholder('Enter a product name');
        this.price = page.getByPlaceholder('Enter a price');
        this.dateStocked = page.getByTestId('date-stocked');
        this.submitButton = page.getByRole('button', {name:'submit'});
    }

    public async fillForm(){
        await this.productName.fill(`${randomData.randomName}`);
        await this.price.fill(/*`${randomData.randomPrice}`*/'1');
        await this.dateStocked.click();
        await this.dateStocked.press('ArrowLeft');
        await this.submitButton.click();
    }

}