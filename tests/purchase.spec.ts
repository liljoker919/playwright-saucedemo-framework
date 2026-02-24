import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { InventoryPage } from '../pages/InventoryPage';
import { CartPage } from '../pages/CartPage';
import { users } from '../utils/testData';

test.describe('Purchase Flow', () => {
  let loginPage: LoginPage;
  let inventoryPage: InventoryPage;
  let cartPage: CartPage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    inventoryPage = new InventoryPage(page);
    cartPage = new CartPage(page);

    await loginPage.goto();
    await loginPage.login(users.standard.username, users.standard.password);
    await expect(page).toHaveURL(/inventory/);
  });

  test('should add a single item to the cart', async () => {
    await inventoryPage.addItemToCartByName('Sauce Labs Backpack');
    const count = await inventoryPage.getCartItemCount();
    expect(count).toBe(1);
  });

  test('should add multiple items to the cart', async () => {
    await inventoryPage.addItemToCartByName('Sauce Labs Backpack');
    await inventoryPage.addItemToCartByName('Sauce Labs Bike Light');
    const count = await inventoryPage.getCartItemCount();
    expect(count).toBe(2);
  });

  test('should remove an item from the cart on inventory page', async () => {
    await inventoryPage.addItemToCartByName('Sauce Labs Backpack');
    await inventoryPage.removeItemFromCartByName('Sauce Labs Backpack');
    const count = await inventoryPage.getCartItemCount();
    expect(count).toBe(0);
  });

  test('should complete a full checkout flow', async ({ page }) => {
    await inventoryPage.addItemToCartByName('Sauce Labs Backpack');
    await inventoryPage.goToCart();

    await expect(page).toHaveURL(/cart/);
    const itemsInCart = await cartPage.getCartItemCount();
    expect(itemsInCart).toBe(1);

    await cartPage.proceedToCheckout();
    await expect(page).toHaveURL(/checkout-step-one/);

    await cartPage.fillShippingInfo('John', 'Doe', '12345');
    await expect(page).toHaveURL(/checkout-step-two/);

    await cartPage.finishCheckout();
    await expect(page).toHaveURL(/checkout-complete/);

    const confirmationMessage = await cartPage.getConfirmationMessage();
    expect(confirmationMessage).toContain('Thank you for your order');
  });

  test('should navigate back from cart to inventory', async ({ page }) => {
    await inventoryPage.addItemToCartByName('Sauce Labs Backpack');
    await inventoryPage.goToCart();
    await expect(page).toHaveURL(/cart/);

    await cartPage.continueShoppingButton.click();
    await expect(page).toHaveURL(/inventory/);
  });

  test('should show correct item in cart', async ({ page }) => {
    const itemName = 'Sauce Labs Backpack';
    await inventoryPage.addItemToCartByName(itemName);
    await inventoryPage.goToCart();

    await expect(page.locator('.cart_item')).toHaveCount(1);
    await expect(page.locator('.inventory_item_name')).toHaveText(itemName);
  });
});
