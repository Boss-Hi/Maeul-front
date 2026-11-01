const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const vm = require("node:vm");
const ts = require("typescript");
function client(data, status = 200) {
  const module = { exports: {} };
  const calls = [];
  const code = ts.transpileModule(
    fs.readFileSync("src/lib/api/location.ts", "utf8"),
    {
      compilerOptions: {
        module: ts.ModuleKind.CommonJS,
        target: ts.ScriptTarget.ES2022
      }
    }
  ).outputText;
  vm.runInNewContext(code, {
    module,
    exports: module.exports,
    require,
    URLSearchParams,
    fetch: async (...args) => {
      calls.push(args);
      return new Response(JSON.stringify(data), { status });
    }
  });
  return { api: module.exports, calls };
}
const regions = [
  { code: "11", name: "서울특별시", sigungus: [{ code: "140", name: "중구" }] },
  { code: "26", name: "부산광역시", sigungus: [{ code: "110", name: "중구" }] }
];
test("address maps city within correct province and does not cache coordinates", async () => {
  const { api, calls } = client({
    success: true,
    data: { region1depth: "서울특별시", region2depth: "중구" }
  });
  const result = await api.getLocationRegion(37.5665, 126.978, regions);
  assert.equal(result.regionCode, "11");
  assert.equal(result.cityCode, "140");
  assert.equal(calls[0][0], "/api/location?latitude=37.5665&longitude=126.978");
  assert.equal(calls[0][1].cache, "no-store");
});
test("unknown addresses, invalid data and HTTP errors do not select nationwide", async () => {
  for (const data of [
    {},
    { success: true, data: null },
    {
      success: true,
      data: { region1depth: "서울특별시", region2depth: "없는구" }
    }
  ]) {
    await assert.rejects(client(data).api.getLocationRegion(0, 0, regions));
  }
  for (const status of [400, 500, 502])
    await assert.rejects(
      client({}, status).api.getLocationRegion(0, 0, regions)
    );
});
test("geolocation handles success, unsupported, denied, unavailable and timeout", async () => {
  const { api } = client({});
  await assert.rejects(api.getCurrentCoordinates(undefined), /브라우저/);
  for (const code of [1, 2, 3])
    await assert.rejects(
      api.getCurrentCoordinates({
        getCurrentPosition: (_, reject) => reject({ code })
      })
    );
  const coords = await api.getCurrentCoordinates({
    getCurrentPosition: (resolve, _, options) => {
      assert.equal(options.timeout, 10000);
      resolve({ coords: { latitude: 37.5665, longitude: 126.978 } });
    }
  });
  assert.equal(coords.latitude, 37.5665);
});
