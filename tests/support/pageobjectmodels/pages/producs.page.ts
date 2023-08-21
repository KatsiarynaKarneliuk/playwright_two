import { Page, Locator } from '@playwright/test';

export default class ProductsPage{
    readonly page: Page;
    readonly createButton: Locator;
    readonly freshProduct: Locator;

    constructor(page:Page){
        this.page = page
        this.createButton = page.getByTestId('add-a-product-button');
        this.freshProduct = page.locator('.product-list-table tbody tr').last();
    }

    public async goto(){
        await this.page.goto('https://commitquality.com/');
    }
    public async clickCreateButton(){
        await this.createButton.click();
    }
    public async isPoductExist(){
        if(!await this.freshProduct){
            return false
        }
        return true;
    }
}