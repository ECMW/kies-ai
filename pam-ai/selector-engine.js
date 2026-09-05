/* Adviesregels 0.3.0: eigen, transparante oriëntatielaag. Geen formele PAM-poorten. */
(function (root) {
  "use strict";
  const C =
    typeof module !== "undefined" && module.exports
      ? require("./model-catalog.js")
      : root.PAM_CATALOG;
  const VERSION = "0.3.0",
    SCHEMA = "pam-ai-modeladvies/1",
    CONFIG = "pam-ai-platform/1";
  const TYPES = {
    rewrite: {
      name: "Tekst verbeteren",
      role: "routine",
      need: "Instructies volgen en betekenis behouden",
      check:
        "Vergelijk met de oorspronkelijke tekst: kloppen betekenis, namen, getallen en toon?",
      escalate:
        "Pas als het model aantoonbaar betekenis verliest of ingewikkelde instructies niet volgt.",
    },
    draft: {
      name: "Een tekst opstellen",
      role: "routine",
      need: "Een afgebakende tekst maken",
      check:
        "Controleer feiten en toon. Laat ontbrekende informatie als vraag of invulplek staan.",
      escalate:
        "Als meerdere bronnen of tegenstrijdige eisen nodig zijn, kies een analyse van die bronnen.",
    },
    summary: {
      name: "Samenvatten of actiepunten maken",
      role: "routine",
      need: "Hoofdpunten uit aangeleverde tekst halen",
      check:
        "Controleer besluiten, namen, aantallen en actiehouders aan de hand van de brontekst. Voeg geen impliciete afspraken toe.",
      escalate:
        "Als bronnen elkaar tegenspreken of de samenhang tussen documenten moet worden beoordeeld.",
    },
    extract: {
      name: "Gegevens uit tekst halen",
      role: "routine",
      need: "Informatie herkennen en in een vaste vorm zetten",
      check:
        "Controleer ieder veld tegen de bron. Laat niet gevonden waarden leeg en meld twijfel.",
      escalate:
        "Als de gegevens interpretatie vragen of de documenten onderling tegenstrijdig zijn.",
    },
    analysis: {
      name: "Inhoud analyseren of vergelijken",
      role: "analysis",
      need: "Bronnen vergelijken en redeneringen expliciet maken",
      check:
        "Vraag bronverwijzingen per conclusie. Controleer of conclusies en citaten daadwerkelijk uit die bronnen volgen.",
      escalate:
        "Alleen wanneer de taaktest laat zien dat ingewikkelde samenhang of tegenstrijdigheden niet goed worden behandeld.",
    },
    complex: {
      name: "Een ingewikkeld vraagstuk uitwerken",
      role: "complex",
      need: "Meerdere afhankelijke stappen en tegenstrijdige eisen afwegen",
      check:
        "Laat aannames en tussenstappen benoemen. Controleer de beslissende redenering met een inhoudsdeskundige.",
      escalate:
        "Extra modelvermogen is alleen gerechtvaardigd als het een vastgestelde tekortkoming oplost.",
    },
    code: {
      name: "Code schrijven of controleren",
      role: "code",
      need: "Programmeren en technische instructies volgen",
      check:
        "Voer de code eerst uit in een testomgeving. Controleer werking, toegang tot gegevens en foutafhandeling.",
      escalate:
        "Bij aangetoonde tekorten op complexe code of meerdere afhankelijke wijzigingen.",
    },
    research: {
      name: "Actuele informatie zoeken",
      role: "analysis",
      feature: "web",
      need: "Actuele bronnen ophalen én beoordelen",
      check:
        "Open de bronnen zelf. Controleer publicatiedatum en of de bron de conclusie ondersteunt.",
      escalate: "Een ander taalmodel lost ontbrekende actuele bronnen niet op.",
    },
    audio: {
      name: "Een opname uitschrijven",
      role: "routine",
      feature: "audio",
      need: "Spraakherkenning; eventueel daarna samenvatten",
      check:
        "Controleer namen, sprekers, besluiten en actiehouders tegen de opname. Maak onderscheid tussen letterlijk transcript en interpretatie.",
      escalate:
        "Een krachtiger tekstmodel vervangt geen ontbrekende spraakherkenning.",
    },
    image: {
      name: "Een beeld maken of aanpassen",
      role: "routine",
      feature: "image",
      need: "Beeldgeneratie of beeldbewerking",
      check:
        "Controleer bruikbaarheid, rechten en eventuele herkenbare personen in het resultaat.",
      escalate:
        "Een tekstmodel met afbeeldingsinvoer kan niet automatisch zelf afbeeldingen genereren.",
    },
    agent: {
      name: "Handelingen laten uitvoeren",
      role: "agent",
      feature: "actions",
      need: "Gereedschappen gebruiken met afgebakende rechten",
      check:
        "Beperk rechten, vereis bevestiging voor ingrijpende acties en zorg dat fouten kunnen worden gestopt en hersteld.",
      escalate:
        "Extra modelvermogen vervangt geen toegangsbeperking, toezicht of herstelmogelijkheid.",
    },
    numbers: {
      name: "Rekenen of vaste regels toepassen",
      role: null,
      need: "Exacte, herhaalbare berekening",
      check:
        "Leg rekenregels, eenheden en afronding vast. Controleer met bekende voorbeelden.",
      escalate:
        "Gebruik een rekenblad, calculator of getest script voor de berekening. Een taalmodel kan helpen bij uitleg.",
    },
    unknown: {
      name: "Taak nog verduidelijken",
      role: null,
      need: "Een concrete gewenste uitkomst",
      check: "Beschrijf wat je aanlevert en wat je terug wilt krijgen.",
      escalate:
        "Kies hieronder zelf het soort taak als de automatische herkenning niet klopt.",
    },
  };
  function infer(text) {
    const s = String(text || "").toLowerCase();
    const matches = [];
    const rules = [
      [
        "audio",
        /\b(audio|(?:vergader|geluids|video)?opname|opnamen|opnames|geluidsbestand|spraak|uitschrijven|transcrib)|\b(maak|maken)\s+(?:een\s+)?transcript\b/,
      ],
      [
        "image",
        /\b(afbeelding|beeld|illustratie|foto|logo).*(maken|genereren|ontwerpen|bewerken)|\b(maak|genereer|ontwerp|bewerk).*(afbeelding|beeld|illustratie|foto|logo)/,
      ],
      ["numbers", /\b(bereken|optellen|btw|reken|som van|totalen)/],
      [
        "agent",
        /\b(automatisch versturen|verstuur|boek een|verwijder|bestelling plaatsen|acties uitvoeren)/,
      ],
      [
        "research",
        /\b(actueel|actuele|vandaag|laatste nieuws|zoek online|op internet|recente ontwikkelingen)/,
      ],
      [
        "code",
        /\b(code|programmeer|programmeren|python|javascript|bug|sql|script)/,
      ],
      [
        "rewrite",
        /\b(herschrijf|verbeter|redigeer|vertaal|korter|b1|spelling|herformuleer)/,
      ],
      [
        "summary",
        /\b(samenvat|samenvatting|vat\b.*\bsamen|actiepunten|notulen|hoofdpunten)/,
      ],
      ["extract", /\b(extraheer|velden|haal.*uit|rubriceer|classificeer)/],
      [
        "complex",
        /\b(complex|ingewikkeld|tegenstrijdige eisen|afhankelijke stappen)/,
      ],
      [
        "analysis",
        /\b(analyse|analyseer|vergelijk|beoordeel|onderzoek|afwegen|verschillen|beleid)/,
      ],
      [
        "draft",
        /\b(schrijf|stel.*op|bedenk|maak.*tekst|mail|brief|idee|brainstorm)/,
      ],
    ];
    for (const [id, re] of rules) if (re.test(s)) matches.push(id);
    return {
      type: matches[0] || "unknown",
      matches,
      localOnly:
        /uitsluitend lokaal|alleen lokaal|zonder cloud|niet naar de cloud|on.prem/.test(
          s,
        ),
      chain:
        matches.includes("audio") &&
        /samenvat|actiepunten|notulen|besluiten/.test(s),
      sensitiveHint:
        /personeel|student|patiënt|patient|namen|gezond|sollicit|medisch|beoordeling van|bsn|vertrouwelijk|salaris/.test(
          s,
        ),
    };
  }
  function newAdvice() {
    return {
      schema: SCHEMA,
      appVersion: VERSION,
      id: uid(),
      created: new Date().toISOString(),
      updated: new Date().toISOString(),
      task: "",
      type: "auto",
      data: "",
      use: "",
      priority: "balance",
      notes: "",
      chosen: "",
      measurements: [],
      archivedMeasurements: [],
    };
  }
  function uid() {
    return typeof crypto !== "undefined" && crypto.randomUUID
      ? crypto.randomUUID()
      : "a" + Date.now() + Math.random().toString(36).slice(2);
  }
  function defaultPlatform() {
    return {
      schema: CONFIG,
      name: "NebulaONE",
      catalogVersion: C.version,
      updated: C.checked,
      owner: "",
      models: C.models.map((m) => ({
        id: m.id,
        enabled: true,
        deployment: "",
        approvedDeployment: "",
        features: {
          local: "unknown",
          audio: "unknown",
          image: "unknown",
          web: "unknown",
          actions: "unknown",
        },
        featureRef: "",
        approval: {
          public: "unknown",
          internal: "unknown",
          personal: "unknown",
        },
        approvalRef: "",
        validUntil: "",
        conditions: "",
      })),
    };
  }
  const has = (o, k) => Object.prototype.hasOwnProperty.call(o, k);
  const limited = (x, n = 10000) => typeof x === "string" && x.length <= n;
  function parseAdvice(raw) {
    if (typeof raw !== "string" || raw.length > 1000000)
      throw Error("Bestand is te groot.");
    const x = JSON.parse(raw);
    if (x?.schema !== SCHEMA)
      throw Error(
        "Geen PAM-AI-modeladvies. Gebruik voor een formele beoordeling de dossierimport.",
      );
    const n = newAdvice();
    for (const k of ["id", "created", "updated", "task", "notes", "chosen"])
      if (has(x, k)) {
        if (!limited(x[k])) throw Error("Ongeldige tekst: " + k);
        n[k] = x[k];
      }
    for (const [k, vals] of Object.entries({
      type: ["auto", ...Object.keys(TYPES)],
      data: ["", "public", "internal", "personal", "unknown"],
      use: ["", "draft", "consequential", "actions", "unknown"],
      priority: ["balance", "cost", "time", "control", "environment"],
    })) {
      if (!vals.includes(x[k])) throw Error("Ongeldige keuze: " + k);
      n[k] = x[k];
    }
    if (n.chosen && !C.models.some((m) => m.id === n.chosen))
      throw Error("Onbekend gekozen model.");
    if (x.measurements !== undefined) {
      if (!Array.isArray(x.measurements) || x.measurements.length > 8)
        throw Error("Ongeldige metingen.");
      n.measurements = x.measurements.map((r) => {
        if (!C.models.some((m) => m.id === r.id))
          throw Error("Onbekend gemeten model.");
        const out = { id: r.id };
        for (const k of ["cases", "accepted", "cost", "minutes", "energy"]) {
          const v = r[k];
          if (v !== null && v !== "" && (!Number.isFinite(v) || v < 0))
            throw Error("Ongeldige meting: " + k);
          out[k] = (v === "" ? null : v) ?? null;
        }
        if (
          (out.cases !== null && !Number.isInteger(out.cases)) ||
          (out.accepted !== null && !Number.isInteger(out.accepted)) ||
          (out.cases !== null &&
            out.accepted !== null &&
            out.accepted > out.cases)
        )
          throw Error("Controleer de aantallen in de meting.");
        for (const k of ["reference", "boundary", "testset", "deployment"]) {
          if (!limited(r[k] ?? "")) throw Error("Ongeldige bewijsverwijzing.");
          out[k] = r[k] || "";
        }
        return out;
      });
      if (
        new Set(n.measurements.map((r) => r.id)).size !== n.measurements.length
      )
        throw Error("Dubbele modelmeting.");
    }
    if (x.archivedMeasurements !== undefined) {
      if (
        !Array.isArray(x.archivedMeasurements) ||
        x.archivedMeasurements.length > 50
      )
        throw Error("Te veel gearchiveerde metingen.");
      n.archivedMeasurements = x.archivedMeasurements.map((arc) => {
        const parsed = parseAdvice(
          JSON.stringify({
            ...newAdvice(),
            task: arc.task,
            type: arc.type,
            data: arc.data,
            use: arc.use,
            measurements: arc.measurements,
            archivedMeasurements: undefined,
          }),
        );
        return {
          task: parsed.task,
          type: parsed.type,
          data: parsed.data,
          use: parsed.use,
          measurements: parsed.measurements,
        };
      });
    }
    return n;
  }
  function parsePlatform(raw) {
    if (typeof raw !== "string" || raw.length > 1000000)
      throw Error("Platformbestand te groot.");
    const x = JSON.parse(raw);
    if (
      x?.schema !== CONFIG ||
      !Array.isArray(x.models) ||
      x.models.length !== C.models.length
    )
      throw Error("Onbekend platformformaat of andere catalogus.");
    const p = defaultPlatform();
    for (const k of ["name", "owner", "updated"]) {
      if (!limited(x[k], 500)) throw Error("Ongeldige platforminformatie.");
      p[k] = x[k];
    }
    if (new Set(x.models.map((m) => m.id)).size !== C.models.length)
      throw Error("Dubbele modellen.");
    p.models = x.models.map((m) => {
      if (
        !C.models.some((c) => c.id === m.id) ||
        typeof m.enabled !== "boolean"
      )
        throw Error("Onbekend model.");
      const out = { id: m.id, enabled: m.enabled, features: {}, approval: {} };
      for (const k of [
        "deployment",
        "approvedDeployment",
        "featureRef",
        "approvalRef",
        "validUntil",
        "conditions",
      ]) {
        if (!limited(m[k], 5000)) throw Error("Ongeldige modelinformatie.");
        out[k] = m[k];
      }
      if (
        out.validUntil &&
        (!/^\d{4}-\d{2}-\d{2}$/.test(out.validUntil) ||
          !Number.isFinite(Date.parse(out.validUntil)) ||
          new Date(out.validUntil).toISOString().slice(0, 10) !==
            out.validUntil)
      )
        throw Error("Ongeldige herbeoordelingsdatum.");
      for (const k of ["local", "audio", "image", "web", "actions"]) {
        if (!["unknown", "yes", "no"].includes(m.features?.[k]))
          throw Error("Ongeldige functie.");
        out.features[k] = m.features[k];
      }
      for (const k of ["public", "internal", "personal"]) {
        if (
          !["unknown", "allowed", "blocked", "conditional"].includes(
            m.approval?.[k],
          )
        )
          throw Error("Ongeldige platformafspraak.");
        out.approval[k] = m.approval[k];
      }
      return out;
    });
    return p;
  }
  function approval(m, data, today) {
    const value = m.approval[data] || "unknown";
    if (value === "blocked")
      return {
        status: "blocked",
        reason: "Volgens de platformafspraak uitgesloten voor deze gegevens.",
      };
    if (value === "unknown" || data === "unknown" || !data)
      return {
        status: "unknown",
        reason: "Platformafspraak voor deze gegevens ontbreekt.",
      };
    if (
      !m.deployment.trim() ||
      m.approvedDeployment !== m.deployment ||
      !m.approvalRef.trim() ||
      !m.validUntil
    )
      return {
        status: "unknown",
        reason:
          "Modelconfiguratie, bewijsverwijzing of herbeoordelingsdatum ontbreekt.",
      };
    if (m.validUntil < today)
      return {
        status: "unknown",
        reason: "De platformafspraak is toe aan herbeoordeling.",
      };
    if (value === "conditional" && !m.conditions.trim())
      return {
        status: "unknown",
        reason: "De voorwaarden zijn nog niet vastgelegd.",
      };
    return {
      status: value,
      reason:
        value === "allowed"
          ? "De beheerder heeft een platformafspraak vastgelegd. Controleer of deze taak binnen die afspraak valt."
          : m.conditions,
    };
  }
  function recommend(
    a,
    p = defaultPlatform(),
    today = new Date().toISOString().slice(0, 10),
  ) {
    const detected = infer(a.task),
      type = a.type === "auto" ? detected.type : a.type,
      profile = TYPES[type] || TYPES.unknown;
    const required = [
      ...new Set(
        [
          profile.feature,
          a.use === "actions" ? "actions" : null,
          detected.localOnly ? "local" : null,
        ].filter(Boolean),
      ),
    ];
    const all = C.models.map((m) => {
      const config = p.models.find((c) => c.id === m.id);
      const gate = approval(config, a.data, today);
      const feature = required.every(
        (f) =>
          config.features[f] === "yes" &&
          config.featureRef.trim() &&
          config.deployment.trim(),
      )
        ? "yes"
        : required.some((f) => config.features[f] === "no")
          ? "no"
          : "unknown";
      return {
        ...m,
        config,
        gate,
        feature,
        match: !!profile.role && m.roles.includes(profile.role),
      };
    });
    const candidates = all.filter(
      (m) =>
        m.config.enabled &&
        !m.dynamic &&
        m.match &&
        m.gate.status !== "blocked" &&
        m.feature === "yes",
    );
    const blocked = all.filter(
      (m) =>
        m.match &&
        (!m.config.enabled ||
          m.gate.status === "blocked" ||
          m.feature !== "yes"),
    );
    const checks = [
      {
        title: "Gewenste uitkomst",
        text: profile.check,
        source: "Methodiek v1.1: taakuitkomst, acceptatie en bewijs",
      },
      {
        title: "Gegevens en gebruik",
        text:
          a.data === "public"
            ? "Ook bij openbare gegevens blijven doel, rechten en gebruiksvoorwaarden relevant."
            : a.data === "personal"
              ? "Laat de beheerder bevestigen dat deze verwerking van persoonsgegevens binnen de vastgelegde afspraken valt: doel, toegang, bewaartermijn en de rol van de leverancier."
              : a.data === "internal"
                ? "Controleer via de beheerder welke modelconfiguraties deze interne informatie mogen ontvangen."
                : "Het soort gegevens is nog onbekend. Gebruik het advies om je te oriënteren; toestemming is hiermee niet vastgesteld.",
        source:
          "Methodiek v1.1, poort 1: privacy, security, contract en omgeving",
      },
    ];
    if (detected.sensitiveHint && a.data === "public")
      checks.push({
        title: "Controleer je gegevenskeuze",
        text: "Je taakbeschrijving bevat woorden die op persoonlijke of vertrouwelijke informatie kunnen wijzen. Controleer of 'openbaar of fictief' inderdaad klopt.",
        source: "Lokale woordherkenning, adviesregel CONTEXT-1",
      });
    if (
      ["consequential", "actions", "unknown", ""].includes(a.use) ||
      type === "agent"
    )
      checks.push({
        title: "Menselijke verantwoordelijkheid",
        text: "Het resultaat kan gevolgen hebben of het gebruik is nog onduidelijk. Leg vast wie controleert, wie beslist en hoe een fout wordt hersteld. Een modeladvies geeft hiervoor geen toestemming.",
        source: "Methodiek v1.1, poort 1 en routeafhankelijke bewijslast",
      });
    if (type === "audio")
      checks.push({
        title: "Vergaderopname",
        text: "Stel vooraf vast of opnemen en verwerken voor dit doel mag, informeer deelnemers waar nodig en leg toegang en bewaartermijn vast. Speakerlabels en actiepunten vragen aparte controle.",
        source:
          "Methodiek v1.1, taakcontext en poort 1; taakgerichte uitwerking",
      });
    if (profile.feature)
      checks.push({
        title: "Benodigde platformfunctie",
        text: {
          audio:
            "De foto's bevestigen geen spraakherkenning. De beheerder moet vastleggen welke configuratie audio daadwerkelijk kan verwerken.",
          web: "Actuele antwoorden vereisen toegang tot actuele bronnen. De aanwezigheid van een taalmodel bevestigt geen webzoekfunctie.",
          image:
            "De foto's bevestigen geen beeldgeneratie. De beheerder moet een werkende beeldfunctie aan een configuratie koppelen.",
          actions:
            "De beheerder moet beschikbare gereedschappen, rechten, bevestiging en logging vastleggen.",
        }[profile.feature],
        source: "Catalogus uit platformfoto's; ingeschakelde functies onbekend",
      });
    if (detected.localOnly)
      checks.push({
        title: "Uitsluitend lokale verwerking",
        text: "Je opdracht sluit cloudverwerking uit. Een model is pas kandidaat als lokale verwerking van de hele configuratie door de beheerder is bevestigd.",
        source: "Expliciete voorwaarde uit je taakbeschrijving",
      });
    if (a.use === "actions" && type !== "agent")
      checks.push({
        title: "Uitvoeren vraagt aanvullende rechten",
        text: "Je wilt ook handelingen laten uitvoeren. Alleen configuraties met een bevestigde gereedschapsfunctie blijven kandidaat.",
        source: "Gebruikscontext en methodiek v1.1, poort 1",
      });
    const missing = [];
    if (!a.task.trim() || type === "unknown")
      missing.push("Gewenste taak verduidelijken.");
    if (!a.data || a.data === "unknown")
      missing.push("Soort gegevens vaststellen.");
    if (!a.use || a.use === "unknown")
      missing.push("Gebruik van de uitkomst verduidelijken.");
    if (required.length && !candidates.length)
      missing.push(
        "Geschikte platformfunctie bevestigen: " + profile.need + ".",
      );
    if (candidates.some((m) => m.gate.status === "unknown"))
      missing.push(
        "Beheerder: platformafspraken voor de genoemde modellen vastleggen.",
      );
    if (candidates.some((m) => !m.config.deployment.trim()))
      missing.push(
        "Beheerder: onderliggende modelversie en configuratie bevestigen.",
      );
    if (profile.role)
      missing.push(
        "Taakspecifieke kwaliteit en belasting toetsen; er is nog geen gevalideerde prestatierangorde.",
      );
    const secondary =
      type === "audio" && detected.chain
        ? all.filter(
            (m) =>
              m.roles.includes("routine") &&
              m.config.enabled &&
              m.gate.status !== "blocked" &&
              !m.dynamic &&
              required
                .filter((f) => f !== "audio")
                .every(
                  (f) =>
                    m.config.features[f] === "yes" &&
                    m.config.featureRef.trim() &&
                    m.config.deployment.trim(),
                ),
          )
        : [];
    return {
      type,
      profile,
      detected,
      required,
      candidates,
      blocked,
      secondary,
      checks,
      missing,
      automaticRouting: false,
      status: "advice_only",
      rule: "TASK-" + type.toUpperCase(),
      rulesVersion: VERSION,
      headline:
        type === "numbers"
          ? "Gebruik voor de berekening een rekenhulpmiddel"
          : type === "unknown"
            ? "Maak de gewenste uitkomst concreter"
            : required.length && !candidates.length
              ? "Eerst de benodigde platformfunctie bevestigen"
              : profile.role === "routine"
                ? "Begin met een model voor afgebakende teksttaken"
                : profile.role === "analysis"
                  ? "Vergelijk de modellen voor analyse en redeneren"
                  : profile.role === "code"
                    ? "Begin bij de modellen voor programmeertaken"
                    : profile.role === "complex"
                      ? "Beproef de modellen voor complex werk"
                      : "Controleer de configuratie voor deze taak",
    };
  }
  function metrics(row, expectedDeployment) {
    const n = row.accepted,
      valid =
        Number.isInteger(row.cases) &&
        row.cases > 0 &&
        Number.isInteger(n) &&
        n > 0 &&
        n <= row.cases;
    const evidenced =
      valid &&
      !!row.reference?.trim() &&
      (expectedDeployment === undefined ||
        row.deployment === expectedDeployment);
    const per = (k) =>
      evidenced && Number.isFinite(row[k]) && row[k] >= 0 ? row[k] / n : null;
    return {
      valid,
      evidenced,
      cost: per("cost"),
      minutes: per("minutes"),
      energy: row.boundary?.trim() ? per("energy") : null,
    };
  }
  const out = {
    VERSION,
    SCHEMA,
    CONFIG,
    TYPES,
    CATALOG: C,
    infer,
    newAdvice,
    defaultPlatform,
    parseAdvice,
    parsePlatform,
    recommend,
    metrics,
  };
  if (typeof module !== "undefined" && module.exports) module.exports = out;
  else root.PAM_SELECT = out;
})(typeof globalThis !== "undefined" ? globalThis : this);
