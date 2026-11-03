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
