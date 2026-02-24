import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { users, INVALID_CREDENTIALS, ERROR_MESSAGES } from '../utils/testData';

test.describe('Authentication', () => {
  let loginPage: LoginPage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    await loginPage.goto();
  });

  test('should log in successfully with standard_user', async ({ page }) => {
    await loginPage.login(users.standard.username, users.standard.password);
    await expect(page).toHaveURL(/inventory/);
    await expect(page.locator('.title')).toHaveText('Products');
  });

  test('should show error for locked_out_user', async () => {
    await loginPage.login(users.locked.username, users.locked.password);
    const error = await loginPage.getErrorMessage();
    expect(error).toContain(ERROR_MESSAGES.lockedOut);
  });

  test('should show error for invalid credentials', async () => {
    await loginPage.login(INVALID_CREDENTIALS.username, INVALID_CREDENTIALS.password);
    const error = await loginPage.getErrorMessage();
    expect(error).toContain(ERROR_MESSAGES.invalidCredentials);
  });

  test('should show error when username is missing', async ({ page }) => {
    await loginPage.login('', users.standard.password);
    await expect(page.locator('[data-test="error"]')).toBeVisible();
  });

  test('should show error when password is missing', async ({ page }) => {
    await loginPage.login(users.standard.username, '');
    await expect(page.locator('[data-test="error"]')).toBeVisible();
  });

  test('should redirect to login page after logout', async ({ page }) => {
    await loginPage.login(users.standard.username, users.standard.password);
    await expect(page).toHaveURL(/inventory/);
    await page.getByRole('button', { name: 'Open Menu' }).click();
    await page.getByRole('link', { name: 'Logout' }).click();
    await expect(page).toHaveURL('/');
  });
});
