import { Options } from "sequelize";

// Em testes usa SQLite em memória; nos demais ambientes usa MySQL.
export function criarConfigBanco(env: NodeJS.ProcessEnv = process.env): Options {
    if (env.NODE_ENV === "test") {
        return { dialect: "sqlite", storage: ":memory:", logging: false };
    }

    return {
        dialect: "mysql",
        host: env.DB_HOST ?? "localhost",
        port: Number(env.DB_PORT ?? 3306),
        database: env.DB_NAME ?? "pi_typescript",
        username: env.DB_USER ?? "root",
        password: env.DB_PASSWORD ?? "root",
        logging: false
    };
}
