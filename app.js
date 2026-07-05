/* kies·ai v1.1 — didactische UI-laag. Besliskennis blijft in engine.js. */
(function () {
  const E = window.ENGINE;
  const R = window.MODEL_REGISTRY;
  const $ = (sel) => document.querySelector(sel);
  const regErrors = E.validateRegistry(R);

  const state = { started: false, domain: null, capability: null, answers: {} };

  const EXAMPLES = {
    brainstorm: { label: "Eenvoudige brainstorm", domain: "communicatie", capability: "brainstormen", answers: { data: "openbaar", stakes: "verkenning" } },
    student: { label: "Studentfeedback met persoonsgegevens", domain: "onderwijs", capability: "feedback-op-werk", answers: { data: "persoonsgegevens", stakes: "personen" } },
    bronnen: { label: "Bestuursnotitie met bronvereiste", domain: "bestuur", capability: "beleid-schrijven", answers: { data: "intern", stakes: "besluit", bronnen: "ja" } },
    interview: { label: "Transcriptie van interviews", domain: "onderzoek", capability: "transcriberen", answers: { data: "bijzonder", stakes: "verkenning", schaal: "eenmalig" } },
    workflow: { label: "Structurele workflowautomatisering", domain: "administratie", capability: "workflow-automatiseren", answers: { data: "intern", stakes: "besluit", schaal: "structureel" } }
  };

  const QUESTION_GUIDANCE = {
    data: {
      step: "Gegevens en privacy",
      implication: "Je antwoord bepaalt waar gegevens mogen worden verwerkt en welke contractuele waarborgen nodig zijn.",
      impact: "Modellen met een ongeschikte verwerkingslocatie of zonder passende overeenkomst vallen af.",
      warning: "Twijfel je of dit persoonsgegevens zijn? Kies de strengere optie of vraag privacyadvies.",
      reflection: "Persoonsgegevens veranderen de selectie."
    },
    stakes: {
      step: "Impact en menselijk toezicht",
      implication: "Hoe groter de impact op mensen of publieke besluiten, hoe zwaarder de eisen aan toezicht en uitlegbaarheid.",
      impact: "Bij besluiten over personen blijven alleen voldoende controleerbare opties over; AI mag niet zelf beslissen.",
      warning: "Twijfel je of dit een besluit over personen raakt? Kies de strengste optie of escaleer.",
      reflection: "Bij besluiten over personen adviseert AI; de mens beslist."
    },
    bronnen: {
      step: "Bronherleidbaarheid",
      implication: "Bronherleidbaarheid betekent dat iedere relevante bewering terug te voeren is op een concrete, controleerbare bron.",
      impact: "Als dit een harde eis is, vallen modellen zonder bronkoppeling af — ook als ze overtuigend schrijven.",
      reflection: "Een overtuigend antwoord is nog geen controleerbaar antwoord."
    },
    beeld: {
      step: "Soort invoer",
      implication: "Scans en afbeeldingen vragen een model dat beeld kan lezen. Dat vergroot soms ook privacy- en beveiligingsrisico’s.",
      impact: "Modellen zonder beeldverwerking vallen af.",
      reflection: "De vorm van de invoer bepaalt mede welke infrastructuur nodig is."
    },
    schaal: {
      step: "Eenmalig of structureel",
      implication: "Structureel gebruik maakt een model onderdeel van de organisatie-infrastructuur.",
      impact: "Exit-kosten, dataportabiliteit, inkoopvoorwaarden en leveranciersafhankelijkheid wegen zwaarder mee.",
      warning: "Maak van een eenmalig experiment niet ongemerkt een structureel proces.",
      reflection: "Structureel gebruik vraagt altijd aandacht voor exit en dataportabiliteit."
    }
  };

  const GLOSSARY = {
    "AVG": "De privacywet die regels stelt aan het verwerken van persoonsgegevens.",
    "AI Act": "Europese wet die eisen stelt aan AI, met zwaardere plichten bij toepassingen met een hoog risico.",
    "Bronherleidbaarheid": "De mogelijkheid om een bewering terug te leiden naar de oorspronkelijke, controleerbare bron.",
    "Exit-kosten": "Tijd, geld en inspanning die nodig zijn om verantwoord over te stappen naar een andere oplossing.",
    "Vendor lock-in": "Afhankelijkheid van één leverancier waardoor overstappen moeilijk of kostbaar wordt.",
    "DPIA": "Een gegevensbeschermingseffectbeoordeling: vooraf onderzoeken welke privacyrisico’s ontstaan en hoe je die beheerst.",
    "FRIA": "Een beoordeling van de mogelijke gevolgen van een AI-toepassing voor grondrechten."
  };

  function reset() {
    Object.assign(state, { started: true, domain: null, capability: null, answers: {}, showModels: false });
    render();
  }

  function safe(text) {
    return String(text).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#039;" }[c]));
  }

  function explainTerms(text) {
    let html = safe(text);
    Object.entries(GLOSSARY).forEach(([term, definition]) => {
      const escaped = term.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
      html = html.replace(new RegExp(`\\b${escaped}\\b`, "g"), `<span class="term" tabindex="0">${term}<span role="tooltip">${definition}</span></span>`);
    });
    return html;
  }

  function renderSpine() {
    const cap = state.capability ? E.CAPABILITIES.find((c) => c.id === state.capability) : null;
    const done = cap && !E.nextQuestion(state);
    return `
      <div class="spine">
        <div class="spine-step ${cap ? "is-done" : "is-active"}">
          <span class="spine-num">Stap 1</span><strong>Vermogen</strong>
          <p>${cap ? safe(cap.label) : "Wat moet er gebeuren?"}</p>
        </div>
        <div class="spine-step ${cap ? (done ? "is-done" : "is-active") : "is-locked"}">
          <span class="spine-num">Stap 2</span><strong>Context</strong>
          <p>${cap ? `${Object.keys(state.answers).length} voorwaarde(n) ingevuld` : "Gegevens, impact en eisen"}</p>
        </div>
        <div class="spine-step ${done ? "is-active" : "is-locked"}">
          <span class="spine-num">Stap 3</span><strong>Onderbouwde keuze</strong>
          <p>${done ? "Vergelijking gereed" : "Vergrendeld tot vermogen en context duidelijk zijn"}</p>
        </div>
      </div>
      <blockquote class="spine-note">Een sterk model is niet automatisch een passend model.</blockquote>`;
  }

  function screenIntro() {
    return `
      <div class="onboarding">
        <h1>Richt een bestuurbaar selectieproces in.</h1>
        <p class="lede"><strong>kies·ai kiest niet het “beste” AI-model.</strong> De demonstrator helpt een organisatie eerst het benodigde vermogen en de bestuurlijke context expliciet te maken. Pas daarna worden modellen vergeleken die binnen die ruimte passen.</p>
        <section class="learning-band" aria-label="Ontwerpprincipe">
          <strong>Waarom deze volgorde?</strong>
          <p>Een modelkeuze bepaalt ook waar gegevens terechtkomen, hoe afhankelijk je wordt van een leverancier en hoeveel menselijke controle behouden blijft. Dat maakt modelselectie een governancevraagstuk.</p>
        </section>
        <section class="register-band">
          <strong>Het modelregister is van de instelling.</strong>
          <p>De instelling bepaalt welke modellen zijn toegelaten en onder welke voorwaarden. De beslislogica kent geen modelnamen. Daardoor kan het aanbod veranderen zonder het governanceproces opnieuw te ontwerpen.</p>
        </section>
        ${regErrors.length ? `<div class="warn" role="alert"><strong>Het modelregister kan niet betrouwbaar worden gebruikt.</strong><br>${safe(regErrors[0])} Neem contact op met de registerbeheerder.</div>` : ""}
        <button class="btn-primary btn-large" data-action="start">Ik begrijp het — begin bij het vermogen <span aria-hidden="true">→</span></button>
        <button class="text-button" data-action="show-examples">Bekijk eerst een voorbeeld</button>
        <p class="boundary">Conceptdemonstrator — geen juridisch, security- of inkoopadvies.</p>
      </div>`;
  }

  function screenExamples() {
    return `
      <h1>Bekijk wat context verandert.</h1>
      <p class="lede">Elk voorbeeld begint met een vermogen, voegt bestuurlijke context toe en laat pas daarna passende modellen zien.</p>
      <div class="example-list">
        ${Object.entries(EXAMPLES).map(([id, ex]) => `
          <button class="example" data-action="example" data-id="${id}">
            <strong>${safe(ex.label)}</strong>
            <span>${safe(E.CAPABILITIES.find((c) => c.id === ex.capability).label)}</span>
            <span class="example-action">Bekijk de onderbouwde keuze →</span>
          </button>`).join("")}
      </div>
      <button class="text-button" data-action="intro">Terug naar de introductie</button>`;
  }

  function screenDomain() {
    return `
      <p class="step-label">Stap 1 · oriëntatie</p>
      <h1>Vanuit welk werkveld kijk je?</h1>
      <p class="lede-s">Dit verandert de governancefilters niet. Het helpt alleen om relevante vermogens bovenaan te zetten.</p>
      <div class="grid">${E.DOMAINS.map((d) => `<button class="card" data-action="domain" data-id="${d.id}"><strong>${safe(d.label)}</strong></button>`).join("")}<button class="card card-skip" data-action="domain" data-id="">Sla deze suggestiehulp over</button></div>`;
  }

  function screenCapability() {
    const domain = E.DOMAINS.find((d) => d.id === state.domain);
    const suggested = domain ? domain.suggest : [];
    const groups = E.CAPABILITY_GROUPS.map((g) => {
      const caps = E.CAPABILITIES.filter((c) => c.group === g.id);
      return `<section class="cap-group"><h2>${safe(g.label)} <span class="hint">${safe(g.hint)}</span></h2>${caps.map((c) => `<button class="cap ${suggested.includes(c.id) ? "is-suggested" : ""}" data-action="capability" data-id="${c.id}">${safe(c.label)}${suggested.includes(c.id) ? '<span class="tag">suggestie voor dit werkveld</span>' : ""}</button>`).join("")}</section>`;
    }).join("");
    return `
      <p class="step-label">Stap 1 · vermogen</p>
      <h1>Wat moet er gebeuren?</h1>
      <p class="lede">Kies het vermogen dat je nodig hebt. Nog niet het merk of model dat het uitvoert: die keuze komt pas nadat de context duidelijk is.</p>
      <aside class="reflection">Een model is vervangbaar. Het benodigde vermogen is het stabiele vertrekpunt.</aside>
      ${groups}`;
  }

  function screenQuestion(q) {
    const guide = QUESTION_GUIDANCE[q.id];
    return `
      <p class="step-label">Stap 2 · ${safe(guide.step)}</p>
      <h1>${safe(q.text)}</h1>
      <div class="question-explanation">
        <div><strong>Waarom vragen we dit?</strong><p>${safe(guide.implication)}</p></div>
        <div><strong>Wat verandert er?</strong><p>${safe(guide.impact)}</p></div>
      </div>
      ${guide.warning ? `<div class="caution"><strong>Bij twijfel</strong><p>${safe(guide.warning)}</p></div>` : ""}
      <div class="stack">${q.options.map((o) => `<button class="option" data-action="answer" data-q="${q.id}" data-id="${o.id}"><span>${safe(o.label)}</span><span aria-hidden="true">→</span></button>`).join("")}</div>
      <p class="reflection">${safe(guide.reflection)}</p>`;
  }

  function escalationBlock(out) {
    const privacy = state.answers.data && state.answers.data !== "openbaar";
    const highImpact = state.answers.stakes === "personen";
    const structural = state.answers.schaal === "structureel";
    return `
      <section class="escalation">
        <h2>Wanneer moet je escaleren?</h2>
        <p>Vraag specialistisch advies als één van deze situaties speelt.</p>
        <div class="escalation-grid">
          <div class="${privacy ? "is-relevant" : ""}"><strong>Privacy</strong><p>Bij twijfel over persoonsgegevens, bijzondere gegevens, grondslag of een verplichte ${explainTerms("DPIA")}.</p></div>
          <div class="${highImpact ? "is-relevant" : ""}"><strong>Security</strong><p>Bij vertrouwelijke data, koppelingen met andere systemen, toegangsrechten of onbekende beveiligingsrisico’s.</p></div>
          <div class="${structural ? "is-relevant" : ""}"><strong>Inkoop</strong><p>Bij structureel gebruik, contractvoorwaarden, aanbesteding, ${explainTerms("exit-kosten")} of ${explainTerms("vendor lock-in")}.</p></div>
          <div class="${out.confidence === "laag" ? "is-relevant" : ""}"><strong>Informatiemanagement</strong><p>Bij onduidelijke classificatie, vrijwel gelijkwaardige opties, registerhiaten of uitzonderingen op beleid.</p></div>
        </div>
      </section>`;
  }

  function reasoningBlock(out) {
    const filterRows = out.hardFilters.length
      ? out.hardFilters.map((f) => `<li><div><strong>${explainTerms(f.explanation.split(":")[0])}</strong><p>${explainTerms(f.explanation)}</p><small>${f.before} → ${f.after} opties</small></div><details><summary>Bekijk afgevallen modellen (${f.removed.length})</summary><ul>${f.removed.map((m) => `<li>${safe(m)}</li>`).join("")}</ul></details></li>`).join("")
      : `<li><div><strong>Geen extra uitsluitingscriteria</strong><p>Alle geregistreerde modellen gingen door naar de vermogenscontrole.</p></div></li>`;
    return `
      <section class="reasoning">
        <h2>Zo kwam deze keuze tot stand</h2>
        <p>Harde filters sluiten opties uit. Alleen de overblijvende opties worden daarna gerangschikt. Een hoge score kan een geschonden harde eis nooit compenseren.</p>
        <div class="reasoning-columns">
          <div class="filter-column"><h3>1. Harde filters — modellen vallen af</h3><ol>${filterRows}</ol></div>
          <div class="ranking-column"><h3>2. Rangschikking — passende opties wegen</h3><ul>${out.rankingCriteria.map((c) => `<li>${explainTerms(c)}</li>`).join("")}</ul><details class="ranking-details"><summary>Bekijk de volledige rangschikking (${out.ranked.length})</summary><div class="ranking-list">${out.ranked.map((r, i) => `<div><span>${i + 1}</span><strong>${safe(r.model.name)}</strong><small>score ${r.score}</small></div>`).join("")}</div></details><p class="score-note">Scores helpen ordenen; ze zijn geen objectieve kwaliteitsmeting.</p></div>
        </div>
        <details class="technical-trace"><summary>Technisch regelspoor bekijken</summary><ol>${out.trace.map((t) => `<li><code>${safe(t.id)}</code> ${explainTerms(t.text)}</li>`).join("")}</ol></details>
      </section>`;
  }

  function modelExplanation(out) {
    const eliminated = new Map();
    out.eliminated.forEach((item) => {
      if (!eliminated.has(item.model)) eliminated.set(item.model, []);
      eliminated.get(item.model).push(item.reason);
    });
    const rows = R.models.map((model) => {
      if (model.id === out.recommended.model.id) {
        return `<li><strong>${safe(model.name)}</strong><p>Dit model staat bovenaan binnen de ingevulde voorwaarden.</p></li>`;
      }
      const reasons = eliminated.get(model.name);
      if (reasons) {
        return `<li><strong>${safe(model.name)}</strong><p><span class="status-out">Afgevallen door een harde filter.</span> ${explainTerms(reasons[0])}</p></li>`;
      }
      const rank = out.ranked.findIndex((item) => item.model.id === model.id);
      return `<li><strong>${safe(model.name)}</strong><p>Door de harde filters gekomen, maar lager gerangschikt${rank >= 0 ? ` op plaats ${rank + 1}` : ""}. Dit is geen verbod: het blijft een alternatief als de open bestuurlijke afweging anders uitvalt.</p></li>`;
    }).join("");
    return `
      <section class="favorite-model">
        <button class="btn-secondary" data-action="toggle-models" aria-expanded="${state.showModels ? "true" : "false"}">Waarom viel mijn favoriete model af?</button>
        ${state.showModels ? `<div class="model-explanations"><h2>Zo is ieder geregistreerd model behandeld</h2><p>Zoek hier bijvoorbeeld ChatGPT. Een model kan hard zijn uitgesloten, of wel passen maar lager zijn gerangschikt.</p><ul>${rows}</ul></div>` : ""}
      </section>`;
  }

  function screenNoResult(out) {
    return `
      <p class="step-label">Stap 3 · bestuurlijke uitkomst</p>
      <h1>Geen passend model in het register</h1>
      <div class="caution"><strong>Versoepel de eisen niet zelf.</strong><p>${safe(out.message)}</p></div>
      ${reasoningBlock(out)}
      <div class="actions"><button class="btn-secondary" data-action="reset">Nieuwe vraag</button></div>`;
  }

  function screenResult() {
    const out = E.recommend(state, R);
    if (out.result === "geen") return screenNoResult(out);
    const top = out.recommended;
    return `
      <p class="step-label">Stap 3 · onderbouwde keuze</p>
      <div class="result-head">
        <div><h1>Onderbouwde keuze</h1><p class="result-label">Aanbevolen binnen de ingevulde voorwaarden</p><h2>${safe(top.model.name)}</h2><p>Dit is geen automatisch besluit, maar het best passende vertrekpunt in het huidige instellingsregister.</p></div>
        <aside class="human-review"><strong>Menselijke toets</strong><p>${explainTerms(E.REVIEW_LABELS[out.humanReview])}</p></aside>
      </div>
      <p class="reflection result-reflection">${state.answers.stakes === "personen" ? "Bij besluiten over personen adviseert AI; de mens beslist." : "Een onderbouwde keuze blijft afhankelijk van juiste context en professioneel oordeel."}</p>
      <section class="governance-brief">
        <h2>Bestuurlijke samenvatting</h2>
        <dl>
          <div><dt>Waarom deze keuze?</dt><dd>${safe(top.model.strengths[0] || "Past bij het gekozen vermogen en de ingevulde voorwaarden.")}</dd></div>
          <div><dt>Welke alternatieven vielen af?</dt><dd>${out.eliminated.length ? `${out.eliminated.length} uitsluiting(en) zijn terug te voeren op harde filters.` : "Geen model viel af door een extra governancefilter; de vermogensfit bepaalde de selectie."}</dd></div>
          <div><dt>Welke regels waren doorslaggevend?</dt><dd>${out.hardFilters.length ? out.hardFilters.map((f) => safe(f.explanation.split(":")[0])).join(", ") : "Alleen het vereiste vermogen werkte als harde grens."}</dd></div>
          <div><dt>Welke afweging blijft open?</dt><dd>${out.confidence === "laag" ? "Meerdere opties liggen dicht bij elkaar. De organisatie moet prioriteiten en bestaande afspraken expliciet afwegen." : "Bevestig of de context juist is geclassificeerd en of lokale contracten en beleidskaders dit gebruik toestaan."}</dd></div>
        </dl>
      </section>
      <div class="result-grid">
        <section><h2>Waarom passend</h2><ul>${top.model.strengths.map((s) => `<li>${safe(s)}</li>`).join("")}</ul></section>
        <section class="risk-summary"><h2>Belangrijkste risico’s</h2><ul>${[...out.risks, ...out.limitations].slice(0, 5).map((r) => `<li>${explainTerms(r)}</li>`).join("")}</ul></section>
        <section><h2>Alternatieven</h2>${out.alternatives.length ? `<ul>${out.alternatives.map((a) => `<li><strong>${safe(a.model.name)}</strong><br>${safe(a.model.strengths[0] || "Volwaardig alternatief binnen de filters.")}</li>`).join("")}</ul>` : "<p>Er bleef geen tweede passende optie over.</p>"}</section>
      </div>
      ${out.governance.length || out.privacy.length ? `<section class="governance-summary"><h2>Voorwaarden voor verantwoord gebruik</h2><ul>${[...out.governance, ...out.privacy].map((g) => `<li>${explainTerms(g)}</li>`).join("")}</ul></section>` : ""}
      ${reasoningBlock(out)}
      ${modelExplanation(out)}
      ${escalationBlock(out)}
      <section class="never-relax"><h2>Wat je nooit zelf mag versoepelen</h2><p>Wettelijke eisen, gegevenslocatie, rechten van betrokkenen, menselijk toezicht, beveiligingsvoorwaarden en verplichte logging. Als geen model past, is “geen AI inzetten” een geldige bestuurlijke uitkomst.</p></section>
      <section class="self-classification"><strong>Kritische beperking</strong><p>Dit advies is alleen zo betrouwbaar als de context die je zelf hebt ingevuld. Controleer de classificatie met de verantwoordelijke rol voordat je de toepassing in gebruik neemt.</p></section>
      <div class="actions"><button class="btn-secondary" data-action="print">Advies afdrukken</button><button class="btn-primary" data-action="reset">Nieuwe vraag</button></div>`;
  }

  function render() {
    $("#spine").innerHTML = renderSpine();
    let html;
    if (state.showExamples) html = screenExamples();
    else if (!state.started) html = screenIntro();
    else if (state.domain === null) html = screenDomain();
    else if (!state.capability) html = screenCapability();
    else {
      const q = E.nextQuestion(state);
      html = q ? screenQuestion(q) : screenResult();
    }
    $("#screen").innerHTML = html;
    $("#screen").focus({ preventScroll: true });
    window.scrollTo(0, 0);
  }

  document.addEventListener("click", (ev) => {
    const el = ev.target.closest("[data-action]");
    if (!el) return;
    const action = el.dataset.action;
    if (action === "start") Object.assign(state, { started: true, showExamples: false });
    if (action === "show-examples") state.showExamples = true;
    if (action === "intro") state.showExamples = false;
    if (action === "example") {
      const ex = EXAMPLES[el.dataset.id];
      Object.assign(state, { started: true, showExamples: false, showModels: false, domain: ex.domain, capability: ex.capability, answers: { ...ex.answers } });
    }
    if (action === "domain") state.domain = el.dataset.id;
    if (action === "capability") state.capability = el.dataset.id;
    if (action === "answer") state.answers[el.dataset.q] = el.dataset.id;
    if (action === "toggle-models") state.showModels = !state.showModels;
    if (action === "reset") return reset();
    if (action === "print") return window.print();
    render();
  });

  render();
})();
