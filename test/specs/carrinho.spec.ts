import { driver, expect } from '@wdio/globals';
import CatalogoPage from '../pageobjects/catalogo.page.js';
import ProdutoPage from '../pageobjects/produto.page.js';
import CarrinhoPage from '../pageobjects/carrinho.page.js';

describe('Carrinho de compras', () => {
    beforeEach(async function () {
        this.timeout(180000);
        // Cria uma nova sessão com as capabilities do projeto.
        await driver.reloadSession();
        await CatalogoPage.aguardarCarregamento();
    });

    it('deve adicionar o produto mantendo nome, preço e quantidade', async () => {
        await CatalogoPage.abrirProduto();
        await ProdutoPage.aguardarCarregamento();

        const nomeEsperado = await ProdutoPage.nome.getText();
        const precoEsperado = await ProdutoPage.preco.getText();

        expect(nomeEsperado.trim()).not.toBe('');
        expect(precoEsperado.trim()).not.toBe('');

        await ProdutoPage.adicionarAoCarrinho();
        await ProdutoPage.abrirCarrinho();

        await CarrinhoPage.aguardarProduto();

        await expect(CarrinhoPage.nomeProduto)
            .toHaveText(nomeEsperado);

        await expect(CarrinhoPage.precoProduto)
            .toHaveText(precoEsperado);

        await expect(CarrinhoPage.quantidade)
            .toHaveText('1');
    });

    it('deve remover o produto e exibir o carrinho vazio', async () => {
        await CatalogoPage.abrirProduto();
        await ProdutoPage.aguardarCarregamento();

        await ProdutoPage.adicionarAoCarrinho();
        await ProdutoPage.abrirCarrinho();
        await CarrinhoPage.aguardarProduto();

        await CarrinhoPage.removerProduto();

        await expect(CarrinhoPage.nomeProduto)
            .not.toBeDisplayed();

        await expect(CarrinhoPage.estadoVazio)
            .toBeDisplayed();
    });
});