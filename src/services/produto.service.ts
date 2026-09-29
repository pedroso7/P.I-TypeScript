const produtos = new Produto('Notebook', 'Mouse');

const Produto =
    require("../models/produto.model");
    
function listar() {
    return produtos;
}

function buscarPorId(id) {
    return produtos.find(p => p.id === Number(id));
}

function criar(dados) {
    if (!dados.nome || dados.preco == null) {
        throw new Error("nome e preco são obrigatórios");
    }

    const produtos = {
        id: produtos.length + 1,
        nome: dados.nome,
        preco: dados.preco
    };

    produtos.push(produtos);
    return produtos;
}

module.exports = { listar, buscarPorId, criar };