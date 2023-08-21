import { Page, Locator } from '@playwright/test';
import ProductActions from '../sections/addProduct.section';

export default class AddProductPage{
    readonly page: Page;
    readonly productActions: ProductActions;

    constructor(page:Page){
        this.page = page;   
        this.productActions = new ProductActions(this.page);
    }

    public async goto(){
        await this.page.goto('https://commitquality.com/add-product');
        
    }
    public async addProductActions(){
        await this.productActions.fillForm();
    }
}