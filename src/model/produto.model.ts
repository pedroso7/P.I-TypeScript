export interface ProdutoDados {
    id: number;
    nome: string;
    preco: number;
}

export class Produto implements ProdutoDados {
    id: number;
    nome: string;
    preco: number;

    constructor({ id, nome, preco }: ProdutoDados) {
        this.id = id;
        this.nome = nome;
        this.preco = preco;
    }

    estarEmPromocao(): boolean {
        return this.preco < 100;
    }
}
