/* PAM-AI interface. No network requests; all input remains on this device. */
"use strict";
const E = PAM,
  $ = (s) => document.querySelector(s),
  esc = (v) =>
    String(v ?? "").replace(
      /[&<>"']/g,
      (c) =>
        ({
          "&": "&amp;",
          "<": "&lt;",
          ">": "&gt;",
          '"': "&quot;",
          "'": "&#39;",
        })[c],
    );
const steps = [
  "Taak & context",
  "Alternatieven",
  "Toelaatbaarheid",
  "Test & bewijs",
  "Proportionaliteit",
  "Besluit",
];
let vault = { items: [], current: null },
  a = null,
  ci = 0,
  runDraft = null,
  editRun = -1,
  runPage = 0,
  storageError = "",
  timer,
  importConfirmed = false;
try {
  const raw = localStorage.getItem("pam-ai-v1");
  if (raw) {
    const data = JSON.parse(raw);
    if (!Array.isArray(data.items)) throw Error("Onbekend opslagformaat");
    data.items.forEach((x) => {
      const id = x.id;
      E.parseImport(JSON.stringify(x));
      x.id = id;
    });
    vault = data;
    a = vault.items.find((x) => x.id === vault.current) || null;
  }
} catch (e) {
  storageError =
    "Lokale opslag kon niet veilig worden gelezen. Importeer een reservekopie of exporteer de ruwe opslag via de knop hieronder. De bestaande opslag wordt niet overschreven.";
}
function notice(msg) {
  $("#notice").textContent = msg;
  const runError = $("#run-error");
  if (runError) runError.textContent = msg;
  clearTimeout(timer);
  timer = setTimeout(() => ($("#notice").textContent = ""), 6000);
}
function save() {
  if (a) {
    a.updated = new Date().toISOString();
    a.appVersion = E.VERSION;
    vault.current = a.id;
  }
  if (storageError) {
    const el = $("#save-state");
    if (el) el.textContent = "Niet bewaard — exporteer een reservekopie";
    return;
  }
  try {
    localStorage.setItem("pam-ai-v1", JSON.stringify(vault));
    const el = $("#save-state");
    if (el)
      el.textContent =
        "Lokaal bewaard · " +
        new Date().toLocaleTimeString("nl-NL", {
          hour: "2-digit",
          minute: "2-digit",
        });
  } catch (e) {
    storageError =
      "Opslaan is niet gelukt. Exporteer je beoordeling nu als reservekopie; sluit dit tabblad nog niet.";
    const el = $("#save-state");
    if (el) el.textContent = "Niet bewaard — exporteer een reservekopie";
    notice(storageError);
  }
}
function pathGet(obj, path) {
  return path.split(".").reduce((v, k) => v?.[k], obj);
}
function pathSet(obj, path, v) {
  const bits = path.split(".");
  if (bits.some((x) => ["__proto__", "prototype", "constructor"].includes(x)))
    return;
  const last = bits.pop();
  let n = obj;
  for (const k of bits) n = n[k];
  n[last] = v;
}
const label = (s) => E.LABELS[s] || s || "Nog niet beoordeeld";
function badge(s) {
  return (
    '<span class="badge ' +
    (["PASS", "DECISION-READY", "PILOT-READY", "COMPLETE"].includes(s)
      ? "good"
      : ["FAIL", "HOLD", "NOT ELIGIBLE"].includes(s)
        ? "bad"
        : "wait") +
    '">' +
    esc(label(s)) +
    "</span>"
  );
}
function field(path, title, options = {}) {
  if (
    window.PAM_GUIDE?.active() &&
    /(?:^@|\.)evidence$/.test(path) &&
    !path.startsWith("design.")
  )
    return PAM_GUIDE.sourcePicker(path);
  const draft = path.startsWith("@"),
    key = draft ? path.slice(1) : path,
    v = pathGet(draft ? runDraft : a, key),
    id = "f-" + path.replace(/[^a-z0-9]/gi, "-"),
    disabled = options.lock && a.runs.length ? " disabled" : "",
    wide = options.wide ? " wide" : "",
    opt = options.options;
  let input;
  if (opt)
    input =
      '<select id="' +
      id +
      '" data-path="' +
      path +
      '"' +
      disabled +
      '><option value="">Kies…</option>' +
      opt
        .map((o) => {
          const [val, txt] = Array.isArray(o) ? o : [o, label(o)];
          return (
            '<option value="' +
            esc(val) +
            '"' +
            (String(v) === String(val) ? " selected" : "") +
            ">" +
            esc(txt) +
            "</option>"
          );
        })
        .join("") +
      "</select>";
  else if (options.check)
    input =
      '<input id="' +
      id +
      '" type="checkbox" data-path="' +
      path +
      '"' +
      (v === true ? " checked" : "") +
      disabled +
      ">";
  else if (options.area)
    input =
      '<textarea id="' +
      id +
      '" data-path="' +
      path +
      '" rows="' +
      (options.rows || 3) +
      '"' +
      disabled +
      ">" +
      esc(v) +
      "</textarea>";
  else
    input =
      '<input id="' +
      id +
      '" data-path="' +
      path +
      '" type="' +
      (options.type || "text") +
      '"' +
      (options.type === "number" ? ' min="0" step="any"' : "") +
      ' value="' +
      esc(v) +
      '"' +
      disabled +
      (options.placeholder
        ? ' placeholder="' + esc(options.placeholder) + '"'
        : "") +
      ">";
  input = input.replace(
    /^(<(?:input|textarea|select)\b)/,
    '$1 aria-labelledby="' +
      id +
      '-label"' +
      (options.hint ? ' aria-describedby="' + id + '-hint"' : ""),
  );
  return (
    '<label class="field' +
    wide +
    (options.check ? " checkbox" : "") +
    '" for="' +
    id +
    '">' +
    (options.check ? input : "") +
    '<span id="' +
    id +
    '-label">' +
    esc(title) +
    "</span>" +
    (options.check ? "" : input) +
    (options.hint
      ? '<small id="' + id + '-hint">' + esc(options.hint) + "</small>"
      : "") +
    "</label>"
  );
}
function panel(title, body, sub = "") {
  return (
    '<section class="panel"><h2>' +
    esc(title) +
    "</h2>" +
    (sub ? '<p class="small muted">' + esc(sub) + "</p>" : "") +
    body +
    "</section>"
  );
}
function fields(items) {
  return '<div class="fields">' + items.join("") + "</div>";
}
function btn(action, title, cls = "", extra = "") {
  return (
    '<button type="button" data-action="' +
    action +
    '" class="' +
    cls +
    '" ' +
    extra +
    ">" +
    title +
    "</button>"
  );
}
function candidateTabs() {
  return (
    '<div class="candidate-tabs">' +
    a.candidates
      .map((c, i) =>
        btn(
          "candidate",
          esc(c.name || c.id),
          ci === i ? "active" : "",
          'data-index="' + i + '"',
        ),
      )
      .join("") +
    "</div>"
  );
}
function candEmpty() {
  return (
    '<div class="empty"><h2>Begin met de alternatieven</h2><p>Voeg de huidige niet-AI-werkwijze en een relevante andere oplossing toe.</p>' +
    btn("step", "Alternatieven vastleggen", "primary", 'data-index="1"') +
    "</div>"
  );
}
function fmt(n, percent = false) {
  return n === null || n === undefined
    ? "Onbekend"
    : new Intl.NumberFormat("nl-NL", {
        maximumFractionDigits: percent ? 2 : 4,
        style: percent ? "percent" : "decimal",
      }).format(n);
}
function landing() {
  return (
    '<div class="layout"><aside><p class="side-label">Je werkruimte</p><p>Een concrete taak.<br>Een onderbouwde keuze.</p><p class="side-note">Ontwikkeld door<br><strong>E.C.M. Willems</strong><br>Methodiek v1.1</p></aside><main id="main"><p class="eyebrow">PAM-AI / proportionaliteitsafweging</p><div class="intro-grid"><div><h1>Welke oplossing past bij deze taak?</h1><p class="lead">Leg vast wat nodig is, toets wat mag en werkt, en weeg de extra waarde tegen de extra lasten. Ook andere technologie en géén AI kunnen passend zijn.</p><div class="actions">' +
    btn("new", "Nieuwe beoordeling", "primary") +
    btn("import", "Beoordeling importeren") +
    '</div><p class="small muted">Geen account nodig. Bewaar een export voor gebruik op een ander apparaat.</p></div><div class="start-art"><div><strong>1. Toelaatbaar</strong><span>Mag en kan de configuratie verantwoord worden gebruikt?</span></div><div><strong>2. Voldoende geschikt</strong><span>Haalt de oplossing de taaknorm met genoeg bewijs?</span></div><div><strong>3. Proportioneel</strong><span>Rechtvaardigt de extra waarde de extra lasten?</span></div></div></div>' +
    panel(
      "Op dit apparaat",
      vault.items.length
        ? vault.items
            .map(
              (x) =>
                '<div class="saved-item inline"><div><h3>' +
                esc(x.intake.task || "Naamloze beoordeling") +
                '</h3><span class="small muted">' +
                (x.fictional ? "Fictief voorbeeld · " : "") +
                esc(x.intake.taskId) +
                " · " +
                esc(new Date(x.updated).toLocaleString("nl-NL")) +
                '</span></div><div class="actions">' +
                btn(
                  "open",
                  "Hervatten",
                  "primary",
                  'data-id="' + esc(x.id) + '"',
                ) +
                btn(
                  "delete",
                  "Verwijderen",
                  "danger",
                  'data-id="' + esc(x.id) + '"',
                ) +
                "</div></div>",
            )
            .join("")
        : '<p class="muted">Nog geen beoordelingen. Je werk wordt tijdens het invullen automatisch lokaal bewaard.</p>',
    ) +
    panel(
      "Probeer een fictieve casus",
      '<p>Bekijk hoe een onderbouwde afweging eruitziet, of waarom een kleine pilot nog geen brede inzet rechtvaardigt.</p><div class="actions">' +
        btn("example", "Fictieve volledige afweging", "", 'data-kind="full"') +
        btn("example", "Fictieve kleine pilot", "", 'data-kind="pilot"') +
        "</div>",
    ) +
    footer() +
    "</main></div>"
  );
}
function footer() {
  return (
    '<p class="footer">PAM-AI — Proportionele AI-modelkeuze · E.C.M. Willems · methodiek 1.1 · toepassing ' +
    E.VERSION +
    "<br>Methodiek in ontwikkeling en validatie. Ondersteunt professioneel oordeel; vervangt geen juridische beoordeling, DPIA, FRIA of securityonderzoek.</p>"
  );
}
function render(focus = false) {
  if (window.PAM_GUIDE?.active()) {
    PAM_GUIDE.render(focus);
    return;
  }
  const openDetails = [...document.querySelectorAll("details[open]")].map(
    (d) => d.querySelector("summary")?.textContent,
  );
  if (a) ci = Math.min(ci, Math.max(0, a.candidates.length - 1));
  const error = storageError
    ? '<div class="callout error">' +
      esc(storageError) +
      " " +
      btn("raw-export", "Ruwe opslag downloaden") +
      "</div>"
    : "";
  if (!a) {
    $("#app").innerHTML = error + landing();
    return;
  }
  const status = E.readiness(a),
    body = [
      intakePage,
      candidatesPage,
      gatesPage,
      testPage,
      comparisonPage,
      decisionPage,
    ][a.step]();
  $("#app").innerHTML =
    error +
    (a.fictional
      ? '<div class="fictional"><strong>Fictief voorbeeld.</strong> Alle kandidaten, bewijsstukken en testuitkomsten in deze beoordeling zijn verzonnen demonstratiegegevens.</div>'
      : "") +
    '<div class="layout"><aside><p class="side-label">Beoordeling</p>' +
    btn("home", "← Alle beoordelingen") +
    '<nav aria-label="Stappen">' +
    steps
      .map(
        (s, i) =>
          '<button data-action="step" data-index="' +
          i +
          '" class="' +
          (a.step === i ? "active" : "") +
          '" ' +
          (a.step === i ? 'aria-current="step"' : "") +
          '><span class="stepnum">' +
          (i + 1) +
          "</span>" +
          s +
          "</button>",
      )
      .join("") +
    '</nav><div class="side-note"><strong>' +
    (E.activeRoute(a) || "Route nog open") +
    "</strong><br>" +
    esc(a.intake.scope || "Bepaal eerst de context") +
    "<p>" +
    badge(status.status) +
    '</p>Elke beoordeling mag ook eindigen met meer bewijs, meerdere opties of géén AI.</div><div class="side-actions">' +
    btn("export", "↓ Beoordeling exporteren") +
    btn("version", "Nieuwe beoordelingsversie") +
    '</div></aside><main id="main"><div class="workspacebar"><span>' +
    esc(a.intake.taskId || "Nieuwe beoordeling") +
    " · " +
    esc(a.intake.task || "Taak nog te beschrijven") +
    '</span><span id="save-state">Lokaal bewaren actief</span></div><p class="eyebrow">Stap ' +
    (a.step + 1) +
    " van 6</p>" +
    btn("g-guided", "Terug naar de begeleide route", "primary") +
    body +
    '<div class="actions between bottom no-print">' +
    btn(
      a.step ? "previous" : "home",
      a.step ? "← Vorige stap" : "← Alle beoordelingen",
    ) +
    '<div class="actions">' +
    btn("export", "Exporteren") +
    (a.step < 5 ? btn("next", "Volgende stap →", "primary") : "") +
    "</div></div>" +
    footer() +
    "</main></div>";
  document.querySelectorAll("details").forEach((d) => {
    if (openDetails.includes(d.querySelector("summary")?.textContent))
      d.open = true;
  });
  if (focus) {
    $("#main").setAttribute("tabindex", "-1");
    $("#main").focus();
    window.scrollTo({ top: 0, behavior: "instant" });
  }
}
function intakePage() {
  const i = a.intake,
    f = E.floor(i.thresholds);
  return (
    '<h1>Begin bij de taak</h1><p class="lead">Beschrijf wat moet lukken en voor wie. De context bepaalt hoeveel bewijs de afweging nodig heeft.</p>' +
    panel(
      "Taak en gewenste uitkomst",
      fields([
        field("intake.taskId", "Taak-ID", {
          placeholder: "Bijvoorbeeld INKOOP-2026-01",
        }),
        field("intake.task", "Taak of proces", {
          placeholder:
            "Bijvoorbeeld: antwoorden vinden in interne beleidsdocumenten",
          lock: true,
        }),
        field("intake.goal", "Legitiem doel en gewenste uitkomst", {
          area: true,
          lock: true,
        }),
        field("intake.use", "Hoe wordt de uitkomst gebruikt?", {
          area: true,
          lock: true,
          hint: "Wie controleert het resultaat, en welk besluit of handelen volgt erop?",
        }),
        field("intake.affected", "Gebruikers en mensen die gevolgen ervaren", {
          area: true,
          lock: true,
        }),
        field("intake.baseline", "Huidige werkwijze zonder AI", {
          area: true,
          hint: "Dit is de baseline waarmee je de extra waarde vergelijkt.",
        }),
        field("intake.whyAI", "Waarom AI of andere technologie overwegen?", {
          area: true,
        }),
        field("intake.scope", "Wat wil je nu kunnen besluiten?", {
          options: E.SCOPES,
        }),
        field("intake.owner", "Besluiteigenaar"),
        field("intake.taskOwner", "Taakeigenaar / inhoudsdeskundige"),
      ]),
    ) +
    panel(
      "Welke route past bij de gevolgen?",
      fields(
        [
          "Impact van fouten",
          "Is schade goed omkeerbaar?",
          "Gevoelige of bijzondere data",
          "Gevolgen voor rechten, veiligheid of kerntaak",
          "Schaal van inzet",
          "Externe of agentische handelingen",
          "Formele of sectorale plicht",
        ].map((s, k) =>
          field("intake.answers." + k, s, { options: E.ROUTES[k] }),
        ),
      ) +
        '<div class="hint"><strong>Aanbevolen route: ' +
        (E.route(a) || "beantwoord alle vragen") +
        "</strong><br>" +
        routeHelp(E.activeRoute(a)) +
        "</div><details><summary>Route bevestigen of gemotiveerd afwijken</summary>" +
        fields([
          field("intake.confirmedRoute", "Afwijkende of bevestigde route", {
            options: ["R1", "R2", "R3", "R4"],
            hint: "Leeg: gebruik de aanbevolen route.",
          }),
          field("intake.routeReason", "Motivering van de afwijking", {
            area: true,
          }),
        ]) +
        '<p class="small muted">De routeringsformule plaatst een formele plicht op zichzelf bij R3. Bij directe rechten-/veiligheidsimpact geldt R4. Aanvullende formele beoordeling blijft nodig waar toepasselijk.</p></details>',
    ) +
    panel(
      "Stel de taaknorm vooraf vast",
      '<p class="small">Dit zijn de startwaarden uit het Excelinstrument, geen universele normen. Motiveer ze voor jouw taak voordat je test.</p>' +
        fields([
          field("intake.thresholds.success", "Minimale succeskans (0–1)", {
            type: "number",
            lock: true,
            hint: "0,90 betekent 90%.",
          }),
          field(
            "intake.thresholds.critical",
            "Maximale kans op een kritieke fout (0–1)",
            { type: "number", lock: true },
          ),
          field("intake.thresholds.z", "z-waarde", {
            type: "number",
            lock: true,
          }),
          field("intake.thresholds.baseN", "Basisminimum aantal testcases", {
            type: "number",
            lock: true,
          }),
          field(
            "intake.thresholdReason",
            "Waarom passen deze drempels bij deze taak?",
            { area: true, wide: true, lock: true },
          ),
        ]) +
        '<div class="hint">Effectieve bewijsbodem: <strong>' +
        (f ? f.effective + " cases per kandidaat" : "vul geldige drempels in") +
        "</strong>. " +
        (f
          ? "Minimum bij perfect succes: " +
            f.success +
            "; bij nul kritieke fouten: " +
            f.critical +
            "."
          : "") +
        " Ook dekking en beoordelingsbetrouwbaarheid moeten voldoen. Een kleinere pilot kan wel leerzaam zijn.</div>" +
        (a.runs.length
          ? '<p class="lock-note">Taak en testnorm staan vast sinds de eerste test. Maak een nieuwe beoordelingsversie om die te wijzigen en opnieuw te testen.</p>'
          : ""),
    ) +
    panel(
      "Welke lasten zijn besliskritiek?",
      Object.entries({
        cost: "Directe kosten",
        human: "Menselijke controle en herstel",
        latency: "Doorlooptijd",
        environment: "Milieu en resources",
        autonomy: "Autonomie en afhankelijkheid",
      })
        .map(([k, s]) => field("intake.critical." + k, s, { check: true }))
        .join("") +
        '<p class="small muted">Een onbekende last blijft onbekend. Als die besliskritiek is, kan een volledige afweging nog niet worden afgerond.</p>',
    )
  );
}
function routeHelp(r) {
  return (
    {
      R1: "Begrensde verkenning of kleine pilot. De uitkomst geldt nooit als besluit over bredere inzet.",
      R2: "Standaardkeuze met volledige afweging. Collegiale review is aanbevolen.",
      R3: "Hogere impact of afhankelijkheid. Multidisciplinaire toets en onafhankelijke reviewer zijn vereist.",
      R4: "Kritieke impact. Onafhankelijke review en aanvullende juridische, security- en sectorale toets zijn vereist.",
    }[r] ||
    "De route bepaalt de diepte van het bewijs, niet of een uitsluitingsgrond mag worden genegeerd."
  );
}
function candidatesPage() {
  let c = a.candidates[ci],
    p = "candidates." + ci + ".";
  return (
    '<h1>Leg echte alternatieven vast</h1><p class="lead">Neem altijd de huidige werkwijze zonder AI op. Beschrijf vervolgens wat werkelijk wordt ingezet: versie, omgeving, instellingen én menselijke controle.</p><div class="actions">' +
    btn(
      "add-candidate",
      "+ Alternatief toevoegen",
      "primary",
      a.candidates.length >= 8 ? "disabled" : "",
    ) +
    "</div>" +
    candidateTabs() +
    (c
      ? panel(
          c.name || c.id,
          fields([
            field(p + "type", "Type alternatief", { options: E.TYPES }),
            field(p + "name", "Korte naam"),
            field(p + "component", "Provider, model of component"),
            field(p + "version", "Versie of versie van werkinstructie"),
            field(p + "deployment", "Deployment en regio", {
              hint: "Bijvoorbeeld lokale omgeving, EU-cloud, of handmatige werkplek.",
            }),
            field(p + "fingerprint", "Fingerprint / build / documentversie"),
            field(
              p + "settings",
              "Instellingen, prompt, tools, RAG, agents, rechten en menselijk proces",
              {
                area: true,
                wide: true,
                hint: "Gebruik een verwijzing naar de vaste configuratie. Neem geen sleutels of gevoelige prompts op.",
              },
            ),
            field(p + "testDate", "Testdatum", { type: "date" }),
            field(p + "notes", "Relevante bijzonderheden", { area: true }),
          ]) +
            (a.runs.some((r) => r.candidate === c.id)
              ? '<p class="callout warning">Wijziging van de configuratie maakt eerder testbewijs ongeldig voor deze configuratie. Gebruik een nieuwe beoordelingsversie voor een nieuwe test.</p>'
              : "") +
            '<div class="actions">' +
            btn(
              "copy-candidate",
              "Configuratie als nieuw alternatief kopiëren",
            ) +
            btn("remove-candidate", "Dit alternatief verwijderen", "danger") +
            "</div>",
        )
      : '<div class="empty">Nog geen alternatieven. Voeg eerst de niet-AI-baseline toe.</div>')
  );
}
function evidenceEditor() {
  return (
    "<details><summary>Bewijsregister (" +
    a.evidence.length +
    ' bronnen) — bron toevoegen of wijzigen</summary><p class="small">Gebruik bewijs-ID’s, bijvoorbeeld B01. Meerdere verwijzingen scheid je met een komma. Een verwijzing is pas compleet met bron, eigenaar, datum, graad en beperkingen. “Geen bekende beperking” mag, mits onderzocht.</p>' +
    a.evidence
      .map(
        (e, j) =>
          '<div class="panel"><h3>' +
          esc(e.id) +
          "</h3>" +
          fields([
            field("evidence." + j + ".source", "Bron of document"),
            field("evidence." + j + ".type", "Soort bewijs"),
            field("evidence." + j + ".owner", "Eigenaar"),
            field("evidence." + j + ".date", "Datum", { type: "date" }),
            field("evidence." + j + ".grade", "Bewijsgraad", {
              options: [
                ["A", "A — primair / sterk reproduceerbaar"],
                ["B", "B — gedocumenteerde leverancier / secundair"],
                ["C", "C — schatting / proxy"],
                ["U", "U — onbekend"],
              ],
            }),
            field("evidence." + j + ".location", "Link of bestandslocatie"),
            field(
              "evidence." + j + ".limitations",
              "Beperkingen en reikwijdte",
              { area: true, wide: true },
            ),
            ...(e.grade === "C"
              ? [
                  field(
                    "evidence." + j + ".useLimits",
                    "Gevoeligheidsanalyse of expliciet beperkte claim (graad C)",
                    { area: true, wide: true },
                  ),
                ]
              : []),
          ]) +
          "</div>",
      )
      .join("") +
    btn("add-evidence", "+ Bewijsbron toevoegen") +
    "</details>"
  );
}
function gatesPage() {
  if (!a.candidates.length) return candEmpty();
  const c = a.candidates[ci],
    p = "candidates." + ci + ".";
  return (
    '<h1>Poort 1 · Is de inzet toelaatbaar?</h1><p class="lead">Een negatieve uitkomst sluit dit alternatief uit. Onbekend of ontbrekend bewijs vraagt eerst om aanvulling.</p>' +
    candidateTabs() +
    panel(
      c.name || c.id,
      '<div class="inline"><p>Acht domeinen voor deze configuratie</p>' +
        badge(E.gate1(a, c)) +
        "</div>" +
        ('<div class="actions no-print"><label class="field"><span>Gedeelde bewijsbron (optioneel)</span><select id="shared-evidence"><option value="">Kies bron…</option>' +
          a.evidence
            .map(
              (e) =>
                '<option value="' +
                esc(e.id) +
                '">' +
                esc(e.id + " · " + e.source) +
                "</option>",
            )
            .join("") +
          "</select></label>" +
          btn("shared-evidence", "Verwijzing voor alle domeinen gebruiken") +
          "</div>") +
        c.gate
          .map(
            (g, j) =>
              '<div class="gate-row"><h3>' +
              (j + 1) +
              ". " +
              esc(E.DOMAINS[j]) +
              "</h3>" +
              fields([
                field(p + "gate." + j + ".status", "Beoordeling", {
                  options: E.GATES,
                }),
                field(p + "gate." + j + ".evidence", "Bewijs-ID’s", {
                  hint: "Verwijs naar het bewijsregister hieronder.",
                }),
                ...(["CONDITIONAL", "N/A", "FAIL", "UNKNOWN"].includes(g.status)
                  ? [
                      field(
                        p + "gate." + j + ".reason",
                        g.status === "CONDITIONAL"
                          ? "Concrete voorwaarde"
                          : g.status === "N/A"
                            ? "Waarom niet van toepassing?"
                            : "Onderbouwing / wat ontbreekt?",
                        { area: true, wide: true },
                      ),
                    ]
                  : []),
              ]) +
              "</div>",
          )
          .join(""),
    ) +
    evidenceEditor()
  );
}
function freshRun() {
  const c = a.candidates[ci];
  return {
    id: E.uid(),
    candidate: c?.id || "",
    testCase: "",
    stratum: "",
    accepted: null,
    critical: null,
    ...Object.fromEntries(E.NUMS.map((k) => [k, null])),
    evidence: "",
    notes: "",
    configStamp: "",
    designStamp: "",
  };
}
function restoreRunDraft() {
  if (runDraft) return;
  runDraft = freshRun();
  const c = a.candidates[ci],
    pending = a.pendingRuns?.[c?.id];
  if (!pending || !pending.value || typeof pending.value !== "object") return;
  for (const k of Object.keys(runDraft)) {
    const v = pending.value[k];
    if (
      typeof runDraft[k] === "string"
        ? typeof v === "string"
        : v === null || (typeof v === "number" && Number.isFinite(v))
    )
      runDraft[k] = v;
  }
  editRun = a.runs.findIndex(
    (r) => r.id === runDraft.id && r.candidate === c.id,
  );
}
function saveRunDraft() {
  if (!a || !runDraft || !a.candidates[ci]) return;
  if (
    !a.pendingRuns ||
    typeof a.pendingRuns !== "object" ||
    Array.isArray(a.pendingRuns)
  )
    a.pendingRuns = {};
  a.pendingRuns[a.candidates[ci].id] = { value: E.clone(runDraft) };
  save();
}
function clearRunDraft() {
  if (a?.pendingRuns && a.candidates[ci])
    delete a.pendingRuns[a.candidates[ci].id];
}
function designEditor() {
  return (
    "<details " +
    (!E.designReady(a) ? "open" : "") +
    "><summary>Testontwerp — vóór de eerste test vastleggen</summary>" +
    fields([
      field("design.criticalDefinition", "Wanneer is een fout kritiek?", {
        area: true,
        lock: true,
        hint: "Betrek de taak, de gevolgen en de mensen die die gevolgen ervaren.",
      }),
      field("design.assessor", "Wie beoordeelt de uitkomsten?", { lock: true }),
      field("design.doubleReview", "Blind of dubbel beoordeeld?", {
        options: ["Ja", "Nee", "Gedeeltelijk", "N.v.t."],
        lock: true,
      }),
      field("design.maxRetries", "Maximaal aantal retries per testcase", {
        type: "number",
        lock: true,
      }),
      field(
        "design.reliability",
        "Hoe wordt de betrouwbaarheid van het oordeel vastgesteld?",
        { area: true, wide: true, lock: true },
      ),
    ]) +
    "<h3>Acceptatieregels</h3>" +
    a.design.criteria
      .map(
        (x, j) =>
          '<div class="panel"><h3>' +
          esc(x.id) +
          "</h3>" +
          fields([
            field("design.criteria." + j + ".criterion", "Criterium", {
              lock: true,
            }),
            field("design.criteria." + j + ".method", "Hoe beoordeeld?", {
              lock: true,
            }),
            field(
              "design.criteria." + j + ".minimum",
              "Minimum / beslisregel",
              { lock: true },
            ),
            field(
              "design.criteria." + j + ".critical",
              "Kritiek bij schending?",
              { options: ["Ja", "Nee"], lock: true },
            ),
            field(
              "design.criteria." + j + ".evidence",
              "Bewijs / toelichting",
              { lock: true, wide: true },
            ),
          ]) +
          "</div>",
      )
      .join("") +
    btn(
      "add-criterion",
      "+ Acceptatieregel",
      "",
      a.runs.length ? "disabled" : "",
    ) +
    "<h3>Situaties en groepen in de test</h3>" +
    a.design.strata
      .map(
        (s, j) =>
          '<div class="panel"><h3>' +
          esc(s.id) +
          "</h3>" +
          fields([
            field("design.strata." + j + ".name", "Groep of situatie", {
              lock: true,
            }),
            field("design.strata." + j + ".reason", "Waarom relevant?", {
              lock: true,
            }),
            field(
              "design.strata." + j + ".target",
              "Doelaantal per kandidaat",
              { type: "number", lock: true },
            ),
            field("design.strata." + j + ".required", "Verplicht stratum?", {
              options: ["Ja", "Nee"],
              lock: true,
            }),
            field("design.strata." + j + ".note", "Dekkingsnotitie", {
              area: true,
              lock: true,
              wide: true,
            }),
          ]) +
          "</div>",
      )
      .join("") +
    btn(
      "add-stratum",
      "+ Groep of situatie",
      "",
      a.runs.length ? "disabled" : "",
    ) +
    (a.runs.length
      ? '<p class="lock-note">Ontwerp vastgelegd bij de eerste test. Een nieuwe beoordelingsversie bewaart het oude dossier en begint zonder testresultaten.</p>'
      : "") +
    "</details>"
  );
}
function runEditor() {
  restoreRunDraft();
  const c = a.candidates[ci];
  return (
    '<details id="run-editor" ' +
    (editRun >= 0 ? "open" : "") +
    "><summary>" +
    (editRun >= 0 ? "Testcase corrigeren" : "Een testcase registreren") +
    '</summary><p class="small">Eén rij voor alle pogingen op dezelfde testcase. Een kritieke fout in een eerdere poging blijft tellen. Laat onbekende metingen leeg; vul alleen een gemeten nul als 0 in.</p><form id="run-form">' +
    fields([
      field("@testCase", "Testcase-ID", { placeholder: "TC-001" }),
      field("@stratum", "Situatie / stratum", {
        options: a.design.strata
          .filter((s) => E.text(s.name))
          .map((s) => [s.id, s.id + " · " + s.name]),
      }),
      field("@accepted", "Is de finale taakuitkomst geaccepteerd?", {
        options: [
          [1, "Ja (1)"],
          [0, "Nee (0)"],
        ],
      }),
      field("@critical", "Kritieke fout in één of meer pogingen?", {
        options: [
          [1, "Ja (1)"],
          [0, "Nee (0)"],
        ],
      }),
      field("@calls", "Totaal aantal modelcalls", {
        type: "number",
        hint:
          c?.type === "Niet-AI-baseline"
            ? "Vul 0 in bij een volledig handmatige werkwijze."
            : "",
      }),
      field("@retries", "Totaal aantal retries", { type: "number" }),
      field("@verify", "Verificatie (minuten, alle pogingen)", {
        type: "number",
      }),
      field("@correct", "Correctie en herstel (minuten, alle pogingen)", {
        type: "number",
      }),
      field("@cost", "Directe kosten (€ totaal)", { type: "number" }),
      field("@latency", "Totale doorlooptijd (seconden)", { type: "number" }),
      field("@evidence", "Bewijs-ID’s van de test"),
      field("@notes", "Toelichting", { area: true }),
    ]) +
    '<details><summary>Optionele metingen: milieu, tokens en kwaliteit</summary><p class="small">Tokens zijn geen maat voor energie of duurzaamheid. Fysieke metingen hebben een vergelijkbare systeemgrens en methode nodig.</p>' +
    fields(
      [
        ["energy", "Energie (kWh)"],
        ["carbon", "Uitstoot (g CO₂e)"],
        ["water", "Water (L)"],
        ["inputTokens", "Inputtokens"],
        ["outputTokens", "Outputtokens"],
        ["reasoningTokens", "Reasoningtokens"],
        ["quality", "Optionele kwaliteitsscore (geen totaalscore)"],
      ].map(([k, s]) => field("@" + k, s, { type: "number" })),
    ) +
    '</details><button type="submit" class="primary">Testcase bewaren</button> ' +
    (editRun >= 0 ? btn("cancel-run", "Annuleren") : "") +
    "</form></details>"
  );
}
function testPage() {
  if (!a.candidates.length) return candEmpty();
  const c = a.candidates[ci],
    p = "candidates." + ci + ".",
    v = E.analysis(a, c),
    rows = a.runs
      .map((r, index) => ({ ...r, index }))
      .filter((r) => r.candidate === c.id),
    pageRows = rows.slice(runPage * 25, (runPage + 1) * 25),
    ready = ["PASS", "CONDITIONAL"].includes(v.gate1);
  return (
    '<h1>Poort 2 · Werkt het voldoende betrouwbaar?</h1><p class="lead">Test dezelfde taak onder vergelijkbare omstandigheden. Alle pogingen en al het controle- en herstelwerk tellen mee per geaccepteerde taakuitkomst.</p>' +
    designEditor() +
    candidateTabs() +
    panel(
      c.name || c.id,
      '<div class="inline"><span>Geschiktheid</span>' +
        badge(v.gate2) +
        '</div><div class="metrics"><div class="metric"><strong>' +
        v.accepted +
        " / " +
        v.n +
        '</strong><span>geaccepteerde taken</span></div><div class="metric"><strong>' +
        fmt(v.lcb, true) +
        '</strong><span>Wilson-ondergrens succes</span></div><div class="metric"><strong>' +
        fmt(v.ucb, true) +
        '</strong><span>Wilson-bovengrens kritieke fouten</span></div></div><p class="small">Waargenomen succes: ' +
        fmt(v.success, true) +
        " · kritieke fouten: " +
        fmt(v.criticalRate, true) +
        " · bewijsbodem: " +
        (v.floor ?? "ongeldig") +
        " cases.</p>" +
        (v.gate2 === "MORE EVIDENCE"
          ? '<div class="callout warning">De puntschatting voldoet, maar omvang of onzekerheidsgrenzen nog niet. Dit is geen negatieve testuitkomst. Verzamelen van meer bewijs of een begrensde pilot kan passend zijn.</div>'
          : "") +
        (v.issues.length
          ? "<details><summary>" +
            v.issues.length +
            ' aandachtspunten in testgegevens</summary><ul class="issues">' +
            v.issues
              .slice(0, 40)
              .map((s) => "<li>" + esc(s) + "</li>")
              .join("") +
            "</ul></details>"
          : "") +
        fields([
          field(p + "coverage", "Representatieve dekking bevestigd?", {
            options: ["Ja", "Nee"],
          }),
          field(p + "rubric", "Beoordeling voldoende betrouwbaar?", {
            options: ["Ja", "Nee"],
          }),
          field(p + "coverageNote", "Onderbouwing van de dekking", {
            area: true,
          }),
          field(p + "rubricNote", "Onderbouwing van de beoordeling", {
            area: true,
          }),
        ]),
    ) +
    (ready
      ? panel(
          "Testcases",
          (!E.designReady(a)
            ? '<div class="callout warning">Vul eerst het testontwerp hierboven in. Je kunt al wel informatie verzamelen en bewaren.</div>'
            : "") +
            runEditor() +
            '<details><summary>Testcases importeren uit CSV</summary><p class="small">Gebruik de kolommen van werkblad 05_Testcases. Maximaal 2.000 regels in deze beoordeling. Importeer één rij per kandidaat × testcase; uitkomsten en lasten zijn over alle pogingen samengevoegd.</p><label class="field checkbox"><input type="checkbox" id="csv-confirm" ' +
            (importConfirmed ? "checked" : "") +
            '><span>Deze testdata horen bij het huidige taakontwerp en de vastgelegde configuraties.</span></label><div class="actions">' +
            btn("csv-template", "Download kolomsjabloon") +
            btn("csv-import", "CSV importeren") +
            btn("csv-export", "Testregister exporteren") +
            "</div></details>" +
            (rows.length
              ? '<div class="table-wrap"><table><thead><tr><th>Testcase</th><th>Stratum</th><th>Geaccepteerd</th><th>Kritieke fout</th><th>€ totaal</th><th>Actie</th></tr></thead><tbody>' +
                pageRows
                  .map(
                    (r) =>
                      "<tr><td>" +
                      esc(r.testCase) +
                      "</td><td>" +
                      esc(r.stratum) +
                      "</td><td>" +
                      esc(r.accepted ?? "?") +
                      "</td><td>" +
                      esc(r.critical ?? "?") +
                      "</td><td>" +
                      fmt(r.cost) +
                      "</td><td>" +
                      btn(
                        "edit-run",
                        "Wijzig",
                        "",
                        'data-index="' + r.index + '"',
                      ) +
                      "</td></tr>",
                  )
                  .join("") +
                '</tbody></table></div><div class="actions">' +
                btn("run-prev", "←", "", runPage === 0 ? "disabled" : "") +
                '<span class="small">Pagina ' +
                (runPage + 1) +
                " · " +
                rows.length +
                " testcases</span>" +
                btn(
                  "run-next",
                  "→",
                  "",
                  (runPage + 1) * 25 >= rows.length ? "disabled" : "",
                ) +
                "</div>"
              : '<p class="muted">Nog geen testcases voor dit alternatief.</p>'),
        )
      : '<div class="callout warning">Los poort 1 eerst op voordat je deze kandidaat test of op proportionaliteit vergelijkt.</div>') +
    panel(
      "Lasten per geaccepteerde taak",
      measureTable(v) +
        "<p>" +
        badge(v.numeric) +
        '</p><p class="small">Alle pogingen, ook voor niet-geaccepteerde taken, zijn in de teller opgenomen. Lege metingen maken de betreffende maatstaf onbekend.</p>',
    ) +
    environmentEditor(c) +
    evidenceEditor()
  );
}
function measureTable(v) {
  return (
    '<div class="table-wrap"><table><thead><tr><th>Last</th><th>Per geaccepteerde taak</th><th>Ontbrekende testregels</th></tr></thead><tbody>' +
    E.METRICS.slice(2)
      .map(
        ([k, s]) =>
          "<tr><td>" +
          esc(s) +
          '</td><td class="num">' +
          fmt(v.measures[k].value) +
          "</td><td>" +
          v.measures[k].missing +
          "</td></tr>",
      )
      .join("") +
    "</tbody></table></div>"
  );
}
function environmentEditor(c) {
  const p = "candidates." + ci + ".environment.";
  return (
    "<details " +
    (a.intake.critical.environment ? "open" : "") +
    '><summary>Milieubewijs en systeemgrens</summary><p class="small">Onbekende milieubelasting is nooit nul. Voor een volledige milieuclaim verlangt v1.1 energie, CO₂e én water met vergelijkbaar bewijs. Een graad C vraagt gevoeligheidsanalyse of een expliciet beperkte claim.</p>' +
    fields([
      field(p + "boundary", "Systeemgrens", {
        area: true,
        hint: "Taak/configuratie, hardware/cloud, locatie/tijd, embodied componenten en allocatie.",
      }),
      field(p + "method", "Meetmethode", { area: true }),
      field(p + "grade", "Bewijsgraad", { options: ["A", "B", "C", "U"] }),
      field(p + "comparable", "Voldoende vergelijkbaar?", {
        options: ["Ja", "Nee"],
      }),
      field(p + "embodied", "Embodied componenten inbegrepen?", {
        options: ["Ja", "Nee", "N.v.t."],
      }),
      field(p + "evidence", "Bewijs-ID’s"),
      field(p + "limitations", "Onzekerheden en beperkingen", {
        area: true,
        wide: true,
      }),
      ...(c.environment.grade === "C"
        ? [
            field(
              p + "useLimits",
              "Gevoeligheidsanalyse of expliciet beperkte claim voor deze milieuschatting",
              { area: true, wide: true },
            ),
          ]
        : []),
    ]) +
    "</details>"
  );
}
function comparisonPage() {
  if (!a.candidates.length) return candEmpty();
  return (
    '<h1>Poort 3 · Rechtvaardigt de extra waarde de lasten?</h1><p class="lead">Vergelijk de overblijvende alternatieven met de baseline of een lichtere oplossing. Leg uit welke voordelen materieel zijn en welke afhankelijkheden je accepteert.</p>' +
    panel(
      "Welke alternatieven kunnen verder?",
      '<div class="table-wrap"><table><thead><tr><th>Alternatief</th><th>Toelaatbaarheid</th><th>Geschiktheid</th><th>Bewijs lasten</th></tr></thead><tbody>' +
        a.candidates
          .map((c) => {
            const v = E.analysis(a, c);
            return (
              "<tr><td>" +
              esc(c.name || c.id) +
              "</td><td>" +
              badge(v.gate1) +
              "</td><td>" +
              badge(v.gate2) +
              "</td><td>" +
              badge(v.numeric) +
              "</td></tr>"
            );
          })
          .join("") +
        '</tbody></table></div><p class="small">Een uitgesloten of nog onvoldoende aangetoonde optie krijgt hier geen proportionaliteitsscore. Bij een R1-pilot leg je de voorlopige afweging en bewijsbeperkingen vast in het besluit.</p>',
    ) +
    a.pairs.map((p, j) => pairEditor(p, j)).join("") +
    '<div class="actions">' +
    btn("add-pair", "+ Twee alternatieven vergelijken", "primary") +
    "</div>" +
    candidateTabs() +
    contextEditor() +
    evidenceEditor()
  );
}
function pairEditor(p, j) {
  const pre = "pairs." + j + ".",
    eligible = a.candidates
      .filter((c) => E.analysis(a, c).gate2 === "PASS")
      .map((c) => [c.id, c.name || c.id]),
    result = E.pairwise(a, p);
  return panel(
    "Vergelijking " + (j + 1),
    fields([
      field(pre + "a", "Kandidaat A", { options: eligible }),
      field(pre + "b", "Kandidaat B / lichtere optie / baseline", {
        options: eligible,
      }),
      field(pre + "comparable", "Taak, testcases en meetwijze vergelijkbaar?", {
        options: ["Ja", "Nee"],
      }),
      field(
        pre + "environmentComparable",
        "Milieugrenzen onderling vergelijkbaar?",
        { options: ["Ja", "Nee", "N.v.t."] },
      ),
    ]) +
      '<p class="hint">' +
      esc(result.note) +
      "</p>" +
      (result.allowed
        ? '<div class="table-wrap"><table><thead><tr><th>Maatstaf per geaccepteerde taak</th><th>A</th><th>B</th><th>A − B</th></tr></thead><tbody>' +
          result.rows
            .map(
              (r) =>
                "<tr><td>" +
                esc(r.label) +
                "<br><small>" +
                (["lcb", "ucb"].includes(r.key)
                  ? ""
                  : "per geaccepteerde taak · ") +
                (r.direction > 0 ? "hoger is beter" : "lager is beter") +
                '</small></td><td class="num">' +
                fmt(r.a, ["lcb", "ucb"].includes(r.key)) +
                '</td><td class="num">' +
                fmt(r.b, ["lcb", "ucb"].includes(r.key)) +
                '</td><td class="num">' +
                (r.comparable
                  ? fmt(r.delta, ["lcb", "ucb"].includes(r.key))
                  : "Niet vergelijkbaar") +
                "</td></tr>",
            )
            .join("") +
          "</tbody></table></div>"
        : "") +
      fields([
        field(
          pre + "rationale",
          "Rechtvaardigt de extra taakwaarde van A de extra lasten ten opzichte van B?",
          {
            area: true,
            wide: true,
            hint: "Benoem aantoonbare voordelen, kosten, menswerk en de beperkingen van deze vergelijking.",
          },
        ),
        field(pre + "evidence", "Bewijs-ID’s"),
        field(pre + "limits", "Wat blijft buiten deze vergelijking?", {
          area: true,
        }),
      ]),
  );
}
function contextEditor() {
  const c = a.candidates[ci],
    p = "candidates." + ci + ".";
  if (!c) return "";
  const eligible = E.analysis(a, c).gate2 === "PASS";
  return panel(
    "Context van " + (c.name || c.id),
    fields([
      field(
        p + "context.autonomy",
        "Autonomie, afhankelijkheid, lock-in en exit",
        { area: true },
      ),
      field(
        p + "context.correction",
        "Corrigeerbaarheid, rollback en incidentrespons",
        { area: true },
      ),
      field(
        p + "context.inclusion",
        "Toegankelijkheid, inclusie en verdeling van effecten",
        { area: true },
      ),
      field(p + "context.implementation", "Implementatie- en onderhoudslast", {
        area: true,
      }),
      field(p + "context.other", "Taakspecifieke waarde en overige gevolgen", {
        area: true,
      }),
      field(p + "context.evidence", "Bewijs-ID’s"),
      field(p + "context.complete", "Besliskritiek contextbewijs compleet?", {
        options: ["Ja", "Nee"],
      }),
    ]) +
      (eligible
        ? fields([
            field(p + "frontier", "Gemotiveerd oordeel over dominantie", {
              options: ["FRONTIER", "DOMINATED", "UNDETERMINED"],
              hint: "Dominantie: op geen relevante vergelijkbare dimensie slechter en op minstens één beter. Dit blijft een expliciet oordeel.",
            }),
            field(p + "proportionality", "Proportionaliteitsoordeel", {
              options: E.PROPORTIONS,
            }),
            field(p + "reason", "Kernmotivering", { area: true, wide: true }),
          ])
        : '<div class="callout warning">Een proportionaliteitsoordeel is pas mogelijk nadat deze kandidaat poort 1 en 2 doorstaat.</div>'),
  );
}
function decisionPage() {
  const r = E.readiness(a);
  return (
    '<h1>Leg de afweging en de grenzen vast</h1><p class="lead">Een besluit kan ook NO-GO, meerdere passende opties of uitstel zijn. Het overzicht bewaart de redenering én wat nog onzeker is.</p><div class="callout ' +
    (r.status === "HOLD" ? "warning" : "") +
    '"><strong>' +
    esc(label(r.status)) +
    "</strong><br>" +
    esc(r.note) +
    '</div><details class="no-print" open><summary>Besluit invullen</summary>' +
    fields([
      field("decision.outcome", "Besluituitkomst", {
        options: [
          "Eén optie",
          "Meerdere opties",
          "NO-GO",
          "Uitgesteld besluit",
        ],
      }),
    ]) +
    '<p class="small">Geselecteerde alternatieven (geen automatische winnaar):</p>' +
    a.candidates
      .map(
        (c) =>
          '<label class="field checkbox"><input type="checkbox" data-selection="' +
          esc(c.id) +
          '" ' +
          (a.decision.selected.includes(c.id) ? "checked" : "") +
          "><span>" +
          esc(c.name || c.id) +
          " · " +
          esc(label(E.analysis(a, c).gate2)) +
          "</span></label>",
      )
      .join("") +
    fields([
      field("decision.value", "Beoogde waarde en aantoonbare voordelen", {
        area: true,
      }),
      field("decision.burdens", "Lasten, risico’s en verdeling van effecten", {
        area: true,
      }),
      field(
        "decision.alternatives",
        "Alternatieven, inclusief de niet-AI-baseline",
        { area: true },
      ),
      field("decision.uncertainty", "Bewijsbeperkingen en onzekerheden", {
        area: true,
        hint: "Benoem bij een gedeeltelijke afweging welke dimensies buiten de claim blijven.",
      }),
      field("decision.conditions", "Voorwaarden en begrenzingen", {
        area: true,
      }),
      field("decision.stopRecovery", "Stopcriteria, ingrijpen en herstel", {
        area: true,
      }),
      field(
        "decision.rationale",
        "Waarom deze optie, meerdere opties, NO-GO of uitstel?",
        { area: true, wide: true },
      ),
      field("intake.owner", "Besluiteigenaar"),
      field(
        "decision.reviewer",
        "Reviewer" +
          (["R3", "R4"].includes(E.activeRoute(a))
            ? " (verplicht en onafhankelijk)"
            : " (aanbevolen bij R2)"),
      ),
      field("intake.date", "Besluitdatum", { type: "date" }),
      field("intake.validDays", "Geldigheidsduur in dagen", { type: "number" }),
      field("intake.triggers", "Herbeoordelingstriggers", {
        area: true,
        wide: true,
      }),
      ...(["R3", "R4"].includes(E.activeRoute(a))
        ? [
            field(
              "decision.reviewEvidence",
              "Multidisciplinaire en onafhankelijke toets: uitkomst en bewijs",
              { area: true, wide: true },
            ),
          ]
        : []),
      ...(E.activeRoute(a) === "R4"
        ? [
            field(
              "decision.formalReview",
              "Aanvullende formele toets buiten PAM-AI: uitkomst en bewijs",
              { area: true, wide: true },
            ),
          ]
        : []),
      field(
        "decision.feedback",
        "Gebruikservaring voor validatie van PAM-AI (optioneel)",
        { area: true, wide: true },
      ),
    ]) +
    '<div class="actions">' +
    btn("record", "Besluitversie vastleggen", "primary") +
    btn("print", "Afdrukken / bewaren als PDF") +
    btn("export", "Beoordeling exporteren") +
    "</div></details>" +
    (r.issues.length
      ? '<details class="no-print" open><summary>Nog nodig voor afronding (' +
        r.issues.length +
        ')</summary><ul class="issues">' +
        r.issues.map((x) => "<li>" + esc(x) + "</li>").join("") +
        "</ul></details>"
      : "") +
    report() +
    panel(
      "Vastgelegde besluitversies",
      a.history.length
        ? '<ul class="list-clean">' +
            a.history
              .map(
                (h) =>
                  "<li><strong>" +
                  esc(new Date(h.at).toLocaleString("nl-NL")) +
                  "</strong> · " +
                  esc(label(h.status)) +
                  '<br><span class="small">' +
                  esc(h.decision.outcome) +
                  " — " +
                  esc(h.decision.rationale) +
                  "</span></li>",
              )
              .join("") +
            "</ul>"
        : '<p class="muted">Nog geen besluitversie vastgelegd. Tussentijdse invoer wordt wel automatisch bewaard.</p>',
    )
  );
}
function report() {
  const d = a.decision,
    i = a.intake,
    r = E.readiness(a);
  let body =
    '<div class="print-only"><h1>PAM-AI · Besluitoverzicht</h1></div>' +
    (a.fictional
      ? "<p><strong>FICTIEF VOORBEELD — alle gegevens zijn demonstratiegegevens.</strong></p>"
      : "") +
    '<div class="inline"><h2>' +
    esc(i.task || "Onbenoemde taak") +
    "</h2>" +
    badge(r.status) +
    "</div><p>" +
    esc(r.note) +
    "</p>";
  const rows = {
    "Taak-ID": i.taskId,
    Doel: i.goal,
    "Gebruik en geraakten": i.use + "\n" + i.affected,
    "Route en scope":
      (E.activeRoute(a) || "Onbekend") + " · " + (i.scope || "Onbekend"),
    Routeafwijking: i.routeReason || "Geen afwijking vastgelegd",
    Besluituitkomst: d.outcome || "Nog open",
    Selectie:
      a.candidates
        .filter((c) => d.selected.includes(c.id))
        .map((c) => c.name)
        .join(", ") || "Geen selectie",
    "Beoogde waarde": d.value,
    "Lasten en effecten": d.burdens,
    "Alternatieven en baseline": d.alternatives,
    "Onzekerheden en uitgesloten claims": d.uncertainty,
    Voorwaarden: d.conditions,
    "Stoppen en herstel": d.stopRecovery,
    Eindmotivering: d.rationale,
    Eigenaarschap: i.owner + " · reviewer: " + (d.reviewer || "Niet ingevuld"),
    "Multidisciplinaire / formele toets": [d.reviewEvidence, d.formalReview]
      .filter(Boolean)
      .join("\n"),
    Geldigheid:
      (i.date || "?") +
      " t/m " +
      (E.reviewDate(a) || "?") +
      " (" +
      i.validDays +
      " dagen)",
    Herbeoordelingstriggers: i.triggers,
    Taaknorm:
      "Succes ≥ " +
      fmt(i.thresholds.success, true) +
      "; kritieke fouten ≤ " +
      fmt(i.thresholds.critical, true) +
      "; z = " +
      i.thresholds.z +
      "; basis-n = " +
      i.thresholds.baseN +
      ". " +
      i.thresholdReason,
  };
  body += Object.entries(rows)
    .map(
      ([k, v]) =>
        '<div class="report-block"><p class="report-label">' +
        esc(k) +
        "</p><p>" +
        esc(v || "Nog niet vastgelegd") +
        "</p></div>",
    )
    .join("");
  body +=
    "<h3>Alternatieven en bewijs</h3>" +
    a.candidates
      .map((c) => {
        const v = E.analysis(a, c);
        return (
          '<div class="report-block"><h3>' +
          esc(c.id + " · " + (c.name || "Naam ontbreekt")) +
          "</h3><p>" +
          esc(
            [
              c.type,
              c.component,
              c.version,
              c.deployment,
              c.settings,
              c.fingerprint,
            ].join(" · "),
          ) +
          "</p><p>Poort 1: " +
          esc(label(v.gate1)) +
          " · Poort 2: " +
          esc(label(v.gate2)) +
          "<br>n = " +
          v.n +
          "; geaccepteerd = " +
          v.accepted +
          "; kritieke fouten = " +
          v.critical +
          "; succes-LCB = " +
          fmt(v.lcb, true) +
          "; critical-UCB = " +
          fmt(v.ucb, true) +
          ".</p>" +
          measureTable(v) +
          "<p>Milieubewijs: " +
          esc(
            v.envStatus === "INCOMPLETE DATA"
              ? "Milieumetingen ontbreken"
              : label(v.envStatus),
          ) +
          "; " +
          esc(c.environment.boundary || "systeemgrens onbekend") +
          ".</p><p>Proportionaliteit: " +
          esc(label(c.proportionality)) +
          " — " +
          esc(c.reason || "Nog geen motivering") +
          "</p><p>Context: " +
          esc(Object.values(c.context).filter(Boolean).join(" · ")) +
          "</p><p>Bewijs en voorwaarden poort 1: " +
          esc(
            c.gate
              .map(
                (g, j) =>
                  E.DOMAINS[j] +
                  ": " +
                  label(g.status) +
                  "; " +
                  (g.evidence || "geen bewijs") +
                  (g.reason ? " — " + g.reason : ""),
              )
              .join("\n"),
          ) +
          "</p></div>"
        );
      })
      .join("");
  body +=
    "<h3>Onderlinge afwegingen</h3>" +
    a.pairs
      .map(
        (p) =>
          "<p>" +
          esc(p.a + " tegenover " + p.b) +
          ": " +
          esc(p.rationale || "Motivering ontbreekt") +
          "<br>Bewijs: " +
          esc(p.evidence || "ontbreekt") +
          " · Grenzen: " +
          esc(p.limits || "niet vastgelegd") +
          "</p>",
      )
      .join("") +
    "<h3>Bewijsregister</h3>" +
    a.evidence
      .map(
        (e) =>
          "<p>" +
          esc(
            [
              e.id,
              e.source,
              e.owner,
              e.date,
              "graad " + e.grade,
              e.location,
              e.limitations,
            ].join(" · "),
          ) +
          "</p>",
      )
      .join("") +
    "<h3>Openstaande punten</h3>" +
    (r.issues.length
      ? "<ul>" +
        r.issues.map((x) => "<li>" + esc(x) + "</li>").join("") +
        "</ul>"
      : "<p>Geen ontbrekende verplichte invoer gedetecteerd. Inhoudelijke beoordeling blijft mensenwerk.</p>");
  return '<section class="panel" id="report">' + body + "</section>";
}
function download(content, name, type = "application/json") {
  const blob = new Blob([content], { type }),
    url = URL.createObjectURL(blob),
    link = document.createElement("a");
  link.href = url;
  link.download = name;
  document.body.append(link);
  link.click();
  link.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
function choose(newA) {
  a = newA;
  window.PAM_GUIDE?.reset();
  if (!a.intake.taskId)
    a.intake.taskId = "PAM-" + E.today() + "-" + a.id.slice(-4).toUpperCase();
  ci = 0;
  runDraft = null;
  editRun = -1;
  runPage = 0;
  if (!vault.items.some((x) => x.id === a.id)) vault.items.push(a);
  save();
  render(true);
}
function newVersion() {
  const next = E.clone(a);
  next.id = E.uid();
  next.runs = [];
  next.pendingRuns = {};
  next.history = [];
  next.decision = E.newAssessment().decision;
  next.step = 0;
  next.intake.taskId += "-herzien";
  next.candidates.forEach((c) => {
    c.coverage = "";
    c.rubric = "";
    c.proportionality = "";
    c.reason = "";
  });
  next.pairs = [];
  choose(next);
  notice(
    "Nieuwe versie aangemaakt. De vorige beoordeling en tests blijven bewaard.",
  );
}
document.addEventListener("input", (ev) => {
  const el = ev.target,
    path = el.dataset.path;
  if (!path || !a) return;
  let v =
    el.type === "checkbox"
      ? el.checked
      : el.type === "number"
        ? el.value === ""
          ? null
          : Number(el.value)
        : el.value;
  if (el.dataset.scale && v !== null) v /= Number(el.dataset.scale);
  if (path === "@accepted" || path === "@critical")
    v = el.value === "" ? null : Number(el.value);
  pathSet(
    path.startsWith("@") ? runDraft : a,
    path.startsWith("@") ? path.slice(1) : path,
    v,
  );
  if (!path.startsWith("@")) save();
  else saveRunDraft();
});
document.addEventListener("change", (ev) => {
  const el = ev.target;
  if (el.id === "csv-confirm") {
    importConfirmed = el.checked;
    return;
  }
  if (el.dataset.selection) {
    const id = el.dataset.selection;
    a.decision.selected = el.checked
      ? [...new Set([...a.decision.selected, id])]
      : a.decision.selected.filter((x) => x !== id);
    save();
    render();
    return;
  }
  if (
    el.dataset.path &&
    !el.dataset.path.startsWith("@") &&
    (el.tagName === "SELECT" || el.type === "checkbox")
  )
    render();
});
document.addEventListener("click", (ev) => {
  const el = ev.target.closest("[data-action]");
  if (!el) return;
  const action = el.dataset.action,
    index = Number(el.dataset.index);
  try {
    if (action === "new") choose(E.newAssessment());
    else if (action === "home") {
      save();
      a = null;
      render(true);
    } else if (action === "open")
      choose(vault.items.find((x) => x.id === el.dataset.id));
    else if (action === "delete") {
      if (
        confirm(
          "Deze lokale beoordeling verwijderen? Een eerder geëxporteerde kopie blijft bestaan.",
        )
      ) {
        vault.items = vault.items.filter((x) => x.id !== el.dataset.id);
        save();
        render();
      }
    } else if (action === "example")
      choose(PAM_EXAMPLES.create(el.dataset.kind));
    else if (action === "step" || action === "next" || action === "previous") {
      a.step =
        action === "step"
          ? index
          : Math.max(0, Math.min(5, a.step + (action === "next" ? 1 : -1)));
      runDraft = null;
      editRun = -1;
      save();
      render(true);
    } else if (action === "candidate") {
      ci = index;
      runDraft = null;
      editRun = -1;
      runPage = 0;
      render();
    } else if (action === "add-candidate") {
      if (a.candidates.length >= 8)
        throw Error("Maximaal acht alternatieven per beoordeling.");
      let n = 1;
      while (
        a.candidates.some((c) => c.id === "C" + String(n).padStart(2, "0"))
      )
        n++;
      a.candidates.push(E.newCandidate("C" + String(n).padStart(2, "0")));
      ci = a.candidates.length - 1;
      save();
      render();
    } else if (action === "shared-evidence") {
      const id = $("#shared-evidence").value;
      if (!id) throw Error("Kies eerst een bron.");
      a.candidates[ci].gate.forEach((g) => (g.evidence = id));
      save();
      render();
      notice("Bewijsverwijzing toegevoegd. Beoordeel elk domein afzonderlijk.");
    } else if (action === "copy-candidate") {
      if (a.candidates.length >= 8) throw Error("Maximaal acht alternatieven.");
      const old = a.candidates[ci];
      let n = 1;
      while (
        a.candidates.some((c) => c.id === "C" + String(n).padStart(2, "0"))
      )
        n++;
      const c = E.newCandidate("C" + String(n).padStart(2, "0"));
      for (const k of [
        "type",
        "component",
        "version",
        "deployment",
        "settings",
        "fingerprint",
        "notes",
      ])
        c[k] = old[k];
      c.name = old.name + " (kopie)";
      a.candidates.push(c);
      ci = a.candidates.length - 1;
      save();
      render();
      notice(
        "Configuratie gekopieerd. Toelaatbaarheid en testbewijs opnieuw beoordelen.",
      );
    } else if (action === "remove-candidate") {
      const c = a.candidates[ci];
      if (
        confirm(
          "Alternatief " +
            (c.name || c.id) +
            " inclusief bijbehorende tests en vergelijkingen verwijderen?",
        )
      ) {
        a.candidates.splice(ci, 1);
        a.runs = a.runs.filter((r) => r.candidate !== c.id);
        a.pairs = a.pairs.filter((p) => p.a !== c.id && p.b !== c.id);
        a.decision.selected = a.decision.selected.filter((id) => id !== c.id);
        save();
        render();
      }
    } else if (action === "add-evidence") {
      if (a.evidence.length >= 500) throw Error("Maximum 500 bronnen.");
      a.evidence.push({
        id: "B" + String(a.evidence.length + 1).padStart(2, "0"),
        source: "",
        type: "",
        owner: "",
        date: E.today(),
        grade: "",
        location: "",
        limitations: "",
        useLimits: "",
      });
      save();
      render();
      document.querySelectorAll("details").forEach((d) => {
        if (d.querySelector('[data-action="add-evidence"]')) d.open = true;
      });
    } else if (action === "add-criterion") {
      a.design.criteria.push({
        id: "A" + (a.design.criteria.length + 1),
        criterion: "",
        method: "",
        minimum: "",
        critical: "",
        evidence: "",
      });
      save();
      render();
    } else if (action === "add-stratum") {
      a.design.strata.push({
        id: "S" + String(a.design.strata.length + 1).padStart(2, "0"),
        name: "",
        reason: "",
        target: null,
        required: "",
        note: "",
      });
      save();
      render();
    } else if (action === "add-pair") {
      if (
        a.candidates.filter((c) => E.analysis(a, c).gate2 === "PASS").length < 2
      )
        throw Error(
          "Er zijn twee alternatieven nodig die poort 1 en 2 doorstaan. Voor een pilot: leg de voorlopige afweging vast bij Besluit.",
        );
      a.pairs.push({
        a: "",
        b: "",
        comparable: "",
        environmentComparable: "",
        rationale: "",
        evidence: "",
        limits: "",
      });
      save();
      render();
    } else if (action === "edit-run") {
      editRun = index;
      ci = a.candidates.findIndex((c) => c.id === a.runs[index].candidate);
      runDraft = E.clone(a.runs[index]);
      render();
      $("#run-editor").scrollIntoView({ behavior: "smooth" });
    } else if (action === "cancel-run") {
      clearRunDraft();
      save();
      editRun = -1;
      runDraft = null;
      render();
    } else if (action === "run-prev" || action === "run-next") {
      runPage += action === "run-next" ? 1 : -1;
      render();
    } else if (action === "export")
      download(
        JSON.stringify(a, null, 2),
        (a.fictional ? "FICTIEF-" : "") +
          "PAM-AI-" +
          (a.intake.taskId || "beoordeling").replace(/[^a-z0-9_-]/gi, "_") +
          ".json",
      );
    else if (action === "raw-export")
      download(
        localStorage.getItem("pam-ai-v1") || "{}",
        "PAM-AI-ruwe-opslag.json",
      );
    else if (action === "import") $("#import-file").click();
    else if (action === "version") newVersion();
    else if (action === "print") {
      window.PAM_GUIDE?.beforePrint();
      save();
      a.step = 5;
      render();
      window.print();
    } else if (action === "record") {
      const r = E.readiness(a);
      a.history.push({
        at: new Date().toISOString(),
        status: r.status,
        decision: E.clone(a.decision),
        results: a.candidates.map((c) => E.analysis(a, c)),
        evidence: E.clone(a.evidence),
        intake: E.clone(a.intake),
        issues: r.issues,
        route: E.activeRoute(a),
        scope: a.intake.scope,
        configurations: a.candidates.map((c) => ({
          id: c.id,
          stamp: E.configStamp(c),
          gate1: E.gate1(a, c),
          gate2: E.analysis(a, c).gate2,
        })),
        designStamp: E.designStamp(a),
      });
      save();
      render();
      notice("Besluitversie vastgelegd als " + label(r.status) + ".");
    } else if (action === "csv-template")
      download(
        CSV_COLS.map((x) => x[0]).join(";") + "\r\n",
        "PAM-AI-testregister-sjabloon.csv",
        "text/csv;charset=utf-8",
      );
    else if (action === "csv-export")
      download(
        csvExport(),
        "PAM-AI-testregister.csv",
        "text/csv;charset=utf-8",
      );
    else if (action === "csv-import") {
      if (!importConfirmed)
        throw Error(
          "Bevestig eerst dat de testdata bij dit ontwerp en deze configuraties horen.",
        );
      if (!E.designReady(a)) throw Error("Vul eerst het testontwerp in.");
      $("#csv-file").click();
    }
  } catch (e) {
    notice(e.message);
  }
});
document.addEventListener("submit", (ev) => {
  if (ev.target.id !== "run-form") return;
  ev.preventDefault();
  try {
    if (
      !E.designReady(a) ||
      !E.thresholdsValid(a.intake.thresholds) ||
      !E.text(a.intake.thresholdReason)
    )
      throw Error(
        "Leg eerst het testontwerp en de gemotiveerde drempels vast.",
      );
    const c = a.candidates[ci],
      r = E.clone(runDraft);
    r.candidate = c.id;
    if (editRun < 0) {
      r.configStamp = E.configStamp(c);
      r.designStamp = E.designStamp(a);
    }
    const other = a.runs
        .filter((_, j) => j !== editRun)
        .filter((x) => x.candidate === c.id),
      issues = E.runIssues(a, c, [...other, r]);
    if (issues.length) throw Error(issues[0]);
    if (editRun < 0) {
      if (a.runs.length >= 2000) throw Error("Maximaal 2.000 testregels.");
      a.runs.push(r);
    } else a.runs[editRun] = r;
    clearRunDraft();
    runDraft = null;
    editRun = -1;
    save();
    render();
    notice("Testcase bewaard. Alle pogingen tellen mee.");
  } catch (e) {
    notice(e.message);
  }
});
$("#help").addEventListener("click", () => $("#help-dialog").showModal());
$("#import-file").addEventListener("change", async (ev) => {
  const f = ev.target.files[0];
  if (!f) return;
  try {
    const imported = E.parseImport(await f.text());
    choose(imported);
    notice(
      "Beoordeling als aparte kopie geïmporteerd. Alle uitkomsten zijn opnieuw berekend.",
    );
  } catch (e) {
    notice("Import afgebroken: " + e.message);
  } finally {
    ev.target.value = "";
  }
});
const CSV_COLS = [
  ["Run_ID", "id"],
  ["Candidate_ID", "candidate"],
  ["Test_Case_ID", "testCase"],
  ["Stratum_ID", "stratum"],
  ["Final_Accepted_1_0", "accepted"],
  ["Any_Critical_Error_1_0", "critical"],
  ["Quality_score_optional", "quality"],
  ["Model_calls_total", "calls"],
  ["Retries_total", "retries"],
  ["Verify_min_total", "verify"],
  ["Correct_recover_min_total", "correct"],
  ["Latency_sec_total", "latency"],
  ["Direct_cost_EUR_total", "cost"],
  ["Input_tokens_total", "inputTokens"],
  ["Output_tokens_total", "outputTokens"],
  ["Reasoning_tokens_total", "reasoningTokens"],
  ["Energy_kWh_total", "energy"],
  ["Carbon_gCO2e_total", "carbon"],
  ["Water_L_total", "water"],
  ["Evidence_ID", "evidence"],
  ["Notes", "notes"],
];
function parseCSV(s) {
  s = s.replace(/^\uFEFF/, "");
  const first = s.split(/\r?\n/)[0],
    sep = first.includes(";") ? ";" : ",",
    rows = [];
  let row = [],
    cell = "",
    quoted = false;
  for (let j = 0; j < s.length; j++) {
    const c = s[j];
    if (c === '"') {
      if (quoted && s[j + 1] === '"') {
        cell += '"';
        j++;
      } else quoted = !quoted;
    } else if (c === sep && !quoted) {
      row.push(cell);
      cell = "";
    } else if ((c === "\n" || c === "\r") && !quoted) {
      if (c === "\r" && s[j + 1] === "\n") j++;
      row.push(cell);
      if (row.some((x) => x.trim())) rows.push(row);
      row = [];
      cell = "";
    } else cell += c;
  }
  if (quoted) throw Error("Niet-afgesloten aanhalingsteken in CSV.");
  row.push(cell);
  if (row.some((x) => x.trim())) rows.push(row);
  return rows;
}
function csvExport() {
  const safe = (v) => {
    let s = String(v ?? "");
    if (/^[=+@\-\t\r]/.test(s)) s = "'" + s;
    return '"' + s.replace(/"/g, '""') + '"';
  };
  return (
    "\uFEFF" +
    [
      CSV_COLS.map((x) => x[0]),
      ...a.runs.map((r) => CSV_COLS.map((x) => r[x[1]])),
    ]
      .map((row) => row.map(safe).join(";"))
      .join("\r\n")
  );
}
$("#csv-file").addEventListener("change", async (ev) => {
  const f = ev.target.files[0];
  if (!f) return;
  try {
    if (f.size > 12000000) throw Error("CSV te groot.");
    const rows = parseCSV(await f.text()),
      headers = rows.shift()?.map((x) => x.trim()) || [];
    for (const h of [
      "Candidate_ID",
      "Test_Case_ID",
      "Stratum_ID",
      "Final_Accepted_1_0",
      "Any_Critical_Error_1_0",
    ])
      if (!headers.includes(h)) throw Error("Kolom ontbreekt: " + h);
    if (new Set(headers).size !== headers.length)
      throw Error("Dubbele kolomnaam.");
    const imported = rows.map((row, j) => {
      const r = { ...freshRun(), id: E.uid() };
      for (const [h, k] of CSV_COLS) {
        const idx = headers.indexOf(h),
          value = idx < 0 ? "" : (row[idx] ?? "").trim();
        r[k] =
          E.NUMS.includes(k) || ["accepted", "critical"].includes(k)
            ? value === ""
              ? null
              : Number(value.replace(",", "."))
            : value;
      }
      const c = a.candidates.find((c) => c.id === r.candidate);
      if (!c)
        throw Error("Rij " + (j + 2) + ": onbekende kandidaat " + r.candidate);
      if (!["PASS", "CONDITIONAL"].includes(E.gate1(a, c)))
        throw Error(c.id + ": poort 1 eerst afronden.");
      r.id = r.id || E.uid();
      r.configStamp = E.configStamp(c);
      r.designStamp = E.designStamp(a);
      return r;
    });
    if (!imported.length) throw Error("Geen testregels gevonden.");
    if (a.runs.length + imported.length > 2000)
      throw Error("Maximaal 2.000 testregels.");
    const combined = [...a.runs, ...imported];
    for (const c of a.candidates) {
      const issues = E.runIssues(
        a,
        c,
        combined.filter((r) => r.candidate === c.id),
      );
      if (issues.length) throw Error(issues[0]);
    }
    a.runs = combined;
    save();
    render();
    notice(imported.length + " testregels geïmporteerd.");
  } catch (e) {
    notice("Geen regels geïmporteerd: " + e.message);
  } finally {
    ev.target.value = "";
  }
});
render();
