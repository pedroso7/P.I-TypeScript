import { Request, Response } from "express";
import { ProdutoUseCase } from "../useCases/produto.usecase";

// Erros lançados aqui são enviados pelo Express 5 ao middleware de erros.
export function criarProdutoController(useCase: ProdutoUseCase) {
    return {
        async listar(req: Request, res: Response) {
            const produtos = await useCase.listar();
            res.status(200).json(produtos);
        },

        async buscarPorId(req: Request<{ id: string }>, res: Response) {
            const produto = await useCase.buscarPorId(req.params.id);
            res.status(200).json(produto);
        },

        async criar(req: Request, res: Response) {
            const produto = await useCase.criar(req.body);
            res.status(201).json(produto);
        },

        async atualizar(req: Request<{ id: string }>, res: Response) {
            const produto = await useCase.atualizar(req.params.id, req.body);
            res.status(200).json(produto);
        },

        async remover(req: Request<{ id: string }>, res: Response) {
            await useCase.remover(req.params.id);
            res.status(204).send();
        }
    };
}

export type ProdutoController = ReturnType<typeof criarProdutoController>;
