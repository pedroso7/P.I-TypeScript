import { criarConfigBanco } from "../../src/config/database";

describe("criarConfigBanco", () => {
    it("usa SQLite em memória no ambiente de testes", () => {
        expect(criarConfigBanco({ NODE_ENV: "test" })).toEqual({
            dialect: "sqlite",
            storage: ":memory:",
            logging: false
        });
    });

    it("usa MySQL com valores padrão quando não há variáveis de ambiente", () => {
        expect(criarConfigBanco({})).toEqual({
            dialect: "mysql",
            host: "localhost",
            port: 3306,
            database: "pi_typescript",
            username: "root",
            password: "root",
            logging: false
        });
    });

    it("usa MySQL com os valores das variáveis de ambiente", () => {
        const config = criarConfigBanco({
            DB_HOST: "banco",
            DB_PORT: "3307",
            DB_NAME: "loja",
            DB_USER: "admin",
            DB_PASSWORD: "segredo"
        });

        expect(config).toMatchObject({
            dialect: "mysql",
            host: "banco",
            port: 3307,
            database: "loja",
            username: "admin",
            password: "segredo"
        });
    });

    it("usa process.env quando nenhum ambiente é informado", () => {
        expect(criarConfigBanco().dialect).toBe("sqlite");
    });
});
