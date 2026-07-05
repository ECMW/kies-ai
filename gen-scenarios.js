/* Genereert scenarios.md: 100 realistische casussen door de ECHTE engine.
   Bevat harde asserties: persoonsgegevens mogen nooit op een VS-cloudmodel
   uitkomen; besluiten over personen krijgen altijd "mens-beslist". */
const E = require("./engine.js");
const { MODEL_REGISTRY } = require("./registry.js");

const D = (cap, data, stakes, extra = {}) => ({ capability: cap, answers: { data, stakes, ...extra } });

/* 40 handgeschreven casussen, dekkend over alle domeinen */
const handcrafted = [
  ["Onderwijs", "Docent geschiedenis wil werkvormen bedenken voor een hoorcollege over de Koude Oorlog.", D("brainstormen", "openbaar", "verkenning")],
  ["Onderwijs", "Docent wil oefenvragen maken bij een openbaar leerboek statistiek.", D("toetsvragen-ontwikkelen", "openbaar", "verkenning")],
  ["Onderwijs", "Docent wil AI formatieve feedback laten geven op ingeleverde essays van studenten (met namen).", D("feedback-op-werk", "persoonsgegevens", "personen")],
  ["Onderwijs", "Docent wil een oefen-tutor voor studenten die moeite hebben met verzuringsevenwichten.", D("tutoring", "openbaar", "verkenning", { schaal: "structureel" })],
  ["Toetsing", "Examencommissie wil AI laten adviseren bij het beoordelen van fraudezaken.", D("argumenten-toetsen", "persoonsgegevens", "personen")],
  ["Toetsing", "Toetsdeskundige wil twee toetsmatrijzen vergelijken op dekking van leerdoelen.", D("vergelijken", "intern", "besluit")],
  ["Curriculum", "Curriculumcommissie wil opleidingsprofielen van drie zusterinstellingen vergelijken.", D("vergelijken", "openbaar", "besluit")],
  ["Curriculum", "Opleidingsmanager schrijft een herzieningsnotitie voor het curriculum.", D("beleid-schrijven", "intern", "besluit", { bronnen: "nee" })],
  ["Onderzoek", "Promovendus wil 60 onderzoeksinterviews (herleidbaar tot personen) transcriberen.", D("transcriberen", "persoonsgegevens", "verkenning", { schaal: "structureel" })],
  ["Onderzoek", "Onderzoeker verkent literatuur over epistemische afhankelijkheid; elke claim moet herleidbaar zijn.", D("literatuur-review", "openbaar", "besluit", { bronnen: "ja" })],
  ["Onderzoek", "Onderzoeker wil een R-script voor een mixed-effects-analyse laten schrijven.", D("code-genereren", "openbaar", "verkenning")],
  ["Onderzoek", "Onderzoeksgroep analyseert een geanonimiseerde enquêtedataset.", D("data-analyseren", "intern", "besluit")],
  ["Studentbegeleiding", "Decaan zoekt in de eigen regelingen wat de procedure is bij bindend studieadvies.", D("kennis-zoeken", "intern", "besluit", { bronnen: "ja", schaal: "eenmalig" })],
  ["Studentbegeleiding", "Studieadviseur wil gespreksverslagen met gezondheidsinformatie samenvatten.", D("samenvatten", "bijzonder", "personen", { bronnen: "nee", beeld: "nee" })],
  ["Bibliotheek", "Bibliothecaris bouwt een zoekassistent op de eigen kennisbank voor studenten.", D("kennis-zoeken", "openbaar", "verkenning", { bronnen: "ja", schaal: "structureel" })],
  ["Bibliotheek", "Bibliotheek wil metadata uit gescande oude tijdschriftomslagen halen.", D("extractie-classificatie", "openbaar", "verkenning", { beeld: "ja", schaal: "structureel" })],
  ["Administratie", "Medewerker wil wekelijkse teamoverleggen samenvatten uit opnames.", D("transcriberen", "intern", "verkenning", { schaal: "structureel" })],
  ["Administratie", "Financiële administratie wil facturen automatisch classificeren en boeken.", D("extractie-classificatie", "intern", "besluit", { beeld: "ja", schaal: "structureel" })],
  ["Administratie", "Servicedesk wil standaardantwoorden op veelgestelde studentvragen opstellen.", D("communiceren", "openbaar", "verkenning", { schaal: "structureel" })],
  ["HR", "HR wil binnengekomen sollicitatiebrieven laten voorsorteren.", D("extractie-classificatie", "persoonsgegevens", "personen", { beeld: "nee", schaal: "structureel" })],
  ["HR", "HR-adviseur herschrijft een vacaturetekst inclusiever.", D("herschrijven", "openbaar", "besluit")],
  ["HR", "HR wil exitgesprekverslagen thematisch analyseren.", D("analyseren", "persoonsgegevens", "besluit", { bronnen: "nee", beeld: "nee" })],
  ["Communicatie", "Communicatieafdeling wil campagnebeeld voor de open dag genereren.", D("visuals-maken", "openbaar", "besluit")],
  ["Communicatie", "Webredacteur vertaalt de opleidingspagina's naar het Engels.", D("vertalen", "openbaar", "besluit")],
  ["Communicatie", "Woordvoerder zoekt actuele berichtgeving over een lopende kwestie.", D("feiten-zoeken", "openbaar", "verkenning")],
  ["Informatiemanagement", "Informatiemanager analyseert een leverancierscontract van 90 pagina's op exit-clausules.", D("analyseren", "intern", "besluit", { bronnen: "nee", beeld: "nee" })],
  ["Informatiemanagement", "IM wil het documentair informatiebeheer deels automatiseren.", D("workflow-automatiseren", "intern", "besluit", { schaal: "structureel" })],
  ["Architectuur", "Enterprise-architect vergelijkt twee integratiepatronen voor het LMS.", D("vergelijken", "intern", "besluit")],
  ["Architectuur", "Ontwikkelteam wil legacy-code laten documenteren en refactoren.", D("code-genereren", "intern", "verkenning")],
  ["Bestuur", "Bestuurssecretaris schrijft een collegevoorstel over AI-beleid; herleidbaarheid vereist.", D("beleid-schrijven", "intern", "besluit", { bronnen: "ja" })],
  ["Bestuur", "CvB-lid wil een complex huisvestingsdilemma laten doordenken als sparringpartner.", D("redeneren", "intern", "besluit")],
  ["Bestuur", "Strategieafdeling toetst de argumentatie in een instellingsplan-concept.", D("argumenten-toetsen", "intern", "besluit")],
  ["Kwaliteitszorg", "Kwaliteitszorgmedewerker zoekt in accreditatiekaders en eigen rapporten; bronvermelding verplicht.", D("kennis-zoeken", "intern", "besluit", { bronnen: "ja", schaal: "eenmalig" })],
  ["Kwaliteitszorg", "Panelvoorbereiding: honderden evaluatieformulieren samenvatten (zonder namen).", D("samenvatten", "intern", "verkenning", { bronnen: "nee", beeld: "nee" })],
  ["Inkoop", "Inkoper vergelijkt drie offertes voor een nieuw roostersysteem.", D("vergelijken", "intern", "besluit")],
  ["Inkoop", "Contractmanager haalt looptijden en boeteclausules uit 40 contracten.", D("extractie-classificatie", "intern", "besluit", { beeld: "ja", schaal: "structureel" })],
  ["Kennismanagement", "Innovatieteam brainstormt over AI-native onderwijsvormen.", D("brainstormen", "openbaar", "verkenning")],
  ["Datadiensten", "Data-analist berekent scenario's voor instroomprognoses.", D("berekenen", "intern", "besluit")],
  ["Datadiensten", "Research-engineer bouwt een pipeline die wekelijks datasets valideert.", D("workflow-automatiseren", "intern", "besluit", { schaal: "structureel" })],
  ["Onderwijs", "Docent wil colleges automatisch transcriberen voor studenten met een functiebeperking.", D("transcriberen", "persoonsgegevens", "verkenning", { schaal: "structureel" })]
];

/* Programmatische uitbreiding tot 100: raster over vermogens × gegevensklassen × inzet */
const dataOpts = ["openbaar", "intern", "persoonsgegevens"];
const stakesOpts = ["verkenning", "besluit", "personen"];
const gridCaps = ["samenvatten", "analyseren", "redeneren", "herschrijven", "vertalen", "communiceren", "literatuur-review", "kennis-zoeken", "code-genereren", "data-analyseren", "tutoring", "toetsvragen-ontwikkelen", "feedback-op-werk", "extractie-classificatie", "workflow-automatiseren", "visuals-maken", "feiten-zoeken", "brainstormen", "vergelijken", "argumenten-toetsen"];

const grid = [];
let i = 0;
outer:
for (const cap of gridCaps) {
  for (const data of dataOpts) {
    for (const stakes of stakesOpts) {
      if (handcrafted.length + grid.length >= 100) break outer;
      i++;
      if (i % 2 === 0) continue; // dunner raster, meer spreiding
      const extra = {};
      const capDef = E.CAPABILITIES.find((c) => c.id === cap);
      if (["literatuur-review", "kennis-zoeken", "samenvatten", "analyseren", "beleid-schrijven"].includes(cap)) extra.bronnen = stakes === "verkenning" ? "nee" : "ja";
      if (["analyseren", "extractie-classificatie", "samenvatten"].includes(cap)) extra.beeld = "nee";
      if (["extractie-classificatie", "workflow-automatiseren", "transcriberen", "communiceren", "kennis-zoeken", "tutoring"].includes(cap)) extra.schaal = stakes === "verkenning" ? "eenmalig" : "structureel";
      grid.push([
        "Rastertest",
        `Medewerker wil "${capDef.label.toLowerCase()}" met ${data === "openbaar" ? "openbare informatie" : data === "intern" ? "vertrouwelijke interne documenten" : "persoonsgegevens"}, gebruikt voor ${stakes === "verkenning" ? "verkenning" : stakes === "besluit" ? "een intern besluit" : "een besluit over personen"}.`,
        D(cap, data, stakes, extra)
      ]);
    }
  }
}

const scenarios = handcrafted.concat(grid).slice(0, 100);

/* ---- Uitvoeren + asserties ---- */
let failures = [];
const lines = [];
lines.push("# Testrapport — 100 scenario's door de kies-ai-engine v1.0\n");
lines.push(`Register: ${MODEL_REGISTRY.meta.institution}, versie ${MODEL_REGISTRY.meta.version} (${MODEL_REGISTRY.models.length} modellen). Elk scenario is door de echte engine gehaald; dit rapport is gegenereerd, niet geschreven.\n`);
lines.push("**Ingebouwde asserties (moeten voor alle 100 gelden):** (A1) persoonsgegevens landen nooit op een VS-cloudmodel; (A2) besluiten over personen krijgen altijd het regime 'mens beslist' en een AI Act-verwijzing; (A3) een bron-eis levert alleen modellen met herleidbare citaties op.\n");

scenarios.forEach(([domain, desc, input], idx) => {
  const out = E.recommend(input, MODEL_REGISTRY);
  const n = idx + 1;
  const capLabel = E.CAPABILITIES.find((c) => c.id === input.capability).label;
  const qAsked = E.QUESTIONS.filter((q) => q.relevantIf(input) && input.answers[q.id] !== undefined).map((q) => q.id).join(", ");

  /* Asserties */
  if (out.result === "ok") {
    const m = out.recommended.model;
    if (["persoonsgegevens", "bijzonder"].includes(input.answers.data) && m.hosting === "us-cloud") failures.push(`#${n}: A1 geschonden (${m.name})`);
    if (input.answers.bronnen === "ja" && m.grounding !== "bronnen") failures.push(`#${n}: A3 geschonden (${m.name})`);
  }
  if (input.answers.stakes === "personen") {
    if (out.humanReview !== "mens-beslist") failures.push(`#${n}: A2 geschonden (regime=${out.humanReview})`);
    if (!out.governance.some((g) => g.includes("AI Act")) && out.result === "ok") failures.push(`#${n}: A2 geschonden (geen AI Act-advies)`);
  }

  lines.push(`\n## ${n}. [${domain}] ${desc}`);
  lines.push(`- **Gestelde vragen:** ${qAsked || "geen (vermogen volstond)"}`);
  lines.push(`- **Vermogen (Laag 1):** ${capLabel}`);
  if (out.result === "geen") {
    lines.push(`- **Model (Laag 2):** geen — registerhiaat. ${out.message}`);
  } else {
    lines.push(`- **Model (Laag 2):** ${out.recommended.model.name} (score ${out.recommended.score}, betrouwbaarheid ${out.confidence})`);
    lines.push(`- **Alternatieven:** ${out.alternatives.map((a) => a.model.name).join("; ") || "geen"}`);
  }
  lines.push(`- **Menselijke toets:** ${out.humanReview}`);
  lines.push(`- **Redeneerspoor:** ${out.trace.map((t) => t.id).join(" → ")}`);
  const gov = out.governance.concat(out.risks);
  if (gov.length) lines.push(`- **Governance-advies:** ${gov.join(" · ")}`);
});

lines.push(`\n---\n## Assertieresultaat\n`);
lines.push(failures.length ? `**${failures.length} SCHENDINGEN:**\n` + failures.join("\n") : "**Alle 100 scenario's doorstaan alle asserties.** Persoonsgegevens komen nooit op VS-cloud terecht, besluiten over personen krijgen altijd 'mens beslist' met AI Act-advies, en bron-eisen leiden altijd naar modellen met herleidbare citaties.");

require("fs").writeFileSync(__dirname + "/scenarios.md", lines.join("\n"));
console.log(`Klaar: ${scenarios.length} scenario's, ${failures.length} assertie-schendingen.`);
if (failures.length) { console.log(failures.join("\n")); process.exit(1); }
