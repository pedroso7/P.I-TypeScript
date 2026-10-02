import "dotenv/config";
import { criarApp } from "./app";
import { sequelize } from "./database/sequelize";

const PORTA = Number(process.env.PORT ?? 3000);

async function iniciar() {
  await sequelize.authenticate();
  await sequelize.sync();

  criarApp().listen(PORTA, () => {
    console.log(`Servidor rodando em http://localhost:${PORTA}`);
  });
}

iniciar().catch((erro) => {
  console.error("Erro ao iniciar o servidor:", erro);
  process.exit(1);
});
