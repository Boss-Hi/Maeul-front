const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");
const ts = require("typescript");
module.exports = function loadApi(file, globals = {}) {
  const module = { exports: {} };
  const code = ts.transpileModule(fs.readFileSync(file, "utf8"), { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 } }).outputText;
  vm.runInNewContext(code, {
    module, exports: module.exports, URL, URLSearchParams, Response, ...globals,
    require: name => name.startsWith("@/") ? loadApi(`src/${name.slice(2)}.ts`, globals) : name.startsWith(".") ? loadApi(path.join(path.dirname(file), `${name}.ts`), globals) : require(name)
  });
  return module.exports;
};
