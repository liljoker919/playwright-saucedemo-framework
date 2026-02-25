import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { users, INVALID_CREDENTIALS, ERROR_MESSAGES } from '../utils/testData';

test.describe('Authentication', () => {
  let loginPage: LoginPage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    await loginPage.goto();
  });

  test('Login - Successful', async ({ page }) => {
    // Perform login with standard user credentials
    await loginPage.login(users.standard.username, users.standard.password);
    
    // Verify successful redirection to inventory page
    await expect(page).toHaveURL(/inventory/);
    
    // Verify the title 'Products' is visible
    await expect(page.locator('.title')).toHaveText('Products');
  });

  test('Login - Invalid Credentials', async () => {
    // Attempt login with invalid credentials
    await loginPage.login(INVALID_CREDENTIALS.username, INVALID_CREDENTIALS.password);
    
    // Verify error message is displayed
    const error = await loginPage.getErrorMessage();
    expect(error).toContain(ERROR_MESSAGES.invalidCredentials);
  });
});
