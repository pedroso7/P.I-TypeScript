import { Produto } from "../model/produto.model";
import { ProdutoRepository } from "./produto.repository";

// Guarda os produtos em memória. Quando o projeto usar banco de dados,
// basta criar uma ProdutoRepositorySequelize que implemente a mesma interface.
export class ProdutoRepositoryMemoria
  implements ProdutoRepository {

  private produtos: Produto[] = [
    new Produto({ id: 1, nome: "Notebook", preco: 3500 }),
    new Produto({ id: 2, nome: "Mouse", preco: 120 })
  ];

  async listar(): Promise<Produto[]> {
    return this.produtos;
  }

  async buscarPorId(
    id: number
  ): Promise<Produto | null> {
    return this.produtos.find(p => p.id === id) ?? null;
  }

  async criar(
    produto: Produto
  ): Promise<Produto> {
    this.produtos.push(produto);
    return produto;
  }
}
