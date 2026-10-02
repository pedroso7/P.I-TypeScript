import { ProdutoModel } from "../database/produto.sequelize";
import { NovoProduto, Produto } from "../model/produto.model";
import { ProdutoRepository } from "./produto.repository";

// O MySQL devolve DECIMAL como texto, por isso o Number().
function paraDominio(model: ProdutoModel): Produto {
  return new Produto({
    id: model.id,
    nome: model.nome,
    preco: Number(model.preco)
  });
}

export class ProdutoRepositorySequelize
  implements ProdutoRepository {

  async listar(): Promise<Produto[]> {
    const produtos = await ProdutoModel.findAll({ order: [["id", "ASC"]] });
    return produtos.map(paraDominio);
  }

  async buscarPorId(
    id: number
  ): Promise<Produto | null> {
    const produto = await ProdutoModel.findByPk(id);
    return produto ? paraDominio(produto) : null;
  }

  async criar(
    produto: NovoProduto
  ): Promise<Produto> {
    const criado = await ProdutoModel.create(produto);
    return paraDominio(criado);
  }

  async atualizar(
    id: number,
    produto: NovoProduto
  ): Promise<Produto | null> {
    const existente = await ProdutoModel.findByPk(id);

    if (!existente) {
      return null;
    }

    await existente.update(produto);
    return paraDominio(existente);
  }

  async remover(
    id: number
  ): Promise<boolean> {
    const removidos = await ProdutoModel.destroy({ where: { id } });
    return removidos > 0;
  }
}
