const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");
const ts = require("typescript");

function load(relative, imports = {}, globals = {}) {
  const source = fs.readFileSync(path.join(__dirname, "..", relative), "utf8");
  const code = ts.transpileModule(source, { compilerOptions: {
    module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022
  }}).outputText;
  const module = { exports: {} };
  vm.runInNewContext(code, {
    module, exports: module.exports,
    require: name => imports[name] ?? require(name),
    Response, AbortController, ...globals
  });
  return module.exports;
}
const contract = load("src/lib/itinerary-contract.ts");
const schedule = { id: 31, sequence: 1, type: "NORMAL", title: "산책", description: "", tour: null };
const day = { id: 13, date: "2026-11-01", dayNumber: 1, schedules: [schedule] };
function client(response, token = "test-token") {
  const calls = [];
  return {
    calls,
    api: load("src/lib/api/itinerary.ts", {
      "@/lib/itinerary-contract": contract,
      "@/lib/itinerary-history": { rememberItinerary: () => {} },
      "@/lib/auth/session": { ACCESS_TOKEN_STORAGE_KEY: "token", isAccessTokenExpired: () => false }
    }, {
      sessionStorage: { getItem: () => token },
      fetch: async (url, options) => { calls.push({ url, options }); return response(); }
    })
  };
}
const ok = data => new Response(JSON.stringify({ success: true, data }));

test("only documented methods and nested routes are allowed", () => {
  for (const [method, route] of [
    ["GET","current"], ["GET","4"], ["GET","4/days/13"],
    ["GET","4/days/13/schedules/31"], ["POST","generate"],
    ["POST","4/days/13/schedules"], ["PUT","4/days/13/schedules/31"],
    ["PUT","4/days/13/schedules/reorder"]
  ]) assert.equal(contract.itineraryRouteAllowed(method, route.split("/")), true);
  for (const [method, route] of [
    ["DELETE","4"], ["PUT","4"], ["GET","4/days/13/schedules/reorder"],
    ["POST","4/days/0/schedules"], ["GET","../users"], ["POST","current"]
  ]) assert.equal(contract.itineraryRouteAllowed(method, route.split("/")), false);
});
test("normal and tour inputs reject missing fields", () => {
  assert.equal(contract.scheduleInputSchema.safeParse({ type:"NORMAL",title:" ",description:"" }).success, false);
  assert.equal(contract.scheduleInputSchema.safeParse({ type:"TOUR",contentId:"bad" }).success, false);
  assert.equal(contract.scheduleInputSchema.safeParse({ type:"TOUR",contentId:"3382746" }).success, true);
});
test("reorder requires unique schedule ids and consecutive sequences", () => {
  assert.equal(contract.reorderSchema.safeParse({schedules:[{id:31,sequence:1},{id:31,sequence:2}]}).success, false);
  assert.equal(contract.reorderSchema.safeParse({schedules:[{id:31,sequence:2}]}).success, false);
});
test("day and schedule reads use entity IDs, not day number or sequence", async () => {
  const c = client(() => ok(day));
  assert.equal((await c.api.getItineraryDay(4,13)).id,13);
  assert.equal(c.calls[0].url,"/api/itinerary/4/days/13");
  const detail = client(() => ok(schedule));
  assert.equal((await detail.api.getSchedule(4,13,31)).id,31);
  assert.equal(detail.calls[0].url,"/api/itinerary/4/days/13/schedules/31");
});
test("create and update send the documented payload and methods", async () => {
  const c = client(() => ok(schedule));
  await c.api.saveSchedule(4,13,{type:"NORMAL",title:" 산책 ",description:""});
  assert.equal(c.calls[0].options.method,"POST");
  assert.deepEqual(JSON.parse(c.calls[0].options.body), {type:"NORMAL",title:"산책",description:""});
  await c.api.saveSchedule(4,13,{type:"TOUR",contentId:"3382746"},31);
  assert.equal(c.calls[1].options.method,"PUT");
  assert.equal(c.calls[1].options.headers.Authorization,"Bearer test-token");
  assert.deepEqual(JSON.parse(c.calls[1].options.body),{type:"TOUR",contentId:"3382746"});
});
test("reorder sends the complete ordered list with 1-based sequence", async () => {
  const c = client(() => ok([]));
  await c.api.reorderSchedules(4,13,[33,31,32]);
  assert.equal(c.calls[0].url,"/api/itinerary/4/days/13/schedules/reorder");
  assert.deepEqual(JSON.parse(c.calls[0].options.body),{schedules:[{id:33,sequence:1},{id:31,sequence:2},{id:32,sequence:3}]});
});
test("missing login does not send a request", async () => {
  const c = client(() => ok(day),null);
  await assert.rejects(c.api.getItineraryDay(4,13), error => error.status === 401);
  assert.equal(c.calls.length,0);
});
test("only known missing-current error becomes an empty state", async () => {
  const missing = client(() => new Response(JSON.stringify({message:"일정을 찾을 수 없습니다: "}),{status:400}));
  assert.equal(await missing.api.getCurrentItinerary(),null);
  const bad = client(() => new Response(JSON.stringify({message:"다른 오류"}),{status:400}));
  await assert.rejects(bad.api.getCurrentItinerary(),error => error.status === 400);
});
test("failed mutation stays a failure, never a local success", async () => {
  const c = client(() => new Response("{}",{status:500}));
  await assert.rejects(c.api.saveSchedule(4,13,{type:"NORMAL",title:"산책",description:""}),error => error.status === 500);
});

test("proxy forwards nested routes and preserves upstream errors", async () => {
  const calls = [];
  const route = load("src/app/api/itinerary/[[...path]]/route.ts", {
    "@/lib/itinerary-contract": contract
  }, {
    URL, process, AbortSignal,
    fetch: async (url, options) => {
      calls.push({ url, options });
      return new Response(JSON.stringify({message:"수정 실패"}),{status:400});
    }
  });
  const response = await route.PUT(new Request("http://localhost/api/itinerary/4/days/13/schedules/31", {
    method:"PUT",headers:{authorization:"Bearer test-token","Content-Type":"application/json"},
    body:JSON.stringify({type:"TOUR",contentId:"3382746"})
  }),{params:Promise.resolve({path:["4","days","13","schedules","31"]})});
  assert.equal(response.status,400);
  assert.equal(calls[0].url.pathname,"/api/itinerary/4/days/13/schedules/31");
  assert.equal(calls[0].options.method,"PUT");
});
test("proxy rejects invalid input before accessing the backend", async () => {
  let calls = 0;
  const route = load("src/app/api/itinerary/[[...path]]/route.ts", {
    "@/lib/itinerary-contract": contract
  }, { URL, process, AbortSignal, fetch: async () => {calls++;return ok(null);} });
  const response = await route.POST(new Request("http://localhost/api/itinerary/4/days/13/schedules", {
    method:"POST",headers:{authorization:"Bearer test-token","Content-Type":"application/json"},
    body:JSON.stringify({type:"NORMAL",title:"",description:""})
  }),{params:Promise.resolve({path:["4","days","13","schedules"]})});
  assert.equal(response.status,400);
  assert.equal(calls,0);
});
