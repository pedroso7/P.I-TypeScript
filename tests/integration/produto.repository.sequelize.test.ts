import { sequelize } from "../../src/database/sequelize";
import { Produto } from "../../src/model/produto.model";
import { ProdutoRepositorySequelize } from "../../src/repository/produto.repository.sequelize";

// Usa o Sequelize de verdade com SQLite em memória (NODE_ENV=test).
describe("ProdutoRepositorySequelize", () => {
    const repository = new ProdutoRepositorySequelize();

    beforeEach(async () => {
        await sequelize.sync({ force: true });
    });

    afterAll(async () => {
        await sequelize.close();
    });

    it("cria e lista produtos em ordem de id", async () => {
        const notebook = await repository.criar({ nome: "Notebook", preco: 3500.5 });
        await repository.criar({ nome: "Mouse", preco: 120 });

        expect(notebook).toBeInstanceOf(Produto);
        expect(notebook).toEqual({ id: 1, nome: "Notebook", preco: 3500.5 });

        const produtos = await repository.listar();
        expect(produtos.map(p => p.nome)).toEqual(["Notebook", "Mouse"]);
    });

    it("lista vazia quando não há produtos", async () => {
        await expect(repository.listar()).resolves.toEqual([]);
    });

    it("busca por id", async () => {
        const criado = await repository.criar({ nome: "Teclado", preco: 80 });

        await expect(repository.buscarPorId(criado.id)).resolves.toEqual(criado);
        await expect(repository.buscarPorId(999)).resolves.toBeNull();
    });

    it("atualiza um produto existente", async () => {
        const criado = await repository.criar({ nome: "Monitor", preco: 900 });

        const atualizado = await repository.atualizar(criado.id, { nome: "Monitor 4K", preco: 1500 });

        expect(atualizado).toEqual({ id: criado.id, nome: "Monitor 4K", preco: 1500 });
        await expect(repository.buscarPorId(criado.id)).resolves.toEqual(atualizado);
    });

    it("devolve null ao atualizar produto inexistente", async () => {
        await expect(repository.atualizar(999, { nome: "X", preco: 1 })).resolves.toBeNull();
    });

    it("remove um produto existente", async () => {
        const criado = await repository.criar({ nome: "Cabo", preco: 15 });

        await expect(repository.remover(criado.id)).resolves.toBe(true);
        await expect(repository.buscarPorId(criado.id)).resolves.toBeNull();
    });

    it("devolve false ao remover produto inexistente", async () => {
        await expect(repository.remover(999)).resolves.toBe(false);
    });
});
