import { $ } from '@wdio/globals';
import Page from './page.js';

class ProdutoPage extends Page {
    get nome() {
        return $('id=com.saucelabs.mydemoapp.android:id/productTV');
    }

    get preco() {
        return $('id=com.saucelabs.mydemoapp.android:id/priceTV');
    }

    get btnAdicionar() {
        return $('id=com.saucelabs.mydemoapp.android:id/cartBt');
    }

    get btnCarrinho() {
        return $('id=com.saucelabs.mydemoapp.android:id/cartIV');
    }

    async aguardarCarregamento() {
        await this.nome.waitForDisplayed();
        await this.preco.waitForDisplayed();
    }

    async adicionarAoCarrinho() {
        await this.btnAdicionar.click();
    }

    async abrirCarrinho() {
        await this.btnCarrinho.click();
    }
}

export default new ProdutoPage();