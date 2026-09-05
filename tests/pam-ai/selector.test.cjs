"use strict";
const { test } = require("node:test"),
  assert = require("node:assert/strict"),
  S = require("../../pam-ai/selector-engine.js");
const advice = (task, extra = {}) => ({
  ...S.newAdvice(),
  task,
  data: "public",
  use: "draft",
  ...extra,
});
test("Exact acht platformlabels; geen fictieve scores of milieuwaarden", () => {
  assert.deepEqual(
    S.CATALOG.models.map((m) => m.name),
    [
      "GPT-5.4 mini",
      "GPT-5.6 Terra",
      "GPT-5.6 Luna",
      "GPT-5.5",
      "GPT-5.4",
      "GPT Chat Latest",
      "Mistral Large 3",
      "Mistral Small",
    ],
  );
  assert.ok(
    S.CATALOG.models.every(
      (m) => m.score === undefined && m.energy === undefined,
    ),
  );
});
test("Afgebakende teksttaak geeft drie startpunten, geen winnaar of automatische routing", () => {
  const r = S.recommend(advice("Herschrijf de openbare tekst op B1-niveau"));
  assert.deepEqual(
    r.candidates.map((x) => x.id),
    ["gpt54mini", "luna", "small"],
  );
  assert.equal(r.automaticRouting, false);
  assert.equal(r.winner, undefined);
  assert.ok(r.candidates.every((x) => x.gate.status === "unknown"));
});
test("Ingebouwd vergaderopnamevoorbeeld vraagt audio; geen tekstmodel als complete oplossing", () => {
  const r = S.recommend(
    advice(
      "Fictief voorbeeld: maak een transcript en actiepunten uit een vergaderopname.",
    ),
  );
  assert.equal(r.type, "audio");
  assert.equal(r.detected.chain, true);
  assert.equal(r.candidates.length, 0);
  assert.equal(r.secondary.length, 3);
});
test("Bestaand transcript en gewone vat-tekst-samen vorm vragen geen audio", () => {
  for (const task of [
    "Vat deze transcriptie samen",
    "Vat deze tekst samen",
    "Maak actiepunten uit dit teksttranscript",
  ])
    assert.equal(S.recommend(advice(task)).type, "summary");
});
test("Uitsluiting blijft hard, ook bij gunstige taakmatch", () => {
  const p = S.defaultPlatform();
  p.models.find((x) => x.id === "luna").approval.public = "blocked";
  const r = S.recommend(advice("Herschrijf deze tekst"), p);
  assert.ok(!r.candidates.some((x) => x.id === "luna"));
  assert.ok(
    r.blocked.some((x) => x.id === "luna" && x.gate.status === "blocked"),
  );
});
test("Alle passende modellen uitgesloten geeft geen alternatief uit een zwaardere categorie", () => {
  const p = S.defaultPlatform();
  p.models.forEach((x) => (x.approval.public = "blocked"));
  assert.equal(
    S.recommend(advice("Herschrijf deze tekst"), p).candidates.length,
    0,
  );
});
test("Onbekende gegevens en gebruik worden niet als gunstig beoordeeld", () => {
  const r = S.recommend(
    advice("Schrijf een mail", { data: "unknown", use: "unknown" }),
  );
  assert.ok(r.missing.some((x) => x.startsWith("Soort")));
  assert.ok(
    r.checks.some((x) => x.title === "Menselijke verantwoordelijkheid"),
  );
});
test("Expliciete acties en lokale eis beperken de volledige shortlist", () => {
  const a = S.recommend(advice("Maak een samenvatting", { use: "actions" }));
  assert.equal(a.candidates.length, 0);
  assert.deepEqual(a.required, ["actions"]);
  const l = S.recommend(
    advice("Maak een samenvatting, uitsluitend lokaal zonder cloudverwerking"),
  );
  assert.equal(l.candidates.length, 0);
  assert.ok(l.required.includes("local"));
  assert.equal(
    S.recommend(
      advice(
        "Maak van deze vergaderopname een transcript en actiepunten, uitsluitend lokaal",
      ),
    ).secondary.length,
    0,
  );
  assert.equal(
    S.recommend(
      advice("Maak van deze vergaderopname een transcript en actiepunten", {
        use: "actions",
      }),
    ).secondary.length,
    0,
  );
});
test("Een bevestigde functie vraagt concrete configuratie en bewijsverwijzing", () => {
  const p = S.defaultPlatform(),
    m = p.models[0];
  m.features.audio = "yes";
  assert.equal(
    S.recommend(advice("Schrijf een vergaderopname uit"), p).candidates.length,
    0,
  );
  m.deployment = "FICTIEF gecontroleerde audioketen";
  m.featureRef = "FICTIEVE proefnotitie";
  assert.equal(
    S.recommend(advice("Schrijf een vergaderopname uit"), p).candidates[0].id,
    m.id,
  );
});
test("Platformafspraak vraagt dezelfde configuratie, bron en actuele datum", () => {
  const p = S.defaultPlatform(),
    m = p.models[0];
  m.approval.public = "allowed";
  m.deployment = "FICTIEF-v1";
  m.approvedDeployment = m.deployment;
  m.approvalRef = "FICTIEVE goedkeuring";
  m.validUntil = "2026-12-01";
  assert.equal(
    S.recommend(advice("Herschrijf de tekst"), p, "2026-09-05").candidates[0]
      .gate.status,
    "allowed",
  );
  m.deployment = "FICTIEF-v2";
  assert.equal(
    S.recommend(advice("Herschrijf de tekst"), p, "2026-09-05").candidates[0]
      .gate.status,
    "unknown",
  );
  m.approvedDeployment = m.deployment;
  m.validUntil = "2026-01-01";
  assert.equal(
    S.recommend(advice("Herschrijf de tekst"), p, "2026-09-05").candidates[0]
      .gate.status,
    "unknown",
  );
});
test("Ongeldige kalenderdatum wordt geweigerd; blokkade vervalt niet op datum", () => {
  const p = S.defaultPlatform();
  p.models[0].validUntil = "2027-99-99";
  assert.throws(() => S.parsePlatform(JSON.stringify(p)), /datum/);
  p.models[0].validUntil = "2026-01-01";
  p.models[0].approval.public = "blocked";
  assert.ok(
    !S.recommend(advice("Herschrijf tekst"), p).candidates.some(
      (x) => x.id === p.models[0].id,
    ),
  );
});
test("Rekenen adviseert een rekenhulpmiddel", () => {
  const r = S.recommend(advice("Bereken de btw en totalen"));
  assert.equal(r.type, "numbers");
  assert.equal(r.candidates.length, 0);
});
test("Vage taak, actuele informatie en beeldgeneratie leveren gerichte vervolgbehoefte", () => {
  assert.equal(S.recommend(advice("Help mij")).type, "unknown");
  for (const task of [
    "Zoek actuele ontwikkelingen",
    "Maak een afbeelding van een fiets",
  ]) {
    const r = S.recommend(advice(task));
    assert.equal(r.candidates.length, 0);
    assert.ok(r.required.length);
  }
});
test("Kosten- of milieuprioriteit verzint geen rangorde", () => {
  const a = advice("Herschrijf de tekst"),
    r = S.recommend(a);
  for (const priority of ["cost", "environment", "time", "control"])
    assert.deepEqual(
      S.recommend({ ...a, priority }).candidates.map((x) => x.id),
      r.candidates.map((x) => x.id),
    );
});
test("Alle lasten gedeeld door geaccepteerde uitkomsten, leeg blijft onbekend", () => {
  const row = {
    cases: 10,
    accepted: 5,
    cost: 2,
    minutes: 15,
    energy: null,
    reference: "FICTIEVE proef",
    boundary: "",
    deployment: "v1",
  };
  assert.deepEqual(S.metrics(row), {
    valid: true,
    evidenced: true,
    cost: 0.4,
    minutes: 3,
    energy: null,
  });
  assert.equal(
    S.metrics({
      ...row,
      energy: 0,
      boundary: "FICTIEVE meting, volledige keten",
    }).energy,
    0,
  );
  assert.equal(S.metrics({ ...row, accepted: 0 }).cost, null);
  assert.equal(S.metrics({ ...row, reference: "" }).cost, null);
  assert.equal(S.metrics(row, "v2").cost, null);
});
test("Metingarchief en tijdstempel blijven behouden; afgeleide adviezen worden niet vertrouwd", () => {
  const a = advice("Herschrijf tekst");
  a.updated = "2026-09-01T10:00:00Z";
  a.advice = { winner: "wrong", automaticRouting: true };
  a.archivedMeasurements = [
    {
      task: "Vorige taak",
      type: "draft",
      data: "public",
      use: "draft",
      measurements: [
        {
          id: "luna",
          cases: 10,
          accepted: 5,
          cost: 2,
          minutes: 15,
          energy: null,
          reference: "FICTIEF",
          boundary: "",
          testset: "A",
          deployment: "v1",
        },
      ],
    },
  ];
  const n = S.parseAdvice(JSON.stringify(a));
  assert.equal(n.updated, a.updated);
  assert.deepEqual(n.archivedMeasurements, a.archivedMeasurements);
  assert.equal(n.advice, undefined);
});
test("Import weigert ongeldige waarden zonder gedeeltelijke toepassing", () => {
  const a = advice("Herschrijf tekst");
  a.measurements = [
    { id: "luna", cases: 10, accepted: 11, cost: 2, minutes: 0, energy: null },
  ];
  assert.throws(() => S.parseAdvice(JSON.stringify(a)), /aantallen/);
  a.measurements = [];
  a.use = "approved";
  assert.throws(() => S.parseAdvice(JSON.stringify(a)), /keuze/);
  const p = S.defaultPlatform();
  p.models[1].id = p.models[0].id;
  assert.throws(() => S.parsePlatform(JSON.stringify(p)), /Dubbele/);
});
