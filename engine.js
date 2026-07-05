/* ============================================================
   BESLISMECHANISME — kies-ai v1.0
   ------------------------------------------------------------
   Dit bestand kent GEEN ENKEL AI-model. Het kent alleen:
     Laag 1: vermogens (capabilities) — stabiel over jaren
     Vragen: adaptief, minimaal
     Regels: governance als filter, niet als voetnoot
     Score:  pas ná de filters
   Modellen leven uitsluitend in registry.js.
   Verdwijnen alle huidige modellen, dan verandert hier niets.
   ============================================================ */

/* ---------- LAAG 1: VERMOGENSTAXONOMIE ---------- */

const CAPABILITY_GROUPS = [
  { id: "tekst", label: "Tekst & communicatie", hint: "schrijven, herschrijven, vertalen, mailen" },
  { id: "kennis", label: "Kennis & analyse", hint: "begrijpen, vergelijken, zoeken, onderbouwen" },
  { id: "onderwijs", label: "Onderwijs & begeleiding", hint: "lesmateriaal, feedback, tutoring" },
  { id: "data", label: "Data & code", hint: "programmeren, analyseren, rekenen" },
  { id: "media", label: "Beeld & geluid", hint: "illustraties, transcriptie" },
  { id: "proces", label: "Proces & automatisering", hint: "documentstromen, workflows" }
];

const CAPABILITIES = [
  { id: "brainstormen", group: "tekst", label: "Brainstormen & ideeën verkennen", needs: {} },
  { id: "samenvatten", group: "tekst", label: "Samenvatten van documenten of gesprekken", needs: { longContext: true } },
  { id: "herschrijven", group: "tekst", label: "Herschrijven & redigeren", needs: {} },
  { id: "vertalen", group: "tekst", label: "Vertalen", needs: {} },
  { id: "beleid-schrijven", group: "tekst", label: "Beleids- en bestuursdocumenten schrijven", needs: { reasoning: true } },
  { id: "communiceren", group: "tekst", label: "Berichten, mail & webteksten opstellen", needs: {} },

  { id: "analyseren", group: "kennis", label: "Documenten of situaties analyseren", needs: { longContext: true } },
  { id: "redeneren", group: "kennis", label: "Complexe vraagstukken doordenken", needs: { reasoning: true } },
  { id: "vergelijken", group: "kennis", label: "Opties of documenten vergelijken", needs: {} },
  { id: "argumenten-toetsen", group: "kennis", label: "Argumenten & concepten kritisch toetsen", needs: { reasoning: true } },
  { id: "literatuur-review", group: "kennis", label: "Literatuur verkennen & reviewen", needs: { grounding: true } },
  { id: "kennis-zoeken", group: "kennis", label: "Zoeken in eigen bronnen & beleid", needs: { grounding: true } },
  { id: "feiten-zoeken", group: "kennis", label: "Actuele informatie op het web zoeken", needs: { webAccess: true } },

  { id: "tutoring", group: "onderwijs", label: "Studenten laten oefenen & begeleiden", needs: {} },
  { id: "toetsvragen-ontwikkelen", group: "onderwijs", label: "Toets- en oefenvragen ontwikkelen", needs: {} },
  { id: "feedback-op-werk", group: "onderwijs", label: "Formatieve feedback op studentwerk", needs: { reasoning: true } },

  { id: "code-genereren", group: "data", label: "Code schrijven & reviewen", needs: { coding: true } },
  { id: "data-analyseren", group: "data", label: "Datasets analyseren & visualiseren", needs: { coding: true } },
  { id: "berekenen", group: "data", label: "Berekeningen & modellen doorrekenen", needs: { reasoning: true } },

  { id: "visuals-maken", group: "media", label: "Beeld & illustraties genereren", needs: { vision: true } },
  { id: "transcriberen", group: "media", label: "Audio & video transcriberen", needs: {} },

  { id: "extractie-classificatie", group: "proces", label: "Gegevens uit documenten halen (op schaal)", needs: {} },
  { id: "workflow-automatiseren", group: "proces", label: "Werkprocessen automatiseren (agentisch)", needs: { toolUse: true } }
];

/* Domeinen: dekken al het werk in het hoger onderwijs.
   Ze sturen suggesties, nooit de uitkomst — het vermogen beslist. */
const DOMAINS = [
  { id: "onderwijs", label: "Onderwijs & docenten", suggest: ["tutoring", "toetsvragen-ontwikkelen", "feedback-op-werk", "samenvatten", "brainstormen"] },
  { id: "toetsing", label: "Toetsing & examinering", suggest: ["toetsvragen-ontwikkelen", "feedback-op-werk", "argumenten-toetsen"] },
  { id: "curriculum", label: "Curriculumontwikkeling", suggest: ["brainstormen", "vergelijken", "beleid-schrijven"] },
  { id: "onderzoek", label: "Onderzoek", suggest: ["literatuur-review", "transcriberen", "data-analyseren", "argumenten-toetsen"] },
  { id: "studentbegeleiding", label: "Studentbegeleiding & -support", suggest: ["kennis-zoeken", "communiceren", "tutoring"] },
  { id: "bibliotheek", label: "Bibliotheek & informatiediensten", suggest: ["literatuur-review", "kennis-zoeken", "extractie-classificatie"] },
  { id: "administratie", label: "Administratie & bedrijfsvoering", suggest: ["extractie-classificatie", "samenvatten", "communiceren", "workflow-automatiseren"] },
  { id: "hr", label: "HR", suggest: ["herschrijven", "samenvatten", "extractie-classificatie"] },
  { id: "communicatie", label: "Communicatie & marketing", suggest: ["communiceren", "herschrijven", "visuals-maken", "vertalen"] },
  { id: "informatiemanagement", label: "Informatiemanagement", suggest: ["kennis-zoeken", "extractie-classificatie", "analyseren"] },
  { id: "architectuur", label: "IT & architectuur", suggest: ["code-genereren", "analyseren", "vergelijken", "workflow-automatiseren"] },
  { id: "bestuur", label: "Bestuur, strategie & governance", suggest: ["beleid-schrijven", "redeneren", "argumenten-toetsen", "analyseren"] },
  { id: "kwaliteitszorg", label: "Kwaliteitszorg & accreditatie", suggest: ["kennis-zoeken", "analyseren", "samenvatten"] },
  { id: "inkoop", label: "Inkoop & contractmanagement", suggest: ["vergelijken", "analyseren", "extractie-classificatie"] },
  { id: "kennismanagement", label: "Kennismanagement & innovatie", suggest: ["kennis-zoeken", "brainstormen", "workflow-automatiseren"] },
  { id: "datadiensten", label: "Data-analyse & onderzoeksondersteuning", suggest: ["data-analyseren", "berekenen", "code-genereren"] }
];

/* ---------- VRAAGMOTOR (adaptief, minimaal) ---------- */
/* Elke vraag heeft een relevantIf(state): alleen vragen die de
   uitkomst nog kunnen veranderen worden gesteld. */

const QUESTIONS = [
  {
    id: "data",
    text: "Welke gegevens voer je in?",
    why: "Bepaalt welke verwerkingslocaties en contracten (AVG) zijn toegestaan.",
    options: [
      { id: "openbaar", label: "Geen of openbare informatie" },
      { id: "intern", label: "Interne of vertrouwelijke documenten" },
      { id: "persoonsgegevens", label: "Persoonsgegevens (namen, studentdata, dossiers)" },
      { id: "bijzonder", label: "Bijzondere persoonsgegevens (gezondheid, e.d.)" }
    ],
    relevantIf: () => true
  },
  {
    id: "stakes",
    text: "Waarvoor wordt de uitkomst gebruikt?",
    why: "Bepaalt het toezichtsregime en of de AI Act-hoogrisicoregels gelden.",
    options: [
      { id: "verkenning", label: "Verkenning of concept — ik controleer alles zelf" },
      { id: "besluit", label: "Intern besluit of externe publicatie" },
      { id: "personen", label: "Een besluit óver personen (student of medewerker)" }
    ],
    relevantIf: () => true
  },
  {
    id: "bronnen",
    text: "Moet elke bewering herleidbaar zijn naar een bron?",
    why: "Herleidbaarheid vereist een model met broncitaties (grounding).",
    options: [
      { id: "ja", label: "Ja, herleidbaarheid is een eis" },
      { id: "nee", label: "Nee, ik gebruik het als denk- of schrijfhulp" }
    ],
    relevantIf: (s) => ["literatuur-review", "kennis-zoeken", "samenvatten", "analyseren", "beleid-schrijven"].includes(s.capability)
  },
  {
    id: "beeld",
    text: "Bevat je invoer afbeeldingen of scans?",
    why: "Beeldinvoer vereist een model dat beeld kan lezen.",
    options: [
      { id: "ja", label: "Ja" },
      { id: "nee", label: "Nee, alleen tekst" }
    ],
    relevantIf: (s) => ["analyseren", "extractie-classificatie", "samenvatten"].includes(s.capability)
  },
  {
    id: "schaal",
    text: "Is dit eenmalig of wordt het een structureel proces?",
    why: "Structureel gebruik raakt inkoop, auditbaarheid en exit-strategie.",
    options: [
      { id: "eenmalig", label: "Eenmalig of incidenteel" },
      { id: "structureel", label: "Structureel / geautomatiseerd proces" }
    ],
    relevantIf: (s) => ["extractie-classificatie", "workflow-automatiseren", "transcriberen", "communiceren", "kennis-zoeken", "tutoring"].includes(s.capability)
  }
];

function nextQuestion(state) {
  for (const q of QUESTIONS) {
    if (state.answers[q.id] === undefined && q.relevantIf(state)) return q;
  }
  return null;
}

/* ---------- GOVERNANCEREGELS ---------- */
/* Regels werken in twee soorten:
   - filter: verwijdert modellen VÓÓR de score (niet compenseerbaar)
   - advies: voegt risico's, adviezen en toezichtseisen toe
   Elke afgevuurde regel komt met id in het redeneerspoor. */

const RULES = [
  {
    id: "R-AVG-1",
    kind: "filter",
    when: (s) => ["persoonsgegevens", "bijzonder"].includes(s.answers.data),
    test: (m) => m.dpa && (m.hosting === "on-prem" || m.hosting === "eu-cloud"),
    note: "Persoonsgegevens: alleen modellen met verwerkersovereenkomst en verwerking binnen de EER of on-prem. VS-cloudmodellen zijn uitgesloten (doorgifterisico)."
  },
  {
    id: "R-AVG-2",
    kind: "filter",
    when: (s) => s.answers.data === "bijzonder",
    test: (m) => m.hosting === "on-prem",
    note: "Bijzondere persoonsgegevens: uitsluitend on-prem-verwerking; een DPIA is verplicht vóór ingebruikname."
  },
  {
    id: "R-VERTROUWELIJK-1",
    kind: "filter",
    when: (s) => ["intern", "persoonsgegevens", "bijzonder"].includes(s.answers.data),
    test: (m) => m.dpa && !m.consumerVersion,
    note: "Vertrouwelijk werk: alleen zakelijke licenties met verwerkersovereenkomst; consumentenversies zijn uitgesloten."
  },
  {
    id: "R-AIACT-1",
    kind: "advies",
    when: (s) => s.answers.stakes === "personen",
    apply: (out) => {
      out.humanReview = "mens-beslist";
      out.risks.push("Dit gebruik valt vermoedelijk onder de hoog-risicocategorieën van de EU AI Act (beoordeling van of besluiten over personen in het onderwijs).");
      out.governance.push("AI Act: het model mag uitsluitend adviseren; een mens neemt en motiveert het besluit. Registreer het gebruik, voer een DPIA/FRIA uit en informeer betrokkenen.");
    },
    note: "Besluiten over personen: hoog-risicoregime AI Act — mens beslist, model adviseert."
  },
  {
    id: "R-EXPLAIN-1",
    kind: "filter",
    when: (s) => s.answers.stakes === "personen",
    test: (m) => m.explainability >= 2,
    note: "Besluiten over personen vereisen een aantoonbaar en auditbaar redeneerspoor: modellen zonder logging/herleidbaarheid zijn uitgesloten."
  },
  {
    id: "R-BRON-1",
    kind: "filter",
    when: (s) => s.answers.bronnen === "ja",
    test: (m) => m.grounding === "bronnen",
    note: "Herleidbaarheid is een eis: alleen modellen die elke bewering aan een brondocument koppelen komen in aanmerking."
  },
  {
    id: "R-BEELD-1",
    kind: "filter",
    when: (s) => s.answers.beeld === "ja",
    test: (m) => m.vision >= 2,
    note: "De invoer bevat beeld: modellen zonder beeldverwerking vallen af."
  },
  {
    id: "R-COPY-1",
    kind: "advies",
    when: (s) => s.capability === "visuals-maken" || (["communiceren", "beleid-schrijven", "herschrijven"].includes(s.capability) && ["besluit", "personen"].includes(s.answers.stakes)),
    apply: (out) => {
      out.risks.push("Auteursrecht: gegenereerde output kan beschermd materiaal reproduceren; de instelling blijft verantwoordelijk voor publicatie.");
      out.governance.push("Publicatie alleen na menselijke redactie; genereer geen herkenbare personen, merken of stijlen van levende makers.");
    },
    note: "Publicatiegericht genereren: auteursrechtelijke controle vóór publicatie."
  },
  {
    id: "R-LOCKIN-1",
    kind: "advies",
    when: (s) => s.answers.schaal === "structureel",
    apply: (out) => {
      out.governance.push("Structureel gebruik: leg exit-strategie en dataportabiliteit vast in de inkoopvoorwaarden; toets tegen de aanbestedingsdrempels.");
      out.tieBreak = "exit";
    },
    note: "Structureel proces: exit-kosten wegen zwaarder mee (vendor-lock-in-preventie) en inkoop wordt betrokken."
  },
  {
    id: "R-PUBVAL-1",
    kind: "advies",
    when: (s) => ["tutoring", "feedback-op-werk", "toetsvragen-ontwikkelen"].includes(s.capability),
    apply: (out) => {
      out.governance.push("Publieke waarden (menselijkheid): AI ondersteunt de docent en vervangt geen begeleidingsrelatie; wees transparant naar studenten over AI-gebruik en borg toegankelijkheid voor alle studenten.");
    },
    note: "Onderwijsnabij gebruik: menselijkheid en transparantie richting studenten geborgd."
  },
  {
    id: "R-DUUR-1",
    kind: "advies",
    when: (s) => s.answers.stakes === "verkenning" && ["brainstormen", "herschrijven", "vertalen", "communiceren", "samenvatten"].includes(s.capability),
    apply: (out) => { out.preferLight = true; },
    note: "Eenvoudige taak: het eenvoudigst verdedigbare (en zuinigste) model krijgt voorrang — zwaarte moet verdiend worden."
  },
  {
    id: "R-WEB-1",
    kind: "filter",
    when: (s) => s.capability === "feiten-zoeken",
    test: (m) => m.grounding === "web",
    note: "Actuele webinformatie vereist een model met web-toegang; modellen zonder internettoegang vallen af."
  }
];

/* ---------- TOEZICHTSREGIME (MSM-kwadrant) ---------- */
function reviewRegime(answers) {
  if (answers.stakes === "personen") return "mens-beslist";
  if (answers.stakes === "besluit") return "mens-in-de-lus";
  return "steekproef";
}

const REVIEW_LABELS = {
  "mens-beslist": "Mens beslist — het model adviseert alleen. Elk besluit wordt door een mens genomen én gemotiveerd.",
  "mens-in-de-lus": "Mens in de lus — controleer en accordeer elke output vóór gebruik of publicatie.",
  "steekproef": "Steekproefsgewijze controle volstaat — blijf output periodiek toetsen op kwaliteit."
};

/* ---------- SCORING (pas ná de filters) ---------- */
function scoreModel(m, cap, state, out) {
  let score = (m.capabilities[cap.id] || 0) * 3;
  const needs = cap.needs || {};
  if (needs.reasoning) score += m.reasoning;
  if (needs.coding) score += m.coding;
  if (needs.vision) score += m.vision;
  if (needs.toolUse) score += m.toolUse;
  if (needs.longContext) score += m.contextLength === "lang" ? 2 : m.contextLength === "middel" ? 1 : 0;
  if (needs.grounding && m.grounding === "bronnen") score += 2;
  if (state.answers.bronnen === "ja" && m.grounding === "bronnen") score += 1;
  score -= (m.costs - 1) * 0.5;
  if (out.preferLight) score -= (m.footprint - 1) * 1.5;
  else score -= (m.footprint - 1) * 0.25;
  /* Optionaliteit als vaste, lichte voorkeur; zwaarder bij structureel gebruik */
  const exitWeight = out.tieBreak === "exit" ? 1.0 : 0.3;
  score -= (m.exitCosts - 1) * exitWeight;
  if (m.openSource) score += 0.25;
  return Math.round(score * 100) / 100;
}

/* ---------- HOOFDFUNCTIE ---------- */
function recommend(state, registry) {
  const cap = CAPABILITIES.find((c) => c.id === state.capability);
  if (!cap) throw new Error("Onbekend vermogen: " + state.capability);

  const out = {
    capability: cap,
    trace: [],
    risks: [],
    governance: [],
    privacy: [],
    limitations: [],
    hardFilters: [],
    eliminated: [],
    ranked: [],
    humanReview: reviewRegime(state.answers),
    tieBreak: null,
    preferLight: false
  };

  out.trace.push({ id: "LAAG-1", text: `Vermogen vastgesteld: "${cap.label}". Modellen zijn tot dit punt niet aan de orde geweest.` });

  /* Fase 1 — harde filters */
  let candidates = registry.models.slice();
  const startCount = candidates.length;
  for (const rule of RULES) {
    if (!rule.when(state)) continue;
    if (rule.kind === "filter") {
      const before = candidates.length;
      const removed = candidates.filter((m) => !rule.test(m));
      candidates = candidates.filter((m) => rule.test(m));
      if (removed.length) {
        out.hardFilters.push({
          id: rule.id,
          explanation: rule.note,
          before,
          after: candidates.length,
          removed: removed.map((m) => m.name)
        });
        removed.forEach((m) => out.eliminated.push({ model: m.name, rule: rule.id, reason: rule.note }));
      }
      out.trace.push({ id: rule.id, text: rule.note + ` (${before} → ${candidates.length} modellen)` });
    } else {
      rule.apply(out);
      out.trace.push({ id: rule.id, text: rule.note });
    }
  }

  /* Vermogen zelf als filter: model moet het vermogen minimaal kunnen */
  const capabilityRemoved = candidates.filter((m) => (m.capabilities[cap.id] || 0) < 1);
  candidates = candidates.filter((m) => (m.capabilities[cap.id] || 0) >= 1);
  if (capabilityRemoved.length) {
    out.hardFilters.push({
      id: "LAAG-2",
      explanation: `Het model moet het gevraagde vermogen "${cap.label}" aantoonbaar ondersteunen.`,
      before: candidates.length + capabilityRemoved.length,
      after: candidates.length,
      removed: capabilityRemoved.map((m) => m.name)
    });
    capabilityRemoved.forEach((m) => out.eliminated.push({
      model: m.name,
      rule: "LAAG-2",
      reason: `Ondersteunt het gevraagde vermogen "${cap.label}" niet voldoende.`
    }));
  }
  out.trace.push({ id: "LAAG-2", text: `Vermogensfilter: ${candidates.length} van ${startCount} geregistreerde modellen kunnen "${cap.label}".` });

  if (candidates.length === 0) {
    out.result = "geen";
    out.message = "Geen geregistreerd model voldoet aan de eisen. Dit is een registerhiaat: meld het bij informatiemanagement. Overweeg de taak zonder AI uit te voeren of de eisen bestuurlijk te herzien — versoepel ze niet zelf.";
    out.confidence = "n.v.t.";
    return out;
  }

  /* Fase 2 — score en rangschikking */
  const scored = candidates
    .map((m) => ({ model: m, score: scoreModel(m, cap, state, out) }))
    .sort((a, b) => b.score - a.score);

  out.recommended = scored[0];
  out.alternatives = scored.slice(1, 4);
  out.ranked = scored;
  out.rankingCriteria = [
    "Vermogensfit: hoe goed het model de gekozen taak ondersteunt.",
    "Benodigde eigenschappen, zoals redeneren, brongebruik, beeld of lange documenten.",
    "Kosten, duurzaamheid en openheid wegen mee; ze kunnen een harde eis nooit compenseren.",
    out.tieBreak === "exit"
      ? "Exit-kosten wegen extra zwaar, omdat het om structureel gebruik gaat."
      : "Exit-kosten wegen licht mee om toekomstige afhankelijkheid te beperken."
  ];

  /* Betrouwbaarheid: afstand tussen nr. 1 en nr. 2 */
  const gap = scored.length > 1 ? scored[0].score - scored[1].score : 99;
  out.confidence = gap >= 3 ? "hoog" : gap >= 1.5 ? "middel" : "laag";
  if (out.confidence === "laag") {
    out.limitations.push("Meerdere modellen scoren vrijwel gelijk; de alternatieven zijn volwaardige opties. Kies op basis van wat je al kent of vraag informatiemanagement.");
  }

  /* Privacy- en beperkingenblok uit registerdata */
  const top = out.recommended.model;
  if (top.privacyNotes) out.privacy.push(top.privacyNotes);
  if (state.answers.data !== "openbaar") out.privacy.push("Voer niet meer gegevens in dan nodig (dataminimalisatie); anonimiseer waar mogelijk.");
  out.limitations.push(...top.weaknesses);
  if (top.grounding !== "bronnen") out.limitations.push("Dit model levert geen herleidbare broncitaties: controleer feitelijke beweringen zelf.");
  if (top.governanceNotes) out.governance.push(top.governanceNotes);

  out.trace.push({ id: "SCORE", text: `Rangschikking op vermogensfit, met correcties voor voetafdruk en exit-kosten: ${scored.map((s) => `${s.model.name} (${s.score})`).join("; ")}.` });
  out.trace.push({ id: "TOEZICHT", text: "Toezichtsregime: " + REVIEW_LABELS[out.humanReview] });

  out.result = "ok";
  return out;
}

/* ---------- REGISTERVALIDATIE ---------- */
function validateRegistry(registry) {
  const errors = [];
  const required = ["id", "name", "type", "hosting", "dpa", "capabilities", "explainability", "exitCosts", "footprint", "grounding"];
  const capIds = new Set(CAPABILITIES.map((c) => c.id));
  for (const m of registry.models || []) {
    for (const f of required) if (m[f] === undefined) errors.push(`${m.id || "?"}: veld "${f}" ontbreekt`);
    for (const k of Object.keys(m.capabilities || {})) {
      if (!capIds.has(k)) errors.push(`${m.id}: onbekend vermogen "${k}" (taxonomie is leidend)`);
    }
  }
  return errors;
}

const ENGINE = {
  CAPABILITY_GROUPS, CAPABILITIES, DOMAINS, QUESTIONS, RULES, REVIEW_LABELS,
  nextQuestion, recommend, validateRegistry
};

if (typeof module !== "undefined" && module.exports) {
  module.exports = ENGINE;
} else if (typeof window !== "undefined") {
  window.ENGINE = ENGINE;
}
