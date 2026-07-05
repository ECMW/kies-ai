/* ============================================================
   UI-LAAG — kies-ai v1.0
   Presenteert het beslismechanisme. Bevat zelf geen besliskennis.
   ============================================================ */
(function () {
  const E = window.ENGINE;
  const R = window.MODEL_REGISTRY;
  const $ = (sel) => document.querySelector(sel);

  /* Registervalidatie bij opstarten — fouten zichtbaar, niet stil */
  const regErrors = E.validateRegistry(R);

  const state = { domain: null, group: null, capability: null, answers: {} };
  const EXAMPLES = {
    bronnen: { domain: "kwaliteitszorg", capability: "kennis-zoeken", answers: { data: "intern", stakes: "besluit", bronnen: "ja", schaal: "structureel" } },
    student: { domain: "studentbegeleiding", capability: "analyseren", answers: { data: "persoonsgegevens", stakes: "personen", bronnen: "ja", beeld: "nee" } },
    interview: { domain: "onderzoek", capability: "transcriberen", answers: { data: "bijzonder", stakes: "verkenning", schaal: "eenmalig" } }
  };

  function reset() {
    state.domain = null; state.group = null; state.capability = null; state.answers = {};
    render();
  }

  /* ---------- SPINE (linkerkolom): de architectuur als interface ---------- */
  function renderSpine() {
    const cap = state.capability ? E.CAPABILITIES.find((c) => c.id === state.capability) : null;
    const answered = Object.entries(state.answers).map(([qid, val]) => {
      const q = E.QUESTIONS.find((x) => x.id === qid);
      const opt = q.options.find((o) => o.id === val);
      return `<span class="chip">${opt.label}</span>`;
    }).join("");
    const done = cap && !E.nextQuestion(state);
    return `
      <div class="spine">
        <div class="spine-step ${cap ? "is-done" : "is-active"}">
          <span class="spine-num">Laag 1</span>
          <strong>Vermogen</strong>
          <p>${cap ? cap.label : "Wat moet er gebeuren?"}</p>
        </div>
        <div class="spine-step ${cap ? (done ? "is-done" : "is-active") : "is-locked"}">
          <span class="spine-num">Context</span>
          <strong>Omstandigheden</strong>
          <p>${answered || "Gegevens, inzet, eisen"}</p>
        </div>
        <div class="spine-step ${done ? "is-active" : "is-locked"}">
          <span class="spine-num">Laag 2</span>
          <strong>Model</strong>
          <p>${done ? "Advies gereed" : "🔒 Vergrendeld tot het vermogen vaststaat"}</p>
        </div>
      </div>
      <p class="spine-note">Modellen komen en gaan. Vermogens blijven. Daarom stelt deze assistent de modelvraag altijd als laatste.</p>`;
  }

  /* ---------- SCHERMEN ---------- */
  function screenIntro() {
    return `
      <h1>Welke AI past bij deze taak?</h1>
      <p class="lede">Niet het model is de eerste vraag, maar het <em>vermogen</em>: wat moet er gebeuren? Doorloop je eigen situatie of bekijk direct wat governance verandert in een herkenbare casus.</p>
      ${regErrors.length ? `<div class="warn">Let op: het modelregister bevat ${regErrors.length} schemafout(en). Meld dit bij de beheerder. Eerste fout: ${regErrors[0]}</div>` : ""}
      <button class="btn-primary" data-action="start">Begin met mijn eigen situatie</button>
      <section class="examples" aria-labelledby="examples-title">
        <h2 id="examples-title">Of start met een voorbeeld</h2>
        <div class="example-grid">
          <button class="example" data-action="example" data-id="bronnen"><strong>Beleid doorzoeken</strong><span>Interne bronnen, structureel gebruik en verplichte herleidbaarheid</span></button>
          <button class="example" data-action="example" data-id="student"><strong>Studentdossier analyseren</strong><span>Persoonsgegevens en een mogelijk besluit over een student</span></button>
          <button class="example" data-action="example" data-id="interview"><strong>Onderzoeksinterview transcriberen</strong><span>Bijzondere persoonsgegevens die de instelling niet mogen verlaten</span></button>
        </div>
      </section>
      <p class="meta">Register: ${R.meta.institution} · versie ${R.meta.version} · ${R.models.length} modellen · beheer: ${R.meta.maintainer}</p>`;
  }

  function screenDomain() {
    return `
      <h2>Vanuit welk werkveld werk je? <span class="optional">(optioneel — helpt bij suggesties)</span></h2>
      <div class="grid">
        ${E.DOMAINS.map((d) => `<button class="card" data-action="domain" data-id="${d.id}">${d.label}</button>`).join("")}
        <button class="card card-skip" data-action="domain" data-id="">Sla over</button>
      </div>`;
  }

  function screenCapability() {
    const domain = E.DOMAINS.find((d) => d.id === state.domain);
    const suggested = domain ? domain.suggest : [];
    const groups = E.CAPABILITY_GROUPS.map((g) => {
      const caps = E.CAPABILITIES.filter((c) => c.group === g.id);
      return `
        <div class="cap-group">
          <h3>${g.label} <span class="hint">${g.hint}</span></h3>
          ${caps.map((c) => `<button class="cap ${suggested.includes(c.id) ? "is-suggested" : ""}" data-action="capability" data-id="${c.id}">${c.label}${suggested.includes(c.id) ? '<span class="tag">vaak in jouw werkveld</span>' : ""}</button>`).join("")}
        </div>`;
    }).join("");
    return `<h2>Welk vermogen heb je nodig?</h2><p class="lede-s">Kies wat er moet <em>gebeuren</em> — nog even niet wélk model dat doet.</p>${groups}`;
  }

  function screenQuestion(q) {
    return `
      <h2>${q.text}</h2>
      <p class="why">Waarom deze vraag: ${q.why}</p>
      <div class="stack">
        ${q.options.map((o) => `<button class="option" data-action="answer" data-q="${q.id}" data-id="${o.id}">${o.label}</button>`).join("")}
      </div>`;
  }

  function screenResult() {
    const out = E.recommend(state, R);
    if (out.result === "geen") {
      return `
        <h2>Geen passend model in het register</h2>
        <div class="warn">${out.message}</div>
        ${traceBlock(out)}
        <button class="btn-primary" data-action="reset">Opnieuw beginnen</button>`;
    }
    const top = out.recommended;
    return `
      <div class="result-head">
        <p class="eyebrow">Advies · vermogen: ${out.capability.label}</p>
        <h2>${top.model.name}</h2>
        <p class="conf conf-${out.confidence}">Betrouwbaarheid van dit advies: <strong>${out.confidence}</strong></p>
      </div>

      <section class="block block-review">
        <h3>Menselijke toets</h3>
        <p>${E.REVIEW_LABELS[out.humanReview]}</p>
      </section>

      <section class="block">
        <h3>Waarom dit model</h3>
        <ul>${top.model.strengths.map((s) => `<li>${s}</li>`).join("")}</ul>
      </section>

      ${out.alternatives.length ? `
      <section class="block">
        <h3>Alternatieven</h3>
        <ul>${out.alternatives.map((a) => `<li><strong>${a.model.name}</strong> — ${a.model.strengths[0] || ""}</li>`).join("")}</ul>
      </section>` : ""}

      ${out.governance.length ? `
      <section class="block block-gov">
        <h3>Governance</h3>
        <ul>${out.governance.map((g) => `<li>${g}</li>`).join("")}</ul>
      </section>` : ""}

      ${out.privacy.length ? `
      <section class="block">
        <h3>Privacy</h3>
        <ul>${out.privacy.map((p) => `<li>${p}</li>`).join("")}</ul>
      </section>` : ""}

      ${out.risks.length ? `
      <section class="block block-risk">
        <h3>Risico's</h3>
        <ul>${out.risks.map((r) => `<li>${r}</li>`).join("")}</ul>
      </section>` : ""}

      <section class="block">
        <h3>Beperkingen</h3>
        <ul>${out.limitations.map((l) => `<li>${l}</li>`).join("")}</ul>
      </section>

      ${traceBlock(out)}

      <div class="actions">
        <button class="btn-secondary" data-action="print">Advies afdrukken</button>
        <button class="btn-primary" data-action="reset">Nieuwe vraag</button>
      </div>`;
  }

  function traceBlock(out) {
    return `
      <section class="block block-trace">
        <h3>Redeneerspoor <span class="hint">— elk advies is volledig herleidbaar</span></h3>
        <ol class="trace">
          ${out.trace.map((t) => `<li><code>${t.id}</code> ${t.text}</li>`).join("")}
        </ol>
      </section>`;
  }

  /* ---------- RENDER & EVENTS ---------- */
  function render() {
    $("#spine").innerHTML = renderSpine();
    let html;
    if (!state.started) html = screenIntro();
    else if (state.domain === null) html = screenDomain();
    else if (!state.capability) html = screenCapability();
    else {
      const q = E.nextQuestion(state);
      html = q ? screenQuestion(q) : screenResult();
    }
    $("#screen").innerHTML = html;
    window.scrollTo(0, 0);
  }

  document.addEventListener("click", (ev) => {
    const el = ev.target.closest("[data-action]");
    if (!el) return;
    const action = el.dataset.action;
    if (action === "start") { state.started = true; }
    if (action === "example") {
      const example = EXAMPLES[el.dataset.id];
      Object.assign(state, { started: true, domain: example.domain, capability: example.capability, answers: { ...example.answers } });
    }
    if (action === "domain") { state.domain = el.dataset.id; }
    if (action === "capability") { state.capability = el.dataset.id; }
    if (action === "answer") { state.answers[el.dataset.q] = el.dataset.id; }
    if (action === "reset") { state.started = true; return reset(); }
    if (action === "print") { return window.print(); }
    render();
  });

  render();
})();
