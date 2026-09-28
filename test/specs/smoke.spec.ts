import { driver, expect } from '@wdio/globals'
import { env } from '../../config/env.js'
import CatalogoPage from '../pageobjects/catalogo.page.js'

describe('Smoke | My Demo App Android', () => {
    it('deve abrir o app e exibir o catálogo', async () => {
        await CatalogoPage.aguardarCarregamento()
        expect(await driver.getCurrentPackage()).toBe(env.appPackage)
        await expect(CatalogoPage.titulo).toBeDisplayed()
        await expect(CatalogoPage.listaProdutos).toBeDisplayed()
    })
})
