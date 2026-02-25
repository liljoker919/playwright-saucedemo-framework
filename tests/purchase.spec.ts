import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { InventoryPage } from '../pages/InventoryPage';
import { CartPage } from '../pages/CartPage';
import { users } from '../utils/testData';
import { captureFailureArtifacts } from '../utils/captureFailureArtifacts';

test.describe('Purchase Flow', () => {
  let loginPage: LoginPage;
  let inventoryPage: InventoryPage;
  let cartPage: CartPage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    inventoryPage = new InventoryPage(page);
    cartPage = new CartPage(page);

    // Login to application
    await loginPage.goto();
    await loginPage.login(users.standard.username, users.standard.password);
    
    // Verify successful login
    await expect(page).toHaveURL(/inventory/);
  });

    test('Purchase - Complete Full Checkout Flow', async ({ page }) => {
    // Add a single item to the cart
    await inventoryPage.addItemToCartByName('Sauce Labs Backpack');
    
    // Navigate to the cart
    await inventoryPage.goToCart();

    // Verify we are on the cart page
    await expect(page).toHaveURL(/cart/);
    
    // Validate that 1 item is in the cart
    const itemsInCart = await cartPage.getCartItemCount();
    expect(itemsInCart).toBe(1);

    // Proceed to checkout
    await cartPage.proceedToCheckout();
    await expect(page).toHaveURL(/checkout-step-one/);

    // Fill in shipping information
    await cartPage.fillShippingInfo('John', 'Doe', '12345');
    await expect(page).toHaveURL(/checkout-step-two/);

    // Complete the purchase
    await cartPage.finishCheckout();
    await expect(page).toHaveURL(/checkout-complete/);

    // Verify confirmation message
    const confirmationMessage = await cartPage.getConfirmationMessage();
    expect(confirmationMessage).toContain('Thank you for your order');
  });

  test('Purchase - Data Validation', async ({ page }) => {
    const itemName = 'Sauce Labs Backpack';

     
    // Find the item container
    const itemContainer = page.locator('.inventory_item', { hasText: itemName });
    const priceOnInventory = await itemContainer.locator('.inventory_item_price').innerText();

    // Add item to cart and validate badge update
    await inventoryPage.addItemToCartByName(itemName);
    
    // Validate cart badge count updates correctly
    const badgeCount = await page.locator('.shopping_cart_badge').innerText();
    expect(badgeCount).toBe('1');

    // Go to cart
    await inventoryPage.goToCart();
    
    // Get item price from cart
    const cartItemContainer = page.locator('.cart_item', { hasText: itemName });
    const priceOnCart = await cartItemContainer.locator('.inventory_item_price').innerText();

    // Validate Item price is consistent
    expect(priceOnCart).toBe(priceOnInventory);
  });

  test('Purchase - Failing Test with Screenshot and Trace', async ({ page }, testInfo) => {
    await inventoryPage.addItemToCartByName('Sauce Labs Backpack');
    await inventoryPage.goToCart();
    try {
      await expect(inventoryPage.getCartBadge()).toHaveText('999');
    } catch (error) {
      await captureFailureArtifacts(page, testInfo);
      throw error;
    }
  });
});
