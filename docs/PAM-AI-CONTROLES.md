# PAM-AI web 0.1.0 — controles en oplevering

Uitgevoerd op 5 september 2026. De resultaten hieronder betreffen software en bronberekeningen; ze valideren niet zelfstandig de methodiek in de praktijk.

## Volledige broncontrole

Alle 11 werkbladen, 1.068 nietlege cellen en 496 formules zijn vergeleken met de oorspronkelijke OOXML. De extractie is identiek. Er zijn 98 genormaliseerde formulefamilies en 54 herhaalde formulekolommen; geen afwijkende kopieerformules.

Ook gecontroleerd: 35 keuzelijstvalidaties, 11 tabellen, 9 unieke inhoudelijke opmerkingen en 104 conditionele opmaakregels. Geen gedefinieerde namen, externe werkmaplinks, macro's, queries, verborgen werkbladen/rijen/kolommen of opgeslagen foutcellen. De DOCX is volledig gelezen, inclusief alle definities, tabellen, routes en het validatieprotocol.

De afhankelijkheden lopen van intake/kandidaten/poort 1/testdata naar analyse en bewijs, daarna vergelijking en besluit. Het testontwerp, de validatiechecklist en diverse menselijke bevestigingen zijn in Excel niet volledig door formules afgedwongen. Zie het [volledige auditbestand](../tests/pam-ai/ooxml-complete-audit.json) en de [bronvertaling](PAM-AI-BRONVERTALING.md).

## Rechtstreekse Excel-vergelijking

Dertien fictieve scenario’s zijn met Microsoft Excel 16.0, CalculateFullRebuild, op een tijdelijke kopie herberekend. Het origineel is niet gewijzigd. De eigen onzichtbare Excel-instanties zijn gesloten na de controles.

| Scenario | Poort 2 | Excel-eindstatus | Web |
|---|---|---|---|
| 30/30 geslaagd, geen kritieke fout | MORE EVIDENCE | HOLD | Gelijk |
| 189/189 geslaagd | PASS | DECISION-READY | Gelijk |
| 188/188 geslaagd | MORE EVIDENCE | HOLD | Gelijk |
| 160/189 geslaagd | FAIL | HOLD | Gelijk |
| Eén besliskritiek kostenveld leeg | PASS | HOLD | Gelijk; onvolledig bedrag wordt niet als volledig getoond |
| Begrensde R1-pilot, 30/30, voorwaarden | MORE EVIDENCE | PILOT WITH CONDITIONS | Gelijk |
| Poort 1 FAIL ondanks gunstige prestaties | NOT ELIGIBLE | HOLD | Gelijk |
| Twee gelijkwaardige passende opties | PASS | DECISION-READY | Gelijk; geen numerieke winnaar |
| Geen voorkeurskandidaat geselecteerd | PASS | DRAFT | Gelijk |
| R1 met brede scope | PASS | DECISION-READY | Bewust HOLD volgens de expliciete R1-methodiektekst |
| Pilot zonder voorwaarden | MORE EVIDENCE | DRAFT | Gelijk |
| Geen bewijsverwijzing voor poort 1 | NOT ELIGIBLE | HOLD | Gelijk |
| 10 kritieke fouten op 189 | FAIL | HOLD | Gelijk |

Wilson-uitkomsten uit Excel:

| n bij perfect succes | Succes-ondergrens | Bovengrens kritieke fouten |
|---:|---:|---:|
| 30 | 0.886482908609522 | 0.11351709139047801 |
| 188 | 0.9799751461622506 | 0.020024853837749473 |
| 189 | 0.9800789871065165 | 0.019921012893483563 |

De onafhankelijke bronberekening had verschil 0 met Excel. JavaScript wordt gecontroleerd met tolerantie 1e-12; statussen en aantallen exact.

Bewijs: [excel-fixtures.json](../tests/pam-ai/excel-fixtures.json), [reproduceerbaar Excel-script](../tests/pam-ai/run-excel-fixtures.ps1).

## Geautomatiseerde logische tests

**32 tests geslaagd.** Naast de dertien bronfixtures: bewijsbodem; onbekend versus nul; harde FAIL ondanks lege andere velden; dubbele testcases; configuratie-/normdrift; ongeldige bewijs-ID’s; bewijsgraden U/C; conceptimport; vervalste route/scope/booleans; beschadigde JSON/versies/prototype-invoer; NO-GO zonder nutteloze tests; zwaardere review; een passend alternatief bij uitgesloten baseline; retries en lasten van mislukkingen; routering; kalenderdatum voor review.

Uitvoeren:

~~~sh
node --test tests/pam-ai/engine.test.cjs
~~~

## Functionele gebruikstest

Gecontroleerd in een schone, geïsoleerde Edge-browser:

- Nieuwe beoordeling, bewerken, automatisch bewaren, herladen en hervatten.
- Volledige fictieve afweging en de beperkte uitkomst van een kleine pilot.
- JSON-export en import als afzonderlijke beoordeling; uitkomsten opnieuw berekend.
- Poort 1-uitsluiting zichtbaar tijdens invoer.
- Mobiele breedte 390 pixels zonder horizontale pagina-overloop.
- Geen JavaScript-runtimefouten en geen externe verzoeken vanuit de app.
- CSV-export en import van 378 testregels; tweede import met dezelfde kandidaat × testcase atomair geweigerd.
- Handmatig een testcase toevoegen en na herladen behouden.
- Afdrukbaar besluitoverzicht naar A4-PDF; controle op leesbaarheid en paginering.

Testbestanden: [UI-test](../tests/pam-ai/ui.test.cjs), [CSV/registratietest](../tests/pam-ai/csv-ui.test.cjs). Voor deze optionele ontwikkeltests is Playwright nodig. De toepassing zelf heeft geen productie-dependencies.

## Resterende beperkingen en volgende praktijkcontrole

De methodiek blijft een validatiekandidaat. De webtoepassing controleert aanwezigheid, samenhang, rekengeldigheid en verwijzingen; niet de inhoudelijke waarheid van bewijs of motiveringen. Geen automatische juridische classificatie of vervanging van DPIA/FRIA/securityonderzoek.

De primaire praktijkcontrole is een echte afgebakende casus met taakeigenaar en reviewer. Meet conform het aangeleverde protocol afzonderlijk voorbereidingstijd, testwerk, onbegrepen velden, herstelwerk en ervaren besliswaarde. Gebruik de feedback om een volgende versie gericht te verbeteren. Er is nog geen empirisch bewijs dat deze webversie een bepaalde tijdsbesparing oplevert.


## Controles van de begeleide route v0.2.0

De browsercontrole begint nu ook bij een lege afweging, zonder vooraf ingevulde bewijsstukken:

- Eerste scherm bevat twee inhoudelijke velden; statistische instellingen verschijnen pas bij de testvoorbereiding.
- Zeven routevragen met dezelfde antwoorden als de bron; de huidige werkwijze kan uit de intake worden overgenomen.
- Onbekend antwoord blijft onbekend na toevoegen van een document. Een negatieve beoordeling sluit testen van die optie uit.
- Bronbeschrijving in twee korte stappen, kiezen op naam, automatische koppeling van de interne bewijsverwijzing.
- 95% wordt als 0,95 opgeslagen en na herladen weer als 95% getoond.
- Automatisch bewaren, navigeren, herladen, JSON-export/import en hervatten; ook op 390 pixels zonder horizontale pagina-overloop.
- Een nog niet ingediend testgeval blijft als concept bewaard bij navigatie en herladen, telt nog niet mee en wordt na controle eenmaal toegevoegd.
- Verplicht aantal AI-aanroepen staat zichtbaar bij de testvragen, ook voor handmatig werk met expliciet nul.
- Wisselen van optie opent de eerste onbeantwoorde vraag; een compleet NO-GO wordt niet als onvolledig gepresenteerd.
- Meerdere verdedigbare opties en een kleine pilot blijven verschillende, correct begrensde uitkomsten.
- Afdruk naar A4, geen JavaScript-fouten en geen externe verzoeken vanuit de toepassing.

Zie [begeleide browsercontrole](../tests/pam-ai/guided-ui.test.cjs). De bestaande dossier-, CSV- en 32 rekencontroles slagen eveneens. De Excel-referentiegevallen zijn hergebruikt; er was geen nieuwe Excel-herberekening nodig voor deze wijziging van de bediening.

Dit zijn technische en functionele controles, geen empirische bruikbaarheidstest met eindgebruikers. De eerste gebruikersreactie maakte duidelijk dat de oorspronkelijke bediening onvoldoende begrijpelijk was. De nieuwe route is een gerichte verbetering; praktijkbegrip en besliswaarde moeten met echte gebruikers en casussen worden beoordeeld.
