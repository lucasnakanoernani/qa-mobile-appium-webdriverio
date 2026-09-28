import { $ } from '@wdio/globals'
import { env } from '../../config/env.js'
import Page from './page.js'

class CatalogoPage extends Page {

    get titulo() {
        return $(`id=${env.appPackage}:id/productTV`)
    }

    get listaProdutos() {
        return $(`id=${env.appPackage}:id/productRV`)
    }

    get produtoEscolhido() {
        return $('android=new UiSelector().resourceId("com.saucelabs.mydemoapp.android:id/productIV").instance(0)');
    }

    async abrirProduto() {
        await this.aguardarCarregamento();
        await this.produtoEscolhido.click();
    }

    async aguardarCarregamento(): Promise<void> {
        await this.titulo.waitForDisplayed({ timeout: 30000 })
        await this.listaProdutos.waitForDisplayed()
    }
}

export default new CatalogoPage()
