# PAM-AI web — bronvertaling en inhoudelijke grenzen

Auteur methodiek en instrument: **E.C.M. Willems**. Methodiek **1.1**, 4 september 2026. Webtoepassing **0.1.0**. Status bron: **research-grade validatiekandidaat**, nog geen empirisch gevalideerde standaard.

## Gelezen bronnen

- [Excelinstrument v1.1](../pam-ai/bronnen/PAM-AI_v1.1_Praktijkinstrument.xlsx)
- [Methodiek, praktijkhandleiding en validatieprotocol v1.1](../pam-ai/bronnen/PAM-AI_v1.1_Methodiek_Praktijkhandleiding_Validatieprotocol.docx)

Beide originelen zijn ongewijzigd opgenomen. Bestandscontrolesommen staan in [bronmanifest.json](../pam-ai/bronnen/bronmanifest.json). Alle elf werkbladen zijn uitgelezen, met celwaarden, formules, keuzelijsten en onderlinge verwijzingen. De DOCX is volledig uitgelezen, inclusief tabellen. De tool verwerkt geen instructies uit de documenten als opdrachten aan een agent.

## Vertaling naar de zes gebruikersstappen

| Bron | In de webtoepassing | Beslislogica / bewijsketen |
|---|---|---|
| 00_Start; DOCX quick start / vier routes | Start, uitleg en routekaart | Drie poorten in vaste volgorde. R1 blijft begrensd. Geen totaalscore. |
| 01_Intake B6:B28 | Taak en context, zeven routevragen, gemotiveerde bevestiging/afwijking | B26 bepaalt route; B27 kan gemotiveerd afwijken. Geen extra risicoklassen. |
| 01_Intake B31:B46 | Vooraf gemotiveerde drempels, kritieke dimensies en review | Exacte defaults 0,90; 0,02; 1,96; 30; 180 dagen. Dit zijn aanpasbare startpunten. |
| 02_Kandidaten A5:J12 | Maximaal acht concrete alternatieven | Type, naam, component, versie, deployment/regio, instellingen/tools/RAG/agents, testdatum, fingerprint en notities. De niet-AI-baseline is expliciet. |
| 03_Poort1 C:J, K:L, M5:M12 | Acht domeinen per alternatief met bewijs-ID en toelichting | PASS / CONDITIONAL / FAIL / UNKNOWN / N/A. Een FAIL sluit uit; ontbrekende gegevens zijn geen PASS. |
| 04_Testontwerp; DOCX testen | Acceptatieregels, critical-error-definitie, beoordelaar, betrouwbaarheid, retrybeleid, strata | Ontwerp staat vast zodra tests worden geregistreerd. Een nieuwe versie bewaart het oude dossier en start nieuwe tests. |
| 05_Testcases A:U en V6:V25 | Handmatige invoer, wijzigen, CSV-import/export | Eén rij per kandidaat × testcase, maximaal 2.000 regels. Alle pogingen, kosten, controle en herstel in dezelfde rij. |
| 06_Analyse D:M, P5:P12 | Automatische geschiktheid en onzekerheidsgrenzen | Waargenomen falen onderscheiden van MORE EVIDENCE; vervolgens dekking en rubric. |
| 06_Analyse C18:N25; 07_Bewijs | Lasten per geaccepteerde taak, ontbrekende metingen en bewijsregister | Kosten, mensminuten, tijd, retries, energie, CO2e en water. Geen proxy van tokens naar energie. |
| 08_Vergelijking A:S en pairwise/contextblokken | Vergelijkingstabel, A−B en expliciet contextoordeel | Alleen kandidaten die beide poorten doorstaan. Geen automatische winnaar; frontier/dominantie en proportionaliteit blijven gemotiveerde menselijke oordelen zoals de invoervelden P/Q/R/S in Excel. |
| 09_Besluit | Besluit, voorwaarden, stop/herstel, reviewer, geldigheid en print | Geselecteerde optie(s), NO-GO of uitstel. Statustermen worden in het Nederlands toegelicht; export behoudt codes. |
| 10_Validatie | Dossiercheck, gebruiksfeedback, regressietests en dit document | R3/R4-review, R4-formele toets en bewijsbeperkingen zichtbaar. Softwaretests zijn geen empirische methodiekvalidatie. |

## Exacte routering

Volgens 01_Intake!B26, pas wanneer alle zeven vragen zijn ingevuld:

1. R4 bij impact **Kritiek** of rechten/veiligheid/kerntaak **Ja**.
2. Anders R3 bij impact **Hoog**, omkeerbaarheid **Nee**, gevoelige data **Ja**, schaal **Groot**, externe/agentische handelingen **Ja** of formele plicht **Ja**.
3. Anders R2 bij impact **Middel**, omkeerbaarheid **Gedeeltelijk**, data **Beperkt**, rechten/veiligheid **Mogelijk**, schaal **Middel**, externe handelingen **Beperkt** of formele plicht **Mogelijk**.
4. Anders R1.

Een andere bevestigde route verlangt motivering volgens 10_Validatie. De route is ondersteuning, geen juridische classificatie.

## Exacte statistiek

Voor n onafhankelijke kandidaat × testcase-uitkomsten, x successen en p = x/n:

- lower = (p + z²/(2n) − z × sqrt((p(1−p) + z²/(4n))/n)) / (1 + z²/n)
- upper = (p + z²/(2n) + z × sqrt((p(1−p) + z²/(4n))/n)) / (1 + z²/n)
- minimum bij perfect succes = ceil(z² × succesminimum / (1 − succesminimum))
- minimum bij nul critical errors = ceil(z² × (1 − critical-maximum) / critical-maximum)
- effectieve bewijsbodem = max(basisminimum, beide berekende minima)

Bron: 01_Intake!B35:B37, 06_Analyse!I5/L5/P5 en de overeenkomstige regels voor de overige kandidaten. Niet afronden vóór vergelijking. z is exact 1,96 als default, geen vervanging door een langere quantielwaarde.

Poort 2: eerst poort 1; daarna complete testgegevens; geen data; feitelijk succes onder de grens of critical-rate erboven = FAIL; onvoldoende n/Wilson = MORE EVIDENCE; daarna dekking en rubric; pas dan PASS.

Lasten: som van **alle** kandidaat-testregels gedeeld door het aantal geaccepteerde taken. Menswerk is verificatie plus correctie/herstel. Bij geen geaccepteerde uitkomst is de noemer onbruikbaar en blijft de maatstaf onbekend.

## Vastgestelde bronverschillen en transparante afhandeling

De leidende inhoud is de expliciete methodiektekst wanneer een Excel-formule de beschreven regel onvoldoende afdwingt. Er zijn geen nieuwe gewichten of statistische grenzen toegevoegd.

| Verschil / lacune | Webgedrag en bronbasis |
|---|---|
| 03_Poort1!M5 controleert lege domeinen vóór FAIL. Een FAIL plus leeg domein wordt INCOMPLETE. | FAIL blijft direct zichtbaar en sluit uit, volgens DOCX “één FAIL” en 00_Start. Dit verandert de veilige blokkade niet, wel het label. |
| 05_Testcases V waarschuwt voor duplicaten, maar 06_Analyse telt deze door. Ongeldige 0/1-waarden kunnen via plakken binnenkomen. | Dubbele kandidaat × testcase en ongeldige uitkomsten blokkeren invoer/analyse, volgens de expliciete registratie- en anti-gamingregels. |
| Lege milieuwaarden leveren door SUMIFS soms 0 op; gedeeltelijk lege lasten kunnen een te laag getal tonen. | De betreffende maatstaf blijft onbekend tot alle metingen aanwezig zijn. Dit volgt DOCX “onbekend is niet nul”. |
| 07_Bewijs controleert of graad is ingevuld, maar U kan daardoor COMPLETE worden. | U draagt geen numerieke vergelijkingsclaim. C verlangt vastgelegde gevoeligheidsanalyse of beperkte claim. |
| Excel vraagt bewijs-ID’s op rijniveau en valideert verwijzingen niet; voorwaarden delen één veld. | Web koppelt domeinen aan bestaande bronnen en maakt voorwaarden/N/A-motiveringen per domein zichtbaar. Dit operationaliseert het bewijsvereiste, maar verifieert de inhoud van een document niet. |
| Route-overzicht noemt formele plicht onder R4; de expliciete routeringsformule en DOCX-routering geven daarvoor R3. | De concrete zeven-vragen-formule is gevolgd. Formele toets blijft nodig waar toepasselijk. |
| 09_Besluit!B46 bevat geen controle dat R1 alleen pilot/verkenning betreft. Een breed R1-besluit kan in Excel DECISION-READY worden. | Brede R1-scope blijft HOLD, conform 00_Start, routekaart en DOCX. Deze afwijking is een expliciete regressietest. |
| B46 activeert het pilotpad op scope, ook bij R2–R4. | Scopegestuurd pilotpad blijft behouden. Bij R3/R4 blijven onafhankelijke/multidisciplinaire review en bij R4 formele toets nodig. De uitkomst claimt nooit brede inzet. |
| Poort 1 CONDITIONAL en proportionaliteit CONDITIONAL komen niet door de volledige DECISION-READY-formule. | Dit blijft zichtbaar als HOLD. Een conditionele afweging kan wel worden opgeslagen met voorwaarden; de webversie verruimt de definitieve formule niet. Bij pilotvoorwaarden heet de uitkomst expliciet pilot onder voorwaarden. |
| Frontierstatus en proportionaliteit zijn handmatige Excel-keuzen, geen berekende scores. | De webversie berekent alleen vergelijkbare verschillen en laat het oordeel gemotiveerd invullen. |
| B44 controleert niet alle verplichte inhoud uit DOCX/10_Validatie. | De dossiercheck vraagt concrete taak/configuratie, motivering, review, stop/herstel en tijdige herbeoordeling. NO-GO/uitstel verlangt geen zinloos extra testontwerp. |

In de Excel-vergelijking krijgen fictieve fixtures aanvullende volledige dossierinformatie voor de webinvoer. Voor de dertien geteste situaties stemmen statistiek, poort 1, poort 2 en numerieke bewijsstatus overeen, met de hierboven benoemde veilige verschillen. De R1-brede-scope-fixture geeft bewust een andere eindstatus.

## Grenzen van versie 0.1.0

- Lokale browseropslag, geen centrale database, rollenbeheer of samenwerking. Exporteer reservekopieën; browseropslag is niet versleuteld en kan worden gewist of vol raken.
- De tool leest of controleert gelinkte bewijsstukken niet. Een ingevulde motivering is geen bewijs van juridische, inhoudelijke of ecologische juistheid.
- De betrouwbaarheid van menselijke beoordeling en comparabiliteit blijven expliciete beoordelingen. Er zijn geen nieuwe materialiteitsdrempels, interbeoordelaarscoëfficiënten of significantietoetsen toegevoegd.
- De tekst van een voorwaarde, beperkte claim of review is niet automatisch op inhoudelijke kwaliteit beoordeeld.
- Een vastgelegde besluitversie is een momentopname, geen elektronische handtekening. Model-/taak-/ontwerpwijzigingen maken eerder testbewijs onbruikbaar voor de nieuwe configuratie.
- Fysieke milieuwaarden blijven onbekend waar niet gemeten. Geen berekening uit prijs, tokens of modelgrootte.
- R1 zonder volledige zekerheid is een begrensde pilot, nooit productievalidatie. De bron laat het pilotpad ook bij hogere routes toe; aanvullend toezicht en de formele verplichtingen blijven dan onverkort gelden.
- Gebruiksduur, begrijpelijkheid en besliskwaliteit vragen nog de praktijk- en externe validatie uit 10_Validatie / DOCX. De technische tests leveren dat bewijs niet.

Citeer: Willems, E.C.M. (2026), *PAM-AI v1.1 — Proportionele AI-modelkeuze*.


## Verbetering bediening v0.2.0

Aanleiding: de eerste interface was een te directe vertaling van Excel en vroeg te veel methodiekkennis. De begeleide route begint nu met twee taakvragen en biedt korte deelstappen. Gevolgen en toelaatbaarheid worden één vraag tegelijk behandeld. De bestaande methodiek blijft hetzelfde.

- Gewone vraagteksten verwijzen naar dezelfde intakevelden, zeven routevragen en acht domeinen. De routecategorieën zijn niet veranderd.
- Bewijs wordt op documentnaam gekoppeld. De bestaande bewijs-ID blijft intern behouden; kiezen van een document vult nooit automatisch een positief oordeel in. Onvolledige of onbekende bronnen worden herkenbaar gemarkeerd.
- Succes- en foutgrenzen worden als percentages ingevoerd en exact gedeeld door 100 voor de bestaande rekenmodule. De z-waarde en bewijsbodem staan onder verdieping.
- Iedere optievergelijking gebruikt dezelfde geschiktheidscontrole. De interface toont geen totaalscore, ranglijst of automatische keuze.
- Testconcepten blijven bewaard bij navigatie en herladen. Ze tellen pas mee nadat de bestaande validatie bij ‘Testgeval bewaren’ is geslaagd.
- Een volledig gemotiveerd NO-GO of uitgesteld besluit krijgt een duidelijke gebruikersnaam. De onderliggende HOLD-status en het verbod op automatische goedkeuring blijven behouden.
- De volledige dossierweergave blijft beschikbaar. Oude beoordelingen en exports blijven bruikbaar.

Geen nieuwe beslisregels of drempelwaarden. Engine-wijziging: alleen het toepassingsversienummer.
