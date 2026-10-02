import { Request, Response } from "express";
import * as service from "../services/produto.service";

export function listar(req: Request, res: Response) {
    const produtos = service.listar();
    res.status(200).json(produtos);
}

export function buscarPorId(req: Request<{ id: string }>, res: Response) {
    const produto = service.buscarPorId(req.params.id);

    if (!produto) {
        return res.status(404).json({
            mensagem: "Produto não encontrado"
        });
    }

    res.status(200).json(produto);
}

export function criar(req: Request, res: Response) {
    try {
        const produto = service.criar(req.body);
        res.status(201).json(produto);
    } catch (error) {
        const mensagem = error instanceof Error ? error.message : "Erro ao criar produto";
        res.status(400).json({ mensagem });
    }
}
