import { test as base } from '@playwright/test';
import ProductsPage  from '../pageobjectmodels/pages/producs.page';
import AddProductPage from '../pageobjectmodels/pages/createProduct.page';

export const test =base.extend<{productsPage:ProductsPage;addProductPage: AddProductPage}>({
    productsPage:async({page}, use)=>{
        await use(new ProductsPage(page))
    },
    addProductPage:async({page}, use)=>{
        await use(new AddProductPage(page))
    }
})

