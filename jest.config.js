/** @type {import("jest").Config} */
module.exports = {
  testEnvironment: "node",
  roots: ["<rootDir>/tests"],
  transform: {
    "^.+\\.ts$": "<rootDir>/jest.transform.js"
  },
  coverageProvider: "v8",
  collectCoverageFrom: [
    "src/**/*.ts",
    // Só inicia o servidor e conecta no MySQL; a lógica fica em app.ts.
    "!src/server.ts"
  ],
  coverageThreshold: {
    global: {
      branches: 90,
      functions: 90,
      lines: 90,
      statements: 90
    }
  }
};
