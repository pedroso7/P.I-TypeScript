import { Router } from "express";
import { ProdutoController } from "../controllers/produto.controller";

export function criarProdutoRoutes(produtoController: ProdutoController): Router {
  const router = Router();

  router.get("/", produtoController.listar);

  router.get(
    "/:id",
    produtoController.buscarPorId
  );

  router.post(
    "/",
    produtoController.criar
  );

  router.put(
    "/:id",
    produtoController.atualizar
  );

  router.delete(
    "/:id",
    produtoController.remover
  );

  return router;
}
