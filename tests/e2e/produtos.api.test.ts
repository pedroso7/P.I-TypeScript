import request from "supertest";
import { criarApp } from "../../src/app";
import { sequelize } from "../../src/database/sequelize";
import { ProdutoRepository } from "../../src/repository/produto.repository";

// Testa a API completa: Routes -> Controller -> Use Case -> Repository -> Sequelize.
describe("API /produtos", () => {
    const app = criarApp();

    beforeEach(async () => {
        await sequelize.sync({ force: true });
    });

    afterAll(async () => {
        await sequelize.close();
    });

    it("executa o CRUD completo", async () => {
        const criado = await request(app)
            .post("/produtos")
            .send({ nome: "Notebook", preco: 3500 })
            .expect(201);
        expect(criado.body).toEqual({ id: 1, nome: "Notebook", preco: 3500 });

        const lista = await request(app).get("/produtos").expect(200);
        expect(lista.body).toEqual([{ id: 1, nome: "Notebook", preco: 3500 }]);

        const buscado = await request(app).get("/produtos/1").expect(200);
        expect(buscado.body.nome).toBe("Notebook");

        const atualizado = await request(app)
            .put("/produtos/1")
            .send({ nome: "Notebook Pro", preco: 5000 })
            .expect(200);
        expect(atualizado.body).toEqual({ id: 1, nome: "Notebook Pro", preco: 5000 });

        await request(app).delete("/produtos/1").expect(204);
        await request(app).get("/produtos/1").expect(404);
    });

    it("devolve 404 para produto inexistente", async () => {
        const resposta = await request(app).get("/produtos/999").expect(404);
        expect(resposta.body).toEqual({ mensagem: "Produto não encontrado" });

        await request(app).put("/produtos/999").send({ nome: "X", preco: 1 }).expect(404);
        await request(app).delete("/produtos/999").expect(404);
    });

    it("devolve 400 para dados inválidos", async () => {
        const resposta = await request(app).post("/produtos").send({ nome: "Mouse" }).expect(400);
        expect(resposta.body).toEqual({ mensagem: "preco deve ser um número maior ou igual a zero" });
    });

    it("devolve 400 para id inválido", async () => {
        const resposta = await request(app).get("/produtos/abc").expect(400);
        expect(resposta.body).toEqual({ mensagem: "id inválido" });
    });

    it("devolve 400 para JSON mal formado", async () => {
        const resposta = await request(app)
            .post("/produtos")
            .set("Content-Type", "application/json")
            .send("{\"nome\":")
            .expect(400);
        expect(resposta.body).toEqual({ mensagem: "JSON inválido" });
    });

    it("devolve 500 quando ocorre um erro inesperado", async () => {
        const repositoryComFalha = {
            listar: jest.fn().mockRejectedValue(new Error("banco fora do ar"))
        } as unknown as ProdutoRepository;
        const erroLog = jest.spyOn(console, "error").mockImplementation(() => {});

        const resposta = await request(criarApp(repositoryComFalha)).get("/produtos").expect(500);

        expect(resposta.body).toEqual({ mensagem: "Erro interno do servidor" });
        expect(erroLog).toHaveBeenCalled();
        erroLog.mockRestore();
    });
});
