# kies-ai v1.0 — documentatie

AI-modelkeuze-assistent voor het hoger onderwijs. Capability-first, leveranciersneutraal, governance-bewust, uitlegbaar.

---

## 1. Snel starten (gebruikershandleiding)

1. Open `index.html` in een browser. Geen installatie, geen server, geen internetverbinding nodig (de lettertypen degraderen netjes zonder verbinding). Er verlaten **geen gegevens** de pagina.
2. Kies optioneel je werkveld (alleen voor suggesties), daarna het **vermogen**: wat moet er gebeuren?
3. Beantwoord de vragen die verschijnen — de assistent stelt alleen vragen die voor jouw geval de uitkomst kunnen veranderen (meestal 2 tot 4).
4. Lees het advies: model, alternatieven, betrouwbaarheid, menselijke toets, governance, privacy, risico's, beperkingen én het volledige redeneerspoor.
5. Druk het advies af als onderbouwing bij je aanvraag of DPIA (knop "Advies afdrukken").

Voor beheerders: `print.html` bevat de A4-beslisboom, snelkaart, poster en bestuurlijke samenvatting; afdrukken via de browser (Ctrl/Cmd+P).

---

## 2. Architectuur en kennismodel

```
  Vermogenstaxonomie (Laag 1, stabiel)          engine.js
        │  23 vermogens · 6 groepen · 16 domeinen
        ▼
  Beslissingscriteria (adaptieve vragen)        engine.js
        │  gegevensklasse · inzet · bronnen-eis · beeld · schaal
        ▼
  Vermogens- & governance-eisen                 engine.js
        │  12 regels: filters (niet compenseerbaar) + adviezen
        ▼
  Beschikbare organisatiemodellen               registry.js  ← VAN DE INSTELLING
        │  vermogensscores · privacyprofiel · hosting · exit-kosten
        │  voetafdruk · uitlegbaarheid · grounding · kosten
        ▼
  Aanbeveling                                   engine.js → app.js
     model · alternatieven · betrouwbaarheid · redeneerspoor
     menselijke toets · governance · privacy · beperkingen
```

**Harde scheiding.** `engine.js` bevat geen enkele modelnaam. `registry.js` bevat geen enkele beslisregel. `app.js` bevat geen besliskennis. Dit is de future-proof-garantie (zie §5).

**Volgorde is betekenis.** Governance-regels zijn *filters vóór de score*: een model dat de AVG-toets niet haalt, kan dat niet compenseren met kwaliteit. Pas binnen de toegestane verzameling wordt gerangschikt — op vermogensfit, gecorrigeerd voor voetafdruk (duurzaamheid) en exit-kosten (lock-in-preventie, zwaarder bij structureel gebruik).

**Toezichtsregimes.** Elke aanbeveling krijgt een regime: *mens beslist* (besluiten over personen — AI Act), *mens in de lus* (interne besluiten en publicaties) of *steekproef* (verkenning).

---

## 3. Modelregister beheren

Het register (`registry.js`) is een bestuurlijk asset. Wijzigen:

1. Open `registry.js` in een teksteditor.
2. Kopieer een bestaand modelblok, pas de velden aan (schema staat bovenin het bestand gedocumenteerd).
3. Sla op en herlaad `index.html`. De engine valideert het register bij het opstarten en toont schemafouten in beeld — een kapot register faalt luid, niet stil.

Richtlijnen: scoor vermogens conservatief (0–3); vul `privacyNotes` en `governanceNotes` altijd; werk `meta.version` bij per wijziging; leg wijzigingen vast in het architectuurberaad.

---

## 4. API-specificatie (koppeling eigen catalogus)

De engine is een pure functie; dezelfde logica draait ongewijzigd client-side of server-side (Node). Instellingen die het register centraal willen beheren, zetten deze REST-laag ervoor:

```
GET  /api/v1/capabilities
     → { groups: [...], capabilities: [...], domains: [...] }   (Laag 1, read-only)

GET  /api/v1/questions?capability={id}
     → [ { id, text, why, options[] } ]                          (alleen relevante vragen)

GET  /api/v1/registry
PUT  /api/v1/registry            (rol: informatiemanagement; gevalideerd met validateRegistry)
     → registry-JSON conform het schema in registry.js

POST /api/v1/recommend
     body:     { "capability": "samenvatten",
                 "answers": { "data": "intern", "stakes": "besluit", "bronnen": "nee" } }
     antwoord: { "recommended": {...}, "alternatives": [...], "confidence": "middel",
                 "humanReview": "mens-in-de-lus", "trace": [...], "governance": [...],
                 "privacy": [...], "risks": [...], "limitations": [...] }

GET  /api/v1/audit?from=...&to=...   (v2: gelogde adviezen t.b.v. verantwoording)
```

Implementatieskelet (Express, ~15 regels): importeer `engine.js` en `registry.js`, map `POST /recommend` op `ENGINE.recommend(body, registry)`. Het antwoordcontract is identiek aan wat de webapp toont — één bron van waarheid.

---

## 5. Toekomstvastheid: het verdwijntest-bewijs

**Stelling:** verdwijnen alle huidige AI-modellen binnen vijf jaar, dan hoeft alleen `registry.js` te worden bijgewerkt.

**Bewijs door constructie.** (1) `engine.js` refereert nergens aan een modelnaam — controleer met `grep -i "chatgpt\|claude\|gemini\|copilot\|mistral\|whisper" engine.js`: nul treffers. (2) De taxonomie beschrijft menselijk werk (samenvatten, analyseren, feedback geven), geen technologie; die vraag bestond vóór AI en bestaat erna. (3) De governance-regels verwijzen naar wetgeving en modeleigenschappen (`hosting`, `dpa`, `grounding`, `explainability`), niet naar producten. Een hypothetisch model uit 2031 dat die velden invult, wordt door dezelfde regels correct behandeld. (4) De testsuite (`gen-scenarios.js`) draait tegen het register en blijft geldig bij elke registerinhoud — de asserties toetsen eigenschappen, geen namen.

Wat wél onderhoud vraagt naast het register: de governance-regels bij wetswijziging (AI Act-uitwerkingen) en de taxonomie bij werkelijk nieuwe vermogens — beide bewust bestuurlijk, laagfrequent onderhoud.

---

## 6. Ontwerpprincipes en publieke waarden

- **Capability-first (harde eis):** de modelvraag is in de interface letterlijk vergrendeld tot het vermogen vaststaat.
- **Leveranciersneutraal:** rangschikking uitsluitend op registerdata; exit-kosten wegen standaard licht mee en zwaar bij structureel gebruik — het mechanisme heeft een ingebouwde voorkeur tégen lock-in.
- **Uitlegbaar:** elk advies draagt een redeneerspoor met regel-ID's; geschikt als bijlage bij DPIA of inkoopdossier.
- **Duurzaam:** voetafdruk staat in het register; bij eenvoudige taken krijgt het zuinigste toereikende model voorrang ("zwaarte moet verdiend worden").
- **Menselijkheid:** onderwijsnabije vermogens (tutoring, feedback, toetsing) activeren altijd het advies dat AI de begeleidingsrelatie ondersteunt en niet vervangt, met transparantie richting studenten.
- **Faal luid:** een leeg kandidatenveld is een *registerhiaat* met een meldadvies — nooit een stille versoepeling van de eisen.

---

## 7. Kritische review v1.0 en voorstel v2.0

**Zwaktes van v1.0 (eerlijk benoemd):**

1. **Zelfclassificatie is de achilleshiel.** Wie "persoonsgegevens" niet aanvinkt, omzeilt elk filter. Het mechanisme disciplineert de welwillende gebruiker; het detecteert de onzorgvuldige niet.
2. **Registerscores zijn meningen.** De 0–3-vermogensscores zijn expertoordelen zonder benchmarkonderbouwing; Goodhart ligt op de loer zodra leveranciers weten dat het register selecteert.
3. **Eén vermogen per vraag.** Veel echt werk is een keten (transcriberen → analyseren → samenvatten). v1.0 dwingt tot losse selecties en mist de governance van de kéten (foutpropagatie, gecombineerde privacyrisico's).
4. **Grofmazige AI Act-toets.** "Besluit over personen" is een proxy; de echte hoog-risicoclassificatie is fijnmaziger (Annex III) en vraagt juridische duiding per casus.
5. **Geen gebruikslogboek.** Adviezen worden niet centraal gelogd, waardoor de instelling geen zicht krijgt op feitelijk AI-gebruik — precies de observability die sturing mogelijk maakt.
6. **Ontbrekende vermogens:** spraaksynthese, presentaties bouwen, roosteren/plannen, peer-review-ondersteuning, toegankelijkheidscontrole, codemigratie.

**Voorstel v2.0:**

- **Ketenselectie:** werkstromen als reeks vermogens, met governance-evaluatie over de hele keten en dissensus-signalering tussen modellen bij hoge inzet.
- **Registerobjectivering:** vermogensscores koppelen aan (sector)benchmarks, met SURF/Npuls als gedeeld registerbeheer — één sectorregister, lokale overrides.
- **Auditlaag:** opt-in logging van adviezen (niet van inhoud) → managementinformatie over AI-gebruik, voedt inkoop en beleid.
- **AI Act-module:** gestructureerde Annex III-toets met verwijzing naar de FG, in plaats van één proxyvraag.
- **Organisatieprofielen:** per instelling instelbare drempels (bijv. "wij staan geen VS-cloud toe, ook niet voor openbare data") als configuratie boven op de regels — beleid als parameter.
- **Meertaligheid** (Engels) en integratie in intranet/SSO.

---

## 8. Beperkingen (voor de goede orde)

Dit instrument adviseert; het besluit niet. Het vervangt geen DPIA, geen inkooptraject en geen juridische toets. Het register weerspiegelt de kennis van de beheerder op de versiedatum. En de belangrijkste beperking van elk zelfhulpinstrument: het werkt voor wie het gebruikt.
