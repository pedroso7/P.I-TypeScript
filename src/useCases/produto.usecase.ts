import { AppError } from "../errors/app.error";
import { NovoProduto, Produto } from "../model/produto.model";
import { ProdutoRepository } from "../repository/produto.repository";

function validarId(id: unknown): number {
    const numero = Number(id);

    if (!Number.isInteger(numero) || numero <= 0) {
        throw new AppError("id inválido");
    }

    return numero;
}

function validarDados(dados: unknown): NovoProduto {
    const { nome, preco } = (dados ?? {}) as Record<string, unknown>;

    if (typeof nome !== "string" || nome.trim() === "") {
        throw new AppError("nome é obrigatório");
    }

    if (typeof preco !== "number" || !Number.isFinite(preco) || preco < 0) {
        throw new AppError("preco deve ser um número maior ou igual a zero");
    }

    return { nome: nome.trim(), preco };
}

// Regras de negócio. Depende só da interface ProdutoRepository (Dependency Inversion).
export class ProdutoUseCase {
    private readonly repository: ProdutoRepository;

    constructor(repository: ProdutoRepository) {
        this.repository = repository;
    }

    listar(): Promise<Produto[]> {
        return this.repository.listar();
    }

    async buscarPorId(id: unknown): Promise<Produto> {
        const produto = await this.repository.buscarPorId(validarId(id));

        if (!produto) {
            throw new AppError("Produto não encontrado", 404);
        }

        return produto;
    }

    async criar(dados: unknown): Promise<Produto> {
        return this.repository.criar(validarDados(dados));
    }

    async atualizar(id: unknown, dados: unknown): Promise<Produto> {
        const produto = await this.repository.atualizar(validarId(id), validarDados(dados));

        if (!produto) {
            throw new AppError("Produto não encontrado", 404);
        }

        return produto;
    }

    async remover(id: unknown): Promise<void> {
        const removido = await this.repository.remover(validarId(id));

        if (!removido) {
            throw new AppError("Produto não encontrado", 404);
        }
    }
}
