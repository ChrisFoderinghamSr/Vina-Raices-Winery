import assert from 'node:assert/strict';
import {chromium} from 'playwright';

const browser = await chromium.launch();
try {
  const page = await browser.newPage({viewport:{width:390,height:844},reducedMotion:'reduce'});
  await page.goto('http://127.0.0.1:8080');
  const toggle=page.locator('.menu-toggle');
  await toggle.click();
  assert.equal(await toggle.getAttribute('aria-expanded'),'true');
  await toggle.click();
  for (const button of await page.locator('.wine-detail').all()) {
    await button.click();
    await page.locator('dialog[open]').waitFor();
    await page.keyboard.press('Escape');
    await page.locator('dialog').waitFor({state:'hidden'});
  }
  await page.locator('#email').fill('browser@example.test');
  await page.locator('#signup-form button').click();
  await page.getByText('Thank you for joining our mailing list.').waitFor();
} finally { await browser.close(); }
