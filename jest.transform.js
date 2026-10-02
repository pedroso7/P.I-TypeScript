// Converte TypeScript para JavaScript nos testes usando o esbuild.
const { transformSync } = require("esbuild");

module.exports = {
  process(sourceText, sourcePath) {
    const { code, map } = transformSync(sourceText, {
      loader: "ts",
      format: "cjs",
      target: "node20",
      sourcemap: true,
      sourcefile: sourcePath
    });

    return { code, map };
  }
};
