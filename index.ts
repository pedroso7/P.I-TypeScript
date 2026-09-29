const express = require("express");
const produtoRoutes = require("./src/routes/produto.routes");
const app = express();

app.use(express.json());
app.use("/produto", produtoRoutes)

const produtos = [
  { id: 1, nome: "Notebook", preco: 3500 },
  { id: 2, nome: "Mouse", preco: 120}
];

app.listen(3000);

