import { Page, TestInfo } from '@playwright/test';

/**
 * Capture screenshot and trace for a failed test.
 * @param page Playwright Page object
 * @param testInfo Playwright TestInfo object
 * @param screenshotDir Directory for screenshots (default: 'screenshots')
 * @param traceDir Directory for traces (default: 'traces')
 */
export async function captureFailureArtifacts(
  page: Page,
  testInfo: TestInfo,
  screenshotDir = 'screenshots',
  traceDir = 'traces'
) {
  const name = testInfo.title.replace(/\s+/g, '_');
  await page.screenshot({ path: `${screenshotDir}/${name}.png`, fullPage: true });
  await page.context().tracing.stop({ path: `${traceDir}/${name}.zip` });
}
