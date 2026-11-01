const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const vm = require("node:vm");
const ts = require("typescript");
function client(payload, status = 200, token = "test") {
  const calls = [];
  const module = { exports: {} };
  const code = ts.transpileModule(fs.readFileSync("src/lib/api/missions.ts", "utf8"), { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 } }).outputText;
  vm.runInNewContext(code, { module, exports: module.exports,
    require: (name) => name === "@/lib/auth/session" ? { ACCESS_TOKEN_STORAGE_KEY: "token", isAccessTokenExpired: () => false } : require(name),
    sessionStorage: { getItem: () => token },
    fetch: async (...args) => { calls.push(args); return new Response(status === 204 ? null : JSON.stringify(payload), { status }); }
  });
  return { api: module.exports, calls };
}
const mission = { id: 4, name: "무대 앞 직관 성공", description: "공연장 방문", startDate: "2026-11-01", endDate: "2026-11-02", completedCount: 0, totalCount: 1, percentage: 0, neighborhoodCount: 0, missionTasks: [{ id: 4, name: "공연장 방문", description: null, isComplete: false }] };
test("current mission preserves server counts, task completion and auth", async () => {
  const { api, calls } = client({ success: true, data: mission });
  const result = await api.getCurrentMission();
  assert.equal(result.name, mission.name);
  assert.equal(result.neighborhoodCount, 0);
  assert.equal(result.missionTasks[0].isComplete, false);
  assert.equal(calls[0][0], "/api/missions/current");
  assert.equal(calls[0][1].headers.Authorization, "Bearer test");
  assert.equal(calls[0][1].cache, "no-store");
});
test("null and 204 are empty states", async () => {
  assert.equal(await client({ success: true, data: null }).api.getCurrentMission(), null);
  assert.equal(await client(null, 204).api.getCurrentMission(), null);
});
test("errors and undocumented 404 do not become empty states", async () => {
  for (const status of [400, 401, 404, 500]) await assert.rejects(client({}, status).api.getCurrentMission(), (error) => error.status === status);
});
test("invalid payloads never show invented progress", async () => {
  for (const data of [{}, { ...mission, percentage: 101 }, { ...mission, missionTasks: [{ id: 4 }] }]) await assert.rejects(client({ success: true, data }).api.getCurrentMission());
});
test("missing auth does not fetch", async () => {
  const { api, calls } = client({}, 200, null);
  await assert.rejects(api.getCurrentMission(), (error) => error.status === 401);
  assert.equal(calls.length, 0);
});
