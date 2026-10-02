import { NextFunction, Request, Response } from "express";
import { AppError } from "../errors/app.error";

export function tratarErros(erro: unknown, req: Request, res: Response, next: NextFunction) {
    if (erro instanceof AppError) {
        return res.status(erro.statusCode).json({ mensagem: erro.message });
    }

    if (erro instanceof SyntaxError) {
        return res.status(400).json({ mensagem: "JSON inválido" });
    }

    console.error(erro);
    return res.status(500).json({ mensagem: "Erro interno do servidor" });
}
