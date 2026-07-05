/* ============================================================
   MODELREGISTER — kies-ai v1.0
   ------------------------------------------------------------
   Dit bestand is EIGENDOM VAN DE INSTELLING.
   Beheer: informatiemanagement / architectuur.
   Het beslismechanisme (engine.js) leest dit register maar
   kent geen enkel model. Voeg modellen toe, wijzig of verwijder
   ze zonder één regel engine-code aan te raken.

   Schema per model — alle velden verplicht tenzij anders vermeld:
   id             unieke sleutel (string, kebab-case)
   name           weergavenaam
   type           "cloud-llm" | "lokale-llm" | "rag" | "specialist"
   hosting        "us-cloud" | "eu-cloud" | "on-prem"
   dpa            verwerkersovereenkomst aanwezig (bool)
   consumerVersion true = consumentenversie zonder zakelijke
                  garanties (wordt gefilterd bij vertrouwelijk werk)
   capabilities   { capabilityId: 0..3 }  (0 = niet, 3 = uitstekend)
   reasoning      0..3   coding 0..3   vision 0..3   toolUse 0..3
   memory         0..3   contextLength "kort"|"middel"|"lang"
   grounding      "geen" | "web" | "bronnen"  (herleidbare citaties)
   explainability 1..3  (3 = volledig auditbaar redeneerspoor/logs)
   openSource     bool   offline bool
   costs          1..3   footprint 1..3 (energie/water; 3 = zwaar)
   exitCosts      1..3   (3 = hoge lock-in: gesloten formaat, geen export)
   riskProfile    "laag" | "middel" | "hoog"
   strengths / weaknesses   arrays van korte zinnen (NL)
   privacyNotes / governanceNotes  korte zinnen (NL)
   ============================================================ */

const MODEL_REGISTRY = {
  meta: {
    institution: "Voorbeeldinstelling (pas aan)",
    version: "2026.07",
    maintainer: "informatiemanagement@instelling.nl",
    schemaVersion: 1
  },
  models: [
    {
      id: "cloud-llm-a",
      name: "ChatGPT (Edu-licentie)",
      type: "cloud-llm",
      hosting: "us-cloud",
      dpa: true,
      consumerVersion: false,
      capabilities: {
        brainstormen: 3, samenvatten: 3, herschrijven: 3, vertalen: 3,
        "beleid-schrijven": 2, communiceren: 3, analyseren: 3, redeneren: 3,
        vergelijken: 3, "argumenten-toetsen": 3, "literatuur-review": 2,
        "kennis-zoeken": 1, "feiten-zoeken": 2, tutoring: 2,
        "toetsvragen-ontwikkelen": 2, "feedback-op-werk": 2,
        "code-genereren": 3, "data-analyseren": 3, berekenen: 2,
        "visuals-maken": 2, transcriberen: 1, "extractie-classificatie": 2,
        "workflow-automatiseren": 2
      },
      reasoning: 3, coding: 3, vision: 3, toolUse: 3, memory: 2,
      contextLength: "middel", grounding: "web",
      explainability: 1, openSource: false, offline: false,
      costs: 2, footprint: 3, exitCosts: 2, riskProfile: "middel",
      strengths: ["Breed inzetbaar", "Sterke algemene kwaliteit", "Web-zoeken beschikbaar"],
      weaknesses: ["VS-hosting: doorgifte-beoordeling nodig", "Beperkt auditbaar", "Geen herleidbare broncitaties uit eigen collecties"],
      privacyNotes: "Alleen de Edu-licentie met verwerkersovereenkomst gebruiken; consumentenversie is uitgesloten voor werk.",
      governanceNotes: "Doorgifte buiten EER beoordelen (DPIA); geen bijzondere persoonsgegevens."
    },
    {
      id: "cloud-llm-b",
      name: "Claude (Team/Enterprise)",
      type: "cloud-llm",
      hosting: "us-cloud",
      dpa: true,
      consumerVersion: false,
      capabilities: {
        brainstormen: 3, samenvatten: 3, herschrijven: 3, vertalen: 3,
        "beleid-schrijven": 3, communiceren: 3, analyseren: 3, redeneren: 3,
        vergelijken: 3, "argumenten-toetsen": 3, "literatuur-review": 2,
        "kennis-zoeken": 1, "feiten-zoeken": 2, tutoring: 2,
        "toetsvragen-ontwikkelen": 2, "feedback-op-werk": 3,
        "code-genereren": 3, "data-analyseren": 3, berekenen: 2,
        "visuals-maken": 0, transcriberen: 0, "extractie-classificatie": 2,
        "workflow-automatiseren": 2
      },
      reasoning: 3, coding: 3, vision: 2, toolUse: 3, memory: 2,
      contextLength: "lang", grounding: "web",
      explainability: 1, openSource: false, offline: false,
      costs: 2, footprint: 3, exitCosts: 1, riskProfile: "middel",
      strengths: ["Sterk in lange documenten en redeneren", "Sterk in beleids- en schrijfwerk", "Data-export mogelijk"],
      weaknesses: ["VS-hosting: doorgifte-beoordeling nodig", "Geen beeldgeneratie", "Beperkt auditbaar"],
      privacyNotes: "Zakelijke licentie met verwerkersovereenkomst vereist.",
      governanceNotes: "Doorgifte buiten EER beoordelen; geen bijzondere persoonsgegevens."
    },
    {
      id: "cloud-llm-c",
      name: "Gemini (Workspace for Education)",
      type: "cloud-llm",
      hosting: "eu-cloud",
      dpa: true,
      consumerVersion: false,
      capabilities: {
        brainstormen: 3, samenvatten: 3, herschrijven: 2, vertalen: 3,
        "beleid-schrijven": 2, communiceren: 3, analyseren: 3, redeneren: 2,
        vergelijken: 2, "argumenten-toetsen": 2, "literatuur-review": 2,
        "kennis-zoeken": 1, "feiten-zoeken": 3, tutoring: 2,
        "toetsvragen-ontwikkelen": 2, "feedback-op-werk": 2,
        "code-genereren": 2, "data-analyseren": 2, berekenen: 2,
        "visuals-maken": 2, transcriberen: 2, "extractie-classificatie": 2,
        "workflow-automatiseren": 2
      },
      reasoning: 2, coding: 2, vision: 3, toolUse: 2, memory: 2,
      contextLength: "lang", grounding: "web",
      explainability: 1, openSource: false, offline: false,
      costs: 1, footprint: 3, exitCosts: 2, riskProfile: "middel",
      strengths: ["Zeer lange context", "Sterk multimodaal (beeld/video)", "Integratie met Workspace"],
      weaknesses: ["Beperkt auditbaar", "Koppeling aan Google-ecosysteem verhoogt exit-kosten"],
      privacyNotes: "Education-tenant met verwerkersovereenkomst; EU-dataregio instelbaar.",
      governanceNotes: "Ecosysteemafhankelijkheid meewegen bij structureel gebruik."
    },
    {
      id: "cloud-llm-d",
      name: "Microsoft 365 Copilot",
      type: "cloud-llm",
      hosting: "eu-cloud",
      dpa: true,
      consumerVersion: false,
      capabilities: {
        brainstormen: 2, samenvatten: 3, herschrijven: 3, vertalen: 2,
        "beleid-schrijven": 2, communiceren: 3, analyseren: 2, redeneren: 2,
        vergelijken: 2, "argumenten-toetsen": 1, "literatuur-review": 1,
        "kennis-zoeken": 2, "feiten-zoeken": 2, tutoring: 0,
        "toetsvragen-ontwikkelen": 1, "feedback-op-werk": 1,
        "code-genereren": 1, "data-analyseren": 2, berekenen: 1,
        "visuals-maken": 1, transcriberen: 3, "extractie-classificatie": 2,
        "workflow-automatiseren": 2
      },
      reasoning: 2, coding: 1, vision: 2, toolUse: 2, memory: 2,
      contextLength: "middel", grounding: "bronnen",
      explainability: 2, openSource: false, offline: false,
      costs: 3, footprint: 2, exitCosts: 3, riskProfile: "middel",
      strengths: ["Werkt binnen eigen documenten en mail (tenant-grounding)", "Vergaderverslagen en samenvattingen", "EU-datagrens beschikbaar"],
      weaknesses: ["Sterk gebonden aan Microsoft-ecosysteem (hoge exit-kosten)", "Beperkt buiten Office-context", "Relatief duur per gebruiker"],
      privacyNotes: "Verwerking binnen de eigen tenant; toegangsrechten bepalen wat het model ziet — rechtenhygiëne is voorwaarde.",
      governanceNotes: "Hoge lock-in: bij structureel gebruik exit-strategie en dataportabiliteit vastleggen."
    },
    {
      id: "eu-llm",
      name: "Mistral (EU-hosting)",
      type: "cloud-llm",
      hosting: "eu-cloud",
      dpa: true,
      consumerVersion: false,
      capabilities: {
        brainstormen: 2, samenvatten: 3, herschrijven: 2, vertalen: 3,
        "beleid-schrijven": 2, communiceren: 2, analyseren: 2, redeneren: 2,
        vergelijken: 2, "argumenten-toetsen": 2, "literatuur-review": 1,
        "kennis-zoeken": 1, "feiten-zoeken": 1, tutoring: 1,
        "toetsvragen-ontwikkelen": 1, "feedback-op-werk": 1,
        "code-genereren": 2, "data-analyseren": 2, berekenen: 1,
        "visuals-maken": 0, transcriberen: 0, "extractie-classificatie": 2,
        "workflow-automatiseren": 1
      },
      reasoning: 2, coding: 2, vision: 1, toolUse: 2, memory: 1,
      contextLength: "middel", grounding: "geen",
      explainability: 2, openSource: true, offline: false,
      costs: 1, footprint: 2, exitCosts: 1, riskProfile: "laag",
      strengths: ["EU-hosting en EU-jurisdictie", "Open gewichten beschikbaar (migratiepad naar on-prem)", "Lage exit-kosten"],
      weaknesses: ["Minder sterk in complexe redenering dan frontier-modellen", "Geen web-zoeken standaard"],
      privacyNotes: "Verwerking binnen de EU; geschikt voor vertrouwelijke interne documenten na DPIA.",
      governanceNotes: "Digitale soevereiniteit: open gewichten geven een geloofwaardig exit-pad."
    },
    {
      id: "lokale-llm",
      name: "Lokale open-source-LLM (on-prem / SURF-omgeving)",
      type: "lokale-llm",
      hosting: "on-prem",
      dpa: true,
      consumerVersion: false,
      capabilities: {
        brainstormen: 2, samenvatten: 2, herschrijven: 2, vertalen: 2,
        "beleid-schrijven": 1, communiceren: 2, analyseren: 2, redeneren: 1,
        vergelijken: 2, "argumenten-toetsen": 1, "literatuur-review": 1,
        "kennis-zoeken": 2, "feiten-zoeken": 0, tutoring: 1,
        "toetsvragen-ontwikkelen": 1, "feedback-op-werk": 1,
        "code-genereren": 2, "data-analyseren": 2, berekenen: 1,
        "visuals-maken": 0, transcriberen: 0, "extractie-classificatie": 3,
        "workflow-automatiseren": 1
      },
      reasoning: 1, coding: 2, vision: 1, toolUse: 1, memory: 1,
      contextLength: "middel", grounding: "geen",
      explainability: 3, openSource: true, offline: true,
      costs: 2, footprint: 1, exitCosts: 1, riskProfile: "laag",
      strengths: ["Data verlaat de instelling niet", "Volledig auditbaar en logbaar", "Geschikt voor persoonsgegevens na DPIA", "Laagste voetafdruk per taak"],
      weaknesses: ["Merkbaar lager taalvermogen dan frontier-modellen", "Vraagt eigen beheer en capaciteit"],
      privacyNotes: "Voorkeursoptie zodra persoonsgegevens of bijzondere categorieën in het geding zijn.",
      governanceNotes: "Maximale keuzeruimte: geen leverancier tussen instelling en model."
    },
    {
      id: "instellings-rag",
      name: "Kennisbank-assistent (RAG op eigen bronnen)",
      type: "rag",
      hosting: "on-prem",
      dpa: true,
      consumerVersion: false,
      capabilities: {
        brainstormen: 0, samenvatten: 2, herschrijven: 0, vertalen: 0,
        "beleid-schrijven": 1, communiceren: 0, analyseren: 2, redeneren: 1,
        vergelijken: 2, "argumenten-toetsen": 0, "literatuur-review": 3,
        "kennis-zoeken": 3, "feiten-zoeken": 0, tutoring: 1,
        "toetsvragen-ontwikkelen": 0, "feedback-op-werk": 0,
        "code-genereren": 0, "data-analyseren": 0, berekenen: 0,
        "visuals-maken": 0, transcriberen: 0, "extractie-classificatie": 1,
        "workflow-automatiseren": 0
      },
      reasoning: 1, coding: 0, vision: 0, toolUse: 1, memory: 0,
      contextLength: "middel", grounding: "bronnen",
      explainability: 3, openSource: true, offline: true,
      costs: 1, footprint: 1, exitCosts: 1, riskProfile: "laag",
      strengths: ["Elke bewering herleidbaar naar een brondocument", "Antwoorden beperkt tot eigen, gevalideerde collecties", "Volledig auditbaar"],
      weaknesses: ["Weet niets buiten de aangesloten bronnen", "Kwaliteit staat of valt met de kwaliteit van de collectie"],
      privacyNotes: "Toegangsrechten van de bronnen worden gerespecteerd; rechtenhygiëne is voorwaarde.",
      governanceNotes: "Eerste keus wanneer herleidbaarheid een eis is (beleid, bestuur, kwaliteitszorg)."
    },
    {
      id: "transcriptie-lokaal",
      name: "Transcriptiedienst (Whisper, on-prem)",
      type: "specialist",
      hosting: "on-prem",
      dpa: true,
      consumerVersion: false,
      capabilities: {
        brainstormen: 0, samenvatten: 0, herschrijven: 0, vertalen: 1,
        "beleid-schrijven": 0, communiceren: 0, analyseren: 0, redeneren: 0,
        vergelijken: 0, "argumenten-toetsen": 0, "literatuur-review": 0,
        "kennis-zoeken": 0, "feiten-zoeken": 0, tutoring: 0,
        "toetsvragen-ontwikkelen": 0, "feedback-op-werk": 0,
        "code-genereren": 0, "data-analyseren": 0, berekenen: 0,
        "visuals-maken": 0, transcriberen: 3, "extractie-classificatie": 0,
        "workflow-automatiseren": 0
      },
      reasoning: 0, coding: 0, vision: 0, toolUse: 0, memory: 0,
      contextLength: "kort", grounding: "geen",
      explainability: 3, openSource: true, offline: true,
      costs: 1, footprint: 1, exitCosts: 1, riskProfile: "laag",
      strengths: ["Audio verlaat de instelling niet", "Geschikt voor interviews met persoonsgegevens (na DPIA)", "Open source"],
      weaknesses: ["Alleen transcriptie; geen analyse", "Namen en jargon vragen nacontrole"],
      privacyNotes: "Standaardkeuze voor onderzoeksinterviews en vertrouwelijke opnames.",
      governanceNotes: "Combineer met een tweede model voor analyse van het transcript — dat is een aparte capaciteitskeuze."
    },
    {
      id: "beeldgenerator",
      name: "Beeldgenerator (zakelijke licentie)",
      type: "specialist",
      hosting: "eu-cloud",
      dpa: true,
      consumerVersion: false,
      capabilities: {
        brainstormen: 1, samenvatten: 0, herschrijven: 0, vertalen: 0,
        "beleid-schrijven": 0, communiceren: 0, analyseren: 0, redeneren: 0,
        vergelijken: 0, "argumenten-toetsen": 0, "literatuur-review": 0,
        "kennis-zoeken": 0, "feiten-zoeken": 0, tutoring: 0,
        "toetsvragen-ontwikkelen": 0, "feedback-op-werk": 0,
        "code-genereren": 0, "data-analyseren": 0, berekenen: 0,
        "visuals-maken": 3, transcriberen: 0, "extractie-classificatie": 0,
        "workflow-automatiseren": 0
      },
      reasoning: 0, coding: 0, vision: 3, toolUse: 0, memory: 0,
      contextLength: "kort", grounding: "geen",
      explainability: 1, openSource: false, offline: false,
      costs: 2, footprint: 3, exitCosts: 1, riskProfile: "middel",
      strengths: ["Hoogwaardige illustraties en campagnebeeld", "Zakelijke licentie met vrijwaring"],
      weaknesses: ["Auteursrechtelijke status van output blijft aandachtspunt", "Geen herkenbare personen of merken genereren"],
      privacyNotes: "Geen persoonsgegevens of herkenbare personen als invoer gebruiken.",
      governanceNotes: "Bij publicatie: menselijke redactie en beeldverantwoording verplicht."
    }
  ]
};

/* Node- én browser-compatibel */
if (typeof module !== "undefined" && module.exports) {
  module.exports = { MODEL_REGISTRY };
} else if (typeof window !== "undefined") {
  window.MODEL_REGISTRY = MODEL_REGISTRY;
}
