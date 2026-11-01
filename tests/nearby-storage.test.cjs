const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const vm = require("node:vm");
const ts = require("typescript");
const mod = { exports: {} };
vm.runInNewContext(
  ts.transpileModule(fs.readFileSync("src/lib/nearby-storage.ts", "utf8"), {
    compilerOptions: { module: ts.ModuleKind.CommonJS }
  }).outputText,
  { module: mod, exports: mod.exports }
);
const api = mod.exports;
function storage() {
  const data = new Map();
  return {
    getItem: (key) => data.get(key) ?? null,
    setItem: (key, value) => data.set(key, value)
  };
}
const region = {
  regionCode: "11",
  cityCode: "560",
  label: "서울특별시 영등포구"
};
test("region survives a new session and stores no coordinates", () => {
  const local = storage();
  api.writeNearbyRegion(
    local,
    storage(),
    { ...region, latitude: 37, longitude: 126 },
    123
  );
  const saved = api.readNearbyRegion(local, storage());
  assert.equal(saved.label, region.label);
  assert.equal(saved.checkedAt, 123);
  assert.equal(saved.latitude, undefined);
  assert.equal(saved.longitude, undefined);
});
test("closing prompt preserves previous region", () => {
  const local = storage(),
    session = storage();
  api.writeNearbyRegion(local, session, region);
  api.dismissNearbyPrompt(session);
  assert.equal(api.readNearbyRegion(local, session).cityCode, "560");
  assert.equal(api.isNearbyPromptDismissed(session), true);
  assert.equal(api.isNearbyPromptDismissed(storage()), false);
});
test("legacy session migrates without inventing a lookup timestamp", () => {
  const local = storage(),
    session = storage();
  session.setItem(
    "maeul-nearby-session",
    JSON.stringify({ choice: "allowed", region })
  );
  assert.equal(api.readNearbyRegion(local, session).checkedAt, 0);
  assert.equal(api.readNearbyRegion(local, storage()).label, region.label);
});
test("invalid data ignored and unavailable local storage falls back to session", () => {
  const local = storage(),
    session = storage();
  local.setItem("maeul-nearby-region", "broken");
  assert.equal(api.readNearbyRegion(local, session), null);
  const unavailable = {
    getItem() {
      throw Error();
    },
    setItem() {
      throw Error();
    }
  };
  api.writeNearbyRegion(unavailable, session, region);
  assert.equal(api.readNearbyRegion(unavailable, session).regionCode, "11");
});
