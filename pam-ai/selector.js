/* Gebruikersroute en beheer voor de voorlopige NebulaONE-modelselector. Geen netwerk. */
"use strict";
window.PAM_SELECTOR = (() => {
  const S = PAM_SELECT,
    C = S.CATALOG,
    q = (s) => document.querySelector(s);
  const h = (v) =>
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
  const btn = (action, text, cls = "", extra = "") =>
    '<button type="button" data-select="' +
    action +
    '" class="' +
    cls +
    '" ' +
    extra +
    ">" +
    text +
    "</button>";
  let enabled = new URLSearchParams(location.search).get("view") !== "dossier";
  let platform = S.defaultPlatform(),
    entries = [],
    current = S.newAdvice(),
    stage = 0,
    view = "task",
    adminId = "gpt54mini",
    error = "",
    lock = false;
  try {
    const raw = localStorage.getItem("pam-ai-platform-v1");
    if (raw) platform = S.parsePlatform(raw);
    const stored = localStorage.getItem("pam-ai-selector-v1");
    if (stored) {
      const v = JSON.parse(stored);
      if (!Array.isArray(v.entries) || v.entries.length > 100)
        throw Error("Ongeldige adviezenopslag.");
      entries = v.entries.map((x) => S.parseAdvice(JSON.stringify(x)));
      current = entries.find((x) => x.id === v.current) || S.newAdvice();
      stage = [0, 1, 2].includes(v.stage) ? v.stage : 0;
    }
  } catch (e) {
    error =
      "Opslag kon niet veilig worden gelezen. Exporteer de ruwe opslag als reservekopie. Bestaande opslag wordt niet overschreven. " +
      e.message;
    lock = true;
  }
  function persist() {
    if (lock) return;
    current.updated = new Date().toISOString();
    if (current.task.trim() && !entries.some((x) => x.id === current.id)) {
      if (entries.length >= 100) {
        error =
          "Er zijn 100 adviezen bewaard. Exporteer een reservekopie; dit nieuwe advies kan nog niet lokaal worden bewaard.";
        return;
      }
      entries.push(current);
    }
    try {
      localStorage.setItem(
        "pam-ai-selector-v1",
        JSON.stringify({ entries, current: current.id, stage }),
      );
      localStorage.setItem("pam-ai-platform-v1", JSON.stringify(platform));
      error = "";
      const el = q("#selector-save");
      if (el) el.textContent = "Automatisch bewaard in deze browser";
    } catch (e) {
      error =
        "Opslaan is niet gelukt. Bewaar nu een bestand voordat je dit tabblad sluit.";
      const el = q("#selector-save");
      if (el) el.textContent = error;
    }
  }
  function message(s) {
    q("#notice").textContent = s;
  }
  function exportFile(obj, name) {
    const url = URL.createObjectURL(
      new Blob([JSON.stringify(obj, null, 2)], { type: "application/json" }),
    );
    const a = document.createElement("a");
    a.href = url;
    a.download = name;
    a.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  }
  function input(
    key,
    label,
    value,
    {
      area = false,
      placeholder = "",
      type = "text",
      help = "",
      admin = false,
      row = "",
    } = {},
  ) {
    const attr = admin
      ? 'data-admin="' + key + '"'
      : row
        ? 'data-measure="' + key + '" data-model="' + row + '"'
        : 'data-select-field="' + key + '"';
    const id = "s-" + (admin ? "admin-" : "") + (row ? row + "-" : "") + key;
    const max = admin ? (key.startsWith("platform.") ? 500 : 5000) : 10000;
    return (
      '<label class="s-field" for="' +
      id +
      '"><span>' +
      h(label) +
      "</span>" +
      (help ? '<small id="' + id + '-help">' + h(help) + "</small>" : "") +
      (area
        ? '<textarea id="' +
          id +
          '" ' +
          attr +
          ' rows="4" maxlength="' +
          max +
          '" placeholder="' +
          h(placeholder) +
          '"' +
          (help ? ' aria-describedby="' + id + '-help"' : "") +
          ">" +
          h(value) +
          "</textarea>"
        : '<input id="' +
          id +
          '" ' +
          attr +
          ' type="' +
          type +
          '" value="' +
          h(value ?? "") +
          '" ' +
          (type === "number"
            ? 'min="0" step="any"'
            : 'maxlength="' + max + '"') +
          (help ? ' aria-describedby="' + id + '-help"' : "") +
          ">") +
      "</label>"
    );
  }
  function select(key, label, value, options, admin = false) {
    return (
      '<label class="s-field"><span>' +
      h(label) +
      "</span><select " +
      (admin ? "data-admin" : "data-select-field") +
      '="' +
      key +
      '">' +
      options
        .map(
          ([v, n]) =>
            '<option value="' +
            h(v) +
            '" ' +
            (value === v ? "selected" : "") +
            ">" +
            h(n) +
            "</option>",
        )
        .join("") +
      "</select></label>"
    );
  }
  function radios(key, label, options) {
    return (
      '<fieldset class="s-radios"><legend>' +
      h(label) +
      "</legend>" +
      options
        .map(
          ([v, n, desc]) =>
            '<label class="s-choice"><input type="radio" name="s-' +
            key +
            '" data-select-field="' +
            key +
            '" value="' +
            v +
            '" ' +
            (current[key] === v ? "checked" : "") +
            "><span><strong>" +
            h(n) +
            "</strong>" +
            (desc ? "<small>" + h(desc) + "</small>" : "") +
            "</span></label>",
        )
        .join("") +
      "</fieldset>"
    );
  }
  const dataOptions = [
    [
      "public",
      "Openbaar of fictief",
      "Bijvoorbeeld een gepubliceerde tekst of verzonnen oefenmateriaal.",
    ],
    [
      "internal",
      "Intern of vertrouwelijk",
      "Informatie die niet voor iedereen toegankelijk is.",
    ],
    [
      "personal",
      "Gegevens over personen",
      "Bijvoorbeeld namen, gesprekken, dossiers of beoordelingen.",
    ],
    [
      "unknown",
      "Dat weet ik nog niet",
      "De tool geeft aan wat eerst moet worden uitgezocht.",
    ],
  ];
  const useOptions = [
    [
      "draft",
      "Een concept dat ik zelf controleer",
      "Ik beoordeel het resultaat voordat ik het gebruik of deel.",
    ],
    [
      "consequential",
      "Input voor een besluit over mensen",
      "Bijvoorbeeld een beoordeling, recht of voorziening.",
    ],
    [
      "actions",
      "Zelfstandig handelingen laten uitvoeren",
      "Bijvoorbeeld verzenden, aanpassen of boeken.",
    ],
    [
      "unknown",
      "Dat is nog niet duidelijk",
      "Een gericht vervolgonderzoek blijft mogelijk.",
    ],
  ];
  function typeSelect() {
    return select("type", "Soort taak", current.type, [
      ["auto", "Afleiden uit mijn beschrijving"],
      ...Object.entries(S.TYPES)
        .filter(([k]) => k !== "unknown")
        .map(([k, v]) => [k, v.name]),
    ]);
  }
  function recognition() {
    const i = S.infer(current.task),
      t = current.type === "auto" ? i.type : current.type;
    return (
      "<strong>" +
      h(t === "unknown" ? "Beschrijf de gewenste uitkomst" : S.TYPES[t].name) +
      "</strong>" +
      (i.chain ? " · eerst uitschrijven, daarna samenvatten" : "")
    );
  }
  function taskPage() {
    return (
      '<div class="s-intro"><p class="eyebrow">MODELKEUZE VOOR ' +
      h(platform.name) +
      '</p><h1>Wat wil je gedaan krijgen?</h1><p class="s-lead">Beschrijf je taak. PAM-AI vertaalt die naar passende modellen uit jullie platform en de voorwaarden die ertoe doen.</p></div><section class="s-card s-task">' +
      input("task", "Mijn opdracht", current.task, {
        area: true,
        placeholder:
          "Bijvoorbeeld: vat deze vergadernotulen samen en haal de besluiten en actiepunten eruit.",
        help: "Beschrijf de opdracht; plak hier geen dossier of opname. Je tekst wordt niet naar een AI-dienst verstuurd.",
      }) +
      '<div id="s-recognition" class="s-recognition">' +
      recognition() +
      "</div><details><summary>De taakherkenning aanpassen</summary>" +
      typeSelect() +
      '<p class="s-small">Deze eerste versie herkent woorden lokaal. Controleer de interpretatie; de tool leest geen bijlagen en voert je opdracht niet uit.</p></details><div class="s-buttons">' +
      btn("context", "Bekijk passende modellen →", "primary") +
      "</div></section>" +
      '<div class="s-examples"><p class="s-small">Probeer een <strong>fictief voorbeeld</strong></p>' +
      btn("example", "Tekst eenvoudiger maken", "", 'data-example="rewrite"') +
      btn(
        "example",
        "Vergaderopname → actiepunten",
        "",
        'data-example="audio"',
      ) +
      btn(
        "example",
        "Beleidsstukken vergelijken",
        "",
        'data-example="analysis"',
      ) +
      '</div><section class="s-how"><h2>Van taak naar een uitlegbare keuze</h2><div><p><b>1 · Beschrijf je taak</b><br>Je hoeft geen modelkennis te hebben.</p><p><b>2 · Vul ontbrekende context aan</b><br>Alleen feiten die de tool nog niet kent.</p><p><b>3 · Bekijk het modeladvies</b><br>Met redenen, aandachtspunten en vervolgstap.</p></div></section>'
    );
  }
  function contextPage() {
    const r = S.recommend(current, platform);
    return (
      '<p class="eyebrow">NOG TWEE DINGEN OVER HET GEBRUIK</p><h1>In welke context werk je?</h1><p class="s-lead">Ik herken: <strong>' +
      h(r.profile.name.toLowerCase()) +
      "</strong>. De taak vraagt om " +
      h(r.profile.need.toLowerCase()) +
      '.</p><div class="s-context">' +
      radios(
        "data",
        "Welke informatie ga je aan het model geven?",
        dataOptions,
      ) +
      radios("use", "Hoe ga je het resultaat gebruiken?", useOptions) +
      '</div><details class="s-card"><summary>Ik wil ergens extra op letten</summary>' +
      select("priority", "Aandachtspunt", current.priority, [
        ["balance", "Een evenwichtige afweging"],
        ["cost", "Kosten"],
        ["time", "Wachttijd"],
        ["control", "Mijn controle- en herstelwerk"],
        ["environment", "Milieubelasting"],
      ]) +
      '<p class="s-small">Dit bepaalt waarop je bij het vergelijken let. Zonder taakmetingen maken we geen rangorde op kosten of duurzaamheid.</p></details><div class="s-buttons">' +
      btn("back", "← Mijn taak") +
      btn("result", "Toon mijn modeladvies →", "primary") +
      "</div>"
    );
  }
  function card(m, secondary = false) {
    const status = {
      unknown: "Platformafspraak ontbreekt",
      allowed: "Platformafspraak vastgelegd",
      conditional: "Voorwaarden van toepassing",
    };
    return (
      '<article class="s-model"><p class="eyebrow">' +
      h(m.provider) +
      "</p><h3>" +
      h(m.name) +
      "</h3><p>" +
      h(m.claim.replace("Volgens het platformmenu: ", "")) +
      '</p><p class="s-status">' +
      h(status[m.gate.status] || "Gebruik nog beoordelen") +
      "</p><details><summary>Waarom dit model hier staat</summary><p>" +
      h(m.claim) +
      "</p><p>" +
      h(m.modelFact) +
      "</p><p><b>Configuratie in het platform:</b> " +
      h(m.config.deployment || "nog niet bevestigd") +
      ".</p><p>" +
      h(m.gate.reason) +
      "</p>" +
      (m.config.approvalRef
        ? "<p>Platformverwijzing: " + h(m.config.approvalRef) + "</p>"
        : "") +
      (m.url
        ? '<a href="' +
          h(m.url) +
          '" target="_blank" rel="noopener noreferrer">Documentatie van de leverancier ↗</a>'
        : "") +
      "</details>" +
      (!secondary
        ? btn(
            "choose",
            current.chosen === m.id
              ? "Als startkeuze bewaard"
              : "Bewaar als mijn startkeuze",
            current.chosen === m.id ? "s-selected" : "",
            'data-id="' + m.id + '"',
          )
        : "") +
      "</article>"
    );
  }
  function measurements(r) {
    const display = (n, unit) =>
      n === null
        ? "Onbekend"
        : new Intl.NumberFormat("nl-NL", { maximumFractionDigits: 6 }).format(
            n,
          ) +
          " " +
          unit;
    const measured = current.measurements.filter((row) =>
      r.candidates.some((m) => m.id === row.id),
    );
    return (
      '<details class="s-card s-measurements"><summary>Ik heb deze modellen geprobeerd: vergelijk mijn metingen</summary><p>Gebruik dezelfde taakvoorbeelden en acceptatieafspraken. Tel kosten en werk van <strong>alle pogingen</strong> mee, ook mislukte pogingen, controle en herstel. De uitkomsten hieronder zijn beschrijvend; ze bewijzen geen voldoende geschiktheid.</p><div class="s-buttons">' +
      r.candidates
        .filter((m) => !measured.some((row) => row.id === m.id))
        .map((m) =>
          btn("add-measure", "+ " + h(m.name), "", 'data-id="' + m.id + '"'),
        )
        .join("") +
      "</div>" +
      measured
        .map((row) => {
          const m = S.metrics(
            row,
            platform.models.find((x) => x.id === row.id).deployment,
          );
          return (
            '<section class="s-measure"><h3>' +
            h(C.models.find((x) => x.id === row.id).name) +
            '</h3><div class="s-form-grid">' +
            input(
              "testset",
              "Welke taakvoorbeelden heb je gebruikt?",
              row.testset,
              { row: row.id },
            ) +
            input(
              "reference",
              "Verwijzing naar je testnotities",
              row.reference,
              { row: row.id },
            ) +
            input("cases", "Aantal geteste taken", row.cases, {
              type: "number",
              row: row.id,
            }) +
            input(
              "accepted",
              "Aantal geaccepteerde taakuitkomsten",
              row.accepted,
              { type: "number", row: row.id },
            ) +
            input("cost", "Totale kosten (€)", row.cost, {
              type: "number",
              row: row.id,
            }) +
            input(
              "minutes",
              "Totale controle en herstel (minuten)",
              row.minutes,
              { type: "number", row: row.id },
            ) +
            input(
              "energy",
              "Totale gemeten energie (kWh), indien bekend",
              row.energy,
              { type: "number", row: row.id },
            ) +
            input(
              "boundary",
              "Energie: meetwijze en wat is meegerekend",
              row.boundary,
              { row: row.id },
            ) +
            '</div><p data-metric-result="' +
            row.id +
            '">Per geaccepteerde uitkomst: <b>' +
            h(display(m.cost, "€")) +
            "</b> · " +
            h(display(m.minutes, "min")) +
            " · " +
            h(display(m.energy, "kWh")) +
            '</p><p class="s-small">Bij een gewijzigde configuratie of zonder geldige aantallen en bewijsverwijzing blijft de uitkomst onbekend. Energie vraagt ook een beschreven meetgrens. Vergelijk alleen werkelijk vergelijkbare metingen.</p>' +
            btn(
              "remove-measure",
              "Verwijder deze meting",
              "",
              'data-id="' + row.id + '"',
            ) +
            "</section>"
          );
        })
        .join("") +
      '<p class="s-small">Prijs, tokens, modelnaam en de blaadjes uit het platformmenu zijn geen energiemeting. Ook met een energiemeting is niet automatisch de volledige milieubelasting bekend.</p></details>'
    );
  }
  function resultPage() {
    const r = S.recommend(current, platform),
      known = r.candidates.filter((m) =>
        ["allowed", "conditional"].includes(m.gate.status),
      );
    if (current.chosen && !r.candidates.some((m) => m.id === current.chosen))
      current.chosen = "";
    const focus = {
      balance:
        "Vergelijk kwaliteit én het totale werk per geaccepteerde uitkomst.",
      cost: "Vergelijk de werkelijke kosten van alle pogingen per geaccepteerde uitkomst. Een lage prijs per token is niet genoeg.",
      time: "Meet de wachttijd tot een bruikbaar resultaat, inclusief herpogingen en herstel.",
      control:
        "Meet hoeveel tijd jij kwijt bent aan controleren, corrigeren en herstellen.",
      environment:
        "Vraag om vergelijkbare meetgegevens per geaccepteerde uitkomst. De beschikbare modelkaartjes bieden geen basis voor een duurzaamheidsrangorde.",
    }[current.priority];
    return (
      '<div id="selector-report"><p class="eyebrow">VOORLOPIG MODELADVIES · ' +
      h(platform.name) +
      "</p><h1>" +
      h(r.headline) +
      '</h1><p class="s-task-quote">' +
      h(current.task) +
      '</p><div class="s-context-line">' +
      h(
        dataOptions.find((x) => x[0] === current.data)?.[1] ||
          "Gegevens onbekend",
      ) +
      " · " +
      h(
        useOptions.find((x) => x[0] === current.use)?.[1] || "Gebruik onbekend",
      ) +
      '</div><section class="s-reason"><h2>Waarom dit past bij je taak</h2><p>' +
      h(r.profile.need) +
      ". " +
      (r.profile.role === "routine"
        ? "De taak is afgebakend. Begin met de modellen die het platform hiervoor positioneert en controleer of het resultaat voldoet."
        : h(r.profile.escalate)) +
      "</p><p><b>Jouw controle:</b> " +
      h(r.profile.check) +
      "</p></section>" +
      (r.candidates.length
        ? "<section><h2>" +
          r.candidates.length +
          " " +
          (r.candidates.length === 1
            ? "passend startpunt"
            : "passende startpunten") +
          "</h2><p>" +
          (known.length
            ? "Er zijn platformafspraken vastgelegd. Controleer de reikwijdte; taakgeschiktheid is nog niet bewezen."
            : "De taakmatch is voorlopig. Laat de beheerder de platformafspraken bevestigen voordat je echte gegevens invoert.") +
          '</p><div class="s-model-grid">' +
          r.candidates.map((m) => card(m)).join("") +
          '</div><p class="s-small">Geen onderlinge prestatierangorde: voor deze taak zijn nog geen vergelijkbare kwaliteitstests beschikbaar. Een bewaarde startkeuze is geen formeel inzetbesluit.</p></section>'
        : r.type !== "numbers"
          ? '<section class="s-warning"><h2>Er is nu geen onderbouwde modelselectie voor de hele taak</h2><p>' +
            (r.required.length
              ? "Laat de beheerder de benodigde functie bevestigen. De modelnamen alleen tonen niet of het platform deze invoer of handeling ondersteunt."
              : r.type === "unknown"
                ? "Pas de taakomschrijving of de herkende taaksoort aan."
                : "De passende modellen zijn uitgeschakeld of uitgesloten volgens de platformafspraken.") +
            "</p></section>"
          : "") +
      (r.secondary.length
        ? '<section><h2>Heb je al een transcript?</h2><p>Voor samenvatten en actiepunten uit een <strong>bestaand teksttranscript</strong> kun je onderstaande modellen onderzoeken. Daarmee is de audioverwerking nog niet geregeld.</p><div class="s-model-grid">' +
          r.secondary.map((m) => card(m, true)).join("") +
          "</div></section>"
        : "") +
      '<section class="s-card"><h2>Wat we voor deze taak moeten regelen</h2><div class="s-checks">' +
      r.checks
        .map(
          (c) =>
            "<div><h3>" +
            h(c.title) +
            "</h3><p>" +
            h(c.text) +
            "</p><small>" +
            h(c.source) +
            "</small></div>",
        )
        .join("") +
      "</div></section>" +
      '<section class="s-card"><h2>Kosten, werk en milieubelasting</h2><p>' +
      h(focus) +
      '</p><div class="s-facts"><p><b>Kosten per bruikbare uitkomst</b><br>Nog niet vastgesteld</p><p><b>Controle en herstel</b><br>Nog niet gemeten</p><p><b>Milieubelasting</b><br>Onbekend</p></div><p class="s-small">Deze status betreft de platformcatalogus. Eventuele eigen metingen staan hieronder apart. We gebruiken geen verzonnen prijzen of duurzaamheidswaarderingen.</p></section>' +
      (r.candidates.length ? measurements(r) : "") +
      '<details class="s-card"><summary>Wat ontbreekt voor een onderbouwd inzetbesluit?</summary><ul>' +
      r.missing.map((x) => "<li>" + h(x) + "</li>").join("") +
      "</ul><p>Toelaatbaarheid → voldoende geschiktheid → proportionaliteit. Een latere gunstige uitkomst heft een eerdere uitsluiting niet op. De formele PAM-AI-route bewaakt dit, inclusief onzekerheden en een eventuele begrensde pilot.</p>" +
      btn("bridge", "Werk dit uit in een PAM-AI-beoordeling") +
      "</details>" +
      '<section class="s-card s-record"><h2>Mijn startkeuze en notities</h2><p><b>' +
      h(
        current.chosen
          ? C.models.find((m) => m.id === current.chosen)?.name
          : "Nog geen model gekozen",
      ) +
      "</b></p>" +
      input("notes", "Wat wil je onthouden of controleren?", current.notes, {
        area: true,
      }) +
      (current.archivedMeasurements?.length
        ? '<p class="s-small">' +
          current.archivedMeasurements.length +
          " eerdere meetcontext(en) bewaard in je adviesbestand. Ze tellen niet mee voor de gewijzigde taak.</p>"
        : "") +
      '<p class="s-small">Auteur: E.C.M. Willems · methodiek 1.1 · toepassing en adviesregels ' +
      S.VERSION +
      " · catalogus gecontroleerd " +
      C.checked +
      ". De adviesregels zijn een afzonderlijke aanvulling op de methodiek. Dit advies vervangt geen juridische beoordeling, DPIA, FRIA of securityonderzoek.</p></section>" +
      '<details class="s-card"><summary>Hoe is dit advies tot stand gekomen?</summary><p>Regel <b>' +
      h(r.rule) +
      "</b> koppelt de herkende taak aan mogelijkheden die in het platformmenu worden beschreven. Dit is een transparante oriëntatieregel, geen gevalideerde prestatiemeting en geen regel uit het Excelinstrument.</p><p>Volgorde: beschikbare modellen → uitsluitingen in platformafspraken → beschreven taakmogelijkheden. Onbekende toestemming blijft onbekend. Er is geen totaalscore. Kosten en milieubelasting veranderen de shortlist pas wanneer daar bruikbaar bewijs voor is; deze versie rangschikt daar niet op.</p><p>Bron voor het platformaanbod: " +
      h(C.source) +
      ". De bronfoto’s worden niet gepubliceerd. Leveranciersdocumentatie ondersteunt de modelkenmerken, maar bevestigt niet de werkelijke deployment in NebulaONE.</p><p>GPT Chat Latest wordt niet als vaste kandidaat gebruikt: het onderliggende model is onbekend. Een ander model of gewijzigde configuratie vraagt herbeoordeling.</p>" +
      (r.blocked.length
        ? "<ul>" +
          r.blocked
            .map(
              (m) =>
                "<li>" +
                h(m.name) +
                ": " +
                h(
                  !m.config.enabled
                    ? "uitgeschakeld"
                    : m.gate.status === "blocked"
                      ? m.gate.reason
                      : m.feature === "no"
                        ? "benodigde functie niet beschikbaar"
                        : "benodigde platformfunctie nog niet bevestigd",
                ) +
                "</li>",
            )
            .join("") +
          "</ul>"
        : "") +
      '<p><a href="../docs/PAM-AI-MODELSELECTOR.md">Adviesregels, bronvertaling en vervolg naar automatische routing</a></p></details></div><div class="s-buttons s-no-print">' +
      btn("edit", "← Taak of context wijzigen") +
      btn("export", "Bewaar advies als bestand") +
      btn("print", "Afdrukken / PDF") +
      "</div>"
    );
  }

  function adminPage() {
    const m = platform.models.find((x) => x.id === adminId),
      cat = C.models.find((x) => x.id === adminId);
    return (
      '<p class="eyebrow">PLATFORMBEHEER · LOKALE PROEFINSTELLINGEN</p><h1>Leg de afspraken één keer vast</h1><p class="s-lead">Gebruikers hoeven geen modelversies, functies of leveranciersafspraken op te zoeken. Deze informatie hoort bij het beheer van het platform.</p><p class="s-warning">Deze instellingen worden alleen in deze browser bewaard. Ze zijn nog niet gekoppeld aan NebulaONE en vormen geen centraal of beveiligd beleidsregister. Leg uitsluitend gecontroleerde afspraken vast.</p><div class="s-form-grid">' +
      input("platform.name", "Platformnaam", platform.name, { admin: true }) +
      input("platform.owner", "Beheerrol of team", platform.owner, {
        admin: true,
      }) +
      '</div><div class="s-admin-layout"><nav aria-label="Platformmodellen">' +
      C.models
        .map((c) =>
          btn(
            "admin-model",
            h(c.name),
            c.id === adminId ? "active" : "",
            'data-id="' + c.id + '"',
          ),
        )
        .join("") +
      '</nav><section class="s-card"><h2>' +
      h(cat.name) +
      "</h2><p>" +
      h(cat.claim) +
      "</p>" +
      select(
        "enabled",
        "Beschikbaarheid",
        m.enabled ? "yes" : "no",
        [
          ["yes", "Beschikbaar in de eerste selectie"],
          ["no", "Niet beschikbaar"],
        ],
        true,
      ) +
      input(
        "deployment",
        "Onderliggend model, versie en configuratie",
        m.deployment,
        {
          admin: true,
          help: "Leg ook regio, relevante instellingen en eventuele hulpmiddelen vast. Het menulabel alleen is onvoldoende.",
        },
      ) +
      '<h3>Welke gegevens zijn volgens de vastgelegde afspraak toegestaan?</h3><p class="s-small">Dit is een herbruikbare platformvoorwaarde. De beoordeling van het concrete doel, de taak en gevolgen blijft nodig.</p>' +
      ["public", "internal", "personal"]
        .map((k) =>
          select(
            "approval." + k,
            {
              public: "Openbare of fictieve gegevens",
              internal: "Interne of vertrouwelijke gegevens",
              personal: "Persoonsgegevens",
            }[k],
            m.approval[k],
            [
              ["unknown", "Nog niet vastgesteld"],
              ["allowed", "Toegestaan binnen de beschreven afspraak"],
              ["conditional", "Onder beschreven voorwaarden"],
              ["blocked", "Uitgesloten"],
            ],
            true,
          ),
        )
        .join("") +
      input(
        "approvalRef",
        "Verwijzing naar de goedkeuring en de reikwijdte",
        m.approvalRef,
        {
          admin: true,
          help: "Bijvoorbeeld het vastgestelde beleid of een configuratiebeoordeling. Een leverancierspagina is geen interne goedkeuring.",
        },
      ) +
      input(
        "conditions",
        "Reikwijdte, voorwaarden en uitzonderingen",
        m.conditions,
        { admin: true, area: true },
      ) +
      input("validUntil", "Uiterste herbeoordelingsdatum", m.validUntil, {
        admin: true,
        type: "date",
      }) +
      "<details><summary>Welke aanvullende functies zijn in dit platform bevestigd?</summary><p>Een modelmogelijkheid uit documentatie is nog geen ingeschakelde platformfunctie.</p>" +
      Object.entries({
        local: "Uitsluitend lokale verwerking zonder cloud",
        audio: "Audio verwerken / spraakherkenning",
        image: "Afbeeldingen maken of bewerken",
        web: "Actuele webbronnen ophalen",
        actions: "Handelingen uitvoeren met gereedschappen",
      })
        .map(([k, n]) =>
          select(
            "features." + k,
            n,
            m.features[k],
            [
              ["unknown", "Nog niet bevestigd"],
              ["yes", "Werking bevestigd voor deze configuratie"],
              ["no", "Niet beschikbaar"],
            ],
            true,
          ),
        )
        .join("") +
      input(
        "featureRef",
        "Verwijzing naar de controle van deze functies",
        m.featureRef,
        { admin: true },
      ) +
      "</details><details><summary>Bron en onzekerheden bij dit model</summary><p>" +
      h(cat.modelFact) +
      "</p>" +
      (cat.url
        ? '<a href="' +
          h(cat.url) +
          '" target="_blank" rel="noopener noreferrer">Officiële modeldocumentatie ↗</a>'
        : "") +
      '<p>De blaadjes heten in dit platform “Most efficient” (twee) en “Balanced efficiency” (één). Wie de indeling vaststelt en met welke meetmethode is niet zichtbaar; dit is geen geverifieerd milieubewijs. Tarieven, lokale taakprestaties en milieumetingen zijn niet aangeleverd.</p></details></section></div><section class="s-card"><h2>Van keuzehulp naar automatische selectie</h2><p>Deze versie geeft advies en verstuurt geen opdrachten. Voor automatische selectie zijn daarnaast een gecontroleerde platformkoppeling, passend taakbewijs, onderhoud van versies en een vastgelegde terugvalroute nodig. De formele PAM-AI-beoordeling ondersteunt het verzamelen van dat bewijs.</p>' +
      btn("dossier", "Open onderbouwde beoordelingen") +
      '</section><div class="s-buttons">' +
      btn("admin-export", "Bewaar platforminstellingen") +
      btn("admin-import", "Open platforminstellingen") +
      btn("return", "Terug naar modelkeuze", "primary") +
      "</div>"
    );
  }
  function savedPage() {
    return (
      '<p class="eyebrow">OP DIT APPARAAT</p><h1>Mijn modeladviezen</h1><p>Je adviezen worden automatisch bewaard in dit browserprofiel. Bewaar ook een bestand als reservekopie of om op een ander apparaat verder te gaan.</p><div class="s-buttons">' +
      btn("new", "Nieuwe taak", "primary") +
      btn("import", "Open adviesbestand") +
      "</div>" +
      (entries.length
        ? '<div class="s-saved">' +
          entries
            .slice()
            .reverse()
            .map(
              (x) =>
                '<article class="s-card"><h2>' +
                h(x.task.slice(0, 130)) +
                "</h2><p>" +
                h(
                  S.TYPES[x.type === "auto" ? S.infer(x.task).type : x.type]
                    .name,
                ) +
                " · " +
                h(new Date(x.updated).toLocaleDateString("nl-NL")) +
                "</p>" +
                btn("open", "Hervat advies", "", 'data-id="' + h(x.id) + '"') +
                "</article>",
            )
            .join("") +
          "</div>"
        : "<p>Er zijn nog geen taken bewaard.</p>")
    );
  }
  function render(focus = false) {
    document.body.classList.add("selector-mode");
    const content =
      view === "admin"
        ? adminPage()
        : view === "saved"
          ? savedPage()
          : stage === 0
            ? taskPage()
            : stage === 1
              ? contextPage()
              : resultPage();
    q("#app").innerHTML =
      '<div class="s-shell"><nav class="s-nav s-no-print" aria-label="PAM-AI onderdelen">' +
      btn("return", "Modelkeuze", view === "task" ? "active" : "") +
      btn("saved", "Mijn adviezen", view === "saved" ? "active" : "") +
      btn("admin", "Platformbeheer", view === "admin" ? "active" : "") +
      btn("dossier", "Onderbouwde beoordelingen") +
      "</nav>" +
      (error
        ? '<div class="s-warning" role="alert">' +
          h(error) +
          " " +
          btn("raw", "Exporteer ruwe opslag") +
          "</div>"
        : "") +
      '<main id="main" class="s-main" tabindex="-1">' +
      (view === "task"
        ? '<ol class="s-progress s-no-print" aria-label="Voortgang"><li ' +
          (stage === 0 ? 'aria-current="step"' : "") +
          ">1 · Je taak</li><li " +
          (stage === 1 ? 'aria-current="step"' : "") +
          ">2 · Context</li><li " +
          (stage === 2 ? 'aria-current="step"' : "") +
          ">3 · Modeladvies</li></ol>"
        : "") +
      content +
      '</main><footer class="s-footer"><span>PAM-AI · E.C.M. Willems<br>Methodiek 1.1 · toepassing ' +
      S.VERSION +
      '</span><span id="selector-save">' +
      h(
        error
          ? "Niet bewaard — exporteer een bestand"
          : "Automatisch bewaard in deze browser",
      ) +
      "</span></footer></div>";
    if (focus) {
      q("#main").focus();
      window.scrollTo(0, 0);
    }
  }
  function enterDossier(bridge = false) {
    enabled = false;
    document.body.classList.remove("selector-mode");
    history.replaceState(null, "", "?view=dossier");
    if (bridge) {
      const r = S.recommend(current, platform),
        out = PAM.newAssessment();
      out.intake.task = current.task;
      out.intake.goal = r.profile.need;
      out.intake.use = useOptions.find((x) => x[0] === current.use)?.[1] || "";
      out.intake.whyAI =
        "Voorlopige oriëntatie via adviesregel " +
        r.rule +
        ". Taakgeschiktheid nog te onderzoeken.";
      out.candidates = (
        current.chosen
          ? r.candidates.filter((m) => m.id === current.chosen)
          : r.candidates
      ).map((m, i) => {
        const c = PAM.newCandidate("C" + String(i + 1).padStart(2, "0"));
        c.name = m.name;
        c.type = "AI-model";
        c.component = m.name;
        c.deployment = m.config.deployment;
        c.notes =
          "Overgenomen uit modeladvies. Alle formele poorten en bewijsvelden moeten nog worden beoordeeld.";
        return c;
      });
      choose(out);
    } else window.PAM_SELECTOR.renderDossier();
  }
  document.addEventListener("click", (ev) => {
    const el = ev.target.closest("[data-select]");
    if (!el) return;
    const action = el.dataset.select;
    if (action === "start") {
      enabled = true;
      history.replaceState(null, "", "./");
      view = "task";
      render(true);
      return;
    }
    if (!enabled) return;
    if (action === "context") {
      if (!current.task.trim()) {
        message("Beschrijf eerst wat je gedaan wilt krijgen.");
        q("#s-task").focus();
        return;
      }
      stage = 1;
      view = "task";
    } else if (action === "result") {
      if (!current.data || !current.use) {
        message(
          "Kies bij beide vragen een antwoord. 'Dat weet ik nog niet' is ook een geldige keuze.",
        );
        const field = q(
          'input[name="' + (!current.data ? "s-data" : "s-use") + '"]',
        );
        field?.focus();
        return;
      }
      stage = 2;
      view = "task";
    } else if (action === "back") stage = 0;
    else if (action === "edit") stage = 0;
    else if (action === "return") view = "task";
    else if (action === "saved") view = "saved";
    else if (action === "new") {
      current = S.newAdvice();
      stage = 0;
      view = "task";
    } else if (action === "open") {
      current = entries.find((x) => x.id === el.dataset.id);
      stage = 2;
      view = "task";
    } else if (action === "admin") view = "admin";
    else if (action === "admin-model") adminId = el.dataset.id;
    else if (action === "example") {
      current = S.newAdvice();
      current.task = {
        rewrite:
          "Fictief voorbeeld: herschrijf een openbare webtekst in begrijpelijk Nederlands op B1-niveau.",
        audio:
          "Fictief voorbeeld: maak een transcript en actiepunten uit een vergaderopname.",
        analysis:
          "Fictief voorbeeld: vergelijk twee openbare beleidsstukken en benoem overeenkomsten, verschillen en tegenstrijdigheden met bronverwijzingen.",
      }[el.dataset.example];
      stage = 0;
      view = "task";
    } else if (action === "choose") {
      const r = S.recommend(current, platform);
      if (r.candidates.some((m) => m.id === el.dataset.id)) {
        current.chosen = el.dataset.id;
        message(
          "Voorlopige startkeuze bewaard. Dit is geen toestemming of bewezen taakgeschiktheid.",
        );
      }
    } else if (action === "export") {
      exportFile(
        {
          ...current,
          platformSnapshot: platform,
          advice: S.recommend(current, platform),
        },
        "PAM-AI-modeladvies.json",
      );
      return;
    } else if (action === "admin-export") {
      exportFile(platform, "PAM-AI-platform.json");
      return;
    } else if (action === "import" || action === "admin-import") {
      q(action === "import" ? "#selector-import" : "#platform-import").click();
      return;
    } else if (action === "print") {
      const details = [
        ...document.querySelectorAll("#selector-report details"),
      ];
      const closed = details.filter((d) => !d.open);
      details.forEach((d) => (d.open = true));
      window.print();
      closed.forEach((d) => (d.open = false));
      return;
    } else if (action === "raw") {
      exportFile(
        {
          adviezen: localStorage.getItem("pam-ai-selector-v1"),
          platform: localStorage.getItem("pam-ai-platform-v1"),
        },
        "PAM-AI-opslag-herstel.json",
      );
      return;
    } else if (action === "add-measure") {
      current.measurements.push({
        id: el.dataset.id,
        cases: null,
        accepted: null,
        cost: null,
        minutes: null,
        energy: null,
        reference: "",
        boundary: "",
        testset: "",
        deployment: platform.models.find((m) => m.id === el.dataset.id)
          .deployment,
      });
    } else if (action === "remove-measure") {
      current.measurements = current.measurements.filter(
        (x) => x.id !== el.dataset.id,
      );
    } else if (action === "dossier" || action === "bridge") {
      persist();
      enterDossier(action === "bridge");
      return;
    } else return;
    const wasMeasure = action.includes("measure");
    const oldScroll = window.scrollY;
    persist();
    render(
      !["choose", "admin-model", "add-measure", "remove-measure"].includes(
        action,
      ),
    );
    if (wasMeasure) {
      const d = q(".s-measurements");
      if (d) d.open = true;
      window.scrollTo(0, oldScroll);
    }
  });
  function updateField(el) {
    if (el.maxLength > 0 && el.value.length > el.maxLength) {
      message(
        "Deze tekst is te lang en is niet bewaard. Kort de tekst in of gebruik een verwijzing.",
      );
      return;
    }
    if (el.dataset.selectField) {
      const k = el.dataset.selectField;
      if (!["task", "type", "data", "use", "priority", "notes"].includes(k))
        return;
      if (
        current[k] !== el.value &&
        ["task", "type", "data", "use"].includes(k)
      ) {
        current.chosen = "";
        if (current.measurements.length) {
          if ((current.archivedMeasurements || []).length >= 50) {
            message(
              "Bewaar een export en begin een nieuwe taak: maximaal 50 meetarchieven per advies.",
            );
            return;
          }
          current.archivedMeasurements = [
            ...(current.archivedMeasurements || []),
            {
              task: current.task,
              data: current.data,
              use: current.use,
              type: current.type,
              measurements: current.measurements,
            },
          ];
          current.measurements = [];
          message(
            "Eerdere metingen zijn gearchiveerd bij hun oorspronkelijke taakcontext; ze tellen niet mee voor dit gewijzigde advies.",
          );
        }
      }
      current[k] = el.value;
      if (k === "task" || k === "type") {
        const rec = q("#s-recognition");
        if (rec) rec.innerHTML = recognition();
      }
    } else if (el.dataset.admin) {
      const k = el.dataset.admin,
        m = platform.models.find((x) => x.id === adminId);
      if (k === "platform.name") platform.name = el.value;
      else if (k === "platform.owner") platform.owner = el.value;
      else if (k === "enabled") m.enabled = el.value === "yes";
      else if (k.startsWith("features."))
        m.features[k.split(".")[1]] = el.value;
      else if (k.startsWith("approval.")) {
        m.approval[k.split(".")[1]] = el.value;
        m.approvedDeployment = m.deployment;
      } else if (
        [
          "deployment",
          "featureRef",
          "approvalRef",
          "validUntil",
          "conditions",
        ].includes(k)
      ) {
        if (k === "deployment" && m.deployment !== el.value) {
          m.approvedDeployment = "";
          for (const key of Object.keys(m.approval))
            if (m.approval[key] !== "blocked") m.approval[key] = "unknown";
          for (const key of Object.keys(m.features))
            m.features[key] = "unknown";
          for (const key of Object.keys(m.approval)) {
            const field = q('[data-admin="approval.' + key + '"]');
            if (field) field.value = m.approval[key];
          }
          for (const key of Object.keys(m.features)) {
            const field = q('[data-admin="features.' + key + '"]');
            if (field) field.value = m.features[key];
          }
          message(
            "Configuratie gewijzigd: eerdere afspraken en functiebevestigingen moeten opnieuw worden gecontroleerd.",
          );
        }
        m[k] = el.value;
      }
      platform.updated = new Date().toISOString();
    } else if (el.dataset.measure) {
      const row = current.measurements.find((x) => x.id === el.dataset.model);
      if (!row) return;
      const key = el.dataset.measure;
      const val =
        el.type === "number"
          ? el.value === ""
            ? null
            : Number(el.value)
          : el.value;
      if (el.type === "number") {
        const next = { ...row, [key]: val };
        if (
          (val !== null &&
            (!Number.isFinite(val) ||
              val < 0 ||
              (["cases", "accepted"].includes(key) &&
                !Number.isInteger(val)))) ||
          (next.cases !== null &&
            next.accepted !== null &&
            next.accepted > next.cases)
        ) {
          el.setCustomValidity(
            "Gebruik geldige aantallen: geaccepteerd kan niet hoger zijn dan getest.",
          );
          message(
            "Deze ongeldige waarde is niet bewaard. Controleer de aantallen.",
          );
          return;
        }
        el.setCustomValidity("");
      }
      row[key] = val;
      const m = S.metrics(
          row,
          platform.models.find((x) => x.id === row.id).deployment,
        ),
        out = q('[data-metric-result="' + row.id + '"]'),
        fmt = (n, u) =>
          n === null
            ? "Onbekend"
            : new Intl.NumberFormat("nl-NL", {
                maximumFractionDigits: 6,
              }).format(n) +
              " " +
              u;
      if (out)
        out.textContent =
          "Per geaccepteerde uitkomst: " +
          fmt(m.cost, "€") +
          " · " +
          fmt(m.minutes, "min") +
          " · " +
          fmt(m.energy, "kWh");
    } else return;
    persist();
  }
  document.addEventListener("input", (ev) => {
    if (enabled) updateField(ev.target);
  });
  document.addEventListener("change", (ev) => {
    if (enabled) updateField(ev.target);
  });
  document.addEventListener("DOMContentLoaded", () => {
    q("#selector-import").addEventListener("change", async (ev) => {
      const f = ev.target.files[0];
      if (!f) return;
      try {
        if (f.size > 1000000) throw Error("Bestand te groot.");
        const next = S.parseAdvice(await f.text());
        next.id = S.newAdvice().id;
        current = next;
        stage = 2;
        view = "task";
        persist();
        render(true);
        message(
          "Als kopie geopend. Advies opnieuw bepaald met de huidige lokale platformafspraken.",
        );
      } catch (e) {
        message("Import afgebroken: " + e.message);
      } finally {
        ev.target.value = "";
      }
    });
    q("#platform-import").addEventListener("change", async (ev) => {
      const f = ev.target.files[0];
      if (!f) return;
      try {
        if (f.size > 1000000) throw Error("Bestand te groot.");
        const next = S.parsePlatform(await f.text());
        platform = next;
        persist();
        render(true);
        message(
          "Platforminstellingen geopend. Modeladviezen worden opnieuw afgeleid.",
        );
      } catch (e) {
        message("Import afgebroken: " + e.message);
      } finally {
        ev.target.value = "";
      }
    });
  });
  return {
    active: () => enabled,
    render,
    renderDossier: () => window.renderPAMDossier(),
  };
})();
