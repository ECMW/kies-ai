# PAM-AI — Proportionele AI-modelkeuze

**Ontwikkeld door E.C.M. Willems.** Methodiek v1.1 · webtoepassing v0.1.0.

Een lokale Nederlandstalige toepassing om een concrete AI-configuratie te vergelijken met andere technologie en de huidige niet-AI-werkwijze. Eerst toelaatbaarheid, dan voldoende geschiktheid, daarna proportionaliteit. Het resultaat is een controleerbaar besluitrecord, zonder totaalscore of automatische winnaar.

[Open PAM-AI](https://ecmw.github.io/kies-ai/pam-ai/) · [Bronvertaling en beperkingen](../docs/PAM-AI-BRONVERTALING.md) · [Testverslag](../docs/PAM-AI-CONTROLES.md)

## Lokaal starten

Vanuit de hoofdmap, met Node.js:

~~~sh
node scripts/serve-pam.cjs
~~~

Open daarna http://127.0.0.1:8765/pam-ai/ in je browser. Er zijn geen npm-installatie, API-sleutels of externe diensten nodig. Stop de lokale server met Ctrl+C.

De drie scripts en stylesheet in deze map kunnen ook op een eenvoudige statische webserver staan. Open bij voorkeur via localhost of HTTPS; direct openen met file:// heeft browserafhankelijke opslag.

## Kort gebruiken

1. Maak een beoordeling aan. Beschrijf taak, gewenste uitkomst, baseline en context.
2. Leg de route, drempels en besliskritieke dimensies vooraf vast.
3. Voeg concrete alternatieven toe, inclusief de niet-AI-baseline.
4. Vul het bewijsregister in en koppel bewijs-ID’s aan de acht domeinen.
5. Leg het testontwerp vast. Voer testcases in of importeer CSV met de kolommen van werkblad 05_Testcases.
6. Lees geschiktheid, onzekerheid en ontbrekende metingen. Vergelijk passende alternatieven op extra waarde, lasten en context.
7. Leg het besluit, voorwaarden, stop/herstel en herbeoordeling vast. Je kunt ook NO-GO, meerdere opties of uitstel vastleggen.
8. Exporteer JSON als reservekopie of om elders te hervatten. Gebruik Afdrukken voor een leesbaar besluitoverzicht/PDF.

Iedere testcase bevat de totalen van alle pogingen. Een kritieke fout in een eerdere poging blijft een kritieke fout. Leeg betekent onbekend; gemeten nul is 0. Het formulier voorkomt dat retries of dubbele rijen als extra onafhankelijke cases tellen.

Taaknorm en testontwerp worden vastgezet bij de eerste test. Maak een nieuwe beoordelingsversie voor gewijzigde criteria. Configuratiewijzigingen worden ten opzichte van de testregistratie gesignaleerd.

## Bewaren en privacy

Alles wordt in deze browser opgeslagen. Invoer wordt niet naar een server of AI-dienst verstuurd. Er zijn geen externe scripts, lettertypes, analytics of AI-koppelingen. De Content Security Policy verbiedt uitgaande connecties vanuit de app.

JSON-export bevat je volledige beoordeling, inclusief testgegevens, bewijsverwijzingen en besluitversies. Behandel die bestanden passend bij hun inhoud. Een gedeeld browserprofiel geeft toegang tot dezelfde lokale dossiers. Browsergegevens wissen of een volle opslag kan gegevensverlies veroorzaken; bewaar exports.

## Voorbeelden en bronnen

Alle voorbeeldgegevens zijn expliciet fictief. Ze tonen bediening en berekeningen, geen feitelijke modelprestaties. De twee aangeleverde bronbestanden staan ongewijzigd in [bronnen](./bronnen/). Auteurschap en oorspronkelijke rechten blijven vermeld. Deze software verleent geen nieuwe licentie op de afzonderlijke bronmethodiek.

## Tests

~~~sh
node --test tests/pam-ai/engine.test.cjs
~~~

De JSON met dertien rechtstreeks in Microsoft Excel herberekende fixtures en het reproduceerscript staan in tests/pam-ai. De UI-test gebruikt Playwright als afzonderlijk testhulpmiddel; de toepassing heeft die dependency niet nodig. Start eerst de lokale server, stel desgewenst PAM_PLAYWRIGHT in op je Playwright-module en PAM_BROWSER_CHANNEL op msedge, en voer tests/pam-ai/ui.test.cjs uit.

## Onderhoud

- engine.js: zuivere rekenregels, route, bewijs- en dossiercontroles.
- app.js: formulier, lokale opslag, import/export en besluitoverzicht.
- examples.js: uitsluitend fictieve demonstratiebeoordelingen.
- style.css en index.html: vormgeving en structuur.
- Geen framework, buildstap of productie-dependencies.

PAM-AI v1.1 is een research-grade validatiekandidaat. De toepassing vervangt geen juridische beoordeling, DPIA, FRIA, securityonderzoek of professioneel inhoudelijk oordeel.
