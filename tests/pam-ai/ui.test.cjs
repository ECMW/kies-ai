"use strict";
const { chromium } = require(process.env.PAM_PLAYWRIGHT || "playwright"),
  assert = require("node:assert/strict"),
  fs = require("node:fs"),
  path = require("node:path");
(async () => {
  const browser = await chromium.launch({
    headless: true,
    ...(process.env.PAM_BROWSER_CHANNEL
      ? { channel: process.env.PAM_BROWSER_CHANNEL }
      : {}),
  });
  try {
    const context = await browser.newContext({
        viewport: { width: 1440, height: 1100 },
        acceptDownloads: true,
      }),
      page = await context.newPage(),
      errors = [],
      requests = [];
    page.on("pageerror", (e) => errors.push(e.message));
    page.on("request", (r) => requests.push(r.url()));
    await page.goto("http://127.0.0.1:8765/pam-ai/?view=dossier");
    await page
      .getByText("Eerst een ingevuld voorbeeld bekijken", { exact: true })
      .click();
    await page
      .getByRole("button", { name: "Fictieve volledige afweging", exact: true })
      .click();
    await page.getByText("Meer mogelijkheden", { exact: true }).click();
    await page
      .getByRole("button", { name: "Alle dossiergegevens", exact: true })
      .click();
    await page.getByRole("button", { name: "6 Besluit", exact: true }).click();
    await page
      .getByText("Gereed voor besluit", { exact: true })
      .first()
      .waitFor();
    assert.equal(await page.locator("#report").count(), 1);
    await page
      .getByRole("button", { name: "Besluitversie vastleggen", exact: true })
      .click();
    await page.reload();
    await page.locator("#report").waitFor();
    assert.match(await page.locator("#report").innerText(), /Meerdere opties/);
    const dl = page.waitForEvent("download");
    await page
      .getByRole("button", { name: "Beoordeling exporteren", exact: true })
      .click();
    const file = await dl;
    const exported = await fs.promises.readFile(await file.path(), "utf8");
    assert.equal(JSON.parse(exported).methodVersion, "1.1");
    await page
      .getByRole("button", { name: "← Alle beoordelingen", exact: true })
      .click();
    await page.locator("#import-file").setInputFiles({
      name: "import.json",
      mimeType: "application/json",
      buffer: Buffer.from(exported),
    });
    await page
      .getByRole("heading", { name: "Begin bij de taak", exact: true })
      .waitFor();
    await page
      .getByRole("button", { name: "← Alle beoordelingen", exact: true })
      .first()
      .click();
    await page
      .getByRole("button", { name: "Fictieve kleine pilot", exact: true })
      .click();
    await page.getByRole("button", { name: "6 Besluit", exact: true }).click();
    assert.match(
      await page.locator("#report").innerText(),
      /Pilot onder voorwaarden/,
    );
    await page
      .getByRole("button", { name: "1 Taak & context", exact: true })
      .click();
    await page.screenshot({ path: ".local/pam-desktop.png", fullPage: true });
    await page.setViewportSize({ width: 390, height: 844 });
    await page.screenshot({ path: ".local/pam-mobile.png", fullPage: true });
    assert.equal(
      await page.evaluate(
        () => document.documentElement.scrollWidth > innerWidth,
      ),
      false,
    );
    await page
      .getByRole("button", { name: "← Alle beoordelingen", exact: true })
      .first()
      .click();
    await page
      .getByRole("button", { name: "Nieuwe beoordeling", exact: true })
      .click();
    await page.getByLabel("Taak-ID", { exact: true }).fill("PRAKTIJK-TEST");
    await page
      .getByLabel("Taak of proces", { exact: true })
      .fill("Fictieve bewaarde taak");
    await page
      .getByRole("button", { name: "2 Alternatieven", exact: true })
      .click();
    await page.reload();
    assert.match(
      await page.locator(".workspacebar").innerText(),
      /PRAKTIJK-TEST/,
    );
    await page
      .getByRole("button", { name: "+ Alternatief toevoegen", exact: true })
      .click();
    await page
      .getByRole("combobox", { name: "Type alternatief", exact: true })
      .selectOption("Niet-AI-baseline");
    await page
      .getByLabel("Korte naam", { exact: true })
      .fill("Handmatig voorbeeld");
    await page
      .getByRole("button", { name: "3 Toelaatbaarheid", exact: true })
      .click();
    await page
      .locator('[data-path="candidates.0.gate.0.status"]')
      .selectOption("FAIL");
    assert.match(await page.locator("main").innerText(), /Voldoet niet/);
    assert.deepEqual(errors, []);
    assert.ok(
      requests.every((u) => u.startsWith("http://127.0.0.1:8765/")),
      "Geen externe verzoeken",
    );
    console.log(
      "UI PASS: creëren, bewerken, bewaren, herladen, hervatten, export/import, volledige afweging, kleine pilot, uitsluiting, mobiel; geen externe verzoeken.",
    );
    await page.setViewportSize({ width: 1200, height: 900 });
    await page
      .getByRole("button", { name: "← Alle beoordelingen", exact: true })
      .click();
    await page
      .getByRole("button", { name: "Fictieve volledige afweging", exact: true })
      .click();
    await page.getByRole("button", { name: "6 Besluit", exact: true }).click();
    await page.pdf({
      path: ".local/pam-besluit.pdf",
      format: "A4",
      printBackground: true,
    });
    console.log("Afdruk-PDF gegenereerd.");
  } finally {
    await browser.close();
  }
})().catch((e) => {
  console.error(e);
  process.exitCode = 1;
});
