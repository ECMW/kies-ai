# PAM-AI — Proportionele AI-modelkeuze

**Ontwikkeld door E.C.M. Willems.** Methodiek 1.1 · toepassing en adviesregels 0.3.0.

PAM-AI helpt gebruikers vooraf een eerste modelselectie te maken voor hun taak, uit acht zichtbare modellen in NebulaONE. De oorspronkelijke onderbouwde beoordeling blijft beschikbaar voor toelaatbaarheid, voldoende geschiktheid en proportionaliteit.

## Beginnen

1. Beschrijf je opdracht op de startpagina. Controleer de herkende taak; je kunt deze aanpassen.
2. Beantwoord twee contextvragen: welke informatie gebruik je en wat doe je met de uitkomst? Onbekend is een geldig antwoord.
3. Bekijk de voorlopige selectie, de redenen en de gerichte controles. Bewaar eventueel een model als startkeuze. Dit is geen toestemming of bewezen geschiktheid.
4. Je advies wordt lokaal bewaard. Gebruik **Mijn adviezen** om te hervatten en **Bewaar advies als bestand** voor een reservekopie. Import maakt een kopie en bepaalt het advies opnieuw.
5. Gebruik **Afdrukken / PDF** voor een leesbaar overzicht. Alle voorbeeldtaken zijn gemarkeerd als fictief.

De tool voert je opdracht niet uit. De taakherkenning werkt met lokale woorden en kan iets verkeerd begrijpen. Er zijn geen API-sleutels of externe AI-diensten nodig.

## Platformbeheer

**Platformbeheer** bevat de acht modellen, hun configuraties, gegevensafspraken en ingeschakelde functies. Vul deze in op basis van gecontroleerde informatie. De standaard bevat geen fictieve goedkeuringen, prijzen of duurzaamheidswaarden. Bewaar of importeer instellingen via de afzonderlijke platformknoppen.

Dit beheer geldt alleen in de huidige browser, zonder gebruikersrollen. Een productieplatform moet deze informatie centraal en beschermd beheren. Automatische routing naar NebulaONE is nog niet ingeschakeld.

## Onderbouwen volgens de methodiek

Via **Onderbouwde beoordelingen** zijn bestaande dossiers en de volledige PAM-AI-route bereikbaar. Nieuwe dossiers volgen: taak → opties → toelaatbaarheid → geschiktheid en bewijs → proportionaliteit → besluit.

De routeafhankelijke bewijslast, R1-pilot, Wilson-grenzen en formele beslisregels blijven uit v1.1 afkomstig. De selector kent geen formele PASS toe. De knop om een modeladvies uit te werken neemt alleen taak- en kandidaatbeschrijvingen over.

Alle pogingen, verificatie, correctie en herstel tellen mee per geaccepteerde taakuitkomst. In de selector kun je eigen beschrijvende metingen vastleggen; die leveren geen statistisch bewijs van voldoende geschiktheid. Milieubelasting blijft onbekend zonder passend bewijs.

## Lokaal starten

Vanuit de hoofdmap met Node.js:

~~~sh
node scripts/serve-pam.cjs
~~~

Open daarna [de lokale toepassing](http://127.0.0.1:8765/pam-ai/). Geen framework, productiepakketten of buildstap nodig. Stop de server met Ctrl+C. Statische HTTPS-hosting is ook mogelijk.

## Bewaren en privacy

Invoer blijft in dit browserprofiel. Er zijn geen externe scripts, fonts, analytics of AI-verzoeken. De Content Security Policy verbiedt uitgaande appverbindingen. Een bewuste klik op een documentatielink opent wel de website van die bron.

Adviezen, platforminstellingen en formele dossiers hebben afzonderlijke opslag en import. Browsergegevens wissen kan ze verwijderen; bewaar reservekopieën. Iedereen die hetzelfde browserprofiel gebruikt, kan ze lezen of aanpassen.

De twee oorspronkelijke bronnen staan ongewijzigd in [bronnen](bronnen/). Het auteurschap en de rechten op de methodiek blijven behouden. Bronfoto's en sessiegegevens zijn niet gepubliceerd.

## Controles en onderhoud

~~~sh
node --test tests/pam-ai/engine.test.cjs tests/pam-ai/selector.test.cjs
~~~

De 32 oorspronkelijke controles bevatten 13 rechtstreeks in Excel herberekende referentiegevallen. Daarnaast zijn er 17 controles voor de advieslaag. De bronrekenregels zijn in v0.3.0 ongewijzigd.

Browsercontroles: `selector-ui.test.cjs`, `guided-ui.test.cjs`, `ui.test.cjs` en `csv-ui.test.cjs` in tests/pam-ai. Ze gebruiken Playwright als ontwikkelhulpmiddel; start eerst de lokale server. Zo nodig stel je PAM_PLAYWRIGHT en PAM_BROWSER_CHANNEL=msedge in.

- model-catalog.js: zichtbare modelnamen en herleidbare leveranciersclaims.
- selector-engine.js: pure, afzonderlijke adviesregels en importcontrole.
- selector.js / selector.css: korte route, lokale opslag, beheer en afdruk.
- engine.js: formele bronregels en statistiek.
- guide.js / app.js: formele beoordeling, bewijs, versies en import/export.
- examples.js: fictieve formele voorbeelden.

[Bronvertaling](../docs/PAM-AI-BRONVERTALING.md) · [Adviesregels en automatische routing](../docs/PAM-AI-MODELSELECTOR.md) · [Onderzoek naar de blaadjes](../docs/PAM-AI-BLAADJES.md) · [Controles en beperkingen](../docs/PAM-AI-CONTROLES.md)

PAM-AI 1.1 is een methodiek in validatie. De toepassing vervangt geen juridische beoordeling, DPIA, FRIA of securityonderzoek. De praktische bruikbaarheid en modeladviezen moeten verder worden getest met echte gebruikers en passend lokaal taakbewijs.
