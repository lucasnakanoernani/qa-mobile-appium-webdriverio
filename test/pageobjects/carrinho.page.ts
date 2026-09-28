import { $ } from '@wdio/globals';
import Page from './page.js';

class CarrinhoPage extends Page {
    get nomeProduto() {
        return $('id=com.saucelabs.mydemoapp.android:id/titleTV');
    }

    get precoProduto() {
        return $('id=com.saucelabs.mydemoapp.android:id/priceTV');
    }

    get quantidade() {
        return $('id=com.saucelabs.mydemoapp.android:id/noTV');
    }

    get btnRemover() {
        return $('id=com.saucelabs.mydemoapp.android:id/removeBt');
    }

    get estadoVazio() {
        return $('id=com.saucelabs.mydemoapp.android:id/noItemTitleTV');
    }

    async aguardarProduto() {
        await this.nomeProduto.waitForDisplayed();
    }

    async removerProduto() {
        await this.btnRemover.click();
    }
}

export default new CarrinhoPage();