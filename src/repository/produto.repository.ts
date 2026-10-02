import { NovoProduto, Produto } from "../model/produto.model";

export interface ProdutoRepository {

  listar(): Promise<Produto[]>;

  buscarPorId(
    id: number
  ): Promise<Produto | null>;

  criar(
    produto: NovoProduto
  ): Promise<Produto>;

  atualizar(
    id: number,
    produto: NovoProduto
  ): Promise<Produto | null>;

  remover(
    id: number
  ): Promise<boolean>;
}
