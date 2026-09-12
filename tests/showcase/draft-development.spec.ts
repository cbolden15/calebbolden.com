import { test, expect } from './helpers';
import { openDemo, completeDemo } from './demo-cases';

for (const slug of ['prism','agent-team','agent-config','control-center']) test(`explicit ${slug} source draft renders only in development`, async ({ page }, info) => {
  test.skip(process.env.SHOWCASE_SOURCE_DRAFTS !== 'four-new-drafts', 'Only an explicit disposable source candidate supplies these drafts.');
  const r = await openDemo(page, slug);
  await expect(page.locator('main')).toContainText('Local synthetic example. Unapproved for publication.');
  await expect(page.locator('[data-project-media]')).toHaveCount(0);
  await completeDemo(r,slug); await r.getByRole('button',{name:'Reset',exact:true}).click();
  await expect(page.locator('[data-case-study-section="workflow"]')).toBeVisible();
  await page.locator('[data-demo-reload]').click(); await expect(page.locator('main h1')).not.toHaveText('');
  await info.attach('explicit-development-draft',{body:JSON.stringify({slug,status:200,publication:'draft',productionStatus:404}),contentType:'application/json'});
});
