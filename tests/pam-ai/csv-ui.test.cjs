"use strict";
const { chromium } = require(process.env.PAM_PLAYWRIGHT || "playwright"),
  assert = require("node:assert/strict"),
  fs = require("node:fs");
(async () => {
  const b = await chromium.launch({
    headless: true,
    ...(process.env.PAM_BROWSER_CHANNEL
      ? { channel: process.env.PAM_BROWSER_CHANNEL }
      : {}),
  });
  try {
    const p = await b.newPage({ acceptDownloads: true }),
      errors = [];
    p.on("pageerror", (e) => errors.push(e.message));
    await p.goto("http://127.0.0.1:8765/pam-ai/");
    await p
      .getByRole("button", { name: "Fictieve volledige afweging", exact: true })
      .click();
    await p
      .getByRole("button", { name: "4 Test & bewijs", exact: true })
      .click();
    await p.getByText("Testcases importeren uit CSV", { exact: true }).click();
    let download = p.waitForEvent("download");
    await p
      .getByRole("button", { name: "Testregister exporteren", exact: true })
      .click();
    const d = await download,
      csv = await fs.promises.readFile(await d.path());
    await p
      .getByRole("button", { name: "Nieuwe beoordelingsversie", exact: true })
      .click();
    await p
      .getByRole("button", { name: "4 Test & bewijs", exact: true })
      .click();
    const summary = p.getByText("Testcases importeren uit CSV", {
      exact: true,
    });
    if (!(await p.locator("#csv-confirm").isVisible())) await summary.click();
    await p.locator("#csv-confirm").check();
    await p
      .locator("#csv-file")
      .setInputFiles({ name: "test.csv", mimeType: "text/csv", buffer: csv });
    await p
      .getByText("378 testregels geïmporteerd.", { exact: true })
      .waitFor();
    assert.equal(
      await p.evaluate(
        () =>
          JSON.parse(localStorage.getItem("pam-ai-v1")).items.at(-1).runs
            .length,
      ),
      378,
    );
    await p
      .locator("#csv-file")
      .setInputFiles({ name: "dubbel.csv", mimeType: "text/csv", buffer: csv });
    await p.getByText(/Geen regels geïmporteerd:.*dubbele kandidaat/).waitFor();
    assert.equal(
      await p.evaluate(
        () =>
          JSON.parse(localStorage.getItem("pam-ai-v1")).items.at(-1).runs
            .length,
      ),
      378,
    );
    await p.getByText("Een testcase registreren", { exact: true }).click();
    await p.locator('[data-path="@testCase"]').fill("TC-EXTRA");
    await p.locator('[data-path="@stratum"]').selectOption("S01");
    await p.locator('[data-path="@accepted"]').selectOption("1");
    await p.locator('[data-path="@critical"]').selectOption("0");
    for (const [k, v] of Object.entries({
      calls: "0",
      retries: "0",
      verify: "2",
      correct: "0",
      cost: "0",
      latency: "40",
      evidence: "B01",
    }))
      await p.locator('[data-path="@' + k + '"]').fill(v);
    await p
      .getByRole("button", { name: "Testcase bewaren", exact: true })
      .click();
    await p
      .getByText("Testcase bewaard. Alle pogingen tellen mee.", { exact: true })
      .waitFor();
    assert.equal(
      await p.evaluate(
        () =>
          JSON.parse(localStorage.getItem("pam-ai-v1")).items.at(-1).runs
            .length,
      ),
      379,
    );
    await p.reload();
    assert.equal(
      await p.evaluate(
        () =>
          JSON.parse(localStorage.getItem("pam-ai-v1")).items.at(-1).runs
            .length,
      ),
      379,
    );
    assert.deepEqual(errors, []);
    console.log(
      "CSV/manual PASS: 378 regels export/import, duplicaten atomair geweigerd, handmatige testcase + hervatten.",
    );
  } finally {
    await b.close();
  }
})().catch((e) => {
  console.error(e);
  process.exitCode = 1;
});
