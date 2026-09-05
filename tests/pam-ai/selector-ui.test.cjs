"use strict";
const { chromium } = require(process.env.PAM_PLAYWRIGHT || "playwright"),
  assert = require("node:assert/strict"),
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
    const stored = () =>
      page.evaluate(() => {
        const v = JSON.parse(localStorage.getItem("pam-ai-selector-v1"));
        return v.entries.find((x) => x.id === v.current);
      });
    await page.goto("http://127.0.0.1:8765/pam-ai/");
    await page
      .getByRole("heading", { name: "Wat wil je gedaan krijgen?", exact: true })
      .waitFor();
    await page.screenshot({ path: ".local/pam-v03-start.png", fullPage: true });
    assert.equal(await page.locator("main textarea:visible").count(), 1);
    await button("Vergaderopname → actiepunten").click();
    assert.match(
      await page.locator("#s-recognition").innerText(),
      /opname uitschrijven/,
    );
    await button("Bekijk passende modellen →").click();
    await page.locator('input[name="s-data"][value="personal"]').check();
    await page.locator('input[name="s-use"][value="draft"]').check();
    await button("Toon mijn modeladvies →").click();
    await page
      .getByRole("heading", {
        name: "Eerst de benodigde platformfunctie bevestigen",
        exact: true,
      })
      .waitFor();
    assert.equal(await page.locator('[data-select="choose"]').count(), 0);
    assert.equal(await page.locator(".s-model").count(), 3);
    await page.screenshot({ path: ".local/pam-v03-audio.png", fullPage: true });
    await button("← Taak of context wijzigen").click();
    await page
      .locator("#s-task")
      .fill("Fictief: herschrijf een openbare tekst op B1-niveau.");
    await button("Bekijk passende modellen →").click();
    await page.locator('input[name="s-data"][value="public"]').check();
    await button("Toon mijn modeladvies →").click();
    assert.equal(await page.locator('[data-select="choose"]').count(), 3);
    await page.locator('[data-select="choose"][data-id="luna"]').click();
    assert.equal((await stored()).chosen, "luna");
    await page.locator(".s-measurements summary").click();
    await page.locator('[data-select="add-measure"][data-id="luna"]').click();
    await page.locator("#s-luna-cases").fill("10");
    await page.locator("#s-luna-accepted").fill("11");
    assert.equal((await stored()).measurements[0].accepted, null);
    await page.locator("#s-luna-accepted").fill("5");
    await page.locator("#s-luna-cost").fill("2");
    await page.locator("#s-luna-minutes").fill("15");
    await page.locator("#s-luna-reference").fill("Fictieve testnotities A");
    assert.match(
      await page.locator('[data-metric-result="luna"]').innerText(),
      /0,4 €.*3 min.*Onbekend/,
    );
    await page.reload();
    assert.match(await page.locator("h1").innerText(), /Begin met/);
    assert.equal((await stored()).measurements[0].accepted, 5);
    await page
      .locator("#s-notes")
      .fill("FICTIEF: betekenis en namen controleren.");
    let dl = page.waitForEvent("download");
    await button("Bewaar advies als bestand").click();
    const file = await dl,
      exported = await fs.promises.readFile(await file.path(), "utf8");
    assert.equal(JSON.parse(exported).schema, "pam-ai-modeladvies/1");
    assert.equal(JSON.parse(exported).advice.automaticRouting, false);
    await button("Mijn adviezen").click();
    await page.locator("#selector-import").setInputFiles({
      name: "advies.json",
      mimeType: "application/json",
      buffer: Buffer.from(exported),
    });
    await page
      .getByRole("heading", {
        name: "Begin met een model voor afgebakende teksttaken",
        exact: true,
      })
      .waitFor();
    assert.equal(
      (await stored()).notes,
      "FICTIEF: betekenis en namen controleren.",
    );
    await button("← Taak of context wijzigen").click();
    await page.locator("#s-task").fill("Fictief: schrijf een mail.");
    assert.equal((await stored()).measurements.length, 0);
    assert.equal((await stored()).archivedMeasurements.length, 1);
    await page.reload();
    assert.equal((await stored()).archivedMeasurements.length, 1);
    await button("Platformbeheer").click();
    await page.locator('[data-admin="deployment"]').fill("FICTIEF v1");
    await page
      .locator('[data-admin="approval.internal"]')
      .selectOption("allowed");
    await page.locator('[data-admin="deployment"]').fill("FICTIEF v2");
    assert.equal(
      await page.locator('[data-admin="approval.internal"]').inputValue(),
      "unknown",
    );
    await page
      .locator('[data-admin="approval.public"]')
      .selectOption("blocked");
    await button("Terug naar modelkeuze").click();
    await button("Bekijk passende modellen →").click();
    await button("Toon mijn modeladvies →").click();
    assert.equal(
      await page.locator('[data-select="choose"][data-id="gpt54mini"]').count(),
      0,
    );
    assert.equal(await page.locator('[data-select="choose"]').count(), 2);
    await page.screenshot({
      path: ".local/pam-v03-advies.png",
      fullPage: true,
    });
    await page.setViewportSize({ width: 390, height: 844 });
    await page.screenshot({
      path: ".local/pam-v03-mobile.png",
      fullPage: true,
    });
    assert.ok(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth + 1,
      ),
    );
    await page.setViewportSize({ width: 1365, height: 980 });
    await page.evaluate(() =>
      document
        .querySelectorAll("#selector-report details")
        .forEach((x) => (x.open = true)),
    );
    await page.pdf({
      path: ".local/pam-v03-advies.pdf",
      format: "A4",
      printBackground: true,
    });
    await page
      .getByRole("button", {
        name: "Werk dit uit in een PAM-AI-beoordeling",
        exact: true,
      })
      .click();
    await page
      .getByRole("heading", {
        name: "Welke taak wil je verbeteren?",
        exact: true,
      })
      .waitFor();
    const formal = await page.evaluate(() => {
      const v = JSON.parse(localStorage.getItem("pam-ai-v1"));
      return v.items.find((x) => x.id === v.current);
    });
    assert.equal(formal.intake.task, "Fictief: schrijf een mail.");
    assert.equal(formal.runs.length, 0);
    assert.ok(
      formal.candidates.every((c) => c.gate.every((g) => g.status === "")),
    );
    assert.equal(formal.intake.confirmedRoute, "");
    await button("Modelkeuze").click();
    await page
      .getByRole("heading", {
        name: "Begin met een model voor afgebakende teksttaken",
        exact: true,
      })
      .waitFor();
    assert.deepEqual(errors, []);
    assert.ok(
      requests.every(
        (x) => x.startsWith("http://127.0.0.1:8765/") || x.startsWith("blob:"),
      ),
    );
    console.log(
      "Selector UI: audio, tekst, blokkade, metingen, invoerfout, herladen, import/export, archief, mobiel, PDF, dossieroverdracht en geen externe requests gecontroleerd.",
    );
  } finally {
    await browser.close();
  }
})().catch((e) => {
  console.error(e);
  process.exit(1);
});
