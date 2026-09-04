"use strict";
const test = require("node:test"),
  assert = require("node:assert/strict"),
  fs = require("node:fs"),
  path = require("node:path");
const E = require("../../pam-ai/engine.js"),
  X = require("../../pam-ai/examples.js"),
  excel = JSON.parse(
    fs
      .readFileSync(path.join(__dirname, "excel-fixtures.json"), "utf8")
      .replace(/^\uFEFF/, ""),
  );
function fixture(spec) {
  const a = X.create(spec.route === "R1" ? "pilot" : "full");
  a.intake.scope = spec.scope;
  a.intake.answers[0] = spec.route === "R1" ? "Laag" : "Middel";
  a.design.strata[0].target = spec.n;
  a.decision.selected = spec.noSelection
    ? []
    : spec.multiple
      ? ["C01", "C02"]
      : ["C01"];
  a.decision.outcome = spec.multiple ? "Meerdere opties" : "Eén optie";
  a.decision.conditions = spec.conditions
    ? "FICTIEF begrensd, controleren en stoppen bij incident"
    : spec.scope === "Gecontroleerde pilot"
      ? ""
      : "FICTIEF geen aanvullende voorwaarden; vaste scope en menselijke controle.";
  a.runs = [];
  for (const c of a.candidates) {
    for (let k = 0; k < spec.n; k++)
      a.runs.push({
        id: c.id + "-" + k,
        candidate: c.id,
        testCase: "TC-" + k,
        stratum: "S01",
        accepted: k < spec.accepted ? 1 : 0,
        critical: k < spec.critical ? 1 : 0,
        quality: null,
        calls: 1,
        retries: 0,
        verify: 2,
        correct: 1,
        latency: 5,
        cost: spec.missingCost && k === 0 && c.id === "C01" ? null : 0.02,
        inputTokens: null,
        outputTokens: null,
        reasoningTokens: null,
        energy: null,
        carbon: null,
        water: null,
        evidence: "B01",
        notes: "FICTIEF",
        configStamp: E.configStamp(c),
        designStamp: E.designStamp(a),
      });
  }
  if (spec.gateFail) a.candidates[0].gate[0].status = "FAIL";
  if (spec.missingGateEvidence)
    a.candidates[0].gate.forEach((g) => (g.evidence = ""));
  return a;
}
for (const row of excel.results)
  test("Excel fixture: " + row.id, () => {
    const a = fixture(row.fixture),
      v = E.analysis(a, a.candidates[0]),
      ex = row.excel;
    assert.equal(v.gate1, ex["03_Poort1!M5"]);
    assert.equal(v.gate2, ex["06_Analyse!P5"]);
    assert.equal(v.floor, ex["01_Intake!B37"]);
    assert.equal(v.n, ex["06_Analyse!E5"]);
    assert.equal(v.accepted, ex["06_Analyse!G5"]);
    assert.equal(v.numeric, ex["06_Analyse!N18"]);
    assert.ok(Math.abs(v.lcb - ex["06_Analyse!I5"]) < 1e-12);
    assert.ok(Math.abs(v.ucb - ex["06_Analyse!L5"]) < 1e-12);
    if (!row.fixture.missingCost)
      assert.ok(Math.abs(v.measures.cost.value - ex["06_Analyse!C18"]) < 1e-12);
    else assert.equal(v.measures.cost.value, null);
    assert.equal(v.measures.energy.value, null);
    assert.equal(
      E.readiness(a).status,
      row.id === "r1_broader_scope_source_gap" ? "HOLD" : ex["09_Besluit!B46"],
    );
  });
test("Bewijsbodem exact 35 / 189 / 189", () =>
  assert.deepEqual(E.floor(E.newAssessment().intake.thresholds), {
    success: 35,
    critical: 189,
    effective: 189,
  }));
test("Leeg en gemeten nul blijven onderscheiden", () => {
  const a = X.create();
  a.runs[0].cost = null;
  assert.equal(E.analysis(a, a.candidates[0]).measures.cost.value, null);
  a.runs[0].cost = 0;
  assert.equal(E.analysis(a, a.candidates[0]).measures.cost.value, 0);
});
test("FAIL blijft hard bij lege overige domeinen", () => {
  const a = X.create();
  a.candidates[0].gate[0].status = "FAIL";
  a.candidates[0].gate[1].status = "";
  assert.equal(E.gate1(a, a.candidates[0]), "FAIL");
  assert.equal(E.pairwise(a, a.pairs[0]).allowed, false);
  assert.equal(E.readiness(a).status, "HOLD");
});
test("Dubbele testcase telt niet als nieuw bewijs", () => {
  const a = X.create();
  a.runs.push(E.clone(a.runs[0]));
  assert.equal(E.analysis(a, a.candidates[0]).gate2, "INCOMPLETE DATA");
});
test("Configuratie- en normdrift maken oud testbewijs ongeldig", () => {
  const a = X.create();
  a.candidates[0].version = "nieuw";
  assert.equal(E.analysis(a, a.candidates[0]).gate2, "INCOMPLETE DATA");
  const b = X.create();
  b.intake.thresholds.success = 0.8;
  assert.equal(E.analysis(b, b.candidates[0]).gate2, "INCOMPLETE DATA");
});
test("Scheidingszeichen zijn geen bewijs", () => {
  const a = X.create();
  assert.equal(E.refsValid(a, ","), false);
  assert.equal(E.refsValid(a, "; \n"), false);
});
test("Bewijs U en onbeperkte C ondersteunen geen voldoende bewijs", () => {
  const a = X.create();
  a.evidence[0].grade = "U";
  assert.equal(E.gate1(a, a.candidates[0]), "INCOMPLETE EVIDENCE");
  a.evidence[0].grade = "C";
  assert.equal(E.refsValid(a, "B01"), false);
  a.evidence[0].useLimits =
    "Beperkte claim: alleen het beschreven fictieve bereik.";
  assert.equal(E.refsValid(a, "B01"), true);
});
test("Import herberekent, accepteert concepten en bewaart geen berekende status", () => {
  for (const a of [E.newAssessment(), X.create()]) {
    const b = E.parseImport(JSON.stringify(a));
    assert.notEqual(a.id, b.id);
    assert.equal(E.readiness(a).status, E.readiness(b).status);
  }
});
test("Import weigert route/scope/outcome/critical bypass", () => {
  for (const mutate of [
    (a) => (a.intake.confirmedRoute = "R0"),
    (a) => (a.intake.scope = "fake"),
    (a) => (a.decision.outcome = "fake"),
    (a) => (a.intake.critical = {}),
    (a) => (a.intake.critical.cost = "false"),
    (a) => (a.candidates[0].gate[0].status = "fake"),
  ]) {
    const a = X.create();
    mutate(a);
    assert.throws(() => E.parseImport(JSON.stringify(a)));
  }
});
test("Import weigert ongeldige JSON, versie en prototype keys", () => {
  assert.throws(() => E.parseImport("{"));
  const a = X.create();
  a.methodVersion = "0";
  assert.throws(() => E.parseImport(JSON.stringify(a)));
  assert.throws(() =>
    E.parseImport(
      '{"schema":"pam-ai-assessment/1","methodVersion":"1.1","__proto__":{}}',
    ),
  );
});
test("NO-GO kan zonder overbodige tests worden vastgelegd", () => {
  const a = X.create();
  a.decision.outcome = "NO-GO";
  a.decision.selected = [];
  a.runs = [];
  a.design = E.newAssessment().design;
  a.intake.thresholdReason = "";
  const r = E.readiness(a);
  assert.equal(r.recordComplete, true);
  assert.equal(r.status, "HOLD");
});
test("R3 en R4 vragen aanvullende review", () => {
  const a = X.create();
  a.intake.confirmedRoute = "R4";
  a.intake.routeReason = "FICTIEF opschalen";
  assert.ok(E.readiness(a).issues.some((x) => x.includes("formele")));
  assert.ok(E.readiness(a).issues.some((x) => x.includes("reviewer")));
});
test("Eén passende kandidaat en onderbouwd uitgesloten baseline", () => {
  const a = X.create();
  a.candidates[0].gate[0].status = "FAIL";
  a.decision.selected = ["C02"];
  a.decision.outcome = "Eén optie";
  a.decision.alternatives =
    "Fictief: de baseline is uitgesloten. Geen andere lichtere haalbare optie, zie B01.";
  assert.equal(E.readiness(a).status, "DECISION-READY");
});
test("Retries en kosten van mislukkingen blijven in de teller", () => {
  const a = X.create();
  const c = a.candidates[1],
    rows = a.runs.filter((r) => r.candidate === c.id);
  rows[0].accepted = 0;
  rows[0].calls = 3;
  rows[0].retries = 2;
  rows[0].cost = 1;
  rows[0].critical = 1;
  const v = E.analysis(a, c);
  assert.equal(v.n, 189);
  assert.equal(v.critical, 1);
  assert.ok(Math.abs(v.measures.cost.value - (188 * 0.02 + 1) / 188) < 1e-12);
  assert.equal(v.measures.retries.value, 2 / 188);
});
test("Alle zeven routeringsvragen zijn nodig", () => {
  const a = E.newAssessment();
  assert.equal(E.route(a), "");
  a.intake.answers = ["Laag", "Ja", "Nee", "Nee", "Beperkt", "Nee", "Nee"];
  assert.equal(E.route(a), "R1");
  a.intake.answers[6] = "Ja";
  assert.equal(E.route(a), "R3");
  a.intake.answers[3] = "Ja";
  assert.equal(E.route(a), "R4");
});
test("Reviewdatum telt echte kalenderdagen", () => {
  const a = E.newAssessment();
  a.intake.date = "2026-09-05";
  assert.equal(E.reviewDate(a), "2027-03-04");
});

test("Onbeoordeelde baseline is geen uitgesloten alternatief", () => {
  const a = X.create();
  a.decision.selected = ["C02"];
  a.decision.outcome = "Eén optie";
  a.candidates[0].gate[0].status = "UNKNOWN";
  assert.equal(E.readiness(a).status, "HOLD");
});
test("MORE EVIDENCE baseline is geen negatieve uitkomst", () => {
  const a = X.create();
  a.decision.selected = ["C02"];
  a.decision.outcome = "Eén optie";
  a.runs = a.runs.filter(
    (r) => r.candidate !== "C01" || Number(r.testCase.slice(3)) <= 30,
  );
  assert.equal(E.analysis(a, a.candidates[0]).gate2, "MORE EVIDENCE");
  assert.equal(E.readiness(a).status, "HOLD");
});

test("Milieuschatting C vraagt eigen beperking, ook bij primaire bron", () => {
  const a = X.create();
  const c = a.candidates[0];
  Object.assign(c.environment, {
    boundary: "FICTIEF lokale meting",
    method: "Schatting",
    grade: "C",
    comparable: "Ja",
    embodied: "Nee",
    evidence: "B01",
    limitations: "Fictieve onzekerheid",
  });
  a.runs
    .filter((r) => r.candidate === c.id)
    .forEach((r) => Object.assign(r, { energy: 1, carbon: 1, water: 1 }));
  assert.equal(E.analysis(a, c).envStatus, "INCOMPLETE EVIDENCE");
  c.environment.useLimits =
    "FICTIEF alleen deze schatting; gevoeligheidsanalyse met bandbreedte";
  assert.equal(E.analysis(a, c).envStatus, "COMPLETE");
});
