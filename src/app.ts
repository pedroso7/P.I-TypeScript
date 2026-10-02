import express from "express";
import { criarProdutoController } from "./controllers/produto.controller";
import { tratarErros } from "./middlewares/erro.middleware";
import { ProdutoRepository } from "./repository/produto.repository";
import { ProdutoRepositorySequelize } from "./repository/produto.repository.sequelize";
import { criarProdutoRoutes } from "./routes/produto.routes";
import { ProdutoUseCase } from "./useCases/produto.usecase";

export function criarApp(
  repository: ProdutoRepository = new ProdutoRepositorySequelize()
) {
  const app = express();

  app.use(express.json());

  const produtoController = criarProdutoController(new ProdutoUseCase(repository));
  app.use("/produtos", criarProdutoRoutes(produtoController));

  app.use(tratarErros);

  return app;
}
