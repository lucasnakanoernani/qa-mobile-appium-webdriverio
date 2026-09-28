import { driver } from '@wdio/globals'

export default class Page {
    async voltar(): Promise<void> {
        await driver.back()
    }

    async esconderTeclado(): Promise<void> {
        if (await driver.isKeyboardShown()) await driver.hideKeyboard()
    }
}
