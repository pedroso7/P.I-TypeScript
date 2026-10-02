import { Produto } from "../../src/model/produto.model";

describe("Produto", () => {
    it("guarda os dados recebidos no construtor", () => {
        const produto = new Produto({ id: 1, nome: "Notebook", preco: 3500 });

        expect(produto).toEqual({ id: 1, nome: "Notebook", preco: 3500 });
    });

    it("está em promoção quando o preço é menor que 100", () => {
        expect(new Produto({ id: 1, nome: "Caneta", preco: 99.9 }).estarEmPromocao()).toBe(true);
    });

    it("não está em promoção quando o preço é 100 ou mais", () => {
        expect(new Produto({ id: 1, nome: "Mouse", preco: 100 }).estarEmPromocao()).toBe(false);
    });
});
