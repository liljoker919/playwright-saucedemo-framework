import { Page, Locator } from '@playwright/test';

export class InventoryPage {
  readonly page: Page;
  readonly title: Locator;
  readonly inventoryItems: Locator;
  readonly cartBadge: Locator;
  readonly cartLink: Locator;
  readonly sortDropdown: Locator;
  readonly burgerMenuButton: Locator;
  readonly logoutLink: Locator;

  constructor(page: Page) {
    this.page = page;
    this.title = page.locator('.title');
    this.inventoryItems = page.locator('.inventory_item');
    this.cartBadge = page.locator('.shopping_cart_badge');
    this.cartLink = page.locator('.shopping_cart_link');
    this.sortDropdown = page.locator('[data-test="product_sort_container"]');
    this.burgerMenuButton = page.getByRole('button', { name: 'Open Menu' });
    this.logoutLink = page.getByRole('link', { name: 'Logout' });
  }

  async addItemToCartByName(itemName: string): Promise<void> {
    const item = this.page.locator('.inventory_item').filter({ hasText: itemName });
    await item.getByRole('button', { name: /add to cart/i }).click();
  }

  async removeItemFromCartByName(itemName: string): Promise<void> {
    const item = this.page.locator('.inventory_item').filter({ hasText: itemName });
    await item.getByRole('button', { name: /remove/i }).click();
  }

  async goToCart(): Promise<void> {
    await this.cartLink.click();
  }

  async logout(): Promise<void> {
    await this.burgerMenuButton.click();
    await this.logoutLink.click();
  }

  async getCartItemCount(): Promise<number> {
    const badge = this.cartBadge;
    if (await badge.isVisible()) {
      const text = await badge.textContent();
      return parseInt(text ?? '0', 10);
    }
    return 0;
  }
}
