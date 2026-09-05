/* PAM-AI platformcatalogus: zichtbare menulabels, geen bewezen prestatierangorde. */
(function (root) {
  "use strict";
  const CHECKED = "2026-09-05";
  const source =
    "Door gebruiker aangeleverde foto's, bevestigd door uitlezen van het aangemelde NebulaONE-modelmenu (5 september 2026)";
  const models = [
    {
      id: "gpt54mini",
      name: "GPT-5.4 mini",
      provider: "OpenAI",
      roles: ["routine"],
      claim: "Volgens het platformmenu: snel, voor efficiënt algemeen gebruik.",
      url: "https://developers.openai.com/api/docs/models/gpt-5.4-mini",
      modelFact:
        "Leveranciersmodel: tekst en afbeeldingen in, tekst uit; geen native audio.",
    },
    {
      id: "terra",
      name: "GPT-5.6 Terra",
      provider: "OpenAI",
      roles: ["analysis", "code"],
      claim:
        "Volgens het platformmenu: allround, voor dagelijks programmeerwerk en technische taken.",
      url: "https://developers.openai.com/api/docs/models/gpt-5.6-terra",
      modelFact:
        "Leverancier positioneert Terra als balans tussen intelligentie en kosten. Dit is geen gemeten taakprijs.",
    },
    {
      id: "luna",
      name: "GPT-5.6 Luna",
      provider: "OpenAI",
      roles: ["routine"],
      claim:
        "Volgens het platformmenu: licht en snel, voor korte taken en snelle gesprekken.",
      url: "https://developers.openai.com/api/docs/models/gpt-5.6-luna",
      modelFact:
        "Leverancier positioneert Luna voor veel verzoeken waarbij kosten belangrijk zijn. Geen bewijs van taakgeschiktheid.",
    },
    {
      id: "gpt55",
      name: "GPT-5.5",
      provider: "OpenAI",
      roles: ["complex", "agent"],
      claim:
        "Volgens het platformmenu: plant, handelt en verifieert bij agenttaken.",
      url: "https://developers.openai.com/api/docs/models/gpt-5.5",
      modelFact:
        "Leverancier beschrijft complex professioneel werk en programmeren; gereedschappen vereisen platforminrichting.",
    },
    {
      id: "gpt54",
      name: "GPT-5.4",
      provider: "OpenAI",
      roles: ["analysis", "complex"],
      claim:
        "Volgens het platformmenu: allround voor professioneel werk en lange taken.",
      url: "https://developers.openai.com/api/docs/models/gpt-5.4",
      modelFact:
        "Leverancier beschrijft complex professioneel werk en programmeren. Taakprestatie moet lokaal worden getoetst.",
    },
    {
      id: "chatlatest",
      name: "GPT Chat Latest",
      provider: "OpenAI",
      roles: [],
      dynamic: true,
      claim:
        "Volgens het platformmenu: wisselt automatisch tussen direct antwoorden en nadenken.",
      url: "",
      modelFact:
        "Geen exact onderliggend model vastgesteld. Een wisselende alias biedt geen vaste vergelijkingsbasis.",
    },
    {
      id: "large3",
      name: "Mistral Large 3",
      provider: "Mistral",
      roles: ["analysis", "code", "complex"],
      claim:
        "Volgens het platformmenu: redeneren, programmeren en werken met gereedschappen.",
      url: "https://docs.mistral.ai/models/mistral-large-3-25-12",
      modelFact:
        "Leverancier documenteert een multimodaal model (v25.12). De configuratie in dit platform is niet bevestigd.",
    },
    {
      id: "small",
      name: "Mistral Small",
      provider: "Mistral",
      roles: ["routine"],
      ambiguous: true,
      claim:
        "Volgens het platformmenu: snel, voor dagelijkse taken en gereedschappen.",
      url: "https://docs.mistral.ai/models",
      modelFact:
        "Small bestaat in meerdere versies. Dit platformlabel vermeldt geen versie.",
    },
  ];
  const out = { version: "nebulaone-menu/1", checked: CHECKED, source, models };
  if (typeof module !== "undefined" && module.exports) module.exports = out;
  else root.PAM_CATALOG = out;
})(typeof globalThis !== "undefined" ? globalThis : this);
