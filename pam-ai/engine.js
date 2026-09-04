/* PAM-AI web — methodiek v1.1, E.C.M. Willems. Offline rekenregels. */
(function (root) {
  "use strict";
  const VERSION = "0.1.0",
    METHOD = "1.1",
    SCHEMA = "pam-ai-assessment/1";
  const ROUTES = [
    ["Laag", "Middel", "Hoog", "Kritiek"],
    ["Ja", "Gedeeltelijk", "Nee"],
    ["Nee", "Beperkt", "Ja"],
    ["Nee", "Mogelijk", "Ja"],
    ["Beperkt", "Middel", "Groot"],
    ["Nee", "Beperkt", "Ja"],
    ["Nee", "Mogelijk", "Ja"],
  ];
  const DOMAINS = [
    "Wet, verboden inzet en sectorale eisen",
    "Privacy en data",
    "Security en vertrouwelijkheid",
    "Rechten, inclusie en toegankelijkheid",
    "Menselijke verantwoordelijkheid en transparantie",
    "Provider, intellectueel eigendom en contract",
    "Logging, incidenten en corrigeerbaarheid",
    "Continuïteit, exit en goedgekeurde omgeving",
  ];
  const SCOPES = [
      "Verkenning",
      "Gecontroleerde pilot",
      "Gedeeltelijke proportionaliteitsafweging",
      "Volledige proportionaliteitsafweging",
    ],
    TYPES = [
      "Niet-AI-baseline",
      "AI-model",
      "Hybride",
      "Regelgebaseerd / klassieke ML",
      "Anders",
    ],
    GATES = ["PASS", "CONDITIONAL", "FAIL", "UNKNOWN", "N/A"],
    PROPORTIONS = [
      "PROPORTIONATE",
      "CONDITIONAL",
      "MULTIPLE PROPORTIONAL OPTIONS",
      "NOT PROPORTIONATE",
      "UNDETERMINED",
    ];
  const NUMS = [
    "quality",
    "calls",
    "retries",
    "verify",
    "correct",
    "latency",
    "cost",
    "inputTokens",
    "outputTokens",
    "reasoningTokens",
    "energy",
    "carbon",
    "water",
  ];
  const LABELS = {
    PASS: "Voldoet",
    FAIL: "Voldoet niet",
    CONDITIONAL: "Onder voorwaarden",
    UNKNOWN: "Onbekend",
    "N/A": "Niet van toepassing",
    INCOMPLETE: "Nog niet ingevuld",
    "INCOMPLETE EVIDENCE": "Bewijs ontbreekt",
    "CONDITION MISSING": "Voorwaarde ontbreekt",
    "RATIONALE MISSING": "Motivering ontbreekt",
    "NOT ELIGIBLE": "Niet toegelaten tot deze stap",
    "INCOMPLETE DATA": "Testgegevens onvolledig of ongeldig",
    "NO TEST DATA": "Nog geen testgegevens",
    "MORE EVIDENCE": "Meer bewijs nodig",
    "COVERAGE HOLD": "Dekking nog niet bevestigd",
    "RUBRIC HOLD": "Beoordeling nog niet bevestigd",
    "INSUFFICIENT EVIDENCE": "Onvoldoende bewijs",
    "SUFFICIENT FOR REVIEW": "Voldoende voor afweging",
    COMPLETE: "Compleet",
    "NO DATA": "Geen gegevens",
    "NOT COMPARABLE": "Niet vergelijkbaar",
    DRAFT: "Concept",
    HOLD: "Aangehouden",
    "PILOT-READY": "Gereed voor begrensde pilot",
    "PILOT WITH CONDITIONS": "Pilot onder voorwaarden",
    "DECISION-READY": "Gereed voor besluit",
    PROPORTIONATE: "Proportioneel",
    "MULTIPLE PROPORTIONAL OPTIONS": "Meerdere proportionele opties",
    "NOT PROPORTIONATE": "Niet proportioneel",
    UNDETERMINED: "Onbepaald",
    FRONTIER: "Niet gedomineerd",
    DOMINATED: "Gedomineerd",
  };
  const text = (v) => typeof v === "string" && v.trim().length > 0,
    num = (v) => typeof v === "number" && Number.isFinite(v) && v >= 0,
    clone = (v) => JSON.parse(JSON.stringify(v)),
    uid = () =>
      typeof crypto !== "undefined" && crypto.randomUUID
        ? crypto.randomUUID()
        : "pam-" + Date.now() + "-" + Math.random().toString(36).slice(2),
    today = () => {
      const d = new Date();
      return (
        d.getFullYear() +
        "-" +
        String(d.getMonth() + 1).padStart(2, "0") +
        "-" +
        String(d.getDate()).padStart(2, "0")
      );
    };
  function newCandidate(id) {
    return {
      id,
      type: "",
      name: "",
      component: "",
      version: "",
      deployment: "",
      settings: "",
      testDate: "",
      fingerprint: "",
      notes: "",
      gate: DOMAINS.map(() => ({ status: "", evidence: "", reason: "" })),
      coverage: "",
      rubric: "",
      coverageNote: "",
      rubricNote: "",
      environment: {
        boundary: "",
        method: "",
        grade: "",
        comparable: "",
        embodied: "",
        evidence: "",
        limitations: "",
      },
      context: {
        autonomy: "",
        correction: "",
        inclusion: "",
        implementation: "",
        other: "",
        evidence: "",
        complete: "",
      },
      frontier: "",
      proportionality: "",
      reason: "",
    };
  }
  function newAssessment() {
    return {
      schema: SCHEMA,
      methodVersion: METHOD,
      appVersion: VERSION,
      id: uid(),
      fictional: false,
      updated: new Date().toISOString(),
      step: 0,
      intake: {
        taskId: "",
        task: "",
        goal: "",
        use: "",
        affected: "",
        baseline: "",
        whyAI: "",
        owner: "",
        taskOwner: "",
        date: today(),
        scope: "",
        answers: Array(7).fill(""),
        confirmedRoute: "",
        routeReason: "",
        thresholds: { success: 0.9, critical: 0.02, z: 1.96, baseN: 30 },
        thresholdReason: "",
        critical: {
          cost: true,
          human: true,
          latency: false,
          environment: false,
          autonomy: true,
        },
        validDays: 180,
        triggers:
          "Wijziging van model/configuratie, taak, doelgroep, datastroom, wetgeving, incident, prestaties of kosten.",
      },
      design: {
        maxRetries: 2,
        criticalDefinition: "",
        assessor: "",
        doubleReview: "",
        reliability: "",
        criteria: [
          {
            id: "A1",
            criterion: "",
            method: "",
            minimum: "",
            critical: "",
            evidence: "",
          },
        ],
        strata: [
          {
            id: "S01",
            name: "",
            reason: "",
            target: null,
            required: "",
            note: "",
          },
        ],
      },
      candidates: [],
      runs: [],
      evidence: [],
      pairs: [],
      decision: {
        selected: [],
        outcome: "",
        value: "",
        burdens: "",
        alternatives: "",
        uncertainty: "",
        conditions: "",
        rationale: "",
        reviewer: "",
        reviewEvidence: "",
        formalReview: "",
        feedback: "",
        stopRecovery: "",
      },
      history: [],
    };
  }
  function route(a) {
    const v = a.intake.answers;
    if (v.length !== 7 || v.some((s, i) => !ROUTES[i].includes(s))) return "";
    if (v[0] === "Kritiek" || v[3] === "Ja") return "R4";
    if (
      v[0] === "Hoog" ||
      v[1] === "Nee" ||
      v[2] === "Ja" ||
      v[4] === "Groot" ||
      v[5] === "Ja" ||
      v[6] === "Ja"
    )
      return "R3";
    if (
      v[0] === "Middel" ||
      v[1] === "Gedeeltelijk" ||
      v[2] === "Beperkt" ||
      v[3] === "Mogelijk" ||
      v[4] === "Middel" ||
      v[5] === "Beperkt" ||
      v[6] === "Mogelijk"
    )
      return "R2";
    return "R1";
  }
  function activeRoute(a) {
    return a.intake.confirmedRoute || route(a);
  }
  function thresholdsValid(t) {
    return (
      num(t.success) &&
      t.success > 0 &&
      t.success < 1 &&
      num(t.critical) &&
      t.critical > 0 &&
      t.critical < 1 &&
      num(t.z) &&
      t.z > 0 &&
      Number.isInteger(t.baseN) &&
      t.baseN > 0
    );
  }
  function floor(t) {
    if (!thresholdsValid(t)) return null;
    const success = Math.ceil((t.z * t.z * t.success) / (1 - t.success)),
      critical = Math.ceil((t.z * t.z * (1 - t.critical)) / t.critical);
    return {
      success,
      critical,
      effective: Math.max(t.baseN, success, critical),
    };
  }
  function wilson(x, n, z = 1.96) {
    if (
      !Number.isInteger(n) ||
      n <= 0 ||
      !Number.isInteger(x) ||
      x < 0 ||
      x > n ||
      !num(z) ||
      z <= 0
    )
      return null;
    const p = x / n,
      z2 = z * z,
      d = 1 + z2 / n;
    return {
      lower:
        (p + z2 / (2 * n) - z * Math.sqrt((p * (1 - p) + z2 / (4 * n)) / n)) /
        d,
      upper:
        (p + z2 / (2 * n) + z * Math.sqrt((p * (1 - p) + z2 / (4 * n)) / n)) /
        d,
    };
  }
  function refsValid(a, refs) {
    if (!text(refs)) return false;
    const ids = refs
      .split(/[,;\n]+/)
      .map((s) => s.trim())
      .filter(Boolean);
    return (
      ids.length > 0 &&
      ids.every((id) =>
        a.evidence.some(
          (e) =>
            e.id === id &&
            text(e.source) &&
            text(e.owner) &&
            text(e.date) &&
            ["A", "B", "C"].includes(e.grade) &&
            text(e.limitations) &&
            (e.grade !== "C" || text(e.useLimits)),
        ),
      )
    );
  }
  function gate1(a, c) {
    const rows = c.gate;
    if (rows.some((g) => g.status === "FAIL")) return "FAIL";
    if (rows.length !== 8 || rows.some((g) => !GATES.includes(g.status)))
      return "INCOMPLETE";
    if (rows.some((g) => g.status === "UNKNOWN")) return "INCOMPLETE EVIDENCE";
    if (rows.some((g) => g.status === "CONDITIONAL" && !text(g.reason)))
      return "CONDITION MISSING";
    if (rows.some((g) => g.status === "N/A" && !text(g.reason)))
      return "RATIONALE MISSING";
    if (rows.some((g) => !refsValid(a, g.evidence)))
      return "INCOMPLETE EVIDENCE";
    return rows.some((g) => g.status === "CONDITIONAL")
      ? "CONDITIONAL"
      : "PASS";
  }
  function designReady(a) {
    const d = a.design;
    const started = d.criteria.filter(
      (x) => text(x.criterion) || text(x.method) || text(x.minimum),
    );
    const strata = d.strata.filter((x) => text(x.name));
    return (
      started.every(
        (x) => text(x.criterion) && text(x.method) && text(x.minimum),
      ) &&
      strata.every(
        (x) =>
          text(x.reason) &&
          ["Ja", "Nee"].includes(x.required) &&
          (x.required !== "Ja" || (Number.isInteger(x.target) && x.target > 0)),
      ) &&
      (activeRoute(a) === "R1" || text(d.reliability)) &&
      text(d.criticalDefinition) &&
      text(d.assessor) &&
      text(d.doubleReview) &&
      Number.isInteger(d.maxRetries) &&
      d.maxRetries >= 0 &&
      d.criteria.some(
        (x) => text(x.criterion) && text(x.method) && text(x.minimum),
      ) &&
      d.strata.some((x) => text(x.name))
    );
  }
  function configStamp(c) {
    return JSON.stringify([
      c.type,
      c.name,
      c.component,
      c.version,
      c.deployment,
      c.settings,
      c.fingerprint,
    ]);
  }
  function designStamp(a) {
    return JSON.stringify([
      a.intake.task,
      a.intake.goal,
      a.intake.use,
      a.intake.affected,
      a.intake.thresholds,
      a.intake.thresholdReason,
      a.design,
    ]);
  }
  function runIssues(a, c, rows) {
    let out = [];
    const seen = new Set();
    for (const r of rows) {
      const label = r.testCase || r.id || "Zonder testcase";
      if (!text(r.testCase)) out.push("Testcase-ID ontbreekt");
      if (seen.has(r.testCase))
        out.push(label + ": dubbele kandidaat × testcase");
      seen.add(r.testCase);
      if (![0, 1].includes(r.accepted) || ![0, 1].includes(r.critical))
        out.push(label + ": acceptatie of kritieke fout ontbreekt");
      if (!a.design.strata.some((s) => s.id === r.stratum && text(s.name)))
        out.push(label + ": stratum ontbreekt of onbekend");
      for (const k of NUMS)
        if (r[k] !== null && r[k] !== undefined && !num(r[k]))
          out.push(label + ": ongeldige " + k);
      for (const k of [
        "calls",
        "retries",
        "inputTokens",
        "outputTokens",
        "reasoningTokens",
      ])
        if (r[k] !== null && r[k] !== undefined && !Number.isInteger(r[k]))
          out.push(label + ": " + k + " moet een geheel aantal zijn");
      if (!Number.isInteger(r.calls) || !Number.isInteger(r.retries))
        out.push(label + ": calls en retries ontbreken");
      if (r.retries > a.design.maxRetries)
        out.push(label + ": retrybeleid overschreden");
      if (
        c.type !== "Niet-AI-baseline" &&
        num(r.calls) &&
        num(r.retries) &&
        r.calls < r.retries + 1
      )
        out.push(label + ": calls omvatten niet alle pogingen");
      if (r.configStamp !== configStamp(c))
        out.push(label + ": configuratie gewijzigd sinds test");
      if (r.designStamp !== designStamp(a))
        out.push(label + ": taak of testontwerp gewijzigd sinds test");
      if (!refsValid(a, r.evidence)) out.push(label + ": testbewijs ontbreekt");
    }
    return [...new Set(out)];
  }
  function analysis(a, c) {
    const rows = a.runs.filter((r) => r.candidate === c.id),
      g1 = gate1(a, c),
      issues = runIssues(a, c, rows),
      valid = rows.filter(
        (r) => [0, 1].includes(r.accepted) && [0, 1].includes(r.critical),
      ),
      n = valid.length,
      accepted = valid.reduce((s, r) => s + r.accepted, 0),
      critical = valid.reduce((s, r) => s + r.critical, 0),
      t = a.intake.thresholds,
      bottom = floor(t),
      success = n ? accepted / n : null,
      criticalRate = n ? critical / n : null,
      lo = wilson(accepted, n, t.z),
      hi = wilson(critical, n, t.z);
    let status;
    if (!["PASS", "CONDITIONAL"].includes(g1)) status = "NOT ELIGIBLE";
    else if (!bottom || issues.length || !designReady(a))
      status = "INCOMPLETE DATA";
    else if (!n) status = "NO TEST DATA";
    else if (success < t.success || criticalRate > t.critical) status = "FAIL";
    else if (
      n < bottom.effective ||
      lo.lower < t.success ||
      hi.upper > t.critical
    )
      status = "MORE EVIDENCE";
    else if (
      c.coverage !== "Ja" ||
      !text(c.coverageNote) ||
      a.design.strata.some(
        (s) =>
          s.required === "Ja" &&
          (!Number.isInteger(s.target) ||
            s.target < 1 ||
            rows.filter((r) => r.stratum === s.id).length < s.target),
      )
    )
      status = "COVERAGE HOLD";
    else if (c.rubric !== "Ja" || !text(c.rubricNote)) status = "RUBRIC HOLD";
    else status = "PASS";
    const measure = (keys) => ({
      missing: rows.filter((r) => keys.some((k) => !num(r[k]))).length,
      value:
        !n || !accepted || rows.some((r) => keys.some((k) => !num(r[k])))
          ? null
          : rows.reduce(
              (sum, r) => sum + keys.reduce((s, k) => s + r[k], 0),
              0,
            ) / accepted,
    });
    const measures = {
        cost: measure(["cost"]),
        human: measure(["verify", "correct"]),
        latency: measure(["latency"]),
        retries: measure(["retries"]),
        energy: measure(["energy"]),
        carbon: measure(["carbon"]),
        water: measure(["water"]),
      },
      env = c.environment;
    const envStatus = !rows.length
      ? "NO DATA"
      : ["energy", "carbon", "water"].some((k) => measures[k].missing)
        ? "INCOMPLETE DATA"
        : ![
              "boundary",
              "method",
              "grade",
              "comparable",
              "embodied",
              "limitations",
            ].every((k) => text(env[k])) ||
            !refsValid(a, env.evidence) ||
            env.grade === "U" ||
            (env.grade === "C" && !text(env.useLimits))
          ? "INCOMPLETE EVIDENCE"
          : env.comparable !== "Ja"
            ? "NOT COMPARABLE"
            : "COMPLETE";
    let missing = [];
    for (const k of ["cost", "human", "latency"])
      if (a.intake.critical[k] && (!rows.length || measures[k].missing))
        missing.push(k);
    if (a.intake.critical.environment && envStatus !== "COMPLETE")
      missing.push("environment");
    return {
      id: c.id,
      gate1: g1,
      gate2: status,
      n,
      accepted,
      critical,
      success,
      criticalRate,
      lcb: lo?.lower ?? null,
      ucb: hi?.upper ?? null,
      floor: bottom?.effective ?? null,
      issues,
      measures,
      envStatus,
      numeric: missing.length
        ? "INSUFFICIENT EVIDENCE"
        : "SUFFICIENT FOR REVIEW",
      missing,
    };
  }
  const METRICS = [
    ["lcb", "Succes: Wilson-ondergrens", 1],
    ["ucb", "Kritieke fouten: Wilson-bovengrens", -1],
    ["cost", "Directe kosten (€)", -1],
    ["human", "Controle en herstel (min)", -1],
    ["latency", "Doorlooptijd (sec)", -1],
    ["retries", "Herhaalde pogingen", -1],
    ["energy", "Energie (kWh)", -1],
    ["carbon", "Uitstoot (g CO₂e)", -1],
    ["water", "Water (L)", -1],
  ];
  function pairwise(a, p) {
    const ca = a.candidates.find((c) => c.id === p.a),
      cb = a.candidates.find((c) => c.id === p.b);
    if (!ca || !cb || ca.id === cb.id)
      return {
        allowed: false,
        rows: [],
        note: "Kies twee verschillende alternatieven.",
      };
    const x = analysis(a, ca),
      y = analysis(a, cb);
    if (x.gate2 !== "PASS" || y.gate2 !== "PASS")
      return {
        allowed: false,
        rows: [],
        note: "Proportionaliteit volgt pas wanneer beide alternatieven poort 1 en 2 doorstaan. Licht een uitgesloten baseline toe in de besluitmotivering.",
      };
    const rows = METRICS.map(([key, label, direction]) => {
      const env = ["energy", "carbon", "water"].includes(key),
        allowed =
          p.comparable === "Ja" &&
          (!env ||
            (x.envStatus === "COMPLETE" &&
              y.envStatus === "COMPLETE" &&
              p.environmentComparable === "Ja")),
        av = ["lcb", "ucb"].includes(key) ? x[key] : x.measures[key].value,
        bv = ["lcb", "ucb"].includes(key) ? y[key] : y.measures[key].value;
      return {
        key,
        label,
        direction,
        a: av,
        b: bv,
        delta: allowed && av !== null && bv !== null ? av - bv : null,
        comparable: allowed && av !== null && bv !== null,
      };
    });
    return {
      allowed: true,
      rows,
      note: "Verschillen ondersteunen de motivering. Ze bepalen geen winnaar en bewijzen op zichzelf geen statistisch significant verschil.",
    };
  }
  function contextReady(a, c) {
    return (
      c.context.complete === "Ja" &&
      ["autonomy", "correction", "inclusion", "implementation", "other"].every(
        (k) => text(c.context[k]),
      ) &&
      refsValid(a, c.context.evidence)
    );
  }
  function readiness(a) {
    const d = a.decision,
      i = a.intake,
      r = activeRoute(a),
      issues = [],
      selected = a.candidates.filter((c) => d.selected.includes(c.id)),
      pilot = ["Verkenning", "Gecontroleerde pilot"].includes(i.scope),
      stop = ["NO-GO", "Uitgesteld besluit"].includes(d.outcome),
      need = (ok, msg) => {
        if (!ok) issues.push(msg);
      };
    for (const [k, label] of Object.entries({
      taskId: "Taak-ID",
      task: "Taak",
      goal: "Legitiem doel",
      use: "Beoogd gebruik",
      affected: "Gebruikers en geraakten",
      baseline: "Huidige niet-AI-werkwijze",
      whyAI: "Reden om AI te overwegen",
      owner: "Besluiteigenaar",
      taskOwner: "Taakeigenaar",
      date: "Besluitdatum",
      scope: "Beslisscope",
      thresholdReason: "Taakgerichte motivering van drempels",
      triggers: "Herbeoordelingstriggers",
    }))
      need(
        (stop && k === "thresholdReason") || text(i[k]),
        label + " ontbreekt.",
      );
    need(!!route(a), "Beantwoord alle zeven routevragen.");
    need(
      !i.confirmedRoute || i.confirmedRoute === route(a) || text(i.routeReason),
      "Motiveer de afwijkende route.",
    );
    need(
      thresholdsValid(i.thresholds),
      "Drempels ongeldig: kansen strikt tussen 0 en 1, z positief en basis-n een positief geheel aantal.",
    );
    need(
      Number.isInteger(i.validDays) && i.validDays > 0,
      "Vul een positieve geldigheidsduur in.",
    );
    need(reviewDate(a) !== null, "Vul een geldige besluit- en reviewdatum in.");
    need(
      stop || r !== "R1" || pilot,
      "R1 ondersteunt alleen verkenning of een gecontroleerde pilot.",
    );
    need(
      a.candidates.some((c) => c.type === "Niet-AI-baseline" && text(c.name)),
      "Neem de huidige niet-AI-baseline op.",
    );
    need(
      stop || designReady(a),
      "Leg acceptatie, kritieke fout, beoordelaar, relevante situaties en retrybeleid vast.",
    );
    need(
      ["Eén optie", "Meerdere opties", "NO-GO", "Uitgesteld besluit"].includes(
        d.outcome,
      ),
      "Kies een geldige besluituitkomst.",
    );
    need(SCOPES.includes(i.scope), "Kies een geldige beslisscope.");
    need(["R1", "R2", "R3", "R4"].includes(r), "Kies een geldige route.");
    need(
      ["cost", "human", "latency", "environment", "autonomy"].every(
        (k) => typeof i.critical[k] === "boolean",
      ),
      "Bevestig alle besliskritieke dimensies.",
    );
    for (const [k, label] of Object.entries({
      value: "Beoogde waarde",
      burdens: "Lasten en verdeling van effecten",
      alternatives: "Afweging van alternatieven",
      uncertainty: "Beperkingen en onzekerheden",
      conditions: "Voorwaarden en begrenzing",
      stopRecovery: "Stopcriteria en herstel",
      rationale: "Eindmotivering",
    }))
      need(text(d[k]), label + " ontbreekt.");
    if (["R3", "R4"].includes(r)) {
      need(text(d.reviewer), "Onafhankelijke reviewer vereist.");
      need(
        text(d.reviewEvidence),
        "Leg de multidisciplinaire en onafhankelijke toets vast.",
      );
    }
    if (r === "R4")
      need(
        text(d.formalReview),
        "Leg de aanvullende formele toets buiten PAM-AI vast.",
      );
    if (stop)
      return {
        status: issues.length ? "DRAFT" : "HOLD",
        issues,
        note:
          d.outcome === "NO-GO"
            ? "NO-GO vastgelegd: geen toestemming voor inzet."
            : "Uitgesteld besluit: geen toestemming voor inzet.",
        recordComplete: issues.length === 0,
      };
    need(
      selected.length > 0,
      "Kies een alternatief of leg NO-GO / uitstel vast.",
    );
    need(
      d.selected.length === selected.length,
      "Een geselecteerde kandidaat bestaat niet meer.",
    );
    if (d.outcome === "Meerdere opties")
      need(
        selected.length >= 2,
        "Selecteer minstens twee verdedigbare opties.",
      );
    let hard = false;
    for (const c of selected) {
      const v = analysis(a, c);
      need(
        TYPES.includes(c.type) &&
          [
            "name",
            "component",
            "version",
            "deployment",
            "settings",
            "fingerprint",
          ].every((k) => text(c[k])),
        (c.name || c.id) +
          ": configuratie is niet reproduceerbaar beschreven (gebruik gemotiveerd N.v.t. waar passend).",
      );
      if (!["PASS", "CONDITIONAL"].includes(v.gate1)) {
        issues.push(c.name + ": poort 1 — " + LABELS[v.gate1]);
        hard = true;
      }
      if (
        ["FAIL", "NOT ELIGIBLE", "INCOMPLETE DATA", "NO TEST DATA"].includes(
          v.gate2,
        )
      ) {
        issues.push(c.name + ": poort 2 — " + LABELS[v.gate2]);
        hard = true;
      }
      if (!pilot) {
        need(
          v.gate1 === "PASS",
          c.name +
            ": los voorwaarden van poort 1 eerst op (v1.1 besluitformule).",
        );
        need(v.gate2 === "PASS", c.name + ": " + LABELS[v.gate2]);
        need(
          v.numeric === "SUFFICIENT FOR REVIEW",
          c.name + ": besliskritieke lasten zijn onvolledig.",
        );
        need(contextReady(a, c), c.name + ": contextbewijs ontbreekt.");
        need(
          ["PROPORTIONATE", "MULTIPLE PROPORTIONAL OPTIONS"].includes(
            c.proportionality,
          ) && text(c.reason),
          c.name + ": onderbouwd proportionaliteitsoordeel ontbreekt.",
        );
        need(
          (a.candidates.length > 1 &&
            a.candidates
              .filter((x) => x.id !== c.id)
              .every((x) => {
                const v = analysis(a, x);
                return v.gate1 === "FAIL" || v.gate2 === "FAIL";
              }) &&
            text(d.alternatives) &&
            refsValid(a, c.context.evidence)) ||
            a.pairs.some(
              (p) =>
                (p.a === c.id || p.b === c.id) &&
                pairwise(a, p).allowed &&
                p.comparable === "Ja" &&
                text(p.rationale) &&
                refsValid(a, p.evidence),
            ),
          c.name + ": vergelijk met een relevante lichtere optie of baseline.",
        );
      }
    }
    if (issues.length)
      return {
        status: !selected.length ? "DRAFT" : hard || !pilot ? "HOLD" : "DRAFT",
        issues,
        note: "De ontbrekende onderdelen staan hieronder. Bewaren en een uitgesteld besluit blijven mogelijk.",
        recordComplete: false,
      };
    if (pilot) {
      const conditional = selected.some((c) => {
        const v = analysis(a, c);
        return (
          v.gate2 !== "PASS" ||
          v.gate1 === "CONDITIONAL" ||
          v.numeric !== "SUFFICIENT FOR REVIEW"
        );
      });
      return {
        status: conditional ? "PILOT WITH CONDITIONS" : "PILOT-READY",
        issues: [],
        note: "Uitsluitend de beschreven verkenning of begrensde pilot. Geen besluit over bredere inzet.",
        recordComplete: true,
      };
    }
    return {
      status: "DECISION-READY",
      issues: [],
      note:
        i.scope === SCOPES[2]
          ? "Gereed voor de beschreven gedeeltelijke afweging. Uitgesloten dimensies blijven buiten de claim."
          : "Gereed voor het menselijke besluit, uitsluitend binnen de vastgelegde context en geldigheid.",
      recordComplete: true,
    };
  }
  function reviewDate(a) {
    const date = a.intake.date;
    if (
      !/^\d{4}-\d{2}-\d{2}$/.test(date) ||
      !Number.isInteger(a.intake.validDays) ||
      a.intake.validDays <= 0
    )
      return null;
    const d = new Date(date + "T12:00:00Z");
    if (!Number.isFinite(d.getTime()) || d.toISOString().slice(0, 10) !== date)
      return null;
    d.setUTCDate(d.getUTCDate() + a.intake.validDays);
    return d.toISOString().slice(0, 10);
  }

  function validateShape(a) {
    const fail = (msg) => {
      throw new Error("Ongeldig bestand: " + msg);
    };
    const shape = (value, model, path) => {
      if (model === null) {
        if (value !== null && !num(value))
          fail(path + " moet een getal of leeg zijn");
        return;
      }
      if (Array.isArray(model)) {
        if (!Array.isArray(value)) fail(path + " moet een lijst zijn");
        return;
      }
      if (typeof model === "object") {
        if (!value || Array.isArray(value) || typeof value !== "object")
          fail(path + " moet een object zijn");
        for (const k of Object.keys(model))
          shape(value[k], model[k], path + "." + k);
        return;
      }
      if (typeof value !== typeof model)
        fail(path + " heeft een onjuist veldtype");
      if (typeof value === "number" && !Number.isFinite(value))
        fail(path + " bevat geen eindig getal");
    };
    const base = newAssessment();
    shape(a, base, "beoordeling");
    if (!Number.isInteger(a.step) || a.step < 0 || a.step > 5)
      fail("onbekende stap");
    a.candidates.forEach((c) => shape(c, newCandidate(c.id), "kandidaat"));
    a.design.criteria.forEach((c) =>
      shape(c, base.design.criteria[0], "criterium"),
    );
    a.design.strata.forEach((c) => shape(c, base.design.strata[0], "stratum"));
    const en = (v, values, name) => {
      if (v !== "" && !values.includes(v)) fail("onbekende " + name);
    };
    en(a.intake.scope, SCOPES, "scope");
    en(a.intake.confirmedRoute, ["R1", "R2", "R3", "R4"], "route");
    a.intake.answers.forEach((v, i) => en(v, ROUTES[i], "routeantwoord"));
    en(
      a.decision.outcome,
      ["Eén optie", "Meerdere opties", "NO-GO", "Uitgesteld besluit"],
      "besluituitkomst",
    );
    if (
      a.decision.selected.some((v) => !text(v)) ||
      new Set(a.decision.selected).size !== a.decision.selected.length
    )
      fail("selectie");
    for (const c of a.candidates) {
      en(c.type, TYPES, "kandidaattype");
      c.gate.forEach((g) => en(g.status, GATES, "poortstatus"));
      en(c.coverage, ["Ja", "Nee"], "dekking");
      en(c.rubric, ["Ja", "Nee"], "rubric");
      en(c.proportionality, PROPORTIONS, "proportionaliteit");
      en(c.environment.grade, ["A", "B", "C", "U"], "bewijsgraad");
    }
    for (const e of a.evidence) {
      for (const k of [
        "id",
        "source",
        "type",
        "owner",
        "date",
        "grade",
        "location",
        "limitations",
      ])
        if (typeof e[k] !== "string") fail("bronveld " + k);
      en(e.grade, ["A", "B", "C", "U"], "bewijsgraad");
      if (e.useLimits !== undefined && typeof e.useLimits !== "string")
        fail("beperkte claim");
    }
    for (const r of a.runs) {
      for (const k of [
        "id",
        "candidate",
        "testCase",
        "stratum",
        "evidence",
        "notes",
        "configStamp",
        "designStamp",
      ])
        if (typeof r[k] !== "string") fail("testveld " + k);
      for (const k of [...NUMS, "accepted", "critical"])
        if (r[k] !== null && !num(r[k])) fail("numeriek testveld " + k);
    }
    for (const p of a.pairs) {
      for (const k of [
        "a",
        "b",
        "comparable",
        "environmentComparable",
        "rationale",
        "evidence",
        "limits",
      ])
        if (typeof p[k] !== "string") fail("vergelijkingsveld " + k);
    }
    if (
      a.history.some(
        (h) =>
          !h ||
          typeof h.at !== "string" ||
          typeof h.status !== "string" ||
          !h.decision ||
          typeof h.decision.rationale !== "string" ||
          typeof h.decision.outcome !== "string",
      )
    )
      fail("besluithistorie");
  }

  function parseImport(raw) {
    if (typeof raw !== "string" || raw.length > 12000000)
      throw new Error("Bestand te groot (maximaal 12 MB).");
    let a;
    try {
      a = JSON.parse(raw);
    } catch {
      throw new Error("Dit is geen geldig JSON-bestand.");
    }
    if (!a || a.schema !== SCHEMA || a.methodVersion !== METHOD)
      throw new Error(
        "Onbekend beoordelingsformaat of andere methodiekversie.",
      );
    const check = (x) => {
      if (x && typeof x === "object")
        for (const k of Object.keys(x)) {
          if (["__proto__", "prototype", "constructor"].includes(k))
            throw new Error("Onveilige sleutel in bestand.");
          check(x[k]);
        }
    };
    check(a);
    for (const k of Object.keys(newAssessment()))
      if (!(k in a)) throw new Error("Ontbrekend onderdeel: " + k);
    for (const k of ["candidates", "runs", "evidence", "pairs", "history"])
      if (!Array.isArray(a[k])) throw new Error("Ongeldige lijst: " + k);
    if (
      a.candidates.length > 8 ||
      a.runs.length > 2000 ||
      a.evidence.length > 500 ||
      a.pairs.length > 100
    )
      throw new Error(
        "Maximum: 8 kandidaten, 2.000 testregels, 500 bronnen en 100 vergelijkingen.",
      );
    if (
      !a.intake ||
      !a.design ||
      !a.decision ||
      !Array.isArray(a.intake.answers) ||
      a.intake.answers.length !== 7 ||
      !a.intake.thresholds ||
      !a.intake.critical ||
      !Array.isArray(a.design.criteria) ||
      !Array.isArray(a.design.strata) ||
      !Array.isArray(a.decision.selected)
    )
      throw new Error("De structuur van de beoordeling is onvolledig.");
    for (const c of a.candidates)
      if (
        !c ||
        !text(c.id) ||
        !Array.isArray(c.gate) ||
        c.gate.length !== 8 ||
        c.gate.some((g) => !g || typeof g.status !== "string") ||
        !c.environment ||
        !c.context
      )
        throw new Error("Ongeldige kandidaat.");
    for (const list of [a.candidates, a.evidence]) {
      const ids = list.map((x) => x?.id);
      if (ids.some((x) => !text(x)) || new Set(ids).size !== ids.length)
        throw new Error("Ontbrekende of dubbele ID.");
    }
    if (
      a.runs.some((r) => !r || !a.candidates.some((c) => c.id === r.candidate))
    )
      throw new Error("Testregel verwijst naar onbekende kandidaat.");
    if (
      a.pairs.some(
        (p) =>
          !p ||
          (text(p.a) && !a.candidates.some((c) => c.id === p.a)) ||
          (text(p.b) && !a.candidates.some((c) => c.id === p.b)),
      )
    )
      throw new Error("Vergelijking verwijst naar onbekende kandidaat.");
    validateShape(a);
    try {
      a.candidates.forEach((c) => analysis(a, c));
      readiness(a);
    } catch {
      throw new Error("Ongeldige veldtypen in beoordeling.");
    }
    a.id = uid();
    a.updated = new Date().toISOString();
    a.step = 0;
    return a;
  }
  const api = {
    VERSION,
    METHOD,
    SCHEMA,
    ROUTES,
    DOMAINS,
    SCOPES,
    TYPES,
    GATES,
    PROPORTIONS,
    NUMS,
    LABELS,
    METRICS,
    text,
    num,
    clone,
    uid,
    today,
    newCandidate,
    newAssessment,
    route,
    activeRoute,
    thresholdsValid,
    floor,
    wilson,
    refsValid,
    gate1,
    designReady,
    configStamp,
    designStamp,
    runIssues,
    analysis,
    pairwise,
    contextReady,
    readiness,
    reviewDate,
    parseImport,
  };
  if (typeof module !== "undefined" && module.exports) module.exports = api;
  else root.PAM = api;
})(typeof window !== "undefined" ? window : globalThis);
