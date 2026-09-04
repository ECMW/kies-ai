(function (root) {
  "use strict";
  const E =
    typeof module !== "undefined" && module.exports
      ? require("./engine.js")
      : root.PAM;
  function create(kind = "full") {
    const a = E.newAssessment();
    a.fictional = true;
    Object.assign(a.intake, {
      taskId: "FICTIEF-" + (kind === "pilot" ? "PILOT" : "VERGELIJKING"),
      task: "Interne beleidsvragen beantwoorden — fictieve casus",
      goal: "Een medewerker vindt een correct antwoord met verwijzing naar de geldende beleidsparagraaf.",
      use: "Een medewerker controleert ieder antwoord vóór gebruik. Geen besluiten over personen.",
      affected: "Fictieve medewerkers van een voorbeeldorganisatie.",
      baseline: "Een medewerker zoekt handmatig in dezelfde beleidsdocumenten.",
      whyAI: "Onderzoeken of ondersteund zoeken menselijk zoekwerk vermindert.",
      owner: "Fictieve besluiteigenaar",
      taskOwner: "Fictieve inhoudsdeskundige",
      scope:
        kind === "pilot"
          ? "Gecontroleerde pilot"
          : "Gedeeltelijke proportionaliteitsafweging",
      answers: [
        kind === "pilot" ? "Laag" : "Middel",
        "Ja",
        "Nee",
        "Nee",
        "Beperkt",
        "Nee",
        "Nee",
      ],
      thresholdReason:
        "Fictieve taaknorm: minimaal 90% geaccepteerd. Een verkeerde beleidsverwijzing met materiële gevolgen telt als kritieke fout; maximaal 2%.",
    });
    Object.assign(a.design, {
      criticalDefinition:
        "Een onjuist antwoord dat een medewerker tot een materieel onjuiste handeling kan brengen.",
      assessor: "Fictief panel van twee beleidsmedewerkers",
      doubleReview: "Ja",
      reliability:
        "Fictief: beide beoordelaars gebruiken dezelfde rubric en bespreken verschillen.",
      criteria: [
        {
          id: "A1",
          criterion: "Inhoud klopt en bronverwijzing is controleerbaar",
          method: "Twee beoordelaars vergelijken met de geldende passage",
          minimum: "Beide onderdelen juist",
          critical: "Ja",
          evidence: "B01",
        },
      ],
      strata: [
        {
          id: "S01",
          name: "Veelvoorkomende beleidsvragen",
          reason: "Representeert de afgebakende fictieve taak.",
          target: kind === "pilot" ? 30 : 189,
          required: "Ja",
          note: "Uitsluitend deze voorbeeldsituatie.",
        },
      ],
    });
    a.evidence = [
      {
        id: "B01",
        source: "FICTIEF test- en governancedossier",
        type: "Demonstratie",
        owner: "Fictieve reviewer",
        date: E.today(),
        grade: "A",
        location: "FICTIEF — geen werkelijk document",
        limitations:
          "Alle cijfers, controles en verwijzingen zijn fictief; uitsluitend om bediening en rekenregels te demonstreren.",
        useLimits: "",
      },
    ];
    a.candidates = [E.newCandidate("C01"), E.newCandidate("C02")];
    a.candidates.forEach((c, j) => {
      Object.assign(c, {
        type: j ? "AI-model" : "Niet-AI-baseline",
        name: j ? "Fictieve zoekassistent" : "Fictief handmatig zoeken",
        component: j ? "Fictieve AI-component" : "Mens + beleidsdocumenten",
        version: "Fictieve versie 1",
        deployment: "Fictieve goedgekeurde lokale werkomgeving",
        settings:
          "Vaste voorbeeldset, alleen lezen, medewerker controleert ieder antwoord.",
        fingerprint: "FICTIEF-build-1",
        testDate: E.today(),
        coverage: "Ja",
        rubric: "Ja",
        coverageNote:
          "Fictieve volledige dekking van de vooraf gekozen voorbeeldvragen.",
        rubricNote: "Fictieve overeenstemming tussen twee beoordelaars.",
        proportionality: "MULTIPLE PROPORTIONAL OPTIONS",
        reason:
          "Fictieve afweging: beide opties voldoen. De assistent kost meer geld en minder menswerk; de lokale prioriteit blijft een expliciete keuze.",
      });
      c.gate.forEach((g) =>
        Object.assign(g, { status: "PASS", evidence: "B01" }),
      );
      Object.assign(c.context, {
        autonomy: "Fictief: lokale uitvoering; geen datadoorgifte.",
        correction: "Fictief: medewerker kan terugkeren naar handmatig zoeken.",
        inclusion: "Fictief: bron is ook zonder assistent beschikbaar.",
        implementation: "Fictief: installatie en onderhoud vragen menswerk.",
        other: "Beperkte claim: alleen deze taak, geen milieubeoordeling.",
        evidence: "B01",
        complete: "Ja",
      });
      const n = kind === "pilot" ? 30 : 189;
      for (let k = 0; k < n; k++)
        a.runs.push({
          id: "FICTIEF-" + c.id + "-" + (k + 1),
          candidate: c.id,
          testCase: "TC-" + String(k + 1).padStart(3, "0"),
          stratum: "S01",
          accepted: 1,
          critical: 0,
          quality: null,
          calls: j ? 1 : 0,
          retries: 0,
          verify: j ? 1 : 4,
          correct: 0,
          latency: j ? 75 : 240,
          cost: j ? 0.02 : 0,
          inputTokens: null,
          outputTokens: null,
          reasoningTokens: null,
          energy: null,
          carbon: null,
          water: null,
          evidence: "B01",
          notes: "FICTIEVE uitkomst",
          configStamp: E.configStamp(c),
          designStamp: E.designStamp(a),
        });
    });
    a.pairs = [
      {
        a: "C02",
        b: "C01",
        comparable: "Ja",
        environmentComparable: "Nee",
        rationale:
          "Fictieve afweging: gelijke taakgeschiktheid, minder mensminuten tegenover hogere directe kosten en implementatiewerk. Geen algemene winnaar.",
        evidence: "B01",
        limits:
          "Milieu is onbekend; geen uitspraak over energie, CO₂e of water.",
      },
    ];
    Object.assign(a.decision, {
      selected: kind === "pilot" ? ["C02"] : ["C01", "C02"],
      outcome: kind === "pilot" ? "Eén optie" : "Meerdere opties",
      value: "Fictief: correcte en controleerbare beleidsantwoorden.",
      burdens:
        "Fictief: extra directe kosten en beheerwerk tegenover minder zoektijd. Menselijke controle blijft nodig.",
      alternatives:
        "Handmatig zoeken blijft een volwaardig alternatief en uitwijkmogelijkheid.",
      uncertainty:
        "Fictief bewijs. Milieubelasting is onbekend en buiten deze afweging. " +
        (kind === "pilot"
          ? "30 cases geven nog onvoldoende statistische zekerheid."
          : ""),
      conditions:
        "Uitsluitend deze voorbeeldtaak, geen persoonsgegevens of externe acties. Elk antwoord wordt gecontroleerd.",
      stopRecovery:
        "Stop bij een kritieke fout of configuratiewijziging. Keer terug naar handmatig zoeken en onderzoek herstel.",
      rationale:
        kind === "pilot"
          ? "Alleen een begrensde fictieve pilot met aanvullende bewijsverzameling; geen brede inzet."
          : "Beide fictieve alternatieven blijven verdedigbaar. Een organisatorische voorkeur vraagt een gemotiveerd menselijk besluit.",
    });
    return a;
  }
  if (typeof module !== "undefined" && module.exports)
    module.exports = { create };
  else root.PAM_EXAMPLES = { create };
})(typeof window !== "undefined" ? window : globalThis);
