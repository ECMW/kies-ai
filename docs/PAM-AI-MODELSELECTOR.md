# PAM-AI-modelselector 0.3.0

Ontwikkeld door **E.C.M. Willems**. Methodiek: **PAM-AI 1.1**, 4 september 2026. Adviesregels: **0.3.0**. Platformcatalogus: **nebulaone-menu/1**, gecontroleerd op 5 september 2026.

## Doel en grens

De gebruikersroute helpt vooraf bij een taak een eerste selectie te maken uit acht zichtbare modellen in NebulaONE. Het is de eerste stap naar een keuzelaag voor het platform. Deze versie voert geen opdrachten uit, selecteert niets in NebulaONE en maakt geen verbinding met model-API's. De herkende taak en het voorlopige advies zijn controleerbaar en corrigeerbaar.

De gebruiker heeft de afzonderlijke advieslaag toegestaan nadat is vastgesteld dat de bronbestanden geen taak-naar-modelcatalogus of adviesregels voor specifieke modellen bevatten. De bestaande formele beoordelingslogica blijft ongewijzigd. Een taakmatch is geen bewijs van toelaatbaarheid, voldoende geschiktheid of proportionaliteit.

## Vertaling van de bronnen

| Onderdeel | Herkomst | Uitwerking |
|---|---|---|
| Toelaatbaarheid → voldoende geschiktheid → proportionaliteit | Handleiding v1.1, poorten en routes; Excel | Ongewijzigd in engine.js en de onderbouwde beoordelingen. Geen gunstige latere uitkomst kan een eerdere uitsluiting opheffen. |
| Concrete configuratie als eenheid | Handleiding P127–128 | Beheer registreert onderliggend model, versie en configuratie. Een deploymentwijziging maakt eerdere lokale goedkeuringen en functiebevestigingen opnieuw onbekend. |
| Geaccepteerde taakuitkomst, alle pogingen en herstel | Handleiding P129–130; Excel testregister | Beschrijvende metingen tellen alle kosten en controle/herstel, gedeeld door het aantal geaccepteerde uitkomsten. Geen kwaliteitsbewijs door deze deling. |
| Geen verplichte winnaar | Handleiding P135 | Shortlist, geen geschikte kandidaat, extra bewijsbehoefte en een rekenhulpmiddel zonder AI zijn geldige uitkomsten. Er is geen totaalscore. |
| Taakcriteria vóór testen | Handleiding P180–185 | Taakgericht controlevoorstel; formele acceptatie en testopzet worden in het dossier vooraf vastgelegd. |
| Routes, R1-pilot, Wilson en bewijsbodem | Handleiding en Excel v1.1 | Alleen de oorspronkelijke engine bepaalt deze. De selector vult geen route, PASS, bewijs of testresultaat in. |
| Modelnamen en korte positionering | Gebruikersfoto's; live gelezen modelmenu | Acht exacte menulabels. Korte positionering als voorlopige aanwijzing, geen onafhankelijke prestatietest. |
| Taakherkenning en kwalitatieve profielen | Eigen adviesregels 0.3.0, door gebruiker toegestaan | Lokale woordherkenning met handmatige correctie. Geen externe AI-analyse, gewichten, scores of verzonnen statistische normen. |
| Platformvoorwaarden | Door beheer vastgelegde lokale configuratie | Beschikbaarheid, gegevensafspraken, bron, reikwijdte, herbeoordeling en ingeschakelde functies. Dit is nog geen centraal beheerd beleidsregister. |

## Taakregels

| Regel | Eerste onderzoeksgroep | Reden en beperking |
|---|---|---|
| TASK-REWRITE, DRAFT, SUMMARY, EXTRACT | GPT-5.4 mini, GPT-5.6 Luna, Mistral Small | Het menu positioneert deze voor afgebakende dagelijkse taken. Geen bewezen onderlinge rangorde. |
| TASK-ANALYSIS | GPT-5.6 Terra, GPT-5.4, Mistral Large 3 | Allround, technische taken en redeneren volgens de modelbeschrijvingen. |
| TASK-CODE | GPT-5.6 Terra, Mistral Large 3 | Programmering wordt expliciet genoemd. Andere modellen kunnen programmeren; deze shortlist is een startregel, geen uitputtende capabilityclassificatie. |
| TASK-COMPLEX | GPT-5.5, GPT-5.4, Mistral Large 3 | Complex professioneel werk of redeneren wordt beschreven; noodzaak en resultaat moeten worden getoetst. |
| TASK-RESEARCH | Analysegroep, alleen bij bevestigde webfunctie | Een modelnaam bewijst geen toegang tot actuele informatie. |
| TASK-AUDIO | Alleen met bevestigde audiofunctie | Opname → transcript is een andere stap dan transcript → samenvatting. Bij de tweede stap kan de routinegroep als afzonderlijk startpunt worden getoond. |
| TASK-IMAGE | Alleen met bevestigde beeldgeneratiefunctie | Afbeeldingen begrijpen is niet hetzelfde als afbeeldingen maken. De catalogus bevestigt geen werkende beeldgenerator. |
| TASK-AGENT | GPT-5.5, alleen bij bevestigde gereedschapsfunctie | Rechten, bevestiging en herstel blijven nodig. Geen actie wordt uitgevoerd. |
| TASK-NUMBERS | Rekenblad, calculator of getest script | Exacte berekeningen volgens vastgelegde regels. |
| TASK-UNKNOWN | Taak verduidelijken | Onbekend wordt niet eenvoudig of laagrisico. |

Een expliciete lokale verwerkingseis en het zelfstandig uitvoeren van handelingen begrenzen ook de volledige shortlist. De herkenning dekt niet alle formuleringen of samengestelde opdrachten; gebruikers moeten de interpretatie kunnen corrigeren. Er worden geen juridische conclusies uit trefwoorden getrokken.

GPT Chat Latest blijft buiten de vaste shortlist omdat geen onderliggend model is vastgesteld. Mistral Small blijft als exact menulabel staan; eigenschappen van een willekeurige Small-versie worden niet overgenomen.

## Catalogusbewijs

Officiële documentatie is gelezen voor de vijf concrete OpenAI-namen:
- [GPT-5.4 mini](https://developers.openai.com/api/docs/models/gpt-5.4-mini)
- [GPT-5.6 Terra](https://developers.openai.com/api/docs/models/gpt-5.6-terra)
- [GPT-5.6 Luna](https://developers.openai.com/api/docs/models/gpt-5.6-luna)
- [GPT-5.5](https://developers.openai.com/api/docs/models/gpt-5.5)
- [GPT-5.4](https://developers.openai.com/api/docs/models/gpt-5.4)
- [Mistral Large 3](https://docs.mistral.ai/models/mistral-large-3-25-12)
- [Mistral-catalogus](https://docs.mistral.ai/models)

Deze documentatie bevestigt leveranciersmodellen, niet de feitelijke API-identiteit of instellingen binnen NebulaONE. De live gelezen platformversie was 2.2616.5072. Een opnameknop in de chat is geen bewijs dat complete vergaderbestanden inclusief sprekerherkenning ondersteund worden. Bronfoto's, persoonsgegevens uit de sessie en sessiegegevens zijn niet opgenomen in de repository.

Zie [onderzoek naar de blaadjes](PAM-AI-BLAADJES.md). De labels sturen de selectie niet. Kosten, energie, CO₂ en water blijven onbekend zolang toepasselijk bewijs ontbreekt.

## Opslag en beheer

- Adviezen: `pam-ai-selector-v1`, schema `pam-ai-modeladvies/1`.
- Lokale platforminstellingen: `pam-ai-platform-v1`, schema `pam-ai-platform/1`.
- Bestaande formele beoordelingen blijven in `pam-ai-v1`.
- Adviesimport maakt een kopie en herberekent met de huidige platformafspraken. Een meegeleverd advies of platformsnapshot wordt niet stilzwijgend als actuele instelling gebruikt.
- Platformimport is een aparte beheerdershandeling. Het formaat, model-ID's, keuzes en datums worden gecontroleerd.
- Taakwijzigingen archiveren eerdere metingen bij hun oude context. Configuratiewijzigingen maken oude metingen onbruikbaar voor de huidige configuratie.
- De formele overdracht neemt uitsluitend taakbeschrijving, gewenst resultaat, gebruik en kandidaatbeschrijvingen over. Geen tests, formele poortuitkomsten, bewijs of statistische uitkomsten.
- Maximaal 100 adviezen, acht modelmetingen en 50 eerdere meetcontexten per advies. Advies- en platformimport maximaal 1 MB. Dit zijn technische grenzen, geen methodologische drempels.

Lokale instellingen zijn voor een prototype: iedereen met toegang tot hetzelfde browserprofiel kan ze wijzigen. Voor productie horen modelcatalogus en beleid centraal onder toegangsbeheer en versiebeheer.

## Vervolg naar automatische selectie

De zuivere functie `PAM_SELECT.recommend(advies, platform, datum)` levert herkenning, regel-ID, kandidaten, uitsluitingen en ontbrekende informatie. `automaticRouting` is in deze versie altijd `false`.

Voor automatische routing moeten platformbeheerders eerst de concrete API-/deploymentidentiteiten bevestigen, representatief lokaal taakbewijs per configuratie vastleggen, toepassingsvoorwaarden afbakenen en een gecontroleerde koppeling realiseren. Modelleer ook uitval, wijziging, menselijke correctie en een terugval zonder model. Een beperkt R1-pilotresultaat mag niet als toestemming voor brede automatische inzet dienen.

Het product bevat bewust geen generieke automatische winnaar, fictieve benchmark, duurzaamheidsscore of stille fallback naar een krachtiger model.
