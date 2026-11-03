const test = require("node:test");
const assert = require("node:assert/strict");
const load = require("./load-api.cjs");
function environment(status) {
  const redirects = [], removed = [];
  return { redirects, removed, globals: {
    fetch: async () => new Response("{}", { status }),
    window: { location: { pathname: "/home", search: "?region=11", replace: url => redirects.push(url) } },
    sessionStorage: { removeItem: key => removed.push(key) }
  } };
}
test("401 clears login and redirects once, retaining destination", async () => {
  const env = environment(401);
  const { apiFetch } = load("src/lib/api/api-fetch.ts", env.globals);
  await Promise.all([apiFetch("/api/a"), apiFetch("/api/b", { method: "PUT" })]);
  assert.equal(env.redirects.length, 1);
  assert.equal(env.redirects[0], "/login?next=%2Fhome%3Fregion%3D11");
  assert.equal(env.removed.length, 1);
});
test("400 and 500 do not redirect to login", async () => {
  for (const status of [200, 400, 403, 500, 502]) {
    const env = environment(status);
    await load("src/lib/api/api-fetch.ts", env.globals).apiFetch("/api/a");
    assert.equal(env.redirects.length, 0);
  }
});
test("festival list/detail, categories, regions, profile and survey distinguish empty from errors", async () => {
  for (const status of [400, 500]) {
    const globals = environment(status).globals;
    const festivals = load("src/lib/api/festivals.ts", globals);
    const calls = [
      () => festivals.getFestival("1"),
      () => festivals.getPopularFestivals(),
      () => festivals.getFestivalCategories(),
      () => load("src/lib/api/regions.ts", globals).getRegions(),
      () => load("src/lib/api/profile.ts", globals).getMyProfile("test"),
      () => load("src/lib/api/surveys.ts", globals).getFirstSurvey()
    ];
    for (const call of calls) {
      if (status === 500) await assert.rejects(call());
      else { const value = await call(); assert.ok(value === null || (Array.isArray(value) && value.length === 0)); }
    }
    if (status === 400) {
      const page = await festivals.getFestivals({ page: 0, category: "EV" });
      assert.equal(page.content.length, 0);
      assert.equal(page.last, true);
    } else await assert.rejects(festivals.getFestivals({ page: 0, category: "EV" }));
  }
});
test("all direct API clients use the shared 401 handler", async () => {
  for (const [file, invoke] of [
    ["profile", api => api.getMyProfile("test")],
    ["surveys", api => api.getCurrentSurveyResponse("test")],
    ["location", api => api.getLocationRegion(37, 126, [])],
    ["client", api => api.getJson("/api/regions")]
  ]) {
    const env = environment(401);
    await assert.rejects(invoke(load(`src/lib/api/${file}.ts`, env.globals)));
    assert.equal(env.redirects.length, 1);
  }
});
