import type { Page, Locator } from '@playwright/test';
import { expect } from '@playwright/test';
export const demos = [
  { slug: 'vora', region: 'Vora approval example', marker: 'Approval recorded for this example. Execution has not been shown.' },
  { slug: 'prism', region: 'Prism trace example', marker: 'The result and receipt stay hidden until the sixth event.' },
  { slug: 'agent-team', region: 'Agent Team sample run explorer', marker: 'Merge-policy enforcement: disabled' },
  { slug: 'agent-config', region: 'Agent Config compiler example controls', marker: 'Show stale output' },
  { slug: 'control-center', region: 'Control Center sample dashboard controls', marker: 'Control Center controls ready.' },
];
export async function openDemo(page: Page, slug: string): Promise<Locator> {
  await page.goto(`/work/${slug}`, { waitUntil: 'networkidle' });
  await page.locator('[data-demo-enhancement]').scrollIntoViewIfNeeded();
  const region = page.locator('[data-demo-enhancement] > div[data-ready] > section');
  await expect(region).toBeVisible();
  return region;
}
export async function completeDemo(region: Locator, slug: string) {
  const click = (name: string) => region.getByRole('button', { name, exact: true }).click();
  if (slug === 'vora') { await click('Review proposed action'); await click('Approve example'); await click('Show sample result'); }
  if (slug === 'prism') { await click('Start example'); for (let n = 0; n < 5; n++) await click('Next event'); await click('Inspect receipt'); }
  if (slug === 'agent-team') for (let n = 0; n < 4; n++) await click('Next stage');
  if (slug === 'agent-config') { await click('Detailed'); await click('Show stale output'); await click('Regenerate example'); }
  if (slug === 'control-center') { await click('Fails'); await click('Show sample run result'); }
}
