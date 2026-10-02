import { AppError } from "../../src/errors/app.error";
import { Produto } from "../../src/model/produto.model";
import { ProdutoRepository } from "../../src/repository/produto.repository";
import { ProdutoUseCase } from "../../src/useCases/produto.usecase";

// Repository falso: testa as regras de negócio sem banco de dados.
function criarRepositoryMock(): jest.Mocked<ProdutoRepository> {
    return {
        listar: jest.fn(),
        buscarPorId: jest.fn(),
        criar: jest.fn(),
        atualizar: jest.fn(),
        remover: jest.fn()
    };
}

describe("ProdutoUseCase", () => {
    const notebook = new Produto({ id: 1, nome: "Notebook", preco: 3500 });
    let repository: jest.Mocked<ProdutoRepository>;
    let useCase: ProdutoUseCase;

    beforeEach(() => {
        repository = criarRepositoryMock();
        useCase = new ProdutoUseCase(repository);
    });

    describe("listar", () => {
        it("devolve os produtos do repository", async () => {
            repository.listar.mockResolvedValue([notebook]);

            await expect(useCase.listar()).resolves.toEqual([notebook]);
        });
    });

    describe("buscarPorId", () => {
        it("devolve o produto encontrado", async () => {
            repository.buscarPorId.mockResolvedValue(notebook);

            await expect(useCase.buscarPorId("1")).resolves.toBe(notebook);
            expect(repository.buscarPorId).toHaveBeenCalledWith(1);
        });

        it("lança 404 quando o produto não existe", async () => {
            repository.buscarPorId.mockResolvedValue(null);

            await expect(useCase.buscarPorId(99)).rejects.toMatchObject({
                message: "Produto não encontrado",
                statusCode: 404
            });
        });

        it.each(["abc", "0", "-1", "1.5"])("lança 400 para o id inválido %p", async (id) => {
            await expect(useCase.buscarPorId(id)).rejects.toMatchObject({
                message: "id inválido",
                statusCode: 400
            });
            expect(repository.buscarPorId).not.toHaveBeenCalled();
        });
    });

    describe("criar", () => {
        it("cria o produto removendo espaços do nome", async () => {
            repository.criar.mockResolvedValue(notebook);

            await expect(useCase.criar({ nome: "  Notebook  ", preco: 3500 })).resolves.toBe(notebook);
            expect(repository.criar).toHaveBeenCalledWith({ nome: "Notebook", preco: 3500 });
        });

        it("aceita preço zero", async () => {
            repository.criar.mockResolvedValue(notebook);

            await useCase.criar({ nome: "Brinde", preco: 0 });
            expect(repository.criar).toHaveBeenCalledWith({ nome: "Brinde", preco: 0 });
        });

        it.each([
            [undefined],
            [{}],
            [{ nome: "", preco: 10 }],
            [{ nome: "   ", preco: 10 }],
            [{ nome: 123, preco: 10 }]
        ])("lança 400 quando o nome é inválido: %p", async (dados) => {
            await expect(useCase.criar(dados)).rejects.toMatchObject({
                message: "nome é obrigatório",
                statusCode: 400
            });
        });

        it.each([
            [{ nome: "Mouse" }],
            [{ nome: "Mouse", preco: "120" }],
            [{ nome: "Mouse", preco: -1 }],
            [{ nome: "Mouse", preco: Number.NaN }],
            [{ nome: "Mouse", preco: Number.POSITIVE_INFINITY }]
        ])("lança 400 quando o preço é inválido: %p", async (dados) => {
            await expect(useCase.criar(dados)).rejects.toMatchObject({
                message: "preco deve ser um número maior ou igual a zero",
                statusCode: 400
            });
            expect(repository.criar).not.toHaveBeenCalled();
        });
    });

    describe("atualizar", () => {
        it("devolve o produto atualizado", async () => {
            const atualizado = new Produto({ id: 1, nome: "Notebook Pro", preco: 5000 });
            repository.atualizar.mockResolvedValue(atualizado);

            await expect(useCase.atualizar("1", { nome: "Notebook Pro", preco: 5000 })).resolves.toBe(atualizado);
            expect(repository.atualizar).toHaveBeenCalledWith(1, { nome: "Notebook Pro", preco: 5000 });
        });

        it("lança 404 quando o produto não existe", async () => {
            repository.atualizar.mockResolvedValue(null);

            await expect(useCase.atualizar(99, { nome: "X", preco: 1 })).rejects.toMatchObject({ statusCode: 404 });
        });

        it("valida os dados antes de atualizar", async () => {
            await expect(useCase.atualizar(1, { nome: "X" })).rejects.toBeInstanceOf(AppError);
            expect(repository.atualizar).not.toHaveBeenCalled();
        });
    });

    describe("remover", () => {
        it("remove o produto existente", async () => {
            repository.remover.mockResolvedValue(true);

            await expect(useCase.remover("1")).resolves.toBeUndefined();
            expect(repository.remover).toHaveBeenCalledWith(1);
        });

        it("lança 404 quando o produto não existe", async () => {
            repository.remover.mockResolvedValue(false);

            await expect(useCase.remover(99)).rejects.toMatchObject({ statusCode: 404 });
        });

        it("lança 400 para id inválido", async () => {
            await expect(useCase.remover("x")).rejects.toMatchObject({ statusCode: 400 });
        });
    });
});
