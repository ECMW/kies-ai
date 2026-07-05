# Testrapport — 100 scenario's door de kies-ai-engine v1.0

Register: Voorbeeldinstelling (pas aan), versie 2026.07 (9 modellen). Elk scenario is door de echte engine gehaald; dit rapport is gegenereerd, niet geschreven.

**Ingebouwde asserties (moeten voor alle 100 gelden):** (A1) persoonsgegevens landen nooit op een VS-cloudmodel; (A2) besluiten over personen krijgen altijd het regime 'mens beslist' en een AI Act-verwijzing; (A3) een bron-eis levert alleen modellen met herleidbare citaties op.


## 1. [Onderwijs] Docent geschiedenis wil werkvormen bedenken voor een hoorcollege over de Koude Oorlog.
- **Gestelde vragen:** data, stakes
- **Vermogen (Laag 1):** Brainstormen & ideeën verkennen
- **Model (Laag 2):** Lokale open-source-LLM (on-prem / SURF-omgeving) (score 5.75, betrouwbaarheid laag)
- **Alternatieven:** Gemini (Workspace for Education); Claude (Team/Enterprise); ChatGPT (Edu-licentie)
- **Menselijke toets:** steekproef
- **Redeneerspoor:** LAAG-1 → R-DUUR-1 → LAAG-2 → SCORE → TOEZICHT
- **Governance-advies:** Maximale keuzeruimte: geen leverancier tussen instelling en model.

## 2. [Onderwijs] Docent wil oefenvragen maken bij een openbaar leerboek statistiek.
- **Gestelde vragen:** data, stakes
- **Vermogen (Laag 1):** Toets- en oefenvragen ontwikkelen
- **Model (Laag 2):** Gemini (Workspace for Education) (score 5.2, betrouwbaarheid laag)
- **Alternatieven:** Claude (Team/Enterprise); ChatGPT (Edu-licentie); Mistral (EU-hosting)
- **Menselijke toets:** steekproef
- **Redeneerspoor:** LAAG-1 → R-PUBVAL-1 → LAAG-2 → SCORE → TOEZICHT
- **Governance-advies:** Publieke waarden (menselijkheid): AI ondersteunt de docent en vervangt geen begeleidingsrelatie; wees transparant naar studenten over AI-gebruik en borg toegankelijkheid voor alle studenten. · Ecosysteemafhankelijkheid meewegen bij structureel gebruik.

## 3. [Onderwijs] Docent wil AI formatieve feedback laten geven op ingeleverde essays van studenten (met namen).
- **Gestelde vragen:** data, stakes
- **Vermogen (Laag 1):** Formatieve feedback op studentwerk
- **Model (Laag 2):** Mistral (EU-hosting) (score 5, betrouwbaarheid laag)
- **Alternatieven:** Lokale open-source-LLM (on-prem / SURF-omgeving); Microsoft 365 Copilot
- **Menselijke toets:** mens-beslist
- **Redeneerspoor:** LAAG-1 → R-AVG-1 → R-VERTROUWELIJK-1 → R-AIACT-1 → R-EXPLAIN-1 → R-PUBVAL-1 → LAAG-2 → SCORE → TOEZICHT
- **Governance-advies:** AI Act: het model mag uitsluitend adviseren; een mens neemt en motiveert het besluit. Registreer het gebruik, voer een DPIA/FRIA uit en informeer betrokkenen. · Publieke waarden (menselijkheid): AI ondersteunt de docent en vervangt geen begeleidingsrelatie; wees transparant naar studenten over AI-gebruik en borg toegankelijkheid voor alle studenten. · Digitale soevereiniteit: open gewichten geven een geloofwaardig exit-pad. · Dit gebruik valt vermoedelijk onder de hoog-risicocategorieën van de EU AI Act (beoordeling van of besluiten over personen in het onderwijs).

## 4. [Onderwijs] Docent wil een oefen-tutor voor studenten die moeite hebben met verzuringsevenwichten.
- **Gestelde vragen:** data, stakes, schaal
- **Vermogen (Laag 1):** Studenten laten oefenen & begeleiden
- **Model (Laag 2):** Claude (Team/Enterprise) (score 5, betrouwbaarheid laag)
- **Alternatieven:** Gemini (Workspace for Education); ChatGPT (Edu-licentie); Kennisbank-assistent (RAG op eigen bronnen)
- **Menselijke toets:** steekproef
- **Redeneerspoor:** LAAG-1 → R-LOCKIN-1 → R-PUBVAL-1 → LAAG-2 → SCORE → TOEZICHT
- **Governance-advies:** Structureel gebruik: leg exit-strategie en dataportabiliteit vast in de inkoopvoorwaarden; toets tegen de aanbestedingsdrempels. · Publieke waarden (menselijkheid): AI ondersteunt de docent en vervangt geen begeleidingsrelatie; wees transparant naar studenten over AI-gebruik en borg toegankelijkheid voor alle studenten. · Doorgifte buiten EER beoordelen; geen bijzondere persoonsgegevens.

## 5. [Toetsing] Examencommissie wil AI laten adviseren bij het beoordelen van fraudezaken.
- **Gestelde vragen:** data, stakes
- **Vermogen (Laag 1):** Argumenten & concepten kritisch toetsen
- **Model (Laag 2):** Mistral (EU-hosting) (score 8, betrouwbaarheid hoog)
- **Alternatieven:** Lokale open-source-LLM (on-prem / SURF-omgeving); Microsoft 365 Copilot
- **Menselijke toets:** mens-beslist
- **Redeneerspoor:** LAAG-1 → R-AVG-1 → R-VERTROUWELIJK-1 → R-AIACT-1 → R-EXPLAIN-1 → LAAG-2 → SCORE → TOEZICHT
- **Governance-advies:** AI Act: het model mag uitsluitend adviseren; een mens neemt en motiveert het besluit. Registreer het gebruik, voer een DPIA/FRIA uit en informeer betrokkenen. · Digitale soevereiniteit: open gewichten geven een geloofwaardig exit-pad. · Dit gebruik valt vermoedelijk onder de hoog-risicocategorieën van de EU AI Act (beoordeling van of besluiten over personen in het onderwijs).

## 6. [Toetsing] Toetsdeskundige wil twee toetsmatrijzen vergelijken op dekking van leerdoelen.
- **Gestelde vragen:** data, stakes
- **Vermogen (Laag 1):** Opties of documenten vergelijken
- **Model (Laag 2):** Claude (Team/Enterprise) (score 8, betrouwbaarheid laag)
- **Alternatieven:** ChatGPT (Edu-licentie); Kennisbank-assistent (RAG op eigen bronnen); Mistral (EU-hosting)
- **Menselijke toets:** mens-in-de-lus
- **Redeneerspoor:** LAAG-1 → R-VERTROUWELIJK-1 → LAAG-2 → SCORE → TOEZICHT
- **Governance-advies:** Doorgifte buiten EER beoordelen; geen bijzondere persoonsgegevens.

## 7. [Curriculum] Curriculumcommissie wil opleidingsprofielen van drie zusterinstellingen vergelijken.
- **Gestelde vragen:** data, stakes
- **Vermogen (Laag 1):** Opties of documenten vergelijken
- **Model (Laag 2):** Claude (Team/Enterprise) (score 8, betrouwbaarheid laag)
- **Alternatieven:** ChatGPT (Edu-licentie); Kennisbank-assistent (RAG op eigen bronnen); Mistral (EU-hosting)
- **Menselijke toets:** mens-in-de-lus
- **Redeneerspoor:** LAAG-1 → LAAG-2 → SCORE → TOEZICHT
- **Governance-advies:** Doorgifte buiten EER beoordelen; geen bijzondere persoonsgegevens.

## 8. [Curriculum] Opleidingsmanager schrijft een herzieningsnotitie voor het curriculum.
- **Gestelde vragen:** data, stakes, bronnen
- **Vermogen (Laag 1):** Beleids- en bestuursdocumenten schrijven
- **Model (Laag 2):** Claude (Team/Enterprise) (score 11, betrouwbaarheid hoog)
- **Alternatieven:** Mistral (EU-hosting); ChatGPT (Edu-licentie); Gemini (Workspace for Education)
- **Menselijke toets:** mens-in-de-lus
- **Redeneerspoor:** LAAG-1 → R-VERTROUWELIJK-1 → R-COPY-1 → LAAG-2 → SCORE → TOEZICHT
- **Governance-advies:** Publicatie alleen na menselijke redactie; genereer geen herkenbare personen, merken of stijlen van levende makers. · Doorgifte buiten EER beoordelen; geen bijzondere persoonsgegevens. · Auteursrecht: gegenereerde output kan beschermd materiaal reproduceren; de instelling blijft verantwoordelijk voor publicatie.

## 9. [Onderzoek] Promovendus wil 60 onderzoeksinterviews (herleidbaar tot personen) transcriberen.
- **Gestelde vragen:** data, stakes, schaal
- **Vermogen (Laag 1):** Audio & video transcriberen
- **Model (Laag 2):** Transcriptiedienst (Whisper, on-prem) (score 9.25, betrouwbaarheid hoog)
- **Alternatieven:** Microsoft 365 Copilot; Gemini (Workspace for Education)
- **Menselijke toets:** steekproef
- **Redeneerspoor:** LAAG-1 → R-AVG-1 → R-VERTROUWELIJK-1 → R-LOCKIN-1 → LAAG-2 → SCORE → TOEZICHT
- **Governance-advies:** Structureel gebruik: leg exit-strategie en dataportabiliteit vast in de inkoopvoorwaarden; toets tegen de aanbestedingsdrempels. · Combineer met een tweede model voor analyse van het transcript — dat is een aparte capaciteitskeuze.

## 10. [Onderzoek] Onderzoeker verkent literatuur over epistemische afhankelijkheid; elke claim moet herleidbaar zijn.
- **Gestelde vragen:** data, stakes, bronnen
- **Vermogen (Laag 1):** Literatuur verkennen & reviewen
- **Model (Laag 2):** Kennisbank-assistent (RAG op eigen bronnen) (score 12.25, betrouwbaarheid hoog)
- **Alternatieven:** Microsoft 365 Copilot
- **Menselijke toets:** mens-in-de-lus
- **Redeneerspoor:** LAAG-1 → R-BRON-1 → LAAG-2 → SCORE → TOEZICHT
- **Governance-advies:** Eerste keus wanneer herleidbaarheid een eis is (beleid, bestuur, kwaliteitszorg).

## 11. [Onderzoek] Onderzoeker wil een R-script voor een mixed-effects-analyse laten schrijven.
- **Gestelde vragen:** data, stakes
- **Vermogen (Laag 1):** Code schrijven & reviewen
- **Model (Laag 2):** Claude (Team/Enterprise) (score 11, betrouwbaarheid laag)
- **Alternatieven:** ChatGPT (Edu-licentie); Mistral (EU-hosting); Lokale open-source-LLM (on-prem / SURF-omgeving)
- **Menselijke toets:** steekproef
- **Redeneerspoor:** LAAG-1 → LAAG-2 → SCORE → TOEZICHT
- **Governance-advies:** Doorgifte buiten EER beoordelen; geen bijzondere persoonsgegevens.

## 12. [Onderzoek] Onderzoeksgroep analyseert een geanonimiseerde enquêtedataset.
- **Gestelde vragen:** data, stakes
- **Vermogen (Laag 1):** Datasets analyseren & visualiseren
- **Model (Laag 2):** Claude (Team/Enterprise) (score 11, betrouwbaarheid laag)
- **Alternatieven:** ChatGPT (Edu-licentie); Mistral (EU-hosting); Lokale open-source-LLM (on-prem / SURF-omgeving)
- **Menselijke toets:** mens-in-de-lus
- **Redeneerspoor:** LAAG-1 → R-VERTROUWELIJK-1 → LAAG-2 → SCORE → TOEZICHT
- **Governance-advies:** Doorgifte buiten EER beoordelen; geen bijzondere persoonsgegevens.

## 13. [Studentbegeleiding] Decaan zoekt in de eigen regelingen wat de procedure is bij bindend studieadvies.
- **Gestelde vragen:** data, stakes, bronnen, schaal
- **Vermogen (Laag 1):** Zoeken in eigen bronnen & beleid
- **Model (Laag 2):** Kennisbank-assistent (RAG op eigen bronnen) (score 12.25, betrouwbaarheid hoog)
- **Alternatieven:** Microsoft 365 Copilot
- **Menselijke toets:** mens-in-de-lus
- **Redeneerspoor:** LAAG-1 → R-VERTROUWELIJK-1 → R-BRON-1 → LAAG-2 → SCORE → TOEZICHT
- **Governance-advies:** Eerste keus wanneer herleidbaarheid een eis is (beleid, bestuur, kwaliteitszorg).

## 14. [Studentbegeleiding] Studieadviseur wil gespreksverslagen met gezondheidsinformatie samenvatten.
- **Gestelde vragen:** data, stakes, bronnen, beeld
- **Vermogen (Laag 1):** Samenvatten van documenten of gesprekken
- **Model (Laag 2):** Kennisbank-assistent (RAG op eigen bronnen) (score 7.25, betrouwbaarheid laag)
- **Alternatieven:** Lokale open-source-LLM (on-prem / SURF-omgeving)
- **Menselijke toets:** mens-beslist
- **Redeneerspoor:** LAAG-1 → R-AVG-1 → R-AVG-2 → R-VERTROUWELIJK-1 → R-AIACT-1 → R-EXPLAIN-1 → LAAG-2 → SCORE → TOEZICHT
- **Governance-advies:** AI Act: het model mag uitsluitend adviseren; een mens neemt en motiveert het besluit. Registreer het gebruik, voer een DPIA/FRIA uit en informeer betrokkenen. · Eerste keus wanneer herleidbaarheid een eis is (beleid, bestuur, kwaliteitszorg). · Dit gebruik valt vermoedelijk onder de hoog-risicocategorieën van de EU AI Act (beoordeling van of besluiten over personen in het onderwijs).

## 15. [Bibliotheek] Bibliothecaris bouwt een zoekassistent op de eigen kennisbank voor studenten.
- **Gestelde vragen:** data, stakes, bronnen, schaal
- **Vermogen (Laag 1):** Zoeken in eigen bronnen & beleid
- **Model (Laag 2):** Kennisbank-assistent (RAG op eigen bronnen) (score 12.25, betrouwbaarheid hoog)
- **Alternatieven:** Microsoft 365 Copilot
- **Menselijke toets:** steekproef
- **Redeneerspoor:** LAAG-1 → R-BRON-1 → R-LOCKIN-1 → LAAG-2 → SCORE → TOEZICHT
- **Governance-advies:** Structureel gebruik: leg exit-strategie en dataportabiliteit vast in de inkoopvoorwaarden; toets tegen de aanbestedingsdrempels. · Eerste keus wanneer herleidbaarheid een eis is (beleid, bestuur, kwaliteitszorg).

## 16. [Bibliotheek] Bibliotheek wil metadata uit gescande oude tijdschriftomslagen halen.
- **Gestelde vragen:** data, stakes, beeld, schaal
- **Vermogen (Laag 1):** Gegevens uit documenten halen (op schaal)
- **Model (Laag 2):** Claude (Team/Enterprise) (score 5, betrouwbaarheid laag)
- **Alternatieven:** Gemini (Workspace for Education); ChatGPT (Edu-licentie); Microsoft 365 Copilot
- **Menselijke toets:** steekproef
- **Redeneerspoor:** LAAG-1 → R-BEELD-1 → R-LOCKIN-1 → LAAG-2 → SCORE → TOEZICHT
- **Governance-advies:** Structureel gebruik: leg exit-strategie en dataportabiliteit vast in de inkoopvoorwaarden; toets tegen de aanbestedingsdrempels. · Doorgifte buiten EER beoordelen; geen bijzondere persoonsgegevens.

## 17. [Administratie] Medewerker wil wekelijkse teamoverleggen samenvatten uit opnames.
- **Gestelde vragen:** data, stakes, schaal
- **Vermogen (Laag 1):** Audio & video transcriberen
- **Model (Laag 2):** Transcriptiedienst (Whisper, on-prem) (score 9.25, betrouwbaarheid hoog)
- **Alternatieven:** Microsoft 365 Copilot; Gemini (Workspace for Education); ChatGPT (Edu-licentie)
- **Menselijke toets:** steekproef
- **Redeneerspoor:** LAAG-1 → R-VERTROUWELIJK-1 → R-LOCKIN-1 → LAAG-2 → SCORE → TOEZICHT
- **Governance-advies:** Structureel gebruik: leg exit-strategie en dataportabiliteit vast in de inkoopvoorwaarden; toets tegen de aanbestedingsdrempels. · Combineer met een tweede model voor analyse van het transcript — dat is een aparte capaciteitskeuze.

## 18. [Administratie] Financiële administratie wil facturen automatisch classificeren en boeken.
- **Gestelde vragen:** data, stakes, beeld, schaal
- **Vermogen (Laag 1):** Gegevens uit documenten halen (op schaal)
- **Model (Laag 2):** Claude (Team/Enterprise) (score 5, betrouwbaarheid laag)
- **Alternatieven:** Gemini (Workspace for Education); ChatGPT (Edu-licentie); Microsoft 365 Copilot
- **Menselijke toets:** mens-in-de-lus
- **Redeneerspoor:** LAAG-1 → R-VERTROUWELIJK-1 → R-BEELD-1 → R-LOCKIN-1 → LAAG-2 → SCORE → TOEZICHT
- **Governance-advies:** Structureel gebruik: leg exit-strategie en dataportabiliteit vast in de inkoopvoorwaarden; toets tegen de aanbestedingsdrempels. · Doorgifte buiten EER beoordelen; geen bijzondere persoonsgegevens.

## 19. [Administratie] Servicedesk wil standaardantwoorden op veelgestelde studentvragen opstellen.
- **Gestelde vragen:** data, stakes, schaal
- **Vermogen (Laag 1):** Berichten, mail & webteksten opstellen
- **Model (Laag 2):** Lokale open-source-LLM (on-prem / SURF-omgeving) (score 5.75, betrouwbaarheid laag)
- **Alternatieven:** Claude (Team/Enterprise); Gemini (Workspace for Education); Mistral (EU-hosting)
- **Menselijke toets:** steekproef
- **Redeneerspoor:** LAAG-1 → R-LOCKIN-1 → R-DUUR-1 → LAAG-2 → SCORE → TOEZICHT
- **Governance-advies:** Structureel gebruik: leg exit-strategie en dataportabiliteit vast in de inkoopvoorwaarden; toets tegen de aanbestedingsdrempels. · Maximale keuzeruimte: geen leverancier tussen instelling en model.

## 20. [HR] HR wil binnengekomen sollicitatiebrieven laten voorsorteren.
- **Gestelde vragen:** data, stakes, beeld, schaal
- **Vermogen (Laag 1):** Gegevens uit documenten halen (op schaal)
- **Model (Laag 2):** Lokale open-source-LLM (on-prem / SURF-omgeving) (score 8.75, betrouwbaarheid middel)
- **Alternatieven:** Mistral (EU-hosting); Kennisbank-assistent (RAG op eigen bronnen); Microsoft 365 Copilot
- **Menselijke toets:** mens-beslist
- **Redeneerspoor:** LAAG-1 → R-AVG-1 → R-VERTROUWELIJK-1 → R-AIACT-1 → R-EXPLAIN-1 → R-LOCKIN-1 → LAAG-2 → SCORE → TOEZICHT
- **Governance-advies:** AI Act: het model mag uitsluitend adviseren; een mens neemt en motiveert het besluit. Registreer het gebruik, voer een DPIA/FRIA uit en informeer betrokkenen. · Structureel gebruik: leg exit-strategie en dataportabiliteit vast in de inkoopvoorwaarden; toets tegen de aanbestedingsdrempels. · Maximale keuzeruimte: geen leverancier tussen instelling en model. · Dit gebruik valt vermoedelijk onder de hoog-risicocategorieën van de EU AI Act (beoordeling van of besluiten over personen in het onderwijs).

## 21. [HR] HR-adviseur herschrijft een vacaturetekst inclusiever.
- **Gestelde vragen:** data, stakes
- **Vermogen (Laag 1):** Herschrijven & redigeren
- **Model (Laag 2):** Claude (Team/Enterprise) (score 8, betrouwbaarheid laag)
- **Alternatieven:** ChatGPT (Edu-licentie); Microsoft 365 Copilot; Mistral (EU-hosting)
- **Menselijke toets:** mens-in-de-lus
- **Redeneerspoor:** LAAG-1 → R-COPY-1 → LAAG-2 → SCORE → TOEZICHT
- **Governance-advies:** Publicatie alleen na menselijke redactie; genereer geen herkenbare personen, merken of stijlen van levende makers. · Doorgifte buiten EER beoordelen; geen bijzondere persoonsgegevens. · Auteursrecht: gegenereerde output kan beschermd materiaal reproduceren; de instelling blijft verantwoordelijk voor publicatie.

## 22. [HR] HR wil exitgesprekverslagen thematisch analyseren.
- **Gestelde vragen:** data, stakes, bronnen, beeld
- **Vermogen (Laag 1):** Documenten of situaties analyseren
- **Model (Laag 2):** Gemini (Workspace for Education) (score 10.2, betrouwbaarheid middel)
- **Alternatieven:** Kennisbank-assistent (RAG op eigen bronnen); Mistral (EU-hosting); Lokale open-source-LLM (on-prem / SURF-omgeving)
- **Menselijke toets:** mens-in-de-lus
- **Redeneerspoor:** LAAG-1 → R-AVG-1 → R-VERTROUWELIJK-1 → LAAG-2 → SCORE → TOEZICHT
- **Governance-advies:** Ecosysteemafhankelijkheid meewegen bij structureel gebruik.

## 23. [Communicatie] Communicatieafdeling wil campagnebeeld voor de open dag genereren.
- **Gestelde vragen:** data, stakes
- **Vermogen (Laag 1):** Beeld & illustraties genereren
- **Model (Laag 2):** Beeldgenerator (zakelijke licentie) (score 11, betrouwbaarheid middel)
- **Alternatieven:** Gemini (Workspace for Education); ChatGPT (Edu-licentie); Microsoft 365 Copilot
- **Menselijke toets:** mens-in-de-lus
- **Redeneerspoor:** LAAG-1 → R-COPY-1 → LAAG-2 → SCORE → TOEZICHT
- **Governance-advies:** Publicatie alleen na menselijke redactie; genereer geen herkenbare personen, merken of stijlen van levende makers. · Bij publicatie: menselijke redactie en beeldverantwoording verplicht. · Auteursrecht: gegenereerde output kan beschermd materiaal reproduceren; de instelling blijft verantwoordelijk voor publicatie.

## 24. [Communicatie] Webredacteur vertaalt de opleidingspagina's naar het Engels.
- **Gestelde vragen:** data, stakes
- **Vermogen (Laag 1):** Vertalen
- **Model (Laag 2):** Mistral (EU-hosting) (score 9, betrouwbaarheid laag)
- **Alternatieven:** Gemini (Workspace for Education); Claude (Team/Enterprise); ChatGPT (Edu-licentie)
- **Menselijke toets:** mens-in-de-lus
- **Redeneerspoor:** LAAG-1 → LAAG-2 → SCORE → TOEZICHT
- **Governance-advies:** Digitale soevereiniteit: open gewichten geven een geloofwaardig exit-pad.

## 25. [Communicatie] Woordvoerder zoekt actuele berichtgeving over een lopende kwestie.
- **Gestelde vragen:** data, stakes
- **Vermogen (Laag 1):** Actuele informatie op het web zoeken
- **Model (Laag 2):** Gemini (Workspace for Education) (score 8.2, betrouwbaarheid hoog)
- **Alternatieven:** Claude (Team/Enterprise); ChatGPT (Edu-licentie)
- **Menselijke toets:** steekproef
- **Redeneerspoor:** LAAG-1 → R-WEB-1 → LAAG-2 → SCORE → TOEZICHT
- **Governance-advies:** Ecosysteemafhankelijkheid meewegen bij structureel gebruik.

## 26. [Informatiemanagement] Informatiemanager analyseert een leverancierscontract van 90 pagina's op exit-clausules.
- **Gestelde vragen:** data, stakes, bronnen, beeld
- **Vermogen (Laag 1):** Documenten of situaties analyseren
- **Model (Laag 2):** Gemini (Workspace for Education) (score 10.2, betrouwbaarheid laag)
- **Alternatieven:** Claude (Team/Enterprise); ChatGPT (Edu-licentie); Kennisbank-assistent (RAG op eigen bronnen)
- **Menselijke toets:** mens-in-de-lus
- **Redeneerspoor:** LAAG-1 → R-VERTROUWELIJK-1 → LAAG-2 → SCORE → TOEZICHT
- **Governance-advies:** Ecosysteemafhankelijkheid meewegen bij structureel gebruik.

## 27. [Informatiemanagement] IM wil het documentair informatiebeheer deels automatiseren.
- **Gestelde vragen:** data, stakes, schaal
- **Vermogen (Laag 1):** Werkprocessen automatiseren (agentisch)
- **Model (Laag 2):** Claude (Team/Enterprise) (score 8, betrouwbaarheid laag)
- **Alternatieven:** ChatGPT (Edu-licentie); Gemini (Workspace for Education); Mistral (EU-hosting)
- **Menselijke toets:** mens-in-de-lus
- **Redeneerspoor:** LAAG-1 → R-VERTROUWELIJK-1 → R-LOCKIN-1 → LAAG-2 → SCORE → TOEZICHT
- **Governance-advies:** Structureel gebruik: leg exit-strategie en dataportabiliteit vast in de inkoopvoorwaarden; toets tegen de aanbestedingsdrempels. · Doorgifte buiten EER beoordelen; geen bijzondere persoonsgegevens.

## 28. [Architectuur] Enterprise-architect vergelijkt twee integratiepatronen voor het LMS.
- **Gestelde vragen:** data, stakes
- **Vermogen (Laag 1):** Opties of documenten vergelijken
- **Model (Laag 2):** Claude (Team/Enterprise) (score 8, betrouwbaarheid laag)
- **Alternatieven:** ChatGPT (Edu-licentie); Kennisbank-assistent (RAG op eigen bronnen); Mistral (EU-hosting)
- **Menselijke toets:** mens-in-de-lus
- **Redeneerspoor:** LAAG-1 → R-VERTROUWELIJK-1 → LAAG-2 → SCORE → TOEZICHT
- **Governance-advies:** Doorgifte buiten EER beoordelen; geen bijzondere persoonsgegevens.

## 29. [Architectuur] Ontwikkelteam wil legacy-code laten documenteren en refactoren.
- **Gestelde vragen:** data, stakes
- **Vermogen (Laag 1):** Code schrijven & reviewen
- **Model (Laag 2):** Claude (Team/Enterprise) (score 11, betrouwbaarheid laag)
- **Alternatieven:** ChatGPT (Edu-licentie); Mistral (EU-hosting); Lokale open-source-LLM (on-prem / SURF-omgeving)
- **Menselijke toets:** steekproef
- **Redeneerspoor:** LAAG-1 → R-VERTROUWELIJK-1 → LAAG-2 → SCORE → TOEZICHT
- **Governance-advies:** Doorgifte buiten EER beoordelen; geen bijzondere persoonsgegevens.

## 30. [Bestuur] Bestuurssecretaris schrijft een collegevoorstel over AI-beleid; herleidbaarheid vereist.
- **Gestelde vragen:** data, stakes, bronnen
- **Vermogen (Laag 1):** Beleids- en bestuursdocumenten schrijven
- **Model (Laag 2):** Microsoft 365 Copilot (score 7.15, betrouwbaarheid middel)
- **Alternatieven:** Kennisbank-assistent (RAG op eigen bronnen)
- **Menselijke toets:** mens-in-de-lus
- **Redeneerspoor:** LAAG-1 → R-VERTROUWELIJK-1 → R-BRON-1 → R-COPY-1 → LAAG-2 → SCORE → TOEZICHT
- **Governance-advies:** Publicatie alleen na menselijke redactie; genereer geen herkenbare personen, merken of stijlen van levende makers. · Hoge lock-in: bij structureel gebruik exit-strategie en dataportabiliteit vastleggen. · Auteursrecht: gegenereerde output kan beschermd materiaal reproduceren; de instelling blijft verantwoordelijk voor publicatie.

## 31. [Bestuur] CvB-lid wil een complex huisvestingsdilemma laten doordenken als sparringpartner.
- **Gestelde vragen:** data, stakes
- **Vermogen (Laag 1):** Complexe vraagstukken doordenken
- **Model (Laag 2):** Claude (Team/Enterprise) (score 11, betrouwbaarheid laag)
- **Alternatieven:** ChatGPT (Edu-licentie); Mistral (EU-hosting); Gemini (Workspace for Education)
- **Menselijke toets:** mens-in-de-lus
- **Redeneerspoor:** LAAG-1 → R-VERTROUWELIJK-1 → LAAG-2 → SCORE → TOEZICHT
- **Governance-advies:** Doorgifte buiten EER beoordelen; geen bijzondere persoonsgegevens.

## 32. [Bestuur] Strategieafdeling toetst de argumentatie in een instellingsplan-concept.
- **Gestelde vragen:** data, stakes
- **Vermogen (Laag 1):** Argumenten & concepten kritisch toetsen
- **Model (Laag 2):** Claude (Team/Enterprise) (score 11, betrouwbaarheid laag)
- **Alternatieven:** ChatGPT (Edu-licentie); Mistral (EU-hosting); Gemini (Workspace for Education)
- **Menselijke toets:** mens-in-de-lus
- **Redeneerspoor:** LAAG-1 → R-VERTROUWELIJK-1 → LAAG-2 → SCORE → TOEZICHT
- **Governance-advies:** Doorgifte buiten EER beoordelen; geen bijzondere persoonsgegevens.

## 33. [Kwaliteitszorg] Kwaliteitszorgmedewerker zoekt in accreditatiekaders en eigen rapporten; bronvermelding verplicht.
- **Gestelde vragen:** data, stakes, bronnen, schaal
- **Vermogen (Laag 1):** Zoeken in eigen bronnen & beleid
- **Model (Laag 2):** Kennisbank-assistent (RAG op eigen bronnen) (score 12.25, betrouwbaarheid hoog)
- **Alternatieven:** Microsoft 365 Copilot
- **Menselijke toets:** mens-in-de-lus
- **Redeneerspoor:** LAAG-1 → R-VERTROUWELIJK-1 → R-BRON-1 → LAAG-2 → SCORE → TOEZICHT
- **Governance-advies:** Eerste keus wanneer herleidbaarheid een eis is (beleid, bestuur, kwaliteitszorg).

## 34. [Kwaliteitszorg] Panelvoorbereiding: honderden evaluatieformulieren samenvatten (zonder namen).
- **Gestelde vragen:** data, stakes, bronnen, beeld
- **Vermogen (Laag 1):** Samenvatten van documenten of gesprekken
- **Model (Laag 2):** Mistral (EU-hosting) (score 8.75, betrouwbaarheid laag)
- **Alternatieven:** Gemini (Workspace for Education); Claude (Team/Enterprise); Kennisbank-assistent (RAG op eigen bronnen)
- **Menselijke toets:** steekproef
- **Redeneerspoor:** LAAG-1 → R-VERTROUWELIJK-1 → R-DUUR-1 → LAAG-2 → SCORE → TOEZICHT
- **Governance-advies:** Digitale soevereiniteit: open gewichten geven een geloofwaardig exit-pad.

## 35. [Inkoop] Inkoper vergelijkt drie offertes voor een nieuw roostersysteem.
- **Gestelde vragen:** data, stakes
- **Vermogen (Laag 1):** Opties of documenten vergelijken
- **Model (Laag 2):** Claude (Team/Enterprise) (score 8, betrouwbaarheid laag)
- **Alternatieven:** ChatGPT (Edu-licentie); Kennisbank-assistent (RAG op eigen bronnen); Mistral (EU-hosting)
- **Menselijke toets:** mens-in-de-lus
- **Redeneerspoor:** LAAG-1 → R-VERTROUWELIJK-1 → LAAG-2 → SCORE → TOEZICHT
- **Governance-advies:** Doorgifte buiten EER beoordelen; geen bijzondere persoonsgegevens.

## 36. [Inkoop] Contractmanager haalt looptijden en boeteclausules uit 40 contracten.
- **Gestelde vragen:** data, stakes, beeld, schaal
- **Vermogen (Laag 1):** Gegevens uit documenten halen (op schaal)
- **Model (Laag 2):** Claude (Team/Enterprise) (score 5, betrouwbaarheid laag)
- **Alternatieven:** Gemini (Workspace for Education); ChatGPT (Edu-licentie); Microsoft 365 Copilot
- **Menselijke toets:** mens-in-de-lus
- **Redeneerspoor:** LAAG-1 → R-VERTROUWELIJK-1 → R-BEELD-1 → R-LOCKIN-1 → LAAG-2 → SCORE → TOEZICHT
- **Governance-advies:** Structureel gebruik: leg exit-strategie en dataportabiliteit vast in de inkoopvoorwaarden; toets tegen de aanbestedingsdrempels. · Doorgifte buiten EER beoordelen; geen bijzondere persoonsgegevens.

## 37. [Kennismanagement] Innovatieteam brainstormt over AI-native onderwijsvormen.
- **Gestelde vragen:** data, stakes
- **Vermogen (Laag 1):** Brainstormen & ideeën verkennen
- **Model (Laag 2):** Lokale open-source-LLM (on-prem / SURF-omgeving) (score 5.75, betrouwbaarheid laag)
- **Alternatieven:** Gemini (Workspace for Education); Claude (Team/Enterprise); ChatGPT (Edu-licentie)
- **Menselijke toets:** steekproef
- **Redeneerspoor:** LAAG-1 → R-DUUR-1 → LAAG-2 → SCORE → TOEZICHT
- **Governance-advies:** Maximale keuzeruimte: geen leverancier tussen instelling en model.

## 38. [Datadiensten] Data-analist berekent scenario's voor instroomprognoses.
- **Gestelde vragen:** data, stakes
- **Vermogen (Laag 1):** Berekeningen & modellen doorrekenen
- **Model (Laag 2):** Claude (Team/Enterprise) (score 8, betrouwbaarheid laag)
- **Alternatieven:** ChatGPT (Edu-licentie); Gemini (Workspace for Education); Mistral (EU-hosting)
- **Menselijke toets:** mens-in-de-lus
- **Redeneerspoor:** LAAG-1 → R-VERTROUWELIJK-1 → LAAG-2 → SCORE → TOEZICHT
- **Governance-advies:** Doorgifte buiten EER beoordelen; geen bijzondere persoonsgegevens.

## 39. [Datadiensten] Research-engineer bouwt een pipeline die wekelijks datasets valideert.
- **Gestelde vragen:** data, stakes, schaal
- **Vermogen (Laag 1):** Werkprocessen automatiseren (agentisch)
- **Model (Laag 2):** Claude (Team/Enterprise) (score 8, betrouwbaarheid laag)
- **Alternatieven:** ChatGPT (Edu-licentie); Gemini (Workspace for Education); Mistral (EU-hosting)
- **Menselijke toets:** mens-in-de-lus
- **Redeneerspoor:** LAAG-1 → R-VERTROUWELIJK-1 → R-LOCKIN-1 → LAAG-2 → SCORE → TOEZICHT
- **Governance-advies:** Structureel gebruik: leg exit-strategie en dataportabiliteit vast in de inkoopvoorwaarden; toets tegen de aanbestedingsdrempels. · Doorgifte buiten EER beoordelen; geen bijzondere persoonsgegevens.

## 40. [Onderwijs] Docent wil colleges automatisch transcriberen voor studenten met een functiebeperking.
- **Gestelde vragen:** data, stakes, schaal
- **Vermogen (Laag 1):** Audio & video transcriberen
- **Model (Laag 2):** Transcriptiedienst (Whisper, on-prem) (score 9.25, betrouwbaarheid hoog)
- **Alternatieven:** Microsoft 365 Copilot; Gemini (Workspace for Education)
- **Menselijke toets:** steekproef
- **Redeneerspoor:** LAAG-1 → R-AVG-1 → R-VERTROUWELIJK-1 → R-LOCKIN-1 → LAAG-2 → SCORE → TOEZICHT
- **Governance-advies:** Structureel gebruik: leg exit-strategie en dataportabiliteit vast in de inkoopvoorwaarden; toets tegen de aanbestedingsdrempels. · Combineer met een tweede model voor analyse van het transcript — dat is een aparte capaciteitskeuze.

## 41. [Rastertest] Medewerker wil "samenvatten van documenten of gesprekken" met openbare informatie, gebruikt voor verkenning.
- **Gestelde vragen:** data, stakes, bronnen, beeld
- **Vermogen (Laag 1):** Samenvatten van documenten of gesprekken
- **Model (Laag 2):** Mistral (EU-hosting) (score 8.75, betrouwbaarheid laag)
- **Alternatieven:** Gemini (Workspace for Education); Claude (Team/Enterprise); Kennisbank-assistent (RAG op eigen bronnen)
- **Menselijke toets:** steekproef
- **Redeneerspoor:** LAAG-1 → R-DUUR-1 → LAAG-2 → SCORE → TOEZICHT
- **Governance-advies:** Digitale soevereiniteit: open gewichten geven een geloofwaardig exit-pad.

## 42. [Rastertest] Medewerker wil "samenvatten van documenten of gesprekken" met openbare informatie, gebruikt voor een besluit over personen.
- **Gestelde vragen:** data, stakes, bronnen, beeld
- **Vermogen (Laag 1):** Samenvatten van documenten of gesprekken
- **Model (Laag 2):** Microsoft 365 Copilot (score 9.15, betrouwbaarheid laag)
- **Alternatieven:** Kennisbank-assistent (RAG op eigen bronnen)
- **Menselijke toets:** mens-beslist
- **Redeneerspoor:** LAAG-1 → R-AIACT-1 → R-EXPLAIN-1 → R-BRON-1 → LAAG-2 → SCORE → TOEZICHT
- **Governance-advies:** AI Act: het model mag uitsluitend adviseren; een mens neemt en motiveert het besluit. Registreer het gebruik, voer een DPIA/FRIA uit en informeer betrokkenen. · Hoge lock-in: bij structureel gebruik exit-strategie en dataportabiliteit vastleggen. · Dit gebruik valt vermoedelijk onder de hoog-risicocategorieën van de EU AI Act (beoordeling van of besluiten over personen in het onderwijs).

## 43. [Rastertest] Medewerker wil "samenvatten van documenten of gesprekken" met vertrouwelijke interne documenten, gebruikt voor een intern besluit.
- **Gestelde vragen:** data, stakes, bronnen, beeld
- **Vermogen (Laag 1):** Samenvatten van documenten of gesprekken
- **Model (Laag 2):** Microsoft 365 Copilot (score 9.15, betrouwbaarheid laag)
- **Alternatieven:** Kennisbank-assistent (RAG op eigen bronnen)
- **Menselijke toets:** mens-in-de-lus
- **Redeneerspoor:** LAAG-1 → R-VERTROUWELIJK-1 → R-BRON-1 → LAAG-2 → SCORE → TOEZICHT
- **Governance-advies:** Hoge lock-in: bij structureel gebruik exit-strategie en dataportabiliteit vastleggen.

## 44. [Rastertest] Medewerker wil "samenvatten van documenten of gesprekken" met persoonsgegevens, gebruikt voor verkenning.
- **Gestelde vragen:** data, stakes, bronnen, beeld
- **Vermogen (Laag 1):** Samenvatten van documenten of gesprekken
- **Model (Laag 2):** Mistral (EU-hosting) (score 8.75, betrouwbaarheid laag)
- **Alternatieven:** Gemini (Workspace for Education); Kennisbank-assistent (RAG op eigen bronnen); Microsoft 365 Copilot
- **Menselijke toets:** steekproef
- **Redeneerspoor:** LAAG-1 → R-AVG-1 → R-VERTROUWELIJK-1 → R-DUUR-1 → LAAG-2 → SCORE → TOEZICHT
- **Governance-advies:** Digitale soevereiniteit: open gewichten geven een geloofwaardig exit-pad.

## 45. [Rastertest] Medewerker wil "samenvatten van documenten of gesprekken" met persoonsgegevens, gebruikt voor een besluit over personen.
- **Gestelde vragen:** data, stakes, bronnen, beeld
- **Vermogen (Laag 1):** Samenvatten van documenten of gesprekken
- **Model (Laag 2):** Microsoft 365 Copilot (score 9.15, betrouwbaarheid laag)
- **Alternatieven:** Kennisbank-assistent (RAG op eigen bronnen)
- **Menselijke toets:** mens-beslist
- **Redeneerspoor:** LAAG-1 → R-AVG-1 → R-VERTROUWELIJK-1 → R-AIACT-1 → R-EXPLAIN-1 → R-BRON-1 → LAAG-2 → SCORE → TOEZICHT
- **Governance-advies:** AI Act: het model mag uitsluitend adviseren; een mens neemt en motiveert het besluit. Registreer het gebruik, voer een DPIA/FRIA uit en informeer betrokkenen. · Hoge lock-in: bij structureel gebruik exit-strategie en dataportabiliteit vastleggen. · Dit gebruik valt vermoedelijk onder de hoog-risicocategorieën van de EU AI Act (beoordeling van of besluiten over personen in het onderwijs).

## 46. [Rastertest] Medewerker wil "documenten of situaties analyseren" met openbare informatie, gebruikt voor een intern besluit.
- **Gestelde vragen:** data, stakes, bronnen, beeld
- **Vermogen (Laag 1):** Documenten of situaties analyseren
- **Model (Laag 2):** Kennisbank-assistent (RAG op eigen bronnen) (score 8.25, betrouwbaarheid middel)
- **Alternatieven:** Microsoft 365 Copilot
- **Menselijke toets:** mens-in-de-lus
- **Redeneerspoor:** LAAG-1 → R-BRON-1 → LAAG-2 → SCORE → TOEZICHT
- **Governance-advies:** Eerste keus wanneer herleidbaarheid een eis is (beleid, bestuur, kwaliteitszorg).

## 47. [Rastertest] Medewerker wil "documenten of situaties analyseren" met vertrouwelijke interne documenten, gebruikt voor verkenning.
- **Gestelde vragen:** data, stakes, bronnen, beeld
- **Vermogen (Laag 1):** Documenten of situaties analyseren
- **Model (Laag 2):** Gemini (Workspace for Education) (score 10.2, betrouwbaarheid laag)
- **Alternatieven:** Claude (Team/Enterprise); ChatGPT (Edu-licentie); Kennisbank-assistent (RAG op eigen bronnen)
- **Menselijke toets:** steekproef
- **Redeneerspoor:** LAAG-1 → R-VERTROUWELIJK-1 → LAAG-2 → SCORE → TOEZICHT
- **Governance-advies:** Ecosysteemafhankelijkheid meewegen bij structureel gebruik.

## 48. [Rastertest] Medewerker wil "documenten of situaties analyseren" met vertrouwelijke interne documenten, gebruikt voor een besluit over personen.
- **Gestelde vragen:** data, stakes, bronnen, beeld
- **Vermogen (Laag 1):** Documenten of situaties analyseren
- **Model (Laag 2):** Kennisbank-assistent (RAG op eigen bronnen) (score 8.25, betrouwbaarheid middel)
- **Alternatieven:** Microsoft 365 Copilot
- **Menselijke toets:** mens-beslist
- **Redeneerspoor:** LAAG-1 → R-VERTROUWELIJK-1 → R-AIACT-1 → R-EXPLAIN-1 → R-BRON-1 → LAAG-2 → SCORE → TOEZICHT
- **Governance-advies:** AI Act: het model mag uitsluitend adviseren; een mens neemt en motiveert het besluit. Registreer het gebruik, voer een DPIA/FRIA uit en informeer betrokkenen. · Eerste keus wanneer herleidbaarheid een eis is (beleid, bestuur, kwaliteitszorg). · Dit gebruik valt vermoedelijk onder de hoog-risicocategorieën van de EU AI Act (beoordeling van of besluiten over personen in het onderwijs).

## 49. [Rastertest] Medewerker wil "documenten of situaties analyseren" met persoonsgegevens, gebruikt voor een intern besluit.
- **Gestelde vragen:** data, stakes, bronnen, beeld
- **Vermogen (Laag 1):** Documenten of situaties analyseren
- **Model (Laag 2):** Kennisbank-assistent (RAG op eigen bronnen) (score 8.25, betrouwbaarheid middel)
- **Alternatieven:** Microsoft 365 Copilot
- **Menselijke toets:** mens-in-de-lus
- **Redeneerspoor:** LAAG-1 → R-AVG-1 → R-VERTROUWELIJK-1 → R-BRON-1 → LAAG-2 → SCORE → TOEZICHT
- **Governance-advies:** Eerste keus wanneer herleidbaarheid een eis is (beleid, bestuur, kwaliteitszorg).

## 50. [Rastertest] Medewerker wil "complexe vraagstukken doordenken" met openbare informatie, gebruikt voor verkenning.
- **Gestelde vragen:** data, stakes
- **Vermogen (Laag 1):** Complexe vraagstukken doordenken
- **Model (Laag 2):** Claude (Team/Enterprise) (score 11, betrouwbaarheid laag)
- **Alternatieven:** ChatGPT (Edu-licentie); Mistral (EU-hosting); Gemini (Workspace for Education)
- **Menselijke toets:** steekproef
- **Redeneerspoor:** LAAG-1 → LAAG-2 → SCORE → TOEZICHT
- **Governance-advies:** Doorgifte buiten EER beoordelen; geen bijzondere persoonsgegevens.

## 51. [Rastertest] Medewerker wil "complexe vraagstukken doordenken" met openbare informatie, gebruikt voor een besluit over personen.
- **Gestelde vragen:** data, stakes
- **Vermogen (Laag 1):** Complexe vraagstukken doordenken
- **Model (Laag 2):** Mistral (EU-hosting) (score 8, betrouwbaarheid middel)
- **Alternatieven:** Microsoft 365 Copilot; Kennisbank-assistent (RAG op eigen bronnen); Lokale open-source-LLM (on-prem / SURF-omgeving)
- **Menselijke toets:** mens-beslist
- **Redeneerspoor:** LAAG-1 → R-AIACT-1 → R-EXPLAIN-1 → LAAG-2 → SCORE → TOEZICHT
- **Governance-advies:** AI Act: het model mag uitsluitend adviseren; een mens neemt en motiveert het besluit. Registreer het gebruik, voer een DPIA/FRIA uit en informeer betrokkenen. · Digitale soevereiniteit: open gewichten geven een geloofwaardig exit-pad. · Dit gebruik valt vermoedelijk onder de hoog-risicocategorieën van de EU AI Act (beoordeling van of besluiten over personen in het onderwijs).

## 52. [Rastertest] Medewerker wil "complexe vraagstukken doordenken" met vertrouwelijke interne documenten, gebruikt voor een intern besluit.
- **Gestelde vragen:** data, stakes
- **Vermogen (Laag 1):** Complexe vraagstukken doordenken
- **Model (Laag 2):** Claude (Team/Enterprise) (score 11, betrouwbaarheid laag)
- **Alternatieven:** ChatGPT (Edu-licentie); Mistral (EU-hosting); Gemini (Workspace for Education)
- **Menselijke toets:** mens-in-de-lus
- **Redeneerspoor:** LAAG-1 → R-VERTROUWELIJK-1 → LAAG-2 → SCORE → TOEZICHT
- **Governance-advies:** Doorgifte buiten EER beoordelen; geen bijzondere persoonsgegevens.

## 53. [Rastertest] Medewerker wil "complexe vraagstukken doordenken" met persoonsgegevens, gebruikt voor verkenning.
- **Gestelde vragen:** data, stakes
- **Vermogen (Laag 1):** Complexe vraagstukken doordenken
- **Model (Laag 2):** Mistral (EU-hosting) (score 8, betrouwbaarheid laag)
- **Alternatieven:** Gemini (Workspace for Education); Microsoft 365 Copilot; Kennisbank-assistent (RAG op eigen bronnen)
- **Menselijke toets:** steekproef
- **Redeneerspoor:** LAAG-1 → R-AVG-1 → R-VERTROUWELIJK-1 → LAAG-2 → SCORE → TOEZICHT
- **Governance-advies:** Digitale soevereiniteit: open gewichten geven een geloofwaardig exit-pad.

## 54. [Rastertest] Medewerker wil "complexe vraagstukken doordenken" met persoonsgegevens, gebruikt voor een besluit over personen.
- **Gestelde vragen:** data, stakes
- **Vermogen (Laag 1):** Complexe vraagstukken doordenken
- **Model (Laag 2):** Mistral (EU-hosting) (score 8, betrouwbaarheid middel)
- **Alternatieven:** Microsoft 365 Copilot; Kennisbank-assistent (RAG op eigen bronnen); Lokale open-source-LLM (on-prem / SURF-omgeving)
- **Menselijke toets:** mens-beslist
- **Redeneerspoor:** LAAG-1 → R-AVG-1 → R-VERTROUWELIJK-1 → R-AIACT-1 → R-EXPLAIN-1 → LAAG-2 → SCORE → TOEZICHT
- **Governance-advies:** AI Act: het model mag uitsluitend adviseren; een mens neemt en motiveert het besluit. Registreer het gebruik, voer een DPIA/FRIA uit en informeer betrokkenen. · Digitale soevereiniteit: open gewichten geven een geloofwaardig exit-pad. · Dit gebruik valt vermoedelijk onder de hoog-risicocategorieën van de EU AI Act (beoordeling van of besluiten over personen in het onderwijs).

## 55. [Rastertest] Medewerker wil "herschrijven & redigeren" met openbare informatie, gebruikt voor een intern besluit.
- **Gestelde vragen:** data, stakes
- **Vermogen (Laag 1):** Herschrijven & redigeren
- **Model (Laag 2):** Claude (Team/Enterprise) (score 8, betrouwbaarheid laag)
- **Alternatieven:** ChatGPT (Edu-licentie); Microsoft 365 Copilot; Mistral (EU-hosting)
- **Menselijke toets:** mens-in-de-lus
- **Redeneerspoor:** LAAG-1 → R-COPY-1 → LAAG-2 → SCORE → TOEZICHT
- **Governance-advies:** Publicatie alleen na menselijke redactie; genereer geen herkenbare personen, merken of stijlen van levende makers. · Doorgifte buiten EER beoordelen; geen bijzondere persoonsgegevens. · Auteursrecht: gegenereerde output kan beschermd materiaal reproduceren; de instelling blijft verantwoordelijk voor publicatie.

## 56. [Rastertest] Medewerker wil "herschrijven & redigeren" met vertrouwelijke interne documenten, gebruikt voor verkenning.
- **Gestelde vragen:** data, stakes
- **Vermogen (Laag 1):** Herschrijven & redigeren
- **Model (Laag 2):** Microsoft 365 Copilot (score 5.9, betrouwbaarheid laag)
- **Alternatieven:** Lokale open-source-LLM (on-prem / SURF-omgeving); Claude (Team/Enterprise); ChatGPT (Edu-licentie)
- **Menselijke toets:** steekproef
- **Redeneerspoor:** LAAG-1 → R-VERTROUWELIJK-1 → R-DUUR-1 → LAAG-2 → SCORE → TOEZICHT
- **Governance-advies:** Hoge lock-in: bij structureel gebruik exit-strategie en dataportabiliteit vastleggen.

## 57. [Rastertest] Medewerker wil "herschrijven & redigeren" met vertrouwelijke interne documenten, gebruikt voor een besluit over personen.
- **Gestelde vragen:** data, stakes
- **Vermogen (Laag 1):** Herschrijven & redigeren
- **Model (Laag 2):** Microsoft 365 Copilot (score 7.15, betrouwbaarheid laag)
- **Alternatieven:** Mistral (EU-hosting); Lokale open-source-LLM (on-prem / SURF-omgeving)
- **Menselijke toets:** mens-beslist
- **Redeneerspoor:** LAAG-1 → R-VERTROUWELIJK-1 → R-AIACT-1 → R-EXPLAIN-1 → R-COPY-1 → LAAG-2 → SCORE → TOEZICHT
- **Governance-advies:** AI Act: het model mag uitsluitend adviseren; een mens neemt en motiveert het besluit. Registreer het gebruik, voer een DPIA/FRIA uit en informeer betrokkenen. · Publicatie alleen na menselijke redactie; genereer geen herkenbare personen, merken of stijlen van levende makers. · Hoge lock-in: bij structureel gebruik exit-strategie en dataportabiliteit vastleggen. · Dit gebruik valt vermoedelijk onder de hoog-risicocategorieën van de EU AI Act (beoordeling van of besluiten over personen in het onderwijs). · Auteursrecht: gegenereerde output kan beschermd materiaal reproduceren; de instelling blijft verantwoordelijk voor publicatie.

## 58. [Rastertest] Medewerker wil "herschrijven & redigeren" met persoonsgegevens, gebruikt voor een intern besluit.
- **Gestelde vragen:** data, stakes
- **Vermogen (Laag 1):** Herschrijven & redigeren
- **Model (Laag 2):** Microsoft 365 Copilot (score 7.15, betrouwbaarheid laag)
- **Alternatieven:** Mistral (EU-hosting); Lokale open-source-LLM (on-prem / SURF-omgeving); Gemini (Workspace for Education)
- **Menselijke toets:** mens-in-de-lus
- **Redeneerspoor:** LAAG-1 → R-AVG-1 → R-VERTROUWELIJK-1 → R-COPY-1 → LAAG-2 → SCORE → TOEZICHT
- **Governance-advies:** Publicatie alleen na menselijke redactie; genereer geen herkenbare personen, merken of stijlen van levende makers. · Hoge lock-in: bij structureel gebruik exit-strategie en dataportabiliteit vastleggen. · Auteursrecht: gegenereerde output kan beschermd materiaal reproduceren; de instelling blijft verantwoordelijk voor publicatie.

## 59. [Rastertest] Medewerker wil "vertalen" met openbare informatie, gebruikt voor verkenning.
- **Gestelde vragen:** data, stakes
- **Vermogen (Laag 1):** Vertalen
- **Model (Laag 2):** Mistral (EU-hosting) (score 7.75, betrouwbaarheid middel)
- **Alternatieven:** Lokale open-source-LLM (on-prem / SURF-omgeving); Gemini (Workspace for Education); Claude (Team/Enterprise)
- **Menselijke toets:** steekproef
- **Redeneerspoor:** LAAG-1 → R-DUUR-1 → LAAG-2 → SCORE → TOEZICHT
- **Governance-advies:** Digitale soevereiniteit: open gewichten geven een geloofwaardig exit-pad.

## 60. [Rastertest] Medewerker wil "vertalen" met openbare informatie, gebruikt voor een besluit over personen.
- **Gestelde vragen:** data, stakes
- **Vermogen (Laag 1):** Vertalen
- **Model (Laag 2):** Mistral (EU-hosting) (score 9, betrouwbaarheid hoog)
- **Alternatieven:** Lokale open-source-LLM (on-prem / SURF-omgeving); Microsoft 365 Copilot; Transcriptiedienst (Whisper, on-prem)
- **Menselijke toets:** mens-beslist
- **Redeneerspoor:** LAAG-1 → R-AIACT-1 → R-EXPLAIN-1 → LAAG-2 → SCORE → TOEZICHT
- **Governance-advies:** AI Act: het model mag uitsluitend adviseren; een mens neemt en motiveert het besluit. Registreer het gebruik, voer een DPIA/FRIA uit en informeer betrokkenen. · Digitale soevereiniteit: open gewichten geven een geloofwaardig exit-pad. · Dit gebruik valt vermoedelijk onder de hoog-risicocategorieën van de EU AI Act (beoordeling van of besluiten over personen in het onderwijs).

## 61. [Rastertest] Medewerker wil "vertalen" met vertrouwelijke interne documenten, gebruikt voor een intern besluit.
- **Gestelde vragen:** data, stakes
- **Vermogen (Laag 1):** Vertalen
- **Model (Laag 2):** Mistral (EU-hosting) (score 9, betrouwbaarheid laag)
- **Alternatieven:** Gemini (Workspace for Education); Claude (Team/Enterprise); ChatGPT (Edu-licentie)
- **Menselijke toets:** mens-in-de-lus
- **Redeneerspoor:** LAAG-1 → R-VERTROUWELIJK-1 → LAAG-2 → SCORE → TOEZICHT
- **Governance-advies:** Digitale soevereiniteit: open gewichten geven een geloofwaardig exit-pad.

## 62. [Rastertest] Medewerker wil "vertalen" met persoonsgegevens, gebruikt voor verkenning.
- **Gestelde vragen:** data, stakes
- **Vermogen (Laag 1):** Vertalen
- **Model (Laag 2):** Mistral (EU-hosting) (score 7.75, betrouwbaarheid middel)
- **Alternatieven:** Lokale open-source-LLM (on-prem / SURF-omgeving); Gemini (Workspace for Education); Transcriptiedienst (Whisper, on-prem)
- **Menselijke toets:** steekproef
- **Redeneerspoor:** LAAG-1 → R-AVG-1 → R-VERTROUWELIJK-1 → R-DUUR-1 → LAAG-2 → SCORE → TOEZICHT
- **Governance-advies:** Digitale soevereiniteit: open gewichten geven een geloofwaardig exit-pad.

## 63. [Rastertest] Medewerker wil "vertalen" met persoonsgegevens, gebruikt voor een besluit over personen.
- **Gestelde vragen:** data, stakes
- **Vermogen (Laag 1):** Vertalen
- **Model (Laag 2):** Mistral (EU-hosting) (score 9, betrouwbaarheid hoog)
- **Alternatieven:** Lokale open-source-LLM (on-prem / SURF-omgeving); Microsoft 365 Copilot; Transcriptiedienst (Whisper, on-prem)
- **Menselijke toets:** mens-beslist
- **Redeneerspoor:** LAAG-1 → R-AVG-1 → R-VERTROUWELIJK-1 → R-AIACT-1 → R-EXPLAIN-1 → LAAG-2 → SCORE → TOEZICHT
- **Governance-advies:** AI Act: het model mag uitsluitend adviseren; een mens neemt en motiveert het besluit. Registreer het gebruik, voer een DPIA/FRIA uit en informeer betrokkenen. · Digitale soevereiniteit: open gewichten geven een geloofwaardig exit-pad. · Dit gebruik valt vermoedelijk onder de hoog-risicocategorieën van de EU AI Act (beoordeling van of besluiten over personen in het onderwijs).

## 64. [Rastertest] Medewerker wil "berichten, mail & webteksten opstellen" met openbare informatie, gebruikt voor een intern besluit.
- **Gestelde vragen:** data, stakes, schaal
- **Vermogen (Laag 1):** Berichten, mail & webteksten opstellen
- **Model (Laag 2):** Claude (Team/Enterprise) (score 8, betrouwbaarheid laag)
- **Alternatieven:** Gemini (Workspace for Education); ChatGPT (Edu-licentie); Mistral (EU-hosting)
- **Menselijke toets:** mens-in-de-lus
- **Redeneerspoor:** LAAG-1 → R-COPY-1 → R-LOCKIN-1 → LAAG-2 → SCORE → TOEZICHT
- **Governance-advies:** Publicatie alleen na menselijke redactie; genereer geen herkenbare personen, merken of stijlen van levende makers. · Structureel gebruik: leg exit-strategie en dataportabiliteit vast in de inkoopvoorwaarden; toets tegen de aanbestedingsdrempels. · Doorgifte buiten EER beoordelen; geen bijzondere persoonsgegevens. · Auteursrecht: gegenereerde output kan beschermd materiaal reproduceren; de instelling blijft verantwoordelijk voor publicatie.

## 65. [Rastertest] Medewerker wil "berichten, mail & webteksten opstellen" met vertrouwelijke interne documenten, gebruikt voor verkenning.
- **Gestelde vragen:** data, stakes, schaal
- **Vermogen (Laag 1):** Berichten, mail & webteksten opstellen
- **Model (Laag 2):** Microsoft 365 Copilot (score 5.9, betrouwbaarheid laag)
- **Alternatieven:** Lokale open-source-LLM (on-prem / SURF-omgeving); Gemini (Workspace for Education); Claude (Team/Enterprise)
- **Menselijke toets:** steekproef
- **Redeneerspoor:** LAAG-1 → R-VERTROUWELIJK-1 → R-DUUR-1 → LAAG-2 → SCORE → TOEZICHT
- **Governance-advies:** Hoge lock-in: bij structureel gebruik exit-strategie en dataportabiliteit vastleggen.

## 66. [Rastertest] Medewerker wil "berichten, mail & webteksten opstellen" met vertrouwelijke interne documenten, gebruikt voor een besluit over personen.
- **Gestelde vragen:** data, stakes, schaal
- **Vermogen (Laag 1):** Berichten, mail & webteksten opstellen
- **Model (Laag 2):** Mistral (EU-hosting) (score 6, betrouwbaarheid laag)
- **Alternatieven:** Microsoft 365 Copilot; Lokale open-source-LLM (on-prem / SURF-omgeving)
- **Menselijke toets:** mens-beslist
- **Redeneerspoor:** LAAG-1 → R-VERTROUWELIJK-1 → R-AIACT-1 → R-EXPLAIN-1 → R-COPY-1 → R-LOCKIN-1 → LAAG-2 → SCORE → TOEZICHT
- **Governance-advies:** AI Act: het model mag uitsluitend adviseren; een mens neemt en motiveert het besluit. Registreer het gebruik, voer een DPIA/FRIA uit en informeer betrokkenen. · Publicatie alleen na menselijke redactie; genereer geen herkenbare personen, merken of stijlen van levende makers. · Structureel gebruik: leg exit-strategie en dataportabiliteit vast in de inkoopvoorwaarden; toets tegen de aanbestedingsdrempels. · Digitale soevereiniteit: open gewichten geven een geloofwaardig exit-pad. · Dit gebruik valt vermoedelijk onder de hoog-risicocategorieën van de EU AI Act (beoordeling van of besluiten over personen in het onderwijs). · Auteursrecht: gegenereerde output kan beschermd materiaal reproduceren; de instelling blijft verantwoordelijk voor publicatie.

## 67. [Rastertest] Medewerker wil "berichten, mail & webteksten opstellen" met persoonsgegevens, gebruikt voor een intern besluit.
- **Gestelde vragen:** data, stakes, schaal
- **Vermogen (Laag 1):** Berichten, mail & webteksten opstellen
- **Model (Laag 2):** Gemini (Workspace for Education) (score 7.5, betrouwbaarheid middel)
- **Alternatieven:** Mistral (EU-hosting); Microsoft 365 Copilot; Lokale open-source-LLM (on-prem / SURF-omgeving)
- **Menselijke toets:** mens-in-de-lus
- **Redeneerspoor:** LAAG-1 → R-AVG-1 → R-VERTROUWELIJK-1 → R-COPY-1 → R-LOCKIN-1 → LAAG-2 → SCORE → TOEZICHT
- **Governance-advies:** Publicatie alleen na menselijke redactie; genereer geen herkenbare personen, merken of stijlen van levende makers. · Structureel gebruik: leg exit-strategie en dataportabiliteit vast in de inkoopvoorwaarden; toets tegen de aanbestedingsdrempels. · Ecosysteemafhankelijkheid meewegen bij structureel gebruik. · Auteursrecht: gegenereerde output kan beschermd materiaal reproduceren; de instelling blijft verantwoordelijk voor publicatie.

## 68. [Rastertest] Medewerker wil "literatuur verkennen & reviewen" met openbare informatie, gebruikt voor verkenning.
- **Gestelde vragen:** data, stakes, bronnen
- **Vermogen (Laag 1):** Literatuur verkennen & reviewen
- **Model (Laag 2):** Kennisbank-assistent (RAG op eigen bronnen) (score 11.25, betrouwbaarheid hoog)
- **Alternatieven:** Gemini (Workspace for Education); Claude (Team/Enterprise); ChatGPT (Edu-licentie)
- **Menselijke toets:** steekproef
- **Redeneerspoor:** LAAG-1 → LAAG-2 → SCORE → TOEZICHT
- **Governance-advies:** Eerste keus wanneer herleidbaarheid een eis is (beleid, bestuur, kwaliteitszorg).

## 69. [Rastertest] Medewerker wil "literatuur verkennen & reviewen" met openbare informatie, gebruikt voor een besluit over personen.
- **Gestelde vragen:** data, stakes, bronnen
- **Vermogen (Laag 1):** Literatuur verkennen & reviewen
- **Model (Laag 2):** Kennisbank-assistent (RAG op eigen bronnen) (score 12.25, betrouwbaarheid hoog)
- **Alternatieven:** Microsoft 365 Copilot
- **Menselijke toets:** mens-beslist
- **Redeneerspoor:** LAAG-1 → R-AIACT-1 → R-EXPLAIN-1 → R-BRON-1 → LAAG-2 → SCORE → TOEZICHT
- **Governance-advies:** AI Act: het model mag uitsluitend adviseren; een mens neemt en motiveert het besluit. Registreer het gebruik, voer een DPIA/FRIA uit en informeer betrokkenen. · Eerste keus wanneer herleidbaarheid een eis is (beleid, bestuur, kwaliteitszorg). · Dit gebruik valt vermoedelijk onder de hoog-risicocategorieën van de EU AI Act (beoordeling van of besluiten over personen in het onderwijs).

## 70. [Rastertest] Medewerker wil "literatuur verkennen & reviewen" met vertrouwelijke interne documenten, gebruikt voor een intern besluit.
- **Gestelde vragen:** data, stakes, bronnen
- **Vermogen (Laag 1):** Literatuur verkennen & reviewen
- **Model (Laag 2):** Kennisbank-assistent (RAG op eigen bronnen) (score 12.25, betrouwbaarheid hoog)
- **Alternatieven:** Microsoft 365 Copilot
- **Menselijke toets:** mens-in-de-lus
- **Redeneerspoor:** LAAG-1 → R-VERTROUWELIJK-1 → R-BRON-1 → LAAG-2 → SCORE → TOEZICHT
- **Governance-advies:** Eerste keus wanneer herleidbaarheid een eis is (beleid, bestuur, kwaliteitszorg).

## 71. [Rastertest] Medewerker wil "literatuur verkennen & reviewen" met persoonsgegevens, gebruikt voor verkenning.
- **Gestelde vragen:** data, stakes, bronnen
- **Vermogen (Laag 1):** Literatuur verkennen & reviewen
- **Model (Laag 2):** Kennisbank-assistent (RAG op eigen bronnen) (score 11.25, betrouwbaarheid hoog)
- **Alternatieven:** Gemini (Workspace for Education); Microsoft 365 Copilot; Mistral (EU-hosting)
- **Menselijke toets:** steekproef
- **Redeneerspoor:** LAAG-1 → R-AVG-1 → R-VERTROUWELIJK-1 → LAAG-2 → SCORE → TOEZICHT
- **Governance-advies:** Eerste keus wanneer herleidbaarheid een eis is (beleid, bestuur, kwaliteitszorg).

## 72. [Rastertest] Medewerker wil "literatuur verkennen & reviewen" met persoonsgegevens, gebruikt voor een besluit over personen.
- **Gestelde vragen:** data, stakes, bronnen
- **Vermogen (Laag 1):** Literatuur verkennen & reviewen
- **Model (Laag 2):** Kennisbank-assistent (RAG op eigen bronnen) (score 12.25, betrouwbaarheid hoog)
- **Alternatieven:** Microsoft 365 Copilot
- **Menselijke toets:** mens-beslist
- **Redeneerspoor:** LAAG-1 → R-AVG-1 → R-VERTROUWELIJK-1 → R-AIACT-1 → R-EXPLAIN-1 → R-BRON-1 → LAAG-2 → SCORE → TOEZICHT
- **Governance-advies:** AI Act: het model mag uitsluitend adviseren; een mens neemt en motiveert het besluit. Registreer het gebruik, voer een DPIA/FRIA uit en informeer betrokkenen. · Eerste keus wanneer herleidbaarheid een eis is (beleid, bestuur, kwaliteitszorg). · Dit gebruik valt vermoedelijk onder de hoog-risicocategorieën van de EU AI Act (beoordeling van of besluiten over personen in het onderwijs).

## 73. [Rastertest] Medewerker wil "zoeken in eigen bronnen & beleid" met openbare informatie, gebruikt voor een intern besluit.
- **Gestelde vragen:** data, stakes, bronnen, schaal
- **Vermogen (Laag 1):** Zoeken in eigen bronnen & beleid
- **Model (Laag 2):** Kennisbank-assistent (RAG op eigen bronnen) (score 12.25, betrouwbaarheid hoog)
- **Alternatieven:** Microsoft 365 Copilot
- **Menselijke toets:** mens-in-de-lus
- **Redeneerspoor:** LAAG-1 → R-BRON-1 → R-LOCKIN-1 → LAAG-2 → SCORE → TOEZICHT
- **Governance-advies:** Structureel gebruik: leg exit-strategie en dataportabiliteit vast in de inkoopvoorwaarden; toets tegen de aanbestedingsdrempels. · Eerste keus wanneer herleidbaarheid een eis is (beleid, bestuur, kwaliteitszorg).

## 74. [Rastertest] Medewerker wil "zoeken in eigen bronnen & beleid" met vertrouwelijke interne documenten, gebruikt voor verkenning.
- **Gestelde vragen:** data, stakes, bronnen, schaal
- **Vermogen (Laag 1):** Zoeken in eigen bronnen & beleid
- **Model (Laag 2):** Kennisbank-assistent (RAG op eigen bronnen) (score 11.25, betrouwbaarheid hoog)
- **Alternatieven:** Microsoft 365 Copilot; Lokale open-source-LLM (on-prem / SURF-omgeving); Mistral (EU-hosting)
- **Menselijke toets:** steekproef
- **Redeneerspoor:** LAAG-1 → R-VERTROUWELIJK-1 → LAAG-2 → SCORE → TOEZICHT
- **Governance-advies:** Eerste keus wanneer herleidbaarheid een eis is (beleid, bestuur, kwaliteitszorg).

## 75. [Rastertest] Medewerker wil "zoeken in eigen bronnen & beleid" met vertrouwelijke interne documenten, gebruikt voor een besluit over personen.
- **Gestelde vragen:** data, stakes, bronnen, schaal
- **Vermogen (Laag 1):** Zoeken in eigen bronnen & beleid
- **Model (Laag 2):** Kennisbank-assistent (RAG op eigen bronnen) (score 12.25, betrouwbaarheid hoog)
- **Alternatieven:** Microsoft 365 Copilot
- **Menselijke toets:** mens-beslist
- **Redeneerspoor:** LAAG-1 → R-VERTROUWELIJK-1 → R-AIACT-1 → R-EXPLAIN-1 → R-BRON-1 → R-LOCKIN-1 → LAAG-2 → SCORE → TOEZICHT
- **Governance-advies:** AI Act: het model mag uitsluitend adviseren; een mens neemt en motiveert het besluit. Registreer het gebruik, voer een DPIA/FRIA uit en informeer betrokkenen. · Structureel gebruik: leg exit-strategie en dataportabiliteit vast in de inkoopvoorwaarden; toets tegen de aanbestedingsdrempels. · Eerste keus wanneer herleidbaarheid een eis is (beleid, bestuur, kwaliteitszorg). · Dit gebruik valt vermoedelijk onder de hoog-risicocategorieën van de EU AI Act (beoordeling van of besluiten over personen in het onderwijs).

## 76. [Rastertest] Medewerker wil "zoeken in eigen bronnen & beleid" met persoonsgegevens, gebruikt voor een intern besluit.
- **Gestelde vragen:** data, stakes, bronnen, schaal
- **Vermogen (Laag 1):** Zoeken in eigen bronnen & beleid
- **Model (Laag 2):** Kennisbank-assistent (RAG op eigen bronnen) (score 12.25, betrouwbaarheid hoog)
- **Alternatieven:** Microsoft 365 Copilot
- **Menselijke toets:** mens-in-de-lus
- **Redeneerspoor:** LAAG-1 → R-AVG-1 → R-VERTROUWELIJK-1 → R-BRON-1 → R-LOCKIN-1 → LAAG-2 → SCORE → TOEZICHT
- **Governance-advies:** Structureel gebruik: leg exit-strategie en dataportabiliteit vast in de inkoopvoorwaarden; toets tegen de aanbestedingsdrempels. · Eerste keus wanneer herleidbaarheid een eis is (beleid, bestuur, kwaliteitszorg).

## 77. [Rastertest] Medewerker wil "code schrijven & reviewen" met openbare informatie, gebruikt voor verkenning.
- **Gestelde vragen:** data, stakes
- **Vermogen (Laag 1):** Code schrijven & reviewen
- **Model (Laag 2):** Claude (Team/Enterprise) (score 11, betrouwbaarheid laag)
- **Alternatieven:** ChatGPT (Edu-licentie); Mistral (EU-hosting); Lokale open-source-LLM (on-prem / SURF-omgeving)
- **Menselijke toets:** steekproef
- **Redeneerspoor:** LAAG-1 → LAAG-2 → SCORE → TOEZICHT
- **Governance-advies:** Doorgifte buiten EER beoordelen; geen bijzondere persoonsgegevens.

## 78. [Rastertest] Medewerker wil "code schrijven & reviewen" met openbare informatie, gebruikt voor een besluit over personen.
- **Gestelde vragen:** data, stakes
- **Vermogen (Laag 1):** Code schrijven & reviewen
- **Model (Laag 2):** Mistral (EU-hosting) (score 8, betrouwbaarheid laag)
- **Alternatieven:** Lokale open-source-LLM (on-prem / SURF-omgeving); Microsoft 365 Copilot
- **Menselijke toets:** mens-beslist
- **Redeneerspoor:** LAAG-1 → R-AIACT-1 → R-EXPLAIN-1 → LAAG-2 → SCORE → TOEZICHT
- **Governance-advies:** AI Act: het model mag uitsluitend adviseren; een mens neemt en motiveert het besluit. Registreer het gebruik, voer een DPIA/FRIA uit en informeer betrokkenen. · Digitale soevereiniteit: open gewichten geven een geloofwaardig exit-pad. · Dit gebruik valt vermoedelijk onder de hoog-risicocategorieën van de EU AI Act (beoordeling van of besluiten over personen in het onderwijs).

## 79. [Rastertest] Medewerker wil "code schrijven & reviewen" met vertrouwelijke interne documenten, gebruikt voor een intern besluit.
- **Gestelde vragen:** data, stakes
- **Vermogen (Laag 1):** Code schrijven & reviewen
- **Model (Laag 2):** Claude (Team/Enterprise) (score 11, betrouwbaarheid laag)
- **Alternatieven:** ChatGPT (Edu-licentie); Mistral (EU-hosting); Lokale open-source-LLM (on-prem / SURF-omgeving)
- **Menselijke toets:** mens-in-de-lus
- **Redeneerspoor:** LAAG-1 → R-VERTROUWELIJK-1 → LAAG-2 → SCORE → TOEZICHT
- **Governance-advies:** Doorgifte buiten EER beoordelen; geen bijzondere persoonsgegevens.

## 80. [Rastertest] Medewerker wil "code schrijven & reviewen" met persoonsgegevens, gebruikt voor verkenning.
- **Gestelde vragen:** data, stakes
- **Vermogen (Laag 1):** Code schrijven & reviewen
- **Model (Laag 2):** Mistral (EU-hosting) (score 8, betrouwbaarheid laag)
- **Alternatieven:** Lokale open-source-LLM (on-prem / SURF-omgeving); Gemini (Workspace for Education); Microsoft 365 Copilot
- **Menselijke toets:** steekproef
- **Redeneerspoor:** LAAG-1 → R-AVG-1 → R-VERTROUWELIJK-1 → LAAG-2 → SCORE → TOEZICHT
- **Governance-advies:** Digitale soevereiniteit: open gewichten geven een geloofwaardig exit-pad.

## 81. [Rastertest] Medewerker wil "code schrijven & reviewen" met persoonsgegevens, gebruikt voor een besluit over personen.
- **Gestelde vragen:** data, stakes
- **Vermogen (Laag 1):** Code schrijven & reviewen
- **Model (Laag 2):** Mistral (EU-hosting) (score 8, betrouwbaarheid laag)
- **Alternatieven:** Lokale open-source-LLM (on-prem / SURF-omgeving); Microsoft 365 Copilot
- **Menselijke toets:** mens-beslist
- **Redeneerspoor:** LAAG-1 → R-AVG-1 → R-VERTROUWELIJK-1 → R-AIACT-1 → R-EXPLAIN-1 → LAAG-2 → SCORE → TOEZICHT
- **Governance-advies:** AI Act: het model mag uitsluitend adviseren; een mens neemt en motiveert het besluit. Registreer het gebruik, voer een DPIA/FRIA uit en informeer betrokkenen. · Digitale soevereiniteit: open gewichten geven een geloofwaardig exit-pad. · Dit gebruik valt vermoedelijk onder de hoog-risicocategorieën van de EU AI Act (beoordeling van of besluiten over personen in het onderwijs).

## 82. [Rastertest] Medewerker wil "datasets analyseren & visualiseren" met openbare informatie, gebruikt voor een intern besluit.
- **Gestelde vragen:** data, stakes
- **Vermogen (Laag 1):** Datasets analyseren & visualiseren
- **Model (Laag 2):** Claude (Team/Enterprise) (score 11, betrouwbaarheid laag)
- **Alternatieven:** ChatGPT (Edu-licentie); Mistral (EU-hosting); Lokale open-source-LLM (on-prem / SURF-omgeving)
- **Menselijke toets:** mens-in-de-lus
- **Redeneerspoor:** LAAG-1 → LAAG-2 → SCORE → TOEZICHT
- **Governance-advies:** Doorgifte buiten EER beoordelen; geen bijzondere persoonsgegevens.

## 83. [Rastertest] Medewerker wil "datasets analyseren & visualiseren" met vertrouwelijke interne documenten, gebruikt voor verkenning.
- **Gestelde vragen:** data, stakes
- **Vermogen (Laag 1):** Datasets analyseren & visualiseren
- **Model (Laag 2):** Claude (Team/Enterprise) (score 11, betrouwbaarheid laag)
- **Alternatieven:** ChatGPT (Edu-licentie); Mistral (EU-hosting); Lokale open-source-LLM (on-prem / SURF-omgeving)
- **Menselijke toets:** steekproef
- **Redeneerspoor:** LAAG-1 → R-VERTROUWELIJK-1 → LAAG-2 → SCORE → TOEZICHT
- **Governance-advies:** Doorgifte buiten EER beoordelen; geen bijzondere persoonsgegevens.

## 84. [Rastertest] Medewerker wil "datasets analyseren & visualiseren" met vertrouwelijke interne documenten, gebruikt voor een besluit over personen.
- **Gestelde vragen:** data, stakes
- **Vermogen (Laag 1):** Datasets analyseren & visualiseren
- **Model (Laag 2):** Mistral (EU-hosting) (score 8, betrouwbaarheid laag)
- **Alternatieven:** Lokale open-source-LLM (on-prem / SURF-omgeving); Microsoft 365 Copilot
- **Menselijke toets:** mens-beslist
- **Redeneerspoor:** LAAG-1 → R-VERTROUWELIJK-1 → R-AIACT-1 → R-EXPLAIN-1 → LAAG-2 → SCORE → TOEZICHT
- **Governance-advies:** AI Act: het model mag uitsluitend adviseren; een mens neemt en motiveert het besluit. Registreer het gebruik, voer een DPIA/FRIA uit en informeer betrokkenen. · Digitale soevereiniteit: open gewichten geven een geloofwaardig exit-pad. · Dit gebruik valt vermoedelijk onder de hoog-risicocategorieën van de EU AI Act (beoordeling van of besluiten over personen in het onderwijs).

## 85. [Rastertest] Medewerker wil "datasets analyseren & visualiseren" met persoonsgegevens, gebruikt voor een intern besluit.
- **Gestelde vragen:** data, stakes
- **Vermogen (Laag 1):** Datasets analyseren & visualiseren
- **Model (Laag 2):** Mistral (EU-hosting) (score 8, betrouwbaarheid laag)
- **Alternatieven:** Lokale open-source-LLM (on-prem / SURF-omgeving); Gemini (Workspace for Education); Microsoft 365 Copilot
- **Menselijke toets:** mens-in-de-lus
- **Redeneerspoor:** LAAG-1 → R-AVG-1 → R-VERTROUWELIJK-1 → LAAG-2 → SCORE → TOEZICHT
- **Governance-advies:** Digitale soevereiniteit: open gewichten geven een geloofwaardig exit-pad.

## 86. [Rastertest] Medewerker wil "studenten laten oefenen & begeleiden" met openbare informatie, gebruikt voor verkenning.
- **Gestelde vragen:** data, stakes, schaal
- **Vermogen (Laag 1):** Studenten laten oefenen & begeleiden
- **Model (Laag 2):** Gemini (Workspace for Education) (score 5.2, betrouwbaarheid laag)
- **Alternatieven:** Claude (Team/Enterprise); ChatGPT (Edu-licentie); Kennisbank-assistent (RAG op eigen bronnen)
- **Menselijke toets:** steekproef
- **Redeneerspoor:** LAAG-1 → R-PUBVAL-1 → LAAG-2 → SCORE → TOEZICHT
- **Governance-advies:** Publieke waarden (menselijkheid): AI ondersteunt de docent en vervangt geen begeleidingsrelatie; wees transparant naar studenten over AI-gebruik en borg toegankelijkheid voor alle studenten. · Ecosysteemafhankelijkheid meewegen bij structureel gebruik.

## 87. [Rastertest] Medewerker wil "studenten laten oefenen & begeleiden" met openbare informatie, gebruikt voor een besluit over personen.
- **Gestelde vragen:** data, stakes, schaal
- **Vermogen (Laag 1):** Studenten laten oefenen & begeleiden
- **Model (Laag 2):** Kennisbank-assistent (RAG op eigen bronnen) (score 3.25, betrouwbaarheid laag)
- **Alternatieven:** Mistral (EU-hosting); Lokale open-source-LLM (on-prem / SURF-omgeving)
- **Menselijke toets:** mens-beslist
- **Redeneerspoor:** LAAG-1 → R-AIACT-1 → R-EXPLAIN-1 → R-LOCKIN-1 → R-PUBVAL-1 → LAAG-2 → SCORE → TOEZICHT
- **Governance-advies:** AI Act: het model mag uitsluitend adviseren; een mens neemt en motiveert het besluit. Registreer het gebruik, voer een DPIA/FRIA uit en informeer betrokkenen. · Structureel gebruik: leg exit-strategie en dataportabiliteit vast in de inkoopvoorwaarden; toets tegen de aanbestedingsdrempels. · Publieke waarden (menselijkheid): AI ondersteunt de docent en vervangt geen begeleidingsrelatie; wees transparant naar studenten over AI-gebruik en borg toegankelijkheid voor alle studenten. · Eerste keus wanneer herleidbaarheid een eis is (beleid, bestuur, kwaliteitszorg). · Dit gebruik valt vermoedelijk onder de hoog-risicocategorieën van de EU AI Act (beoordeling van of besluiten over personen in het onderwijs).

## 88. [Rastertest] Medewerker wil "studenten laten oefenen & begeleiden" met vertrouwelijke interne documenten, gebruikt voor een intern besluit.
- **Gestelde vragen:** data, stakes, schaal
- **Vermogen (Laag 1):** Studenten laten oefenen & begeleiden
- **Model (Laag 2):** Claude (Team/Enterprise) (score 5, betrouwbaarheid laag)
- **Alternatieven:** Gemini (Workspace for Education); ChatGPT (Edu-licentie); Kennisbank-assistent (RAG op eigen bronnen)
- **Menselijke toets:** mens-in-de-lus
- **Redeneerspoor:** LAAG-1 → R-VERTROUWELIJK-1 → R-LOCKIN-1 → R-PUBVAL-1 → LAAG-2 → SCORE → TOEZICHT
- **Governance-advies:** Structureel gebruik: leg exit-strategie en dataportabiliteit vast in de inkoopvoorwaarden; toets tegen de aanbestedingsdrempels. · Publieke waarden (menselijkheid): AI ondersteunt de docent en vervangt geen begeleidingsrelatie; wees transparant naar studenten over AI-gebruik en borg toegankelijkheid voor alle studenten. · Doorgifte buiten EER beoordelen; geen bijzondere persoonsgegevens.

## 89. [Rastertest] Medewerker wil "studenten laten oefenen & begeleiden" met persoonsgegevens, gebruikt voor verkenning.
- **Gestelde vragen:** data, stakes, schaal
- **Vermogen (Laag 1):** Studenten laten oefenen & begeleiden
- **Model (Laag 2):** Gemini (Workspace for Education) (score 5.2, betrouwbaarheid middel)
- **Alternatieven:** Kennisbank-assistent (RAG op eigen bronnen); Mistral (EU-hosting); Lokale open-source-LLM (on-prem / SURF-omgeving)
- **Menselijke toets:** steekproef
- **Redeneerspoor:** LAAG-1 → R-AVG-1 → R-VERTROUWELIJK-1 → R-PUBVAL-1 → LAAG-2 → SCORE → TOEZICHT
- **Governance-advies:** Publieke waarden (menselijkheid): AI ondersteunt de docent en vervangt geen begeleidingsrelatie; wees transparant naar studenten over AI-gebruik en borg toegankelijkheid voor alle studenten. · Ecosysteemafhankelijkheid meewegen bij structureel gebruik.

## 90. [Rastertest] Medewerker wil "studenten laten oefenen & begeleiden" met persoonsgegevens, gebruikt voor een besluit over personen.
- **Gestelde vragen:** data, stakes, schaal
- **Vermogen (Laag 1):** Studenten laten oefenen & begeleiden
- **Model (Laag 2):** Kennisbank-assistent (RAG op eigen bronnen) (score 3.25, betrouwbaarheid laag)
- **Alternatieven:** Mistral (EU-hosting); Lokale open-source-LLM (on-prem / SURF-omgeving)
- **Menselijke toets:** mens-beslist
- **Redeneerspoor:** LAAG-1 → R-AVG-1 → R-VERTROUWELIJK-1 → R-AIACT-1 → R-EXPLAIN-1 → R-LOCKIN-1 → R-PUBVAL-1 → LAAG-2 → SCORE → TOEZICHT
- **Governance-advies:** AI Act: het model mag uitsluitend adviseren; een mens neemt en motiveert het besluit. Registreer het gebruik, voer een DPIA/FRIA uit en informeer betrokkenen. · Structureel gebruik: leg exit-strategie en dataportabiliteit vast in de inkoopvoorwaarden; toets tegen de aanbestedingsdrempels. · Publieke waarden (menselijkheid): AI ondersteunt de docent en vervangt geen begeleidingsrelatie; wees transparant naar studenten over AI-gebruik en borg toegankelijkheid voor alle studenten. · Eerste keus wanneer herleidbaarheid een eis is (beleid, bestuur, kwaliteitszorg). · Dit gebruik valt vermoedelijk onder de hoog-risicocategorieën van de EU AI Act (beoordeling van of besluiten over personen in het onderwijs).

## 91. [Rastertest] Medewerker wil "toets- en oefenvragen ontwikkelen" met openbare informatie, gebruikt voor een intern besluit.
- **Gestelde vragen:** data, stakes
- **Vermogen (Laag 1):** Toets- en oefenvragen ontwikkelen
- **Model (Laag 2):** Gemini (Workspace for Education) (score 5.2, betrouwbaarheid laag)
- **Alternatieven:** Claude (Team/Enterprise); ChatGPT (Edu-licentie); Mistral (EU-hosting)
- **Menselijke toets:** mens-in-de-lus
- **Redeneerspoor:** LAAG-1 → R-PUBVAL-1 → LAAG-2 → SCORE → TOEZICHT
- **Governance-advies:** Publieke waarden (menselijkheid): AI ondersteunt de docent en vervangt geen begeleidingsrelatie; wees transparant naar studenten over AI-gebruik en borg toegankelijkheid voor alle studenten. · Ecosysteemafhankelijkheid meewegen bij structureel gebruik.

## 92. [Rastertest] Medewerker wil "toets- en oefenvragen ontwikkelen" met vertrouwelijke interne documenten, gebruikt voor verkenning.
- **Gestelde vragen:** data, stakes
- **Vermogen (Laag 1):** Toets- en oefenvragen ontwikkelen
- **Model (Laag 2):** Gemini (Workspace for Education) (score 5.2, betrouwbaarheid laag)
- **Alternatieven:** Claude (Team/Enterprise); ChatGPT (Edu-licentie); Mistral (EU-hosting)
- **Menselijke toets:** steekproef
- **Redeneerspoor:** LAAG-1 → R-VERTROUWELIJK-1 → R-PUBVAL-1 → LAAG-2 → SCORE → TOEZICHT
- **Governance-advies:** Publieke waarden (menselijkheid): AI ondersteunt de docent en vervangt geen begeleidingsrelatie; wees transparant naar studenten over AI-gebruik en borg toegankelijkheid voor alle studenten. · Ecosysteemafhankelijkheid meewegen bij structureel gebruik.

## 93. [Rastertest] Medewerker wil "toets- en oefenvragen ontwikkelen" met vertrouwelijke interne documenten, gebruikt voor een besluit over personen.
- **Gestelde vragen:** data, stakes
- **Vermogen (Laag 1):** Toets- en oefenvragen ontwikkelen
- **Model (Laag 2):** Mistral (EU-hosting) (score 3, betrouwbaarheid laag)
- **Alternatieven:** Lokale open-source-LLM (on-prem / SURF-omgeving); Microsoft 365 Copilot
- **Menselijke toets:** mens-beslist
- **Redeneerspoor:** LAAG-1 → R-VERTROUWELIJK-1 → R-AIACT-1 → R-EXPLAIN-1 → R-PUBVAL-1 → LAAG-2 → SCORE → TOEZICHT
- **Governance-advies:** AI Act: het model mag uitsluitend adviseren; een mens neemt en motiveert het besluit. Registreer het gebruik, voer een DPIA/FRIA uit en informeer betrokkenen. · Publieke waarden (menselijkheid): AI ondersteunt de docent en vervangt geen begeleidingsrelatie; wees transparant naar studenten over AI-gebruik en borg toegankelijkheid voor alle studenten. · Digitale soevereiniteit: open gewichten geven een geloofwaardig exit-pad. · Dit gebruik valt vermoedelijk onder de hoog-risicocategorieën van de EU AI Act (beoordeling van of besluiten over personen in het onderwijs).

## 94. [Rastertest] Medewerker wil "toets- en oefenvragen ontwikkelen" met persoonsgegevens, gebruikt voor een intern besluit.
- **Gestelde vragen:** data, stakes
- **Vermogen (Laag 1):** Toets- en oefenvragen ontwikkelen
- **Model (Laag 2):** Gemini (Workspace for Education) (score 5.2, betrouwbaarheid middel)
- **Alternatieven:** Mistral (EU-hosting); Lokale open-source-LLM (on-prem / SURF-omgeving); Microsoft 365 Copilot
- **Menselijke toets:** mens-in-de-lus
- **Redeneerspoor:** LAAG-1 → R-AVG-1 → R-VERTROUWELIJK-1 → R-PUBVAL-1 → LAAG-2 → SCORE → TOEZICHT
- **Governance-advies:** Publieke waarden (menselijkheid): AI ondersteunt de docent en vervangt geen begeleidingsrelatie; wees transparant naar studenten over AI-gebruik en borg toegankelijkheid voor alle studenten. · Ecosysteemafhankelijkheid meewegen bij structureel gebruik.

## 95. [Rastertest] Medewerker wil "formatieve feedback op studentwerk" met openbare informatie, gebruikt voor verkenning.
- **Gestelde vragen:** data, stakes
- **Vermogen (Laag 1):** Formatieve feedback op studentwerk
- **Model (Laag 2):** Claude (Team/Enterprise) (score 11, betrouwbaarheid hoog)
- **Alternatieven:** ChatGPT (Edu-licentie); Gemini (Workspace for Education); Mistral (EU-hosting)
- **Menselijke toets:** steekproef
- **Redeneerspoor:** LAAG-1 → R-PUBVAL-1 → LAAG-2 → SCORE → TOEZICHT
- **Governance-advies:** Publieke waarden (menselijkheid): AI ondersteunt de docent en vervangt geen begeleidingsrelatie; wees transparant naar studenten over AI-gebruik en borg toegankelijkheid voor alle studenten. · Doorgifte buiten EER beoordelen; geen bijzondere persoonsgegevens.

## 96. [Rastertest] Medewerker wil "formatieve feedback op studentwerk" met openbare informatie, gebruikt voor een besluit over personen.
- **Gestelde vragen:** data, stakes
- **Vermogen (Laag 1):** Formatieve feedback op studentwerk
- **Model (Laag 2):** Mistral (EU-hosting) (score 5, betrouwbaarheid laag)
- **Alternatieven:** Lokale open-source-LLM (on-prem / SURF-omgeving); Microsoft 365 Copilot
- **Menselijke toets:** mens-beslist
- **Redeneerspoor:** LAAG-1 → R-AIACT-1 → R-EXPLAIN-1 → R-PUBVAL-1 → LAAG-2 → SCORE → TOEZICHT
- **Governance-advies:** AI Act: het model mag uitsluitend adviseren; een mens neemt en motiveert het besluit. Registreer het gebruik, voer een DPIA/FRIA uit en informeer betrokkenen. · Publieke waarden (menselijkheid): AI ondersteunt de docent en vervangt geen begeleidingsrelatie; wees transparant naar studenten over AI-gebruik en borg toegankelijkheid voor alle studenten. · Digitale soevereiniteit: open gewichten geven een geloofwaardig exit-pad. · Dit gebruik valt vermoedelijk onder de hoog-risicocategorieën van de EU AI Act (beoordeling van of besluiten over personen in het onderwijs).

## 97. [Rastertest] Medewerker wil "formatieve feedback op studentwerk" met vertrouwelijke interne documenten, gebruikt voor een intern besluit.
- **Gestelde vragen:** data, stakes
- **Vermogen (Laag 1):** Formatieve feedback op studentwerk
- **Model (Laag 2):** Claude (Team/Enterprise) (score 11, betrouwbaarheid hoog)
- **Alternatieven:** ChatGPT (Edu-licentie); Gemini (Workspace for Education); Mistral (EU-hosting)
- **Menselijke toets:** mens-in-de-lus
- **Redeneerspoor:** LAAG-1 → R-VERTROUWELIJK-1 → R-PUBVAL-1 → LAAG-2 → SCORE → TOEZICHT
- **Governance-advies:** Publieke waarden (menselijkheid): AI ondersteunt de docent en vervangt geen begeleidingsrelatie; wees transparant naar studenten over AI-gebruik en borg toegankelijkheid voor alle studenten. · Doorgifte buiten EER beoordelen; geen bijzondere persoonsgegevens.

## 98. [Rastertest] Medewerker wil "formatieve feedback op studentwerk" met persoonsgegevens, gebruikt voor verkenning.
- **Gestelde vragen:** data, stakes
- **Vermogen (Laag 1):** Formatieve feedback op studentwerk
- **Model (Laag 2):** Gemini (Workspace for Education) (score 7.2, betrouwbaarheid middel)
- **Alternatieven:** Mistral (EU-hosting); Lokale open-source-LLM (on-prem / SURF-omgeving); Microsoft 365 Copilot
- **Menselijke toets:** steekproef
- **Redeneerspoor:** LAAG-1 → R-AVG-1 → R-VERTROUWELIJK-1 → R-PUBVAL-1 → LAAG-2 → SCORE → TOEZICHT
- **Governance-advies:** Publieke waarden (menselijkheid): AI ondersteunt de docent en vervangt geen begeleidingsrelatie; wees transparant naar studenten over AI-gebruik en borg toegankelijkheid voor alle studenten. · Ecosysteemafhankelijkheid meewegen bij structureel gebruik.

## 99. [Rastertest] Medewerker wil "formatieve feedback op studentwerk" met persoonsgegevens, gebruikt voor een besluit over personen.
- **Gestelde vragen:** data, stakes
- **Vermogen (Laag 1):** Formatieve feedback op studentwerk
- **Model (Laag 2):** Mistral (EU-hosting) (score 5, betrouwbaarheid laag)
- **Alternatieven:** Lokale open-source-LLM (on-prem / SURF-omgeving); Microsoft 365 Copilot
- **Menselijke toets:** mens-beslist
- **Redeneerspoor:** LAAG-1 → R-AVG-1 → R-VERTROUWELIJK-1 → R-AIACT-1 → R-EXPLAIN-1 → R-PUBVAL-1 → LAAG-2 → SCORE → TOEZICHT
- **Governance-advies:** AI Act: het model mag uitsluitend adviseren; een mens neemt en motiveert het besluit. Registreer het gebruik, voer een DPIA/FRIA uit en informeer betrokkenen. · Publieke waarden (menselijkheid): AI ondersteunt de docent en vervangt geen begeleidingsrelatie; wees transparant naar studenten over AI-gebruik en borg toegankelijkheid voor alle studenten. · Digitale soevereiniteit: open gewichten geven een geloofwaardig exit-pad. · Dit gebruik valt vermoedelijk onder de hoog-risicocategorieën van de EU AI Act (beoordeling van of besluiten over personen in het onderwijs).

## 100. [Rastertest] Medewerker wil "gegevens uit documenten halen (op schaal)" met openbare informatie, gebruikt voor een intern besluit.
- **Gestelde vragen:** data, stakes, beeld, schaal
- **Vermogen (Laag 1):** Gegevens uit documenten halen (op schaal)
- **Model (Laag 2):** Lokale open-source-LLM (on-prem / SURF-omgeving) (score 8.75, betrouwbaarheid middel)
- **Alternatieven:** Mistral (EU-hosting); Claude (Team/Enterprise); Gemini (Workspace for Education)
- **Menselijke toets:** mens-in-de-lus
- **Redeneerspoor:** LAAG-1 → R-LOCKIN-1 → LAAG-2 → SCORE → TOEZICHT
- **Governance-advies:** Structureel gebruik: leg exit-strategie en dataportabiliteit vast in de inkoopvoorwaarden; toets tegen de aanbestedingsdrempels. · Maximale keuzeruimte: geen leverancier tussen instelling en model.

---
## Assertieresultaat

**Alle 100 scenario's doorstaan alle asserties.** Persoonsgegevens komen nooit op VS-cloud terecht, besluiten over personen krijgen altijd 'mens beslist' met AI Act-advies, en bron-eisen leiden altijd naar modellen met herleidbare citaties.