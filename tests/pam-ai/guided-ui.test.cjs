"use strict";
const { chromium } = require(process.env.PAM_PLAYWRIGHT || "playwright");
const assert = require("node:assert/strict"),
  fs = require("node:fs");
(async () => {
  const browser = await chromium.launch({
    headless: true,
    ...(process.env.PAM_BROWSER_CHANNEL
      ? { channel: process.env.PAM_BROWSER_CHANNEL }
      : {}),
  });
  try {
    const page = await browser.newPage({
        viewport: { width: 1365, height: 980 },
        acceptDownloads: true,
      }),
      errors = [],
      requests = [];
    page.on("pageerror", (e) => errors.push(e.message));
    page.on("request", (r) => requests.push(r.url()));
    const button = (name) => page.getByRole("button", { name, exact: true });
    const step = (i) =>
      page.locator('nav[aria-label="Stappen"] [data-index="' + i + '"]');
    const chapter = (i) =>
      page.locator('[data-action="g-page"][data-index="' + i + '"]');
    const saved = () =>
      page.evaluate(() => {
        const v = JSON.parse(localStorage.getItem("pam-ai-v1"));
        return v.items.find((x) => x.id === v.current);
      });
    await page.goto("http://127.0.0.1:8765/pam-ai/?view=dossier");
    await page.screenshot({ path: ".local/pam-v02-start.png", fullPage: true });
    await button("Start een nieuwe afweging").click();
    assert.equal(
      await page
        .locator(
          '.guide-page input:not([type="hidden"]),.guide-page textarea,.guide-page select',
        )
        .count(),
      2,
    );
    assert.ok(
      !(await page.locator(".guide-page").innerText()).includes("z-waarde"),
    );
    await page
      .getByLabel("Om welke taak gaat het?", { exact: true })
      .fill("Fictieve test: vragen over verlof");
    await page
      .getByLabel("Wat moet een goed resultaat opleveren?", { exact: true })
      .fill("Een correct antwoord met de juiste bron.");
    await page.screenshot({ path: ".local/pam-v02-taak.png", fullPage: true });
    await button("Verder →").click();
    await page
      .getByLabel("Beschrijf de huidige werkwijze zonder AI", { exact: true })
      .fill("Een medewerker zoekt het beleid op en controleert het antwoord.");
    await page
      .getByLabel(
        "Wat wil je verbeteren, en waarom overweeg je een andere oplossing?",
        { exact: true },
      )
      .fill("Onderzoeken of het zoeken minder tijd kost.");
    await button("Verder →").click();
    await page
      .getByLabel("Hoe wordt het resultaat gebruikt en gecontroleerd?", {
        exact: true,
      })
      .fill("Een collega controleert ieder antwoord.");
    await page
      .getByLabel("Wie gebruikt dit, en wie merkt de gevolgen?", {
        exact: true,
      })
      .fill("Een kleine fictieve proefgroep.");
    await page
      .getByLabel("Wie kent deze taak goed?", { exact: true })
      .fill("Fictieve inhoudsdeskundige");
    await button("Verder →").click();
    const answers = ["Laag", "Ja", "Nee", "Nee", "Beperkt", "Nee", "Nee"];
    for (let i = 0; i < 7; i++) {
      await page
        .locator(
          'input[type="radio"][data-path="intake.answers.' +
            i +
            '"][value="' +
            answers[i] +
            '"]',
        )
        .check();
      await button(
        i === 6 ? "Naar je vervolgstap →" : "Volgende vraag →",
      ).click();
    }
    await page
      .locator('input[type="radio"][value="Gecontroleerde pilot"]')
      .check();
    await page
      .getByLabel("Wie is verantwoordelijk voor het besluit?", { exact: true })
      .fill("Fictieve beslisser");
    await button("Verder: je opties →").click();
    await button("+ Huidige werkwijze toevoegen").click();
    assert.equal(
      (await saved()).candidates[0].settings,
      "Een medewerker zoekt het beleid op en controleert het antwoord.",
    );
    await step(2).click();
    await page.locator('input[type="radio"][value="UNKNOWN"]').check();
    await page
      .getByLabel("Wat moet nog worden uitgezocht, en door wie?", {
        exact: true,
      })
      .fill("Juridische collega onderzoekt de toepassing.");
    await button("+ Bron toevoegen").click();
    await page
      .getByLabel("Naam van het document of de meting", { exact: true })
      .fill("Fictieve beoordeling voor de proef");
    await page
      .getByLabel("Wie is verantwoordelijk voor deze bron?", { exact: true })
      .fill("Fictieve beoordelaar");
    await page
      .getByRole("dialog")
      .getByRole("button", { name: "Verder →", exact: true })
      .click();
    await page
      .getByLabel("Wat voor bewijs is dit?", { exact: true })
      .selectOption("A");
    await page
      .getByLabel("Wat toont deze bron wel en niet aan?", { exact: true })
      .fill("Alleen geldig voor de fictieve proef.");
    await button("Bron bewaren en terug").click();
    let data = await saved();
    assert.equal(data.candidates[0].gate[0].status, "UNKNOWN");
    assert.equal(data.candidates[0].gate[0].evidence, data.evidence[0].id);
    assert.ok(
      await page
        .getByText("Fictieve beoordeling voor de proef", { exact: true })
        .isVisible(),
    );
    assert.equal(
      await page.getByLabel("Bewijs-ID’s", { exact: true }).count(),
      0,
    );
    await page.locator('input[type="radio"][value="FAIL"]').check();
    assert.ok(
      await page
        .getByText("Deze optie kan niet verder", { exact: true })
        .isVisible(),
    );
    await page
      .getByLabel("Wat is de reden?", { exact: true })
      .fill("Fictieve uitsluitingsgrond.");
    await page.screenshot({
      path: ".local/pam-v02-toelaatbaarheid.png",
      fullPage: true,
    });
    await step(3).click();
    await chapter(3).click();
    assert.ok(
      await page
        .getByText(
          "Deze optie is uitgesloten. Onderzoek andere opties of leg vast dat je hiervan afziet.",
          { exact: true },
        )
        .isVisible(),
    );
    await chapter(2).click();
    assert.equal(
      await page
        .getByLabel("Minimaal aandeel goede resultaten (%)", { exact: true })
        .inputValue(),
      "90",
    );
    await page
      .getByLabel("Minimaal aandeel goede resultaten (%)", { exact: true })
      .fill("95");
    assert.equal((await saved()).intake.thresholds.success, 0.95);
    await page.reload();
    assert.equal(
      await page
        .getByLabel("Minimaal aandeel goede resultaten (%)", { exact: true })
        .inputValue(),
      "95",
    );
    await step(0).click();
    assert.equal(
      await page
        .locator('input[type="radio"][value="Gecontroleerde pilot"]')
        .isChecked(),
      true,
    );
    await chapter(0).click();
    await page.setViewportSize({ width: 390, height: 844 });
    await page.screenshot({
      path: ".local/pam-v02-mobile.png",
      fullPage: true,
    });
    assert.equal(
      await page.evaluate(
        () => document.documentElement.scrollWidth > innerWidth,
      ),
      false,
    );
    await page.setViewportSize({ width: 1365, height: 980 });
    let dl = page.waitForEvent("download");
    await button("Bestand bewaren").first().click();
    const exported = await fs.promises.readFile(
      await (await dl).path(),
      "utf8",
    );
    assert.equal(JSON.parse(exported).appVersion, "0.3.0");
    await button("← Alle afwegingen").first().click();
    await page
      .locator("#import-file")
      .setInputFiles({
        name: "afweging.json",
        mimeType: "application/json",
        buffer: Buffer.from(exported),
      });
    assert.equal(
      (await saved()).intake.task,
      "Fictieve test: vragen over verlof",
    );
    await button("← Alle afwegingen").first().click();
    await page
      .getByText("Eerst een ingevuld voorbeeld bekijken", { exact: true })
      .click();
    await button("Fictieve volledige afweging").click();
    await step(4).click();
    await chapter(1).click();
    assert.ok(
      (await page.locator(".guide-page").innerText()).includes("Gelijk"),
    );
    await step(5).click();
    await chapter(4).click();
    assert.ok(
      await page
        .getByText("De onderbouwing is gereed voor een besluit", {
          exact: true,
        })
        .isVisible(),
    );
    assert.match(await page.locator("#report").innerText(), /Meerdere opties/);
    await button("Deze stand vastleggen").click();
    await page.reload();
    assert.equal((await saved()).history.length, 1);
    await page.pdf({
      path: ".local/pam-v02-besluit.pdf",
      format: "A4",
      printBackground: true,
    });
    await button("← Alle afwegingen").first().click();
    await page
      .getByText("Eerst een ingevuld voorbeeld bekijken", { exact: true })
      .click();
    await button("Fictieve kleine pilot").click();
    await step(3).click();
    await chapter(4).click();
    assert.ok(
      await page
        .getByText(
          "De eerste resultaten voldoen; er is nog meer bewijs nodig",
          { exact: true },
        )
        .isVisible(),
    );
    await step(5).click();
    await chapter(4).click();
    assert.match(
      await page.locator("#report").innerText(),
      /Pilot onder voorwaarden/,
    );
    await step(3).click();
    await chapter(3).click();
    await page.getByText("Eén testgeval toevoegen", { exact: true }).click();
    await page
      .getByLabel("Naam of kenmerk van het testgeval", { exact: true })
      .fill("FICTIEF-CONCEPT");
    await page
      .getByLabel("Bij welke situatie of groep hoort dit?", { exact: true })
      .selectOption("S01");
    await page
      .getByLabel("Is het uiteindelijke resultaat goedgekeurd?", {
        exact: true,
      })
      .selectOption("1");
    await page
      .getByLabel("Ging er tijdens een van de pogingen iets kritiek mis?", {
        exact: true,
      })
      .selectOption("0");
    await page
      .getByLabel("Hoe vaak is een AI-model aangeroepen?", { exact: true })
      .fill("0");
    await page
      .getByLabel("Hoe vaak is opnieuw geprobeerd?", { exact: true })
      .fill("0");
    await page
      .getByLabel("Totale tijd voor controleren (minuten)", { exact: true })
      .fill("2");
    await page
      .getByLabel("Totale tijd voor corrigeren en herstellen (minuten)", {
        exact: true,
      })
      .fill("0");
    await page
      .getByLabel("Directe kosten van alle pogingen samen (€)", { exact: true })
      .fill("0");
    await page.locator('input[data-proof="@evidence"]').first().check();
    await page.reload();
    assert.equal(
      await page
        .getByLabel("Naam of kenmerk van het testgeval", { exact: true })
        .inputValue(),
      "FICTIEF-CONCEPT",
    );
    assert.equal((await saved()).runs.length, 60, "Concept telt nog niet mee");
    await step(0).click();
    await step(3).click();
    assert.equal(
      await page
        .getByLabel("Naam of kenmerk van het testgeval", { exact: true })
        .inputValue(),
      "FICTIEF-CONCEPT",
    );
    await button("Testgeval bewaren").click();
    assert.equal((await saved()).runs.length, 61);
    assert.equal(Object.keys((await saved()).pendingRuns).length, 0);
    await page.reload();
    assert.equal((await saved()).runs.length, 61);
    await step(2).click();
    await page.locator('[data-action="g-gate"][data-index="7"]').click();
    await page.locator('[data-action="candidate"][data-index="1"]').click();
    assert.equal(
      await page
        .locator('[data-action="g-gate"][aria-current="step"]')
        .getAttribute("data-index"),
      "0",
    );
    await step(5).click();
    await chapter(0).click();
    await page
      .getByLabel("Wat wil je vastleggen?", { exact: true })
      .selectOption("NO-GO");
    await chapter(4).click();
    assert.ok(
      await page
        .getByText("Afzien van inzet is onderbouwd vastgelegd", { exact: true })
        .isVisible(),
    );
    console.log(
      "Extra UI PASS: concepttest bewaard zonder meetellen, herladen/navigeren/hervatten, verplichte AI-aanroepen zichtbaar, handmatig testen, optievragen resetten, complete NO-GO correct benoemd.",
    );

    assert.deepEqual(errors, []);
    assert.ok(
      requests.every((u) => u.startsWith("http://127.0.0.1:8765/")),
      "Geen externe verzoeken",
    );
    console.log(
      "Guided UI PASS: leeg begin, gewone vragen, 7 routes, huidige werkwijze, onbekend vs uitsluiting, documentkiezer, percentages, bewaren/hervatten/export/import, mobiel, meerdere opties, pilot, afdruk, geen externe verzoeken.",
    );
  } finally {
    await browser.close();
  }
})().catch((e) => {
  console.error(e);
  process.exitCode = 1;
});
