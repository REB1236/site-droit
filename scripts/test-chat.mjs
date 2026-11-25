// Teste le handler /api/chat sans clé réelle (MOCK_LLM=1)
process.env.MOCK_LLM = "1";
const { default: handler } = await import("../api/chat.js");
function fakeRes() {
  const out = [];
  return {
    out,
    headers: {},
    statusCode: 200,
    setHeader(k, v) { this.headers[k] = v; },
    status(c) { this.statusCode = c; return this; },
    json(o) { out.push(JSON.stringify(o)); return this; },
    write(s) { out.push(s); },
    end() { this.ended = true; },
  };
}
const req = { method: "POST", headers: {}, body: { messages: [{ role: "user", content: "Quel est le rôle de la chambre de compensation ?" }], scope: "all" }, on() {} };
const res = fakeRes();
await handler(req, res);
const lines = res.out.join("").trim().split("\n").map((l) => JSON.parse(l));
console.log("status", res.statusCode, "events", lines.map((l) => l.t).join(","));
console.log("sources:", lines[0].items.map((i) => i.label).join(" | "));
console.log("answer:", lines.filter((l) => l.t === "delta").map((l) => l.v).join("").slice(0, 160));
delete process.env.MOCK_LLM;
const res2 = fakeRes();
await handler({ ...req, headers: { "x-forwarded-for": "2.2.2.2" } }, res2);
console.log("sans clé ->", res2.out.join("").trim().split("\n").map((l) => JSON.parse(l).t).join(","), res2.out.join("").includes("NO_KEY"));
