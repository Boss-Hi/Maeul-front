const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const vm = require("node:vm");
const ts = require("typescript");
const mod = { exports: {} };
vm.runInNewContext(ts.transpileModule(fs.readFileSync("src/lib/api/surveys.ts", "utf8"), { compilerOptions: { module: ts.ModuleKind.CommonJS } }).outputText, { module: mod, exports: mod.exports, require: name => name === "./api-fetch" ? require("./load-api.cjs")("src/lib/api/api-fetch.ts") : require(name) });
const { hasSavedSurveyAnswers } = mod.exports;
test("new accounts and empty response records must not skip onboarding", () => {
  assert.equal(hasSavedSurveyAnswers(null), false);
  assert.equal(hasSavedSurveyAnswers({ id: 3, answers: [] }), false);
});
test("saved survey answers allow returning users to continue", () => {
  assert.equal(hasSavedSurveyAnswers({ id: 3, answers: [{ questionId: 1, optionId: 3 }] }), true);
});

function apiWithStatus(status) {
  const module = { exports: {} };
  vm.runInNewContext(ts.transpileModule(fs.readFileSync("src/lib/api/surveys.ts", "utf8"), { compilerOptions: { module: ts.ModuleKind.CommonJS } }).outputText, {
    module, exports: module.exports, require: name => name === "./api-fetch" ? require("./load-api.cjs")("src/lib/api/api-fetch.ts", { fetch: async () => new Response("{}", { status }) }) : require(name),
    fetch: async () => new Response(JSON.stringify({ message: "Bad Request" }), { status })
  });
  return module.exports;
}
test("current survey 400 and 404 start onboarding regardless of message", async () => {
  for (const status of [400, 404]) {
    const result = await apiWithStatus(status).getCurrentSurveyResponse("test-token");
    assert.equal(result, null);
    assert.equal(hasSavedSurveyAnswers(result), false);
  }
});
test("authentication and server failures remain errors", async () => {
  for (const status of [401, 403, 500, 502]) {
    await assert.rejects(apiWithStatus(status).getCurrentSurveyResponse("test-token"));
  }
});
test("create and update 400 responses remain errors", async () => {
  const api = apiWithStatus(400);
  const payload = { surveyId: 1, answers: [{ questionId: 1, selectedOptionIds: [3] }] };
  await assert.rejects(api.storeSurvey(payload, "test-token"));
  await assert.rejects(api.updateSurveyResponse({ id: 3, answers: [{ id: 123, questionId: 1, optionId: 3 }] }, payload, "test-token"));
});

test("updates use answer IDs and preserve unchanged multiple choices", () => {
  const current = { id: 4, answers: [
    { id: 123, questionId: 1, optionId: 3 },
    { id: 124, questionId: 2, optionId: 7 },
    { id: 125, questionId: 2, optionId: 8 }
  ] };
  const result = mod.exports.toSurveyUpdateAnswers(current, [
    { questionId: 1, selectedOptionIds: [4] },
    { questionId: 2, selectedOptionIds: [9, 7] }
  ]);
  assert.equal(JSON.stringify(result), JSON.stringify([{ id: 123, optionId: 4 }, { id: 125, optionId: 9 }, { id: 124, optionId: 7 }]));
});
test("missing IDs and unknown add/delete contracts never invent answer IDs", () => {
  assert.throws(() => mod.exports.toSurveyUpdateAnswers({ id: 4, answers: [{ questionId: 1, optionId: 3 }] }, [{ questionId: 1, selectedOptionIds: [4] }]));
  assert.throws(() => mod.exports.toSurveyUpdateAnswers({ id: 4, answers: [{ id: 123, questionId: 1, optionId: 3 }] }, [{ questionId: 1, selectedOptionIds: [3, 4] }]));
});

test("reducing choices sends only selected answer records", () => {
  const result = mod.exports.toSurveyUpdateAnswers({ id: 4, answers: [
    { id: 23, questionId: 4, optionId: 17 },
    { id: 24, questionId: 4, optionId: 18 }
  ] }, [{ questionId: 4, selectedOptionIds: [18] }]);
  assert.equal(JSON.stringify(result), JSON.stringify([{ id: 24, optionId: 18 }]));
});

test("update refreshes IDs before PUT and confirms persisted answers afterwards", async () => {
  const calls = [];
  const latest = { id: 4, answers: [{ id: 90, questionId: 1, optionId: 3 }] };
  const api = require("./load-api.cjs")("src/lib/api/surveys.ts", { fetch: async (url, options) => {
    calls.push({ url, options });
    if (options.method === "PUT") return new Response("{}");
    return new Response(JSON.stringify({ success: true, data: calls.length === 1 ? latest : { ...latest, answers: [{ id: 90, questionId: 1, optionId: 4 }] } }));
  } });
  await api.updateSurveyResponse({ id: 4, answers: [{ id: 20, questionId: 1, optionId: 3 }] }, { surveyId: 1, answers: [{ questionId: 1, selectedOptionIds: [4] }] }, "test");
  assert.equal(calls.length, 3);
  assert.deepEqual(JSON.parse(calls[1].options.body).answers, [{ id: 90, optionId: 4 }]);
});

test("unchanged server answers after PUT never show success", async () => {
  const current = { id: 4, answers: [{ id: 20, questionId: 1, optionId: 3 }] };
  const api = require("./load-api.cjs")("src/lib/api/surveys.ts", { fetch: async () => new Response(JSON.stringify({ success: true, data: current })) });
  await assert.rejects(api.updateSurveyResponse(current, { surveyId: 1, answers: [{ questionId: 1, selectedOptionIds: [4] }] }, "test"), /선택 내용과 달라요/);
});
