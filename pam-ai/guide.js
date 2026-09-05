/* Guided presentation of PAM-AI v1.1. All decisions/calculations stay in engine.js. */
"use strict";
window.PAM_GUIDE = (() => {
  let enabled = true,
    proofTarget = "",
    proofIndex = -1,
    proofPage = 0;
  try {
    enabled = localStorage.getItem("pam-ai-view") !== "all";
  } catch {}
  const names = [
    "Je taak",
    "Je opties",
    "Mag dit?",
    "Werkt het?",
    "Is het de moeite waard?",
    "Je besluit",
  ];
  const chapters = [
    [
      "De taak",
      "De huidige werkwijze",
      "Mensen en gebruik",
      "De gevolgen",
      "Je vervolgstap",
    ],
    ["De opties", "De werkwijze vastleggen"],
    ["Acht vragen"],
    [
      "Goed genoeg",
      "De testafspraken",
      "Hoeveel bewijs?",
      "Testen",
      "De uitkomsten",
    ],
    [
      "Wat kan verder?",
      "Twee opties vergelijken",
      "Gevolgen in de praktijk",
      "Je afweging",
    ],
    [
      "Je keuze",
      "Je onderbouwing",
      "Voorwaarden",
      "Verantwoordelijkheid",
      "Het overzicht",
    ],
  ];
  const riskQuestions = [
    [
      "Hoe groot kunnen de gevolgen van fouten zijn?",
      "Denk aan de mensen die de uitkomst gebruiken of erdoor geraakt worden. Kies op basis van jouw context; PAM-AI kent hiervoor geen vaste bedragen of aantallen.",
      ["Laag", "Middel", "Hoog", "Kritiek"],
    ],
    [
      "Kun je eventuele schade goed terugdraaien?",
      "Alleen de AI-uitkomst corrigeren is niet altijd genoeg. Denk ook aan een besluit dat al is uitgevoerd.",
      ["Ja", "Gedeeltelijk", "Nee"],
    ],
    [
      "Worden gevoelige of bijzondere gegevens gebruikt?",
      "Denk bijvoorbeeld aan vertrouwelijke dossiers of bijzondere persoonsgegevens. Laat dit bij twijfel beoordelen door de verantwoordelijke collega.",
      ["Nee", "Beperkt", "Ja"],
    ],
    [
      "Kan de toepassing gevolgen hebben voor rechten, veiligheid of een kerntaak?",
      "Denk bijvoorbeeld aan beslissingen over toegang tot onderwijs of ondersteuning. Een 'ja' leidt volgens de bron tot de zwaarste onderzoeksroute.",
      ["Nee", "Mogelijk", "Ja"],
    ],
    [
      "Op welke schaal wil je de toepassing gebruiken?",
      "Beoordeel de schaal binnen jouw organisatie en doelgroep. De methodiek geeft geen vaste aantallen voor deze categorieën.",
      ["Beperkt", "Middel", "Groot"],
    ],
    [
      "Kan de toepassing zelf handelingen buiten het gesprek uitvoeren?",
      "Bijvoorbeeld berichten versturen, dossiers aanpassen of andere systemen aansturen.",
      ["Nee", "Beperkt", "Ja"],
    ],
    [
      "Geldt er een formele of sectorale beoordelingsplicht?",
      "Denk aan een verplichte toets voor deze taak of sector. PAM-AI voert die toets niet zelf uit.",
      ["Nee", "Mogelijk", "Ja"],
    ],
  ];
  const gateQuestions = [
    [
      "Is deze toepassing toegestaan volgens de geldende regels?",
      "Wetgeving, verboden toepassingen en regels voor jouw sector.",
      "Een vastgelegde juridische beoordeling voor deze toepassing.",
    ],
    [
      "Zijn privacy en het gebruik van gegevens geregeld?",
      "Welke gegevens zijn nodig, wie mag erbij en onder welke voorwaarden?",
      "Een privacybeoordeling, DPIA waar nodig, of vastgelegde gegevensafspraken.",
    ],
    [
      "Zijn beveiliging en vertrouwelijkheid voldoende geregeld?",
      "Denk aan toegangsrechten, gegevenslekken en bescherming van vertrouwelijke informatie.",
      "Een securitybeoordeling die geldt voor deze omgeving en instellingen.",
    ],
    [
      "Zijn rechten, toegankelijkheid en inclusie voldoende geborgd?",
      "Kan iedereen de dienst gebruiken, en worden mensen niet onterecht benadeeld?",
      "Een toets op toegankelijkheid en mogelijke ongelijke gevolgen.",
    ],
    [
      "Is duidelijk wie verantwoordelijk is en wanneer een mens ingrijpt?",
      "Mensen moeten de inzet kunnen begrijpen, controleren en waar nodig corrigeren.",
      "Een werkinstructie met verantwoordelijkheid, uitleg en menselijke controle.",
    ],
    [
      "Zijn afspraken met leveranciers en over gebruiksrechten op orde?",
      "Denk aan contracten, eigendom van gegevens en rechten op invoer en uitvoer.",
      "Contractafspraken of een inkoopbeoordeling voor deze configuratie.",
    ],
    [
      "Kun je fouten terugvinden, melden en corrigeren?",
      "Denk aan vastlegging, incidenten en de mogelijkheid om de toepassing bij te sturen.",
      "Een procedure voor logging, incidenten en herstel.",
    ],
    [
      "Kun je doorgaan of overstappen als deze oplossing uitvalt?",
      "Beoordeel continuïteit, stoppen, overstappen en of deze werkomgeving is goedgekeurd.",
      "Een continuïteits- of exitplan en goedkeuring van de omgeving.",
    ],
  ];
  const title = (h, p) =>
    "<h1>" + esc(h) + '</h1><p class="lead">' + esc(p) + "</p>";
  const fold = (h, b) =>
    '<details class="guide-detail"><summary>' +
    esc(h) +
    "</summary>" +
    b +
    "</details>";
  const hint = (h, p) =>
    '<div class="guide-hint"><strong>' +
    esc(h) +
    "</strong><p>" +
    esc(p) +
    "</p></div>";
  const group = (arr) => '<div class="guide-fields">' + arr.join("") + "</div>";
  const linkStep = (step, page, text) =>
    btn(
      "g-jump",
      esc(text),
      "",
      "data-step='" + step + "' data-page='" + page + "'",
    );
  const scopeOptions = [
    ["Verkenning", "Eerst verkennen wat mogelijk is"],
    ["Gecontroleerde pilot", "Een beperkte proef onder voorwaarden"],
    [
      "Gedeeltelijke proportionaliteitsafweging",
      "Een afweging over een deel van de lasten",
    ],
    [
      "Volledige proportionaliteitsafweging",
      "Een volledige afweging over inzet",
    ],
  ];
  const props = [
    ["PROPORTIONATE", "De waarde rechtvaardigt de lasten"],
    ["CONDITIONAL", "Alleen onder concrete voorwaarden"],
    ["MULTIPLE PROPORTIONAL OPTIONS", "Er zijn meerdere passende opties"],
    ["NOT PROPORTIONATE", "De lasten zijn niet gerechtvaardigd"],
    ["UNDETERMINED", "Nog geen onderbouwd oordeel mogelijk"],
  ];
  function state() {
    if (!a.guide || !Array.isArray(a.guide.pages) || a.guide.pages.length !== 6)
      a.guide = { pages: [0, 0, 0, 0, 0, 0], risk: 0, gate: 0, context: 0 };
    const s = a.guide;
    s.pages = s.pages.map((n, i) =>
      Number.isInteger(n) && n >= 0 && n < chapters[i].length ? n : 0,
    );
    for (const [k, max] of [
      ["risk", 6],
      ["gate", 7],
      ["context", 4],
    ])
      if (!Number.isInteger(s[k]) || s[k] < 0 || s[k] > max) s[k] = 0;
    return s;
  }
  function radio(path, heading, choices, explanation = "") {
    const v = pathGet(a, path);
    return (
      '<fieldset class="choice-group"><legend>' +
      esc(heading) +
      "</legend>" +
      (explanation
        ? '<p class="small muted">' + esc(explanation) + "</p>"
        : "") +
      choices
        .map((o) => {
          const [val, txt, sub] = Array.isArray(o) ? o : [o, o, ""];
          return (
            '<label class="choice ' +
            (v === val ? "selected" : "") +
            '"><input type="radio" data-path="' +
            esc(path) +
            '" value="' +
            esc(val) +
            '" name="' +
            esc(path) +
            '" ' +
            (v === val ? "checked" : "") +
            "><span><strong>" +
            esc(txt) +
            "</strong>" +
            (sub ? "<small>" + esc(sub) + "</small>" : "") +
            "</span></label>"
          );
        })
        .join("") +
      "</fieldset>"
    );
  }
  function sourcePicker(path, heading = "Welke bron onderbouwt dit?") {
    const draft = path.startsWith("@"),
      val = pathGet(draft ? runDraft : a, draft ? path.slice(1) : path) || "";
    const ids = String(val)
      .split(/[,;\n]+/)
      .map((x) => x.trim())
      .filter(Boolean);
    return (
      '<fieldset class="proof-picker"><legend>' +
      esc(heading) +
      '</legend><p class="small muted">Kies een document, beoordeling of meting. Je bewaart hier een verwijzing; het bestand zelf blijft waar het staat.</p>' +
      (a.evidence.length
        ? '<div class="proof-list">' +
          a.evidence
            .map(
              (e, j) =>
                '<div class="proof-option"><label><input type="checkbox" data-proof="' +
                esc(path) +
                '" value="' +
                esc(e.id) +
                '" ' +
                (ids.includes(e.id) ? "checked" : "") +
                "><span>" +
                esc(e.source || "Bron nog te beschrijven") +
                (!E.refsValid(a, e.id)
                  ? "<small>Bronbeschrijving nog onvolledig of onbekend</small>"
                  : "") +
                "</span></label>" +
                btn(
                  "g-edit-proof",
                  "Details",
                  "text-button",
                  "data-index='" + j + "'",
                ) +
                "</div>",
            )
            .join("") +
          "</div>"
        : '<p class="small">Nog geen bronnen vastgelegd. Je kunt dit openlaten en later aanvullen.</p>') +
      (ids.some((id) => !a.evidence.some((e) => e.id === id))
        ? '<p class="callout warning">Een eerder gekoppelde bron ontbreekt in het dossier. Voeg die bron toe of pas de koppeling aan in de dossierweergave.</p>'
        : "") +
      btn(
        "g-add-proof",
        "+ Bron toevoegen",
        "",
        "data-target='" + esc(path) + "'",
      ) +
      "</fieldset>"
    );
  }
  function sourcesModal() {
    if (proofIndex < 0 || !a.evidence[proofIndex]) return "";
    const p = "evidence." + proofIndex + ".",
      e = a.evidence[proofIndex];
    return (
      '<dialog id="proof-dialog" aria-labelledby="proof-title"><div class="inline"><p class="eyebrow">Bron vastleggen · ' +
      (proofPage + 1) +
      " van 2</p>" +
      btn("g-close-proof", "Sluiten") +
      '</div><h2 id="proof-title">' +
      (proofPage === 0 ? "Waar baseer je dit op?" : "Hoe sterk is deze bron?") +
      "</h2>" +
      (proofPage === 0
        ? group([
            field(p + "source", "Naam van het document of de meting", {
              placeholder:
                "Bijvoorbeeld: privacybeoordeling van deze toepassing",
            }),
            field(p + "location", "Link of bestandslocatie", {
              hint: "Een verwijzing is genoeg. PAM-AI uploadt geen documenten.",
            }),
            field(p + "owner", "Wie is verantwoordelijk voor deze bron?"),
            field(p + "date", "Datum van de bron", { type: "date" }),
            field(p + "type", "Soort document of meting (optioneel)"),
          ])
        : group([
            field(p + "grade", "Wat voor bewijs is dit?", {
              options: [
                ["A", "Eigen of primaire, goed te herhalen meting/beoordeling"],
                [
                  "B",
                  "Gedocumenteerde informatie van een leverancier of andere bron",
                ],
                ["C", "Een schatting of indirecte aanwijzing"],
                ["U", "Nog onbekend"],
              ],
            }),
            field(p + "limitations", "Wat toont deze bron wel en niet aan?", {
              area: true,
              hint: "Benoem de toepassing, omstandigheden en beperkingen. Is er geen bekende beperking, leg dan vast dat dit is onderzocht.",
            }),
            ...(e.grade === "C"
              ? [
                  field(
                    p + "useLimits",
                    "Hoe beperk je de conclusie of onderzoek je de onzekerheid?",
                    {
                      area: true,
                      hint: "Een schatting vraagt een gevoeligheidsanalyse of een expliciet beperkte claim.",
                    },
                  ),
                ]
              : []),
          ])) +
      '<div class="actions between">' +
      (proofPage ? btn("g-proof-prev", "← Terug") : "<span></span>") +
      btn(
        proofPage ? "g-close-proof" : "g-proof-next",
        proofPage ? "Bron bewaren en terug" : "Verder →",
        "primary",
      ) +
      '</div><p class="small muted">De inhoud wordt automatisch lokaal bewaard. Een onvolledige bron blijft herkenbaar als onvolledig.</p></dialog>'
    );
  }
  function landingView() {
    return (
      '<main id="main" class="guide-landing"><p class="eyebrow">PAM-AI · E.C.M. Willems</p>' +
      title(
        "AI inzetten? Begin bij je taak.",
        "Onderzoek welke oplossing bij jouw werk past. Vergelijk AI met je huidige werkwijze en andere opties. Leg vast wat mag, wat werkt en wat de inzet waard is.",
      ) +
      '<div class="actions">' +
      btn("new", "Start een nieuwe afweging", "primary") +
      btn("import", "Een bewaarde afweging openen") +
      '</div><p class="small muted">Geen account nodig. Je kunt op ieder moment stoppen en later verdergaan.</p>' +
      '<div class="guide-intro"><div><span>01</span><h2>Vertel wat je wilt bereiken</h2><p>Begin met gewone vragen over je werk. Je hoeft de methodiek niet vooraf te kennen.</p></div><div><span>02</span><h2>Onderzoek je opties</h2><p>Leg beoordelingen en testresultaten vast. Wat nog niet bekend is, blijft open.</p></div><div><span>03</span><h2>Bewaar je afweging</h2><p>Een leesbaar besluit met onderbouwing, voorwaarden en wat nog moet worden uitgezocht.</p></div></div>' +
      (vault.items.length
        ? panel(
            "Verder met je afweging",
            vault.items
              .map(
                (x) =>
                  '<div class="saved-item inline"><div><h3>' +
                  esc(x.intake.task || "Afweging zonder titel") +
                  '</h3><p class="small muted">' +
                  (x.fictional ? "Fictief voorbeeld · " : "") +
                  esc(new Date(x.updated).toLocaleString("nl-NL")) +
                  '</p></div><div class="actions">' +
                  btn(
                    "open",
                    "Verdergaan",
                    "primary",
                    "data-id='" + esc(x.id) + "'",
                  ) +
                  btn(
                    "delete",
                    "Verwijderen",
                    "text-button",
                    "data-id='" + esc(x.id) + "'",
                  ) +
                  "</div></div>",
              )
              .join(""),
          )
        : "") +
      fold(
        "Eerst een ingevuld voorbeeld bekijken",
        '<p>Deze demonstraties bevatten uitsluitend fictieve gegevens. Ze laten ook zien wanneer meer bewijs nodig blijft.</p><div class="actions">' +
          btn(
            "example",
            "Fictieve volledige afweging",
            "",
            "data-kind='full'",
          ) +
          btn("example", "Fictieve kleine pilot", "", "data-kind='pilot'") +
          "</div>",
      ) +
      '<p class="guide-local">Je antwoorden blijven in deze browser. Maak via ‘Bestand bewaren’ een eigen reservekopie.</p>' +
      footer() +
      "</main>"
    );
  }
  function taskPage(n) {
    const i = a.intake,
      s = state();
    if (n === 0)
      return (
        title(
          "Welke taak wil je verbeteren?",
          "Kies één concrete taak. Zo kun je straks beoordelen of een oplossing echt helpt.",
        ) +
        group([
          field("intake.task", "Om welke taak gaat het?", {
            placeholder:
              "Bijvoorbeeld: vragen van medewerkers over verlof beantwoorden",
            lock: true,
          }),
          field("intake.goal", "Wat moet een goed resultaat opleveren?", {
            area: true,
            lock: true,
            hint: "Bijvoorbeeld: een correct en begrijpelijk antwoord, met een verwijzing naar het geldende beleid.",
          }),
        ]) +
        fold(
          "Waarom vraagt PAM-AI om één taak?",
          "<p>Een model kan voor de ene taak geschikt zijn en voor een andere niet. Je vergelijkt straks de totale inzet die nodig is voor één geaccepteerd resultaat, inclusief opnieuw proberen, controleren en herstellen.</p>",
        )
      );
    if (n === 1)
      return (
        title(
          "Hoe gaat dit werk nu?",
          "Je huidige werkwijze is het vertrekpunt voor de vergelijking. Ook zonder AI doorgaan kan een goede uitkomst zijn.",
        ) +
        group([
          field("intake.baseline", "Beschrijf de huidige werkwijze zonder AI", {
            area: true,
            hint: "Wie doet het werk, met welke hulpmiddelen en welke controle?",
          }),
          field(
            "intake.whyAI",
            "Wat wil je verbeteren, en waarom overweeg je een andere oplossing?",
            {
              area: true,
              hint: "Denk aan kwaliteit, tijd, bereikbaarheid of werkdruk. Een vermoeden is nog geen aangetoonde verbetering.",
            },
          ),
        ])
      );
    if (n === 2)
      return (
        title(
          "Wie gebruikt het resultaat?",
          "Dezelfde techniek kan in een andere werksituatie heel andere gevolgen hebben.",
        ) +
        group([
          field(
            "intake.use",
            "Hoe wordt het resultaat gebruikt en gecontroleerd?",
            {
              area: true,
              lock: true,
              hint: "Wie kijkt het na? Welk besluit of handelen volgt erop?",
            },
          ),
          field(
            "intake.affected",
            "Wie gebruikt dit, en wie merkt de gevolgen?",
            { area: true, lock: true },
          ),
          field("intake.taskOwner", "Wie kent deze taak goed?", {
            hint: "De collega met wie je later kunt bepalen of een resultaat goed genoeg is.",
          }),
        ])
      );
    if (n === 3) {
      const q = riskQuestions[s.risk];
      return (
        '<p class="eyebrow">Gevolgen · vraag ' +
        (s.risk + 1) +
        " van 7</p>" +
        title(q[0], q[1]) +
        radio("intake.answers." + s.risk, "Jouw inschatting", q[2]) +
        hint(
          "Weet je het nog niet?",
          "Laat de vraag open. PAM-AI bepaalt pas een onderzoeksroute als alle zeven vragen zijn beantwoord.",
        ) +
        '<div class="actions between">' +
        btn(
          "g-risk-prev",
          "← Vorige vraag",
          "",
          s.risk === 0 ? "disabled" : "",
        ) +
        btn(
          "g-risk-next",
          s.risk === 6 ? "Naar je vervolgstap →" : "Volgende vraag →",
          "primary",
        ) +
        "</div>"
      );
    }
    return (
      title(
        "Wat wil je nu kunnen besluiten?",
        "De benodigde onderbouwing hangt af van de gevolgen en van hoe ver je wilt gaan.",
      ) +
      hint(
        E.activeRoute(a)
          ? "Dit vraagt de methodiek van je"
          : "Beantwoord eerst de vragen over de gevolgen",
        E.activeRoute(a)
          ? routeHelp(E.activeRoute(a))
          : "Er staat nog geen onderzoeksroute vast. Een open antwoord telt niet als een laag risico.",
      ) +
      radio("intake.scope", "Je doel voor deze afweging", scopeOptions) +
      group([
        field("intake.owner", "Wie is verantwoordelijk voor het besluit?"),
      ]) +
      fold(
        "Onderzoeksroute bekijken of gemotiveerd aanpassen",
        "<p>Voorstel uit de zeven antwoorden: <strong>" +
          esc(E.route(a) || "Nog onbekend") +
          "</strong>. Routecodes volgen de methodiek; ze zijn geen risicoscore.</p>" +
          fields([
            field("intake.confirmedRoute", "Bevestigde of afwijkende route", {
              options: ["R1", "R2", "R3", "R4"],
              hint: "Leeg: het voorstel wordt gebruikt.",
            }),
            field("intake.routeReason", "Waarom wijk je af?", { area: true }),
          ]),
      ) +
      fold(
        "Kenmerk van dit dossier",
        field("intake.taskId", "Eigen dossierkenmerk", {
          hint: "Optioneel aanpasbaar. Bij de start wordt automatisch een kenmerk gemaakt.",
        }),
      )
    );
  }
  function optionPage(n) {
    const c = a.candidates[ci],
      p = "candidates." + ci + ".";
    const buttons =
      '<div class="actions">' +
      btn(
        "g-add-baseline",
        "+ Huidige werkwijze toevoegen",
        "",
        a.candidates.some((x) => x.type === "Niet-AI-baseline")
          ? "disabled"
          : "",
      ) +
      btn(
        "add-candidate",
        "+ Andere optie toevoegen",
        "primary",
        a.candidates.length >= 8 ? "disabled" : "",
      ) +
      "</div>";
    if (!c)
      return (
        title(
          "Welke opties wil je onderzoeken?",
          "Neem je huidige werkwijze zonder AI mee. Voeg daarna een AI-oplossing, andere technologie of een combinatie toe.",
        ) +
        buttons +
        hint(
          "Een optie is een concrete werkwijze",
          "‘Een taalmodel’ is te algemeen. Denk bijvoorbeeld aan ‘medewerker zoekt handmatig’ of ‘zoekassistent met vaste documenten en controle door een medewerker’. Dit zijn alleen voorbeelden.",
        )
      );
    if (n === 0)
      return (
        title(
          "Welke opties wil je onderzoeken?",
          "Je kiest hier nog geen winnaar. Leg de mogelijkheden naast elkaar vast.",
        ) +
        buttons +
        candidateTabs() +
        group([
          field(p + "name", "Hoe noem je deze optie?", {
            placeholder: "Bijvoorbeeld: handmatig zoeken in de kennisbank",
          }),
          field(p + "type", "Wat voor oplossing is dit?", {
            options: [
              ["Niet-AI-baseline", "Huidige werkwijze zonder AI"],
              ["AI-model", "Een AI-model"],
              ["Hybride", "Combinatie van AI en andere werkwijzen"],
              [
                "Regelgebaseerd / klassieke ML",
                "Regels, zoektechniek of klassieke machine learning",
              ],
              ["Anders", "Een andere oplossing"],
            ],
          }),
        ]) +
        fold(
          "Optie kopiëren of verwijderen",
          '<div class="actions">' +
            btn("copy-candidate", "Als nieuwe optie kopiëren") +
            btn("remove-candidate", "Deze optie verwijderen", "danger") +
            "</div>",
        )
      );
    const manual = c.type === "Niet-AI-baseline";
    return (
      title(
        "Hoe werkt deze optie precies?",
        "Dit zorgt ervoor dat je straks test wat je daadwerkelijk wilt gebruiken.",
      ) +
      candidateTabs() +
      group([
        field(
          p + "settings",
          manual
            ? "Beschrijf de stappen en de menselijke controle"
            : "Hoe wordt deze oplossing ingesteld en gecontroleerd?",
          {
            area: true,
            hint: manual
              ? "Denk aan zoeken, beoordelen, controleren en herstellen."
              : "Beschrijf de vaste instructie, gebruikte documenten, hulpmiddelen en wat een mens controleert. Je kunt verwijzen naar een configuratiedocument.",
          },
        ),
        field(
          p + "component",
          manual
            ? "Welke hulpmiddelen worden gebruikt?"
            : "Welk product of model van welke aanbieder?",
        ),
        field(
          p + "version",
          manual
            ? "Welke versie van de werkinstructie?"
            : "Welke versie wordt gebruikt?",
        ),
        field(
          p + "deployment",
          "Waar wordt het werk uitgevoerd en waar blijven de gegevens?",
          {
            hint: "Bijvoorbeeld: werkplek binnen de organisatie of een benoemde cloudomgeving en regio.",
          },
        ),
      ]) +
      fold(
        "Versie herkenbaar vastleggen",
        group([
          field(p + "fingerprint", "Vast kenmerk van deze werkwijze", {
            hint: "Bijvoorbeeld de documentversie, buildcode of een verwijzing naar de vastgelegde instellingen.",
          }),
          field(p + "testDate", "Testdatum", { type: "date" }),
          field(p + "notes", "Bijzonderheden", { area: true }),
        ]),
      ) +
      (a.runs.some((r) => r.candidate === c.id)
        ? hint(
            "Eerder bewijs hoort bij de geteste versie",
            "Een wijziging maakt die testresultaten ongeldig voor de nieuwe configuratie. Start daarvoor een nieuwe beoordelingsversie.",
          )
        : "")
    );
  }
  function permissionPage() {
    if (!a.candidates.length) return candEmpty();
    const c = a.candidates[ci],
      s = state(),
      j = s.gate,
      q = gateQuestions[j],
      g = c.gate[j],
      p = "candidates." + ci + ".gate." + j + ".";
    return (
      title(
        "Mag je deze optie zo gebruiken?",
        "Beantwoord de vragen per optie. Een negatief oordeel sluit de optie uit; ontbrekend bewijs vraagt om uitzoekwerk.",
      ) +
      candidateTabs() +
      '<div class="gate-progress">' +
      c.gate
        .map((v, k) =>
          btn(
            "g-gate",
            String(k + 1),
            j === k ? "active" : "",
            "data-index='" +
              k +
              "' aria-label='Vraag " +
              (k + 1) +
              ": " +
              esc(gateQuestions[k][0]) +
              "' " +
              (j === k ? "aria-current='step'" : ""),
          ),
        )
        .join("") +
      "</div>" +
      '<p class="eyebrow">Vraag ' +
      (j + 1) +
      " van 8 · " +
      esc(c.name || "Naam ontbreekt") +
      "</p><h2>" +
      esc(q[0]) +
      "</h2><p>" +
      esc(q[1]) +
      "</p>" +
      radio(p + "status", "Wat is vastgesteld?", [
        ["PASS", "Ja, dit is beoordeeld en geregeld"],
        ["CONDITIONAL", "Alleen als aan voorwaarden wordt voldaan"],
        ["FAIL", "Nee, dit is niet toegestaan of onvoldoende geregeld"],
        ["UNKNOWN", "Dit moet nog worden uitgezocht"],
        ["N/A", "Dit is niet van toepassing op deze optie"],
      ]) +
      (g.status === "FAIL"
        ? hint(
            "Deze optie kan niet verder",
            "Een voordeel zoals lagere kosten of betere resultaten kan deze uitsluiting niet opheffen.",
          )
        : "") +
      (g.status === "UNKNOWN"
        ? hint(
            "Nog uit te zoeken",
            "Leg vast welke informatie ontbreekt en wie je hiervoor nodig hebt. Dit antwoord wordt niet als akkoord behandeld.",
          )
        : "") +
      (["CONDITIONAL", "FAIL", "UNKNOWN", "N/A"].includes(g.status)
        ? field(
            p + "reason",
            g.status === "CONDITIONAL"
              ? "Aan welke concrete voorwaarden moet worden voldaan?"
              : g.status === "N/A"
                ? "Waarom is dit hier niet van toepassing?"
                : g.status === "UNKNOWN"
                  ? "Wat moet nog worden uitgezocht, en door wie?"
                  : "Wat is de reden?",
            { area: true },
          )
        : "") +
      (g.status ? sourcePicker(p + "evidence") : "") +
      fold(
        "Welk bewijs kan helpen?",
        "<p>" +
          esc(q[2]) +
          " De bron moet gelden voor deze taak en werkwijze. PAM-AI voert juridische, privacy- of beveiligingsonderzoeken niet zelf uit.</p>",
      ) +
      '<div class="actions between">' +
      btn("g-gate-prev", "← Vorige vraag", "", j === 0 ? "disabled" : "") +
      btn(
        "g-gate-next",
        j === 7
          ? a.candidates.some(
              (x, k) =>
                k !== ci &&
                !["PASS", "CONDITIONAL", "FAIL"].includes(E.gate1(a, x)),
            )
            ? "Volgende optie beoordelen →"
            : "Naar de testafspraken →"
          : "Volgende vraag →",
        "primary",
      ) +
      "</div>" +
      (j === 7
        ? hint(
            "Toelaatbaarheid van deze optie: " + label(E.gate1(a, c)),
            "Controleer de andere opties ook. Alleen beoordeelde, onderbouwde antwoorden kunnen deze stap afronden.",
          )
        : "")
    );
  }

  function percentField(path, h) {
    return field(path, h, { type: "number", lock: true })
      .replace(
        'data-path="' + path + '"',
        'data-path="' + path + '" data-scale="100"',
      )
      .replace(
        / value="[^"]*"/,
        ' value="' +
          esc(
            pathGet(a, path) === null
              ? ""
              : Number((pathGet(a, path) * 100).toFixed(10)),
          ) +
          '"',
      );
  }
  function norms() {
    const f = E.floor(a.intake.thresholds);
    return (
      title(
        "Hoe zeker moet je kunnen zijn?",
        "Spreek de eisen af voordat je gaat testen. De ingevulde startwaarden komen uit het Excelinstrument; ze zijn geen algemene norm voor iedere taak.",
      ) +
      group([
        percentField(
          "intake.thresholds.success",
          "Minimaal aandeel goede resultaten (%)",
        ),
        percentField(
          "intake.thresholds.critical",
          "Maximaal aandeel kritieke fouten (%)",
        ),
        field(
          "intake.thresholdReason",
          "Waarom passen deze eisen bij jouw taak?",
          {
            area: true,
            lock: true,
            hint: "Bespreek dit met de inhoudsdeskundige. Strengere eisen vragen doorgaans meer bewijs.",
          },
        ),
      ]) +
      hint(
        "Wat betekent dit voor de test?",
        f
          ? "Bij deze instellingen zijn minimaal " +
              f.effective +
              " verschillende testgevallen per optie nodig voor een volledige geschiktheidsbeoordeling, zelfs als alles goed gaat. Ook de spreiding van de situaties en de betrouwbaarheid van de beoordeling moeten kloppen. Een kleinere proef kan wel leerzaam zijn."
          : "De instellingen zijn nog niet geldig. Vul de eisen in voordat je tests registreert.",
      ) +
      fold(
        "Statistische instellingen en berekening",
        group([
          field("intake.thresholds.z", "z-waarde uit de methodiek", {
            type: "number",
            lock: true,
          }),
          field("intake.thresholds.baseN", "Basisminimum testgevallen", {
            type: "number",
            lock: true,
          }),
        ]) +
          "<p>De tool gebruikt de Wilson-grenzen en de bewijsbodem uit 01_Intake en 06_Analyse. De berekeningen staan ongewijzigd in de rekenmodule.</p>",
      ) +
      fold(
        "Welke ontbrekende informatie kan het besluit tegenhouden?",
        "<p>Deze keuzes komen uit de intake van het Excelinstrument. Vink aan welke lasten besliskritiek zijn. Ontbrekende informatie daarover houdt afronding tegen.</p>" +
          Object.entries({
            cost: "Directe kosten",
            human: "Menselijke controle en herstel",
            latency: "Doorlooptijd",
            environment: "Milieubelasting",
            autonomy: "Autonomie en afhankelijkheid",
          })
            .map(([k, v]) => field("intake.critical." + k, v, { check: true }))
            .join(""),
      )
    );
  }
  function testingPage(n) {
    if (!a.candidates.length) return candEmpty();
    const c = a.candidates[ci],
      p = "candidates." + ci + ".",
      v = E.analysis(a, c);
    if (n === 0)
      return (
        title(
          "Wanneer is een resultaat goed genoeg?",
          "Leg dit samen met iemand die de taak goed kent vast, voordat je resultaten gaat beoordelen.",
        ) +
        a.design.criteria
          .map(
            (x, j) =>
              '<section class="guide-rule"><h2>Afspraak ' +
              (j + 1) +
              "</h2>" +
              group([
                field(
                  "design.criteria." + j + ".criterion",
                  "Waar let je op?",
                  {
                    lock: true,
                    placeholder:
                      "Bijvoorbeeld: het antwoord komt overeen met het geldende beleid",
                  },
                ),
                field(
                  "design.criteria." + j + ".minimum",
                  "Wanneer voldoet het resultaat?",
                  {
                    lock: true,
                    hint: "Maak de afspraak zo concreet dat twee beoordelaars hetzelfde oordeel kunnen geven.",
                  },
                ),
                field(
                  "design.criteria." + j + ".method",
                  "Hoe controleer je dat?",
                  { lock: true },
                ),
                field(
                  "design.criteria." + j + ".critical",
                  "Is een schending hiervan een kritieke fout?",
                  { options: ["Ja", "Nee"], lock: true },
                ),
              ]) +
              fold(
                "Toelichting bij deze afspraak",
                field(
                  "design.criteria." + j + ".evidence",
                  "Onderbouwing van de afspraak",
                  { lock: true, area: true },
                ),
              ) +
              "</section>",
          )
          .join("") +
        btn(
          "add-criterion",
          "+ Een andere kwaliteitseis toevoegen",
          "",
          a.runs.length ? "disabled" : "",
        ) +
        group([
          field(
            "design.criticalDefinition",
            "Welke fout is zo ernstig dat je die als kritiek telt?",
            {
              area: true,
              lock: true,
              hint: "Beschrijf de fout en de gevolgen. Ook een kritieke fout die later is hersteld, blijft meetellen.",
            },
          ),
        ])
      );
    if (n === 1)
      return (
        title(
          "Hoe ga je de opties uitproberen?",
          "Gebruik dezelfde taakafspraken voor de opties. Neem gewone én lastige situaties mee.",
        ) +
        group([
          field("design.assessor", "Wie beoordeelt de resultaten?", {
            lock: true,
          }),
          field(
            "design.maxRetries",
            "Hoe vaak mag je een taak opnieuw proberen?",
            {
              type: "number",
              lock: true,
              hint: "Startwaarde uit de bron: 2 herpogingen. Alle pogingen tellen samen als één testgeval.",
            },
          ),
        ]) +
        a.design.strata
          .map(
            (x, j) =>
              '<section class="guide-rule"><h2>Situatie of groep ' +
              (j + 1) +
              "</h2>" +
              group([
                field(
                  "design.strata." + j + ".name",
                  "Welke situatie of groep moet je meenemen?",
                  {
                    lock: true,
                    placeholder:
                      "Bijvoorbeeld: een vraag waarvoor de documenten geen antwoord bevatten",
                  },
                ),
                field(
                  "design.strata." + j + ".reason",
                  "Waarom is deze situatie relevant?",
                  { lock: true },
                ),
                field(
                  "design.strata." + j + ".target",
                  "Hoeveel verschillende testgevallen per optie?",
                  { type: "number", lock: true },
                ),
                field(
                  "design.strata." + j + ".required",
                  "Moet deze situatie in de test vertegenwoordigd zijn?",
                  { options: ["Ja", "Nee"], lock: true },
                ),
              ]) +
              fold(
                "Notitie over de gekozen situaties",
                field("design.strata." + j + ".note", "Toelichting", {
                  area: true,
                  lock: true,
                }),
              ) +
              "</section>",
          )
          .join("") +
        btn(
          "add-stratum",
          "+ Situatie of groep toevoegen",
          "",
          a.runs.length ? "disabled" : "",
        ) +
        group([
          field(
            "design.doubleReview",
            "Worden resultaten blind of door twee mensen beoordeeld?",
            { options: ["Ja", "Nee", "Gedeeltelijk", "N.v.t."], lock: true },
          ),
          field(
            "design.reliability",
            "Hoe zorg je dat de beoordelingen betrouwbaar zijn?",
            {
              area: true,
              lock: true,
              hint: "Beschrijf bijvoorbeeld hoe beoordelaars de afspraken toepassen en meningsverschillen bespreken.",
            },
          ),
        ]) +
        (a.runs.length
          ? hint(
              "Deze testafspraken staan vast",
              "Voor andere afspraken maak je een nieuwe beoordelingsversie. Zo blijft het eerdere bewijs herleidbaar.",
            )
          : "")
      );
    if (n === 2) return norms();
    if (n === 3) {
      const ready = ["PASS", "CONDITIONAL"].includes(v.gate1);
      if (!ready)
        return (
          title(
            "Eerst vaststellen of je deze optie mag testen",
            "Een test kan een bezwaar tegen de inzet niet opheffen.",
          ) +
          candidateTabs() +
          hint(
            label(v.gate1),
            v.gate1 === "FAIL"
              ? "Deze optie is uitgesloten. Onderzoek andere opties of leg vast dat je hiervan afziet."
              : "Er ontbreken nog beoordelingen of bewijsstukken bij ‘Mag dit?’.",
          ) +
          linkStep(2, 0, "Naar de vragen over toelaatbaarheid") +
          linkStep(5, 0, "Afzien of uitstel vastleggen")
        );
      if (!E.designReady(a) || !E.text(a.intake.thresholdReason))
        return (
          title(
            "Maak eerst de testafspraken af",
            "Dan kun je resultaten op een vaste en controleerbare manier vastleggen.",
          ) +
          candidateTabs() +
          hint(
            "Nog nodig vóór de eerste test",
            "Vul de kwaliteitseisen, kritieke fouten, testafspraken en de motivering van de eisen in.",
          ) +
          linkStep(3, 0, "Kwaliteitseisen bekijken") +
          linkStep(3, 1, "Testafspraken bekijken") +
          linkStep(3, 2, "Eisen en bewijs bekijken")
        );
      return (
        title(
          "Leg de testresultaten vast",
          "Eén testgeval bevat alle pogingen om één taak uit te voeren. Ook mislukte pogingen en herstelwerk horen erbij.",
        ) +
        candidateTabs() +
        capture(c)
      );
    }
    return (
      title(
        "Wat laten de tests zien?",
        "Een goede eerste indruk is iets anders dan voldoende bewijs. De tool houdt die twee uitkomsten uit elkaar.",
      ) +
      candidateTabs() +
      hint(testMeaning(v)[0], testMeaning(v)[1]) +
      '<div class="guide-results"><div><strong>' +
      v.n +
      "</strong><span>testgevallen</span></div><div><strong>" +
      v.accepted +
      "</strong><span>geaccepteerde resultaten</span></div><div><strong>" +
      v.critical +
      "</strong><span>met een kritieke fout</span></div></div>" +
      (v.n
        ? group([
            field(
              p + "coverage",
              "Zijn de relevante situaties en groepen voldoende getest?",
              { options: ["Ja", "Nee"] },
            ),
            field(p + "coverageNote", "Waaruit blijkt dat?", { area: true }),
            field(
              p + "rubric",
              "Zijn de resultaten voldoende betrouwbaar beoordeeld?",
              { options: ["Ja", "Nee"] },
            ),
            field(p + "rubricNote", "Hoe is dat gecontroleerd?", {
              area: true,
            }),
          ])
        : linkStep(3, 3, "Testresultaten vastleggen")) +
      fold(
        "Berekeningen en statistische onzekerheid",
        "<p>Waargenomen succes: " +
          fmt(v.success, true) +
          ". Kritieke fouten: " +
          fmt(v.criticalRate, true) +
          ".</p><p>Wilson-ondergrens succes: " +
          fmt(v.lcb, true) +
          ". Wilson-bovengrens kritieke fouten: " +
          fmt(v.ucb, true) +
          ". Benodigde bewijsbodem: " +
          (v.floor ?? "ongeldig") +
          " testgevallen.</p>",
      ) +
      (v.issues.length
        ? fold(
            "Testgegevens die aandacht nodig hebben",
            "<ul>" +
              v.issues
                .slice(0, 40)
                .map((x) => "<li>" + esc(x) + "</li>")
                .join("") +
              "</ul>",
          )
        : "") +
      fold(
        "Kosten, menswerk en andere lasten per goed resultaat",
        measureTable(v) +
          "<p>Alle pogingen, controle en herstel tellen mee, ook wanneer een taak uiteindelijk niet lukt. Een ontbrekende meting blijft onbekend.</p>",
      ) +
      environmentEditor(c)
    );
  }
  function testMeaning(v) {
    const descriptions = {
      PASS: [
        "Deze optie voldoet aan de geschiktheidseisen",
        "Je kunt nu de waarde en lasten afwegen. Dit zegt nog niet dat deze optie ook de beste keuze is.",
      ],
      "MORE EVIDENCE": [
        "De eerste resultaten voldoen; er is nog meer bewijs nodig",
        "Het aantal testgevallen of de statistische zekerheid is nog onvoldoende voor een volledige beoordeling. Een begrensde pilot onder voorwaarden kan wel een vervolgstap zijn.",
      ],
      FAIL: [
        "Deze optie haalt de afgesproken eisen niet",
        "Meer gunstige kosten of andere voordelen kunnen deze uitkomst niet compenseren.",
      ],
      "NO TEST DATA": [
        "Er zijn nog geen testresultaten",
        "Registreer eerst wat er gebeurt bij het uitvoeren van de taak.",
      ],
      "NOT ELIGIBLE": [
        "Beoordeel eerst of deze optie gebruikt mag worden",
        "De beoordeling bij ‘Mag dit?’ is negatief of nog niet compleet.",
      ],
      "INCOMPLETE DATA": [
        "Controleer de testgegevens",
        "Er ontbreken uitkomsten of er zijn ongeldige gegevens. Die worden niet als een geslaagd resultaat geteld.",
      ],
      "COVERAGE HOLD": [
        "Bevestig of de test de praktijk voldoende afdekt",
        "Beoordeel of de relevante situaties en groepen voldoende zijn vertegenwoordigd.",
      ],
      "RUBRIC HOLD": [
        "Bevestig of de beoordeling betrouwbaar is",
        "Leg uit hoe is gecontroleerd dat de kwaliteitseisen consequent zijn toegepast.",
      ],
    };
    return (
      descriptions[v.gate2] || [
        label(v.gate2),
        "Bekijk de openstaande informatie.",
      ]
    );
  }
  function capture(c) {
    restoreRunDraft();
    const rows = a.runs
        .map((r, index) => ({ ...r, index }))
        .filter((r) => r.candidate === c.id),
      pageRows = rows.slice(runPage * 25, (runPage + 1) * 25);
    return (
      '<details id="run-editor" ' +
      (editRun >= 0 || a.pendingRuns?.[c.id] ? "open" : "") +
      "><summary>" +
      (editRun >= 0 ? "Testgeval corrigeren" : "Eén testgeval toevoegen") +
      '</summary><p class="small">Je invoer wordt als concept bewaard. Klik op ‘Testgeval bewaren’ om de gegevens te controleren en aan de berekening toe te voegen.</p><form id="run-form"><div id="run-error" role="alert"></div>' +
      group([
        field("@testCase", "Naam of kenmerk van het testgeval", {
          placeholder: "Bijvoorbeeld: vraag over verlof bij ziekte",
        }),
        field("@stratum", "Bij welke situatie of groep hoort dit?", {
          options: a.design.strata
            .filter((s) => E.text(s.name))
            .map((s) => [s.id, s.name]),
        }),
        field("@accepted", "Is het uiteindelijke resultaat goedgekeurd?", {
          options: [
            [1, "Ja"],
            [0, "Nee"],
          ],
        }),
        field(
          "@critical",
          "Ging er tijdens een van de pogingen iets kritiek mis?",
          {
            options: [
              [1, "Ja"],
              [0, "Nee"],
            ],
            hint: "Een kritieke fout blijft meetellen, ook als je die later herstelt.",
          },
        ),
        field("@calls", "Hoe vaak is een AI-model aangeroepen?", {
          type: "number",
          hint:
            c.type === "Niet-AI-baseline"
              ? "Vul 0 in bij een volledig handmatige werkwijze."
              : "Tel alle aanroepen voor alle pogingen op.",
        }),
        field("@retries", "Hoe vaak is opnieuw geprobeerd?", {
          type: "number",
        }),
        field("@verify", "Totale tijd voor controleren (minuten)", {
          type: "number",
        }),
        field(
          "@correct",
          "Totale tijd voor corrigeren en herstellen (minuten)",
          { type: "number" },
        ),
        field("@cost", "Directe kosten van alle pogingen samen (€)", {
          type: "number",
          hint: "Onbekend? Laat leeg. Vul alleen 0 in als de kosten echt nul zijn.",
        }),
      ]) +
      fold(
        "Doorlooptijd vastleggen",
        field("@latency", "Totale doorlooptijd (seconden)", { type: "number" }),
      ) +
      sourcePicker(
        "@evidence",
        "Waar zijn dit testresultaat en de metingen vastgelegd?",
      ) +
      fold(
        "Milieumetingen en aanvullende gegevens",
        "<p>Vul alleen onderbouwde metingen in. Tokengebruik, modelgrootte en prijs zijn geen maat voor energieverbruik.</p>" +
          group(
            [
              ["energy", "Energie (kWh)"],
              ["carbon", "Uitstoot (g CO₂e)"],
              ["water", "Water (liter)"],
              ["inputTokens", "Inputtokens"],
              ["outputTokens", "Outputtokens"],
              ["reasoningTokens", "Reasoningtokens"],
              ["quality", "Optionele kwaliteitsscore"],
            ].map(([k, h]) => field("@" + k, h, { type: "number" })),
          ),
      ) +
      field("@notes", "Toelichting bij dit testgeval", { area: true }) +
      '<div class="actions"><button type="submit" class="primary">Testgeval bewaren</button>' +
      (editRun >= 0 ? btn("cancel-run", "Annuleren") : "") +
      "</div></form></details>" +
      fold(
        "Veel testresultaten tegelijk inlezen (CSV)",
        '<p>Gebruik de kolommen uit het Excelinstrument. Het bestand moet één regel bevatten per optie en testgeval, met alle pogingen samen.</p><label class="field checkbox"><input type="checkbox" id="csv-confirm" ' +
          (importConfirmed ? "checked" : "") +
          '><span>Deze resultaten horen bij de huidige testafspraken en vastgelegde werkwijzen.</span></label><div class="actions">' +
          btn("csv-template", "Voorbeeldkolommen downloaden") +
          btn("csv-import", "CSV-bestand inlezen") +
          btn("csv-export", "Testresultaten downloaden") +
          "</div>",
      ) +
      (rows.length
        ? "<h2>" +
          rows.length +
          " testgevallen voor " +
          esc(c.name || c.id) +
          '</h2><div class="table-wrap"><table><thead><tr><th>Testgeval</th><th>Goedgekeurd</th><th>Kritieke fout</th><th></th></tr></thead><tbody>' +
          pageRows
            .map(
              (r) =>
                "<tr><td>" +
                esc(r.testCase) +
                "</td><td>" +
                ({ 0: "Nee", 1: "Ja" }[r.accepted] || "Onbekend") +
                "</td><td>" +
                ({ 0: "Nee", 1: "Ja" }[r.critical] || "Onbekend") +
                "</td><td>" +
                btn(
                  "edit-run",
                  "Wijzigen",
                  "",
                  "data-index='" + r.index + "'",
                ) +
                "</td></tr>",
            )
            .join("") +
          '</tbody></table></div><div class="actions">' +
          btn(
            "run-prev",
            "← Vorige pagina",
            "",
            runPage === 0 ? "disabled" : "",
          ) +
          "<span>Pagina " +
          (runPage + 1) +
          "</span>" +
          btn(
            "run-next",
            "Volgende pagina →",
            "",
            (runPage + 1) * 25 >= rows.length ? "disabled" : "",
          ) +
          "</div>"
        : '<p class="small muted">Nog geen resultaten voor deze optie vastgelegd.</p>')
    );
  }
  function comparisonOverview() {
    return (
      '<div class="option-overview">' +
      a.candidates
        .map((c, j) => {
          const v = E.analysis(a, c),
            fail = v.gate1 === "FAIL" || v.gate2 === "FAIL";
          return (
            "<section><h2>" +
            esc(c.name || "Naam ontbreekt") +
            "</h2><p>" +
            esc(
              v.gate1 === "FAIL"
                ? "Uitgesloten bij toelaatbaarheid"
                : v.gate2 === "PASS"
                  ? "Voldoende geschikt — de afweging kan verder"
                  : testMeaning(v)[0],
            ) +
            "</p>" +
            btn(
              "g-option-step",
              v.gate2 === "PASS"
                ? "Bekijk de lasten"
                : fail
                  ? "Bekijk de reden"
                  : "Bekijk wat nodig is",
              "",
              "data-index='" +
                j +
                "' data-step='" +
                (v.gate2 === "PASS"
                  ? 4
                  : ["PASS", "CONDITIONAL"].includes(v.gate1)
                    ? 3
                    : 2) +
                "'",
            ) +
            "</section>"
          );
        })
        .join("") +
      "</div>"
    );
  }
  function comparePage(n) {
    if (!a.candidates.length) return candEmpty();
    const c = a.candidates[ci],
      p = "candidates." + ci + ".",
      s = state(),
      v = E.analysis(a, c);
    if (n === 0)
      return (
        title(
          "Welke opties kunnen verder?",
          "Vergelijk de waarde en lasten van de opties die mogen worden gebruikt én voldoende geschikt zijn.",
        ) +
        comparisonOverview() +
        hint(
          "Nog geen volledige afweging mogelijk?",
          "Je kunt ook een beperkte pilot, aanvullend onderzoek of afzien van inzet vastleggen. Dat is een geldige vervolgstap.",
        ) +
        linkStep(5, 0, "Een vervolgstap of besluit vastleggen")
      );
    if (n === 1)
      return (
        title(
          "Wat levert de ene optie extra op?",
          "Vergelijk twee geschikte opties op dezelfde taak. De tool berekent verschillen; jij onderbouwt wat die voor het doel betekenen.",
        ) +
        a.pairs.map((pair, j) => friendlyPair(pair, j)).join("") +
        (a.candidates.filter((x) => E.analysis(a, x).gate2 === "PASS").length >=
        2
          ? btn("add-pair", "+ Twee opties naast elkaar zetten", "primary")
          : hint(
              "Er zijn nog geen twee voldoende geschikte opties",
              "Een open beoordeling is geen afwijzing. Leg bij een pilot de voorlopige afweging en de beperkingen vast in het besluit.",
            ))
      );
    if (n === 2) {
      const questions = [
          [
            "autonomy",
            "Kun je onafhankelijk blijven werken en later overstappen?",
            "Beschrijf afhankelijkheden van leveranciers, toegang tot gegevens en de mogelijkheid om te stoppen of te wisselen.",
          ],
          [
            "correction",
            "Kunnen mensen fouten corrigeren en ingrijpen?",
            "Denk aan terugdraaien, incidenten behandelen en doorgaan zonder deze oplossing.",
          ],
          [
            "inclusion",
            "Wie profiteert, en wie draagt de lasten?",
            "Beschrijf toegankelijkheid, mogelijke uitsluiting en verschillen tussen groepen.",
          ],
          [
            "implementation",
            "Wat vraagt invoering en onderhoud van de organisatie?",
            "Denk aan inrichting, opleiding, beheer en blijvende menselijke inzet.",
          ],
          [
            "other",
            "Welke andere waarde of gevolgen zijn voor deze taak relevant?",
            "Benoem wat de cijfers nog niet laten zien, of leg uit waarom er geen andere relevante gevolgen zijn.",
          ],
        ],
        q = questions[s.context];
      return (
        title(
          "Wat verandert er in de praktijk?",
          "Kosten en testresultaten laten niet alle gevolgen zien. Neem ook de mensen en de organisatie mee.",
        ) +
        candidateTabs() +
        '<p class="eyebrow">Onderwerp ' +
        (s.context + 1) +
        " van 5</p>" +
        field(p + "context." + q[0], q[1], { area: true, hint: q[2] }) +
        sourcePicker(
          p + "context.evidence",
          "Welke bronnen onderbouwen deze gevolgen?",
        ) +
        '<div class="actions between">' +
        btn(
          "g-context-prev",
          "← Vorig onderwerp",
          "",
          s.context === 0 ? "disabled" : "",
        ) +
        btn(
          "g-context-next",
          s.context === 4 ? "Naar je afweging →" : "Volgend onderwerp →",
          "primary",
        ) +
        "</div>"
      );
    }
    return (
      title(
        "Rechtvaardigt de waarde de lasten?",
        "Er hoeft geen duidelijke winnaar te zijn. Ook meerdere passende opties of nog geen oordeel zijn mogelijke uitkomsten.",
      ) +
      candidateTabs() +
      (v.gate2 === "PASS"
        ? group([
            field(
              p + "context.complete",
              "Is de belangrijke informatie over deze gevolgen compleet?",
              {
                options: ["Ja", "Nee"],
                hint: "Een 'ja' vervangt de onderbouwing en bronnen bij de vorige onderwerpen niet.",
              },
            ),
            field(
              p + "frontier",
              "Is een andere optie op geen relevant punt slechter, en op minstens één punt beter?",
              {
                options: [
                  [
                    "DOMINATED",
                    "Ja, deze optie wordt door een andere overtroffen",
                  ],
                  ["FRONTIER", "Nee, dat is voor deze optie niet het geval"],
                  ["UNDETERMINED", "Dat kunnen we nog niet vaststellen"],
                ],
                hint: "Vergelijk alleen onderbouwde en vergelijkbare gevolgen. Kleine verschillen zijn niet automatisch betekenisvol.",
              },
            ),
            field(p + "proportionality", "Wat is je oordeel voor deze optie?", {
              options: props,
            }),
            field(
              p + "reason",
              "Waarom is dit voor deze taak een verdedigbaar oordeel?",
              { area: true },
            ),
          ])
        : hint("Eerst meer duidelijkheid nodig", testMeaning(v)[1])) +
      fold("Gemeten lasten van deze optie", measureTable(v)) +
      environmentEditor(c)
    );
  }
  function friendlyPair(pair, j) {
    const pre = "pairs." + j + ".",
      eligible = a.candidates
        .filter((c) => E.analysis(a, c).gate2 === "PASS")
        .map((c) => [c.id, c.name || c.id]),
      r = E.pairwise(a, pair);
    const an =
        a.candidates.find((c) => c.id === pair.a)?.name || "Eerste optie",
      bn = a.candidates.find((c) => c.id === pair.b)?.name || "Tweede optie";
    return panel(
      "Vergelijking " + (j + 1),
      group([
        field(pre + "a", "Welke optie onderzoek je?", { options: eligible }),
        field(pre + "b", "Waarmee vergelijk je die?", { options: eligible }),
        field(
          pre + "comparable",
          "Zijn taak, testgevallen en metingen vergelijkbaar?",
          { options: ["Ja", "Nee"] },
        ),
      ]) +
        (r.allowed
          ? '<p>De bedragen en tijden hieronder gaan over één goedgekeurd resultaat. Alle pogingen, controles en herstel zijn meegerekend.</p><div class="table-wrap"><table><thead><tr><th>Last</th><th>' +
            esc(an) +
            "</th><th>" +
            esc(bn) +
            "</th><th>Verschil</th></tr></thead><tbody>" +
            r.rows
              .filter((x) => !["lcb", "ucb"].includes(x.key))
              .map(
                (x) =>
                  "<tr><td>" +
                  esc(x.label) +
                  "</td><td>" +
                  fmt(x.a) +
                  "</td><td>" +
                  fmt(x.b) +
                  "</td><td>" +
                  (x.comparable
                    ? x.delta === 0
                      ? "Gelijk"
                      : fmt(Math.abs(x.delta)) +
                        (x.delta > 0 ? " meer" : " minder")
                    : "Niet vergelijkbaar") +
                  "</td></tr>",
              )
              .join("") +
            "</tbody></table></div>"
          : hint("Vergelijking nog niet mogelijk", r.note)) +
        group([
          field(
            pre + "rationale",
            "Wat weegt voor jouw taak op tegen welke lasten?",
            {
              area: true,
              hint: "Verwijs naar de aangetoonde verschillen. Leg ook vast wanneer er geen overtuigende voorkeur is.",
            },
          ),
          field(
            pre + "limits",
            "Wat kunnen we op basis van deze vergelijking nog niet zeggen?",
            { area: true },
          ),
        ]) +
        sourcePicker(pre + "evidence") +
        fold(
          "Milieugegevens en statistische details",
          field(
            pre + "environmentComparable",
            "Zijn de grenzen van de milieumetingen onderling vergelijkbaar?",
            { options: ["Ja", "Nee", "N.v.t."] },
          ) +
            "<p>Ontbrekende milieugegevens blijven onbekend. Er wordt geen duurzaamheidsconclusie uit prijs, modelgrootte of tokens afgeleid.</p>" +
            (r.allowed
              ? "<p>" +
                r.rows
                  .filter((x) => ["lcb", "ucb"].includes(x.key))
                  .map(
                    (x) =>
                      esc(x.label) +
                      ": " +
                      fmt(x.a, true) +
                      " tegenover " +
                      fmt(x.b, true),
                  )
                  .join("<br>") +
                "</p>"
              : ""),
        ),
    );
  }

  function decisionStatus(r) {
    if (r.recordComplete && a.decision.outcome === "NO-GO")
      return "Afzien van inzet is onderbouwd vastgelegd";
    if (r.recordComplete && a.decision.outcome === "Uitgesteld besluit")
      return "Het uitgestelde besluit is onderbouwd vastgelegd";
    return (
      {
        DRAFT: "Je afweging is nog in voorbereiding",
        HOLD: "Dit besluit vraagt nog aanvulling",
        "DECISION-READY": "De onderbouwing is gereed voor een besluit",
        "PILOT-READY": "Gereed voor een begrensde pilot",
        "PILOT WITH CONDITIONS": "Alleen een pilot onder voorwaarden",
      }[r.status] || label(r.status)
    );
  }
  function decisionView(n) {
    const r = E.readiness(a),
      d = a.decision,
      route = E.activeRoute(a),
      noChoice = ["NO-GO", "Uitgesteld besluit"].includes(d.outcome);
    if (n === 0)
      return (
        title(
          "Welke vervolgstap is verantwoord?",
          "Je kunt kiezen voor een optie, meerdere opties, afzien van inzet of eerst meer uitzoeken.",
        ) +
        comparisonOverview() +
        field("decision.outcome", "Wat wil je vastleggen?", {
          options: [
            ["Eén optie", "Eén optie kiezen"],
            ["Meerdere opties", "Meerdere opties openhouden"],
            ["NO-GO", "Afzien van de voorgenomen inzet"],
            ["Uitgesteld besluit", "Het besluit uitstellen"],
          ],
        }) +
        (!noChoice && d.outcome
          ? '<fieldset class="choice-group"><legend>Welke optie of opties horen bij je keuze?</legend>' +
            a.candidates
              .map(
                (c) =>
                  '<label class="choice"><input type="checkbox" data-selection="' +
                  esc(c.id) +
                  '" ' +
                  (d.selected.includes(c.id) ? "checked" : "") +
                  "><span><strong>" +
                  esc(c.name || c.id) +
                  "</strong><small>" +
                  esc(testMeaning(E.analysis(a, c))[0]) +
                  "</small></span></label>",
              )
              .join("") +
            "</fieldset>"
          : "") +
        field("decision.rationale", "Waarom is dit nu de juiste vervolgstap?", {
          area: true,
          hint: "Ook ‘eerst meer bewijs verzamelen’ kan een onderbouwde keuze zijn.",
        }) +
        fold(
          "Wat wilde je met deze afweging besluiten?",
          field("intake.scope", "Doel van deze beoordeling", {
            options: scopeOptions,
          }),
        )
      );
    if (n === 1)
      return (
        title(
          "Waarop baseer je de keuze?",
          "Gebruik de resultaten uit de vorige stappen. Beschrijf kort welke voordelen en lasten voor het doel doorslaggevend zijn.",
        ) +
        fold(
          "Je eerdere afwegingen teruglezen",
          a.pairs
            .map(
              (p) =>
                "<p>" +
                esc(p.rationale || "Vergelijking nog niet onderbouwd") +
                "</p>",
            )
            .join("") +
            a.candidates
              .map(
                (c) =>
                  "<p><strong>" +
                  esc(c.name) +
                  "</strong>: " +
                  esc(c.reason || "Nog geen oordeel vastgelegd") +
                  "</p>",
              )
              .join(""),
        ) +
        group([
          field(
            "decision.value",
            "Welke waarde of voordelen zijn aangetoond?",
            { area: true },
          ),
          field(
            "decision.burdens",
            "Welke lasten en risico's horen daarbij, en voor wie?",
            { area: true },
          ),
          field(
            "decision.alternatives",
            "Waarom is dit verdedigbaar tegenover de andere opties?",
            {
              area: true,
              hint: "Neem de huidige werkwijze zonder AI expliciet mee.",
            },
          ),
        ])
      );
    if (n === 2)
      return (
        title(
          "Waar liggen de grenzen?",
          "Maak duidelijk wat nog onzeker is en wanneer mensen moeten ingrijpen.",
        ) +
        group([
          field(
            "decision.uncertainty",
            "Wat weten we nog niet of onvoldoende?",
            {
              area: true,
              hint: "Bij een beperkte proef of gedeeltelijke afweging: benoem welke conclusies je nog niet kunt trekken.",
            },
          ),
          field(
            "decision.conditions",
            "Onder welke voorwaarden mag de vervolgstap plaatsvinden?",
            {
              area: true,
              hint: "Maak de grenzen concreet: wie, waarvoor, onder welke controle en hoe lang?",
            },
          ),
          field(
            "decision.stopRecovery",
            "Wanneer stop je, wie grijpt in en hoe herstel je?",
            { area: true },
          ),
        ]) +
        (["Verkenning", "Gecontroleerde pilot"].includes(a.intake.scope)
          ? hint(
              "Dit blijft een begrensde proef",
              "Een positieve pilotuitkomst is geen toestemming voor bredere inzet. Daarvoor is een nieuwe, voldoende onderbouwde afweging nodig.",
            )
          : "")
      );
    if (n === 3)
      return (
        title(
          "Wie neemt verantwoordelijkheid?",
          "Leg vast wie besluit en wanneer de afweging opnieuw bekeken moet worden.",
        ) +
        group([
          field("intake.owner", "Wie is verantwoordelijk voor het besluit?"),
          field("intake.date", "Datum van het besluit", { type: "date" }),
          field(
            "intake.validDays",
            "Na hoeveel dagen moet dit opnieuw worden beoordeeld?",
            {
              type: "number",
              hint: "Startwaarde uit de bron: 180 dagen. Pas dit aan de situatie aan.",
            },
          ),
          field(
            "intake.triggers",
            "Welke veranderingen vragen eerder om een nieuwe beoordeling?",
            { area: true },
          ),
          field(
            "decision.reviewer",
            ["R3", "R4"].includes(route)
              ? "Wie heeft onafhankelijk meegekeken?"
              : "Wie kijkt mee? (aanbevolen bij de standaardroute)",
          ),
          ...(["R3", "R4"].includes(route)
            ? [
                field(
                  "decision.reviewEvidence",
                  "Wat is de uitkomst van de onafhankelijke en multidisciplinaire toets?",
                  {
                    area: true,
                    hint: "Verwijs naar de vastgelegde beoordeling.",
                  },
                ),
              ]
            : []),
          ...(route === "R4"
            ? [
                field(
                  "decision.formalReview",
                  "Welke aanvullende formele toetsen zijn uitgevoerd en wat was de uitkomst?",
                  {
                    area: true,
                    hint: "Deze toetsen vinden buiten PAM-AI plaats. Leg de uitkomsten en bewijsverwijzingen vast.",
                  },
                ),
              ]
            : []),
        ]) +
        hint(
          "Geplande herbeoordeling",
          E.reviewDate(a) ||
            "Vul een geldige besluitdatum en geldigheidsduur in.",
        )
      );
    return (
      title(
        "Je afweging op één plek",
        "Controleer het overzicht. Bewaar een versie om vast te leggen wat op dit moment bekend is.",
      ) +
      hint(decisionStatus(r), r.note) +
      (r.issues.length
        ? '<section class="guide-next"><h2>Eerstvolgende open punt</h2><p>' +
          esc(r.issues[0]) +
          "</p>" +
          fold(
            "Alle open punten bekijken (" + r.issues.length + ")",
            "<ul>" +
              r.issues.map((x) => "<li>" + esc(x) + "</li>").join("") +
              "</ul>",
          ) +
          "</section>"
        : "") +
      '<div class="actions no-print">' +
      btn("record", "Deze stand vastleggen", "primary") +
      btn("print", "Overzicht afdrukken / PDF") +
      btn("export", "Bestand bewaren") +
      '</div><p class="small muted no-print">Een onvolledige beoordeling wordt als concept of aangehouden besluit vastgelegd, niet als goedkeuring.</p>' +
      report() +
      fold(
        "Eerder vastgelegde standen (" + a.history.length + ")",
        a.history.length
          ? a.history
              .map(
                (h) =>
                  "<p>" +
                  esc(new Date(h.at).toLocaleString("nl-NL")) +
                  " · " +
                  esc(decisionStatus({ status: h.status })) +
                  "<br>" +
                  esc(h.decision.rationale) +
                  "</p>",
              )
              .join("")
          : "<p>Nog geen stand vastgelegd. Je invoer wordt wel automatisch bewaard.</p>",
      )
    );
  }
  function pageBody() {
    const n = state().pages[a.step];
    return [
      taskPage,
      optionPage,
      permissionPage,
      testingPage,
      comparePage,
      decisionView,
    ][a.step](n);
  }
  function renderGuide(focus = false) {
    const prev = document.activeElement?.id,
      opened = [...document.querySelectorAll("details[open]")].map(
        (d) => d.querySelector("summary")?.textContent,
      );
    const error = storageError
      ? '<div class="callout error">' +
        esc(storageError) +
        btn("raw-export", "Ruwe opslag downloaden") +
        "</div>"
      : "";
    if (!a) {
      $("#app").innerHTML = error + landingView();
      return;
    }
    ci = Math.min(ci, Math.max(0, a.candidates.length - 1));
    const s = state(),
      n = s.pages[a.step],
      body = pageBody();
    $("#app").innerHTML =
      error +
      (a.fictional
        ? '<div class="fictional"><strong>Fictief voorbeeld.</strong> Alle opties, beoordelingen en testgegevens in dit dossier zijn demonstratiegegevens.</div>'
        : "") +
      '<div class="layout guide-layout"><aside><p class="side-label">Jouw afweging</p>' +
      btn("home", "← Alle afwegingen", "text-button") +
      '<nav aria-label="Stappen">' +
      names
        .map(
          (h, i) =>
            '<button data-action="step" data-index="' +
            i +
            '" class="' +
            (a.step === i ? "active" : "") +
            '" ' +
            (a.step === i ? 'aria-current="step"' : "") +
            '><span class="stepnum">' +
            (i + 1) +
            "</span>" +
            esc(h) +
            "</button>",
        )
        .join("") +
      '</nav><p class="side-note">Werk stap voor stap. Een vraag mag openblijven als je het antwoord nog moet uitzoeken.</p><div class="side-actions">' +
      btn("export", "Bestand bewaren") +
      fold(
        "Meer mogelijkheden",
        btn("version", "Nieuwe beoordelingsversie") +
          btn("g-expert", "Alle dossiergegevens"),
      ) +
      "</div></aside>" +
      '<main id="main"><div class="workspacebar"><span>' +
      esc(a.intake.task || "Nieuwe afweging") +
      '</span><span id="save-state">' +
      (storageError ? "Niet bewaard" : "Automatisch bewaard in deze browser") +
      "</span>" +
      btn("export", "Bestand bewaren", "workspace-export") +
      "</div>" +
      '<nav class="chapter-nav no-print" aria-label="Onderdelen van deze stap">' +
      chapters[a.step]
        .map(
          (h, j) =>
            '<button data-action="g-page" data-index="' +
            j +
            '" class="' +
            (n === j ? "active" : "") +
            '" ' +
            (n === j ? 'aria-current="step"' : "") +
            ">" +
            esc(h) +
            "</button>",
        )
        .join("") +
      "</nav>" +
      '<div class="guide-page">' +
      body +
      "</div>" +
      '<div class="actions between guide-bottom no-print">' +
      btn("g-back", a.step === 0 && n === 0 ? "← Alle afwegingen" : "← Terug") +
      ((a.step === 0 && n === 3) || a.step === 2 || (a.step === 4 && n === 2)
        ? "<span></span>"
        : a.step === 5 && n === 4
          ? btn("export", "Bestand bewaren", "primary")
          : btn(
              "g-next",
              n === chapters[a.step].length - 1
                ? a.step === 0
                  ? "Verder: je opties →"
                  : "Verder: " + names[a.step + 1].toLowerCase() + " →"
                : "Verder →",
              "primary",
            )) +
      "</div>" +
      '<p class="guide-save-note no-print">Je kunt hier stoppen. Je invoer blijft op dit apparaat bewaard; met ‘Bestand bewaren’ maak je een reservekopie.</p>' +
      '<div class="mobile-dossier no-print">' +
      fold(
        "Dossier en versies",
        btn("version", "Nieuwe beoordelingsversie") +
          btn("g-expert", "Alle dossiergegevens"),
      ) +
      "</div>" +
      footer() +
      "</main></div>" +
      sourcesModal();
    document.querySelectorAll("details").forEach((d) => {
      if (opened.includes(d.querySelector("summary")?.textContent))
        d.open = true;
    });
    if (proofIndex >= 0 && $("#proof-dialog")) {
      $("#proof-dialog").showModal();
      $("#proof-dialog").addEventListener("cancel", () => {
        proofIndex = -1;
      });
    }
    if (focus) {
      $("#main").setAttribute("tabindex", "-1");
      $("#main").focus();
      window.scrollTo({ top: 0, behavior: "instant" });
    } else if (prev && document.getElementById(prev))
      document.getElementById(prev).focus({ preventScroll: true });
  }
  function go(step, page = 0) {
    a.step = step;
    state().pages[step] = page;
    runDraft = null;
    editRun = -1;
    runPage = 0;
    save();
    render(true);
  }
  function navigate(delta) {
    const s = state(),
      n = s.pages[a.step] + delta;
    if (n < 0) {
      if (a.step === 0) {
        save();
        a = null;
        render(true);
      } else go(a.step - 1, chapters[a.step - 1].length - 1);
    } else if (n >= chapters[a.step].length) go(Math.min(5, a.step + 1), 0);
    else go(a.step, n);
  }
  function addProof(target) {
    if (a.evidence.length >= 500) throw Error("Maximaal 500 bronnen.");
    let id = 1;
    while (a.evidence.some((e) => e.id === "B" + String(id).padStart(2, "0")))
      id++;
    a.evidence.push({
      id: "B" + String(id).padStart(2, "0"),
      source: "",
      type: "",
      owner: "",
      date: E.today(),
      grade: "",
      location: "",
      limitations: "",
      useLimits: "",
    });
    proofIndex = a.evidence.length - 1;
    proofPage = 0;
    proofTarget = target;
    if (target) {
      const draft = target.startsWith("@"),
        obj = draft ? runDraft : a,
        path = draft ? target.slice(1) : target;
      const v = pathGet(obj, path) || "";
      pathSet(
        obj,
        path,
        [v, a.evidence[proofIndex].id].filter(Boolean).join(", "),
      );
    }
    if (target?.startsWith("@")) saveRunDraft();
    else save();
    render();
  }
  document.addEventListener("change", (ev) => {
    const el = ev.target;
    if (!a || !enabled) return;
    if (el.dataset.proof) {
      const path = el.dataset.proof,
        draft = path.startsWith("@"),
        obj = draft ? runDraft : a,
        key = draft ? path.slice(1) : path;
      let ids = String(pathGet(obj, key) || "")
        .split(/[,;\n]+/)
        .map((x) => x.trim())
        .filter(Boolean);
      ids = el.checked
        ? [...new Set([...ids, el.value])]
        : ids.filter((x) => x !== el.value);
      pathSet(obj, key, ids.join(", "));
      if (draft) saveRunDraft();
      else save();
    }
    if (el.type === "radio" && el.dataset.path) {
      pathSet(a, el.dataset.path, el.value);
      save();
      render();
    }
  });
  document.addEventListener("click", (ev) => {
    const el = ev.target.closest("[data-action]");
    if (!el) return;
    const act = el.dataset.action,
      index = Number(el.dataset.index);
    if (!a) return;
    if (enabled && act === "candidate") {
      const candidate = a.candidates[index];
      const first = candidate?.gate.findIndex((g) => !g.status);
      state().gate = first >= 0 ? first : 0;
      save();
      return;
    }
    if (!act.startsWith("g-")) return;
    try {
      const s = state();
      if (act === "g-page") go(a.step, index);
      else if (act === "g-next") navigate(1);
      else if (act === "g-back") navigate(-1);
      else if (act === "g-jump")
        go(Number(el.dataset.step), Number(el.dataset.page));
      else if (act === "g-risk-prev" || act === "g-risk-next") {
        if (act === "g-risk-next" && s.risk === 6) {
          go(0, 4);
          return;
        }
        s.risk = Math.max(
          0,
          Math.min(6, s.risk + (act === "g-risk-next" ? 1 : -1)),
        );
        save();
        render(true);
      } else if (act === "g-gate") {
        s.gate = index;
        save();
        render(true);
      } else if (act === "g-gate-prev" || act === "g-gate-next") {
        if (act === "g-gate-next" && s.gate === 7) {
          const next = a.candidates.findIndex(
            (c, j) =>
              j !== ci &&
              !["PASS", "CONDITIONAL", "FAIL"].includes(E.gate1(a, c)),
          );
          if (next >= 0) {
            ci = next;
            const first = a.candidates[ci].gate.findIndex((g) => !g.status);
            s.gate = first >= 0 ? first : 0;
            save();
            render(true);
            return;
          }
          go(3, 0);
          return;
        }
        s.gate = Math.max(
          0,
          Math.min(7, s.gate + (act === "g-gate-next" ? 1 : -1)),
        );
        save();
        render(true);
      } else if (act === "g-context-prev" || act === "g-context-next") {
        if (act === "g-context-next" && s.context === 4) {
          go(4, 3);
          return;
        }
        s.context = Math.max(
          0,
          Math.min(4, s.context + (act === "g-context-next" ? 1 : -1)),
        );
        save();
        render(true);
      } else if (act === "g-option-step") {
        ci = index;
        const step = Number(el.dataset.step);
        go(step, step === 3 ? 4 : step === 4 ? 3 : 0);
      } else if (act === "g-add-baseline") {
        if (a.candidates.length >= 8) throw Error("Maximaal acht opties.");
        let id = 1;
        while (
          a.candidates.some((c) => c.id === "C" + String(id).padStart(2, "0"))
        )
          id++;
        const c = E.newCandidate("C" + String(id).padStart(2, "0"));
        c.name = "Huidige werkwijze";
        c.type = "Niet-AI-baseline";
        c.settings = a.intake.baseline;
        a.candidates.push(c);
        ci = a.candidates.length - 1;
        save();
        render();
      } else if (act === "g-add-proof") addProof(el.dataset.target);
      else if (act === "g-edit-proof") {
        proofIndex = index;
        proofPage = 0;
        render();
      } else if (act === "g-proof-next") {
        proofPage = 1;
        render();
      } else if (act === "g-proof-prev") {
        proofPage = 0;
        render();
      } else if (act === "g-close-proof") {
        proofIndex = -1;
        proofTarget = "";
        save();
        render();
      } else if (act === "g-expert") {
        enabled = false;
        try {
          localStorage.setItem("pam-ai-view", "all");
        } catch {}
        save();
        render(true);
      } else if (act === "g-guided") {
        enabled = true;
        try {
          localStorage.setItem("pam-ai-view", "guided");
        } catch {}
        save();
        render(true);
      }
    } catch (e) {
      notice(e.message);
    }
  });
  return {
    active: () => enabled,
    render: renderGuide,
    sourcePicker,
    landing: landingView,
    beforePrint: () => {
      state().pages[5] = 4;
    },
    reset: () => {
      proofIndex = -1;
    },
  };
})();
