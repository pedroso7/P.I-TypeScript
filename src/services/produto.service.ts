import { Produto, ProdutoDados } from "../model/produto.model";
import { ProdutoRepository } from "../repository/produto.repository";
import { ProdutoRepositoryMemoria } from "../repository/produto.repository.memoria";

// O service depende só da interface (Dependency Inversion).
const repository: ProdutoRepository = new ProdutoRepositoryMemoria();

export async function listar(): Promise<Produto[]> {
    return repository.listar();
}

export async function buscarPorId(id: string | number): Promise<Produto | null> {
    return repository.buscarPorId(Number(id));
}

export async function criar(dados: Partial<Omit<ProdutoDados, "id">>): Promise<Produto> {
    if (!dados.nome || dados.preco == null) {
        throw new Error("nome e preco são obrigatórios");
    }

    const produtos = await repository.listar();

    const produto = new Produto({
        id: produtos.length + 1,
        nome: dados.nome,
        preco: Number(dados.preco)
    });

    return repository.criar(produto);
}
