import express from "express";
import produtoRoutes from "./src/routes/produto.routes";

const app = express();

app.use(express.json());
app.use("/produto", produtoRoutes);

app.listen(3000, () => {
  console.log("Servidor rodando em http://localhost:3000");
});
