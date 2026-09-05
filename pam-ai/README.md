# PAM-AI — Proportionele AI-modelkeuze

**Ontwikkeld door E.C.M. Willems.** Methodiek v1.1 · webtoepassing v0.2.0.

PAM-AI helpt een concrete werkwijze met AI af te wegen tegen andere technologie en de huidige werkwijze zonder AI. Eerst vaststellen wat mag, daarna wat voldoende werkt, daarna of de waarde de lasten rechtvaardigt. De gebruiker legt een controleerbaar besluit vast; de tool wijst geen winnaar aan.

[Open PAM-AI](https://ecmw.github.io/kies-ai/pam-ai/) · [Bronvertaling](../docs/PAM-AI-BRONVERTALING.md) · [Controles en beperkingen](../docs/PAM-AI-CONTROLES.md)

## Beginnen

1. Kies **Start een nieuwe afweging** en beschrijf één taak en het gewenste resultaat.
2. Beantwoord de korte deelstappen. Wat je nog niet weet, mag openblijven.
3. Voeg bij **Je opties** de huidige werkwijze toe en de andere oplossingen die je wilt onderzoeken.
4. Beantwoord bij **Mag dit?** de acht vragen per optie. Kies bewijs op documentnaam of voeg een bron toe. Een bron kiezen betekent niet automatisch dat de toepassing is goedgekeurd.
5. Leg bij **Werkt het?** eerst de kwaliteitseisen en testafspraken vast. De statistische startwaarden komen uit de bron en vragen een motivering voor jouw taak. Registreer daarna resultaten, afzonderlijk of via CSV.
6. Vergelijk de geschikte opties bij **Is het de moeite waard?** Neem ook afhankelijkheden, menselijk ingrijpen en invoering mee.
7. Bewaar bij **Je besluit** een keuze, meerdere opties, afzien van inzet of uitstel. Leg onderbouwing, grenzen, verantwoordelijkheid en herbeoordeling vast.

De begeleide route toont alleen het actuele onderdeel. Berekeningen en toelichtingen staan achter uitklappers. Via **Meer mogelijkheden → Alle dossiergegevens** is dezelfde beoordeling ook als volledig dossier te bewerken. Op mobiel staat dit onder **Dossier en versies**.

Een volledig ingevuld fictief voorbeeld staat op de startpagina achter **Eerst een ingevuld voorbeeld bekijken**. Het voorbeeld is geen aanbeveling of feitelijk bewijs van modelprestaties.

## Bewaren en hervatten

Invoer wordt automatisch in deze browser bewaard. Ook een nog niet ingediend testgeval wordt als concept bewaard; pas na **Testgeval bewaren** wordt het gecontroleerd en meegerekend.

Met **Bestand bewaren** download je een JSON-reservekopie. Op de startpagina kun je dit bestand weer openen. Een import wordt als aparte beoordeling opgeslagen; uitkomsten worden opnieuw berekend. Bestaande v0.1.0-beoordelingen blijven bruikbaar.

**Overzicht afdrukken / PDF** maakt het besluitoverzicht afdrukbaar. Een onvolledige afweging blijft een concept of aangehouden besluit. Vastleggen is geen automatische goedkeuring.

Alle pogingen, controle en herstel tellen samen per testgeval, ook als de taak niet lukt. Een eerdere kritieke fout blijft meetellen. Onbekende metingen blijven leeg; nul is alleen een gemeten nul. Voor andere taaknormen of configuraties gebruik je een nieuwe beoordelingsversie.

Browsergegevens wissen of een volle opslag kan gegevensverlies veroorzaken. Bewaar regelmatig een eigen bestand. Dossiers zijn zichtbaar voor anderen die hetzelfde browserprofiel gebruiken.

## Lokaal starten

Vanuit de hoofdmap, met Node.js:

~~~sh
node scripts/serve-pam.cjs
~~~

Open daarna http://127.0.0.1:8765/pam-ai/. Geen installatie van productiepakketten, API-sleutels of externe diensten nodig. Stop de server met Ctrl+C. De toepassing kan ook op een statische HTTPS-webserver staan.

## Privacy en bronnen

De toepassing verstuurt invoer niet naar een server of AI-dienst. Er zijn geen externe scripts, lettertypes, analytics of AI-koppelingen. De Content Security Policy verbiedt uitgaande verbindingen vanuit de app. Bewijsstukken blijven op hun eigen locatie; PAM-AI bewaart beschrijvingen en verwijzingen.

De twee aangeleverde bestanden staan ongewijzigd in [bronnen](./bronnen/). Oorspronkelijk auteurschap en rechten blijven behouden. Deze software verleent geen nieuwe licentie op de afzonderlijke methodiek.

PAM-AI v1.1 is een methodiek in validatie. De tool controleert samenhang en berekeningen, niet de inhoudelijke waarheid van bewijs. Hij vervangt geen juridische beoordeling, DPIA, FRIA of securityonderzoek. De toegankelijkheid voor gebruikers moet verder worden getoetst met echte praktijksituaties.

## Tests en onderhoud

~~~sh
node --test tests/pam-ai/engine.test.cjs
~~~

De 32 reken- en dossiercontroles bevatten dertien rechtstreeks in Microsoft Excel herberekende referentiegevallen. Die referenties zijn opnieuw gebruikt voor v0.2.0; de rekenregels zijn ongewijzigd.

Browsercontroles staan in tests/pam-ai/guided-ui.test.cjs, ui.test.cjs en csv-ui.test.cjs. Ze gebruiken Playwright als ontwikkelhulpmiddel. Start de lokale server en stel zo nodig PAM_PLAYWRIGHT en PAM_BROWSER_CHANNEL=msedge in. De toepassing zelf heeft geen productie-dependencies.

- engine.js: bronregels, berekeningen en dossiercontroles.
- guide.js / guide.css: begeleide vragen, documentkiezer en gewone taal.
- app.js: gedeelde formulierfuncties, dossierweergave, lokale opslag, import/export en afdruk.
- examples.js: uitsluitend fictieve voorbeelden.
- index.html / style.css: basisstructuur en vormgeving.

Geen framework of buildstap. De begeleide route gebruikt dezelfde velden en rekenmodule als de dossierweergave.
