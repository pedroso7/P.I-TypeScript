class Produto {
    constructor({ id, nome, preco }){
        this.id = id;
        this.nome = nome;
        this.preco = preco;
    }

    estarEmPromocao() {
        return this.preco < 100;
    }
}

module.exports = Produto;