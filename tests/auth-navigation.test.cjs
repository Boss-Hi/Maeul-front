const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");
const ts = require("typescript");
function load(file) {
  const module = { exports: {} };
  const source = fs.readFileSync(path.join(__dirname, "..", file), "utf8");
  const code = ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.CommonJS } }).outputText;
  vm.runInNewContext(code, { module, exports: module.exports, URL, atob, Date });
  return module.exports;
}
const { safeReturnPath } = load("src/lib/auth/return-path.ts");
const { isAccessTokenExpired } = load("src/lib/auth/session.ts");
test("login return keeps protected destination and event query", () => {
  for (const route of ["/mission", "/plan", "/plan?itineraryId=4", "/plan/new?tour_id=123"]) {
    assert.equal(safeReturnPath(route), route);
  }
});
test("login return rejects external URLs and redirect loops", () => {
  for (const route of [null, "https://evil.test", "//evil.test", "/\\evil.test", "/login", "/oauth/kakao/callback", "/onboarding"]) {
    assert.equal(safeReturnPath(route), "/main");
  }
});
test("malformed, missing-expiry and expired sessions require login", () => {
  const token = (claims) => `e30.${Buffer.from(JSON.stringify(claims)).toString("base64url")}.signature`;
  assert.equal(isAccessTokenExpired("invalid"), true);
  assert.equal(isAccessTokenExpired(token({})), true);
  assert.equal(isAccessTokenExpired(token({ exp: 1 })), true);
  assert.equal(isAccessTokenExpired(token({ exp: Date.now() / 1000 + 3600 })), false);
});
