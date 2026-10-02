# P.I-TypeScript

API REST de produtos em Node.js + TypeScript, com Express, Sequelize e MySQL.

## Arquitetura

```
HTTP Request
     ↓
   Routes          src/routes/produto.routes.ts
     ↓
 Controller        src/controllers/produto.controller.ts
     ↓
  Use Case         src/useCases/produto.usecase.ts
   /     \
Repository  Domain src/repository/produto.repository.ts (interface)
   ↓               src/model/produto.model.ts
Sequelize          src/repository/produto.repository.sequelize.ts
   ↓
 MySQL             docker-compose.yml
```

O Use Case depende só da interface `ProdutoRepository` (Dependency Inversion).
A implementação com Sequelize é passada para ele em `src/app.ts`.

## Como rodar

```bash
npm install
cp .env.example .env   # configurações do banco
npm run db:up          # sobe o MySQL no Docker
npm run dev            # http://localhost:3000
```

A tabela `produtos` é criada automaticamente ao iniciar o servidor.

## Rotas

| Método | Rota            | Descrição          | Sucesso |
|--------|-----------------|--------------------|---------|
| GET    | /produtos       | Lista os produtos  | 200     |
| GET    | /produtos/:id   | Busca por id       | 200     |
| POST   | /produtos       | Cria um produto    | 201     |
| PUT    | /produtos/:id   | Atualiza o produto | 200     |
| DELETE | /produtos/:id   | Remove o produto   | 204     |

Corpo do POST e do PUT:

```json
{ "nome": "Notebook", "preco": 3500 }
```

Erros: `400` para dados ou id inválidos, `404` para produto não encontrado.

## Testes

```bash
npm test               # roda os testes
npm run test:coverage  # roda com relatório de cobertura (mínimo exigido: 90%)
```

Os testes usam SQLite em memória, então não precisam do MySQL rodando.

- `tests/unit`: regras de negócio (Use Case com repository falso), domínio e configuração
- `tests/integration`: repository com Sequelize de verdade
- `tests/e2e`: chamadas HTTP na API com o CRUD completo

## Scripts

| Script                  | O que faz                           |
|-------------------------|-------------------------------------|
| `npm run dev`           | Servidor em modo desenvolvimento    |
| `npm run build`         | Compila para `dist/`                |
| `npm start`             | Roda a versão compilada             |
| `npm test`              | Testes com Jest                     |
| `npm run test:coverage` | Testes com cobertura                |
| `npm run db:up`         | Sobe o MySQL (Docker)               |
| `npm run db:down`       | Para o MySQL                        |
