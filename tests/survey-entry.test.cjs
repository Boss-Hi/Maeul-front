const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const vm = require("node:vm");
const ts = require("typescript");
const mod = { exports: {} };
vm.runInNewContext(ts.transpileModule(fs.readFileSync("src/lib/api/surveys.ts", "utf8"), { compilerOptions: { module: ts.ModuleKind.CommonJS } }).outputText, { module: mod, exports: mod.exports, require });
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
    module, exports: module.exports, require,
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
