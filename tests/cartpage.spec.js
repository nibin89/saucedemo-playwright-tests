const { test, expect } = require('@playwright/test');
const LoginPage = require('../Pages/LoginPage');
const InventoryPage = require('../Pages/InventoryPage');
const CartPage = require('../Pages/Cartpage');

test.describe('Shopping Cart Tests', () => {
  let loginPage;
  let inventoryPage;
  let cartPage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    inventoryPage = new InventoryPage(page);
    cartPage = new CartPage(page);
    
    // Login and add a product before each test
    await loginPage.goto();
    await loginPage.loginAsStandardUser();
    await expect(page).toHaveURL(/.*inventory.html/);
  });

  test('TC_015: View cart with items', async () => {
    // Arrange
    await inventoryPage.addProductToCartByIndex(0);
    
    // Act
    await inventoryPage.clickShoppingCart();
    
    // Assert
    expect(await cartPage.isCartPageDisplayed()).toBeTruthy();
    expect(await cartPage.getCartItemsCount()).toBe(1);
  });

  test('@smoke TC_016: Remove item from cart', async () => {
    // Arrange
    await inventoryPage.addProductToCartByIndex(0);
    await inventoryPage.clickShoppingCart();
    expect(await cartPage.getCartItemsCount()).toBe(1);
    
    // Act
    await cartPage.removeItemByIndex(0);
    
    // Assert
    expect(await cartPage.isCartEmpty()).toBeTruthy();
    expect(await cartPage.getCartBadgeCount()).toBe(0);
  });

  test('TC_017: Continue shopping from cart', async () => {
    // Arrange
    await inventoryPage.addProductToCartByIndex(0);
    await inventoryPage.clickShoppingCart();
    
    // Act
    await cartPage.continueShopping();
    
    // Assert
    await expect(inventoryPage.page).toHaveURL(/.*inventory.html/);
    expect(await inventoryPage.getCartBadgeCount()).toBe(1);
  });

  test('TC_018: Cart badge count validation', async () => {
    // Act & Assert
    expect(await inventoryPage.getCartBadgeCount()).toBe(0);
    
    await inventoryPage.addProductToCartByIndex(0);
    expect(await inventoryPage.getCartBadgeCount()).toBe(1);
    
    await inventoryPage.addProductToCartByIndex(1);
    expect(await inventoryPage.getCartBadgeCount()).toBe(2);
    
    await inventoryPage.clickShoppingCart();
    expect(await cartPage.doesCartBadgeMatchItemsCount()).toBeTruthy();
  });

  test('TC_019: Empty cart validation', async () => {
    // Act
    await inventoryPage.clickShoppingCart();
    
    // Assert
    expect(await cartPage.isCartEmpty()).toBeTruthy();
    expect(await cartPage.getCartItemsCount()).toBe(0);
  });

  test('@regression TC_020: Multiple items in cart', async () => {
    // Arrange
    const itemsToAdd = 3;
    await inventoryPage.addMultipleProductsToCart(itemsToAdd);
    
    // Act
    await inventoryPage.clickShoppingCart();
    
    // Assert
    expect(await cartPage.getCartItemsCount()).toBe(itemsToAdd);
    expect(await cartPage.doesCartBadgeMatchItemsCount()).toBeTruthy();
  });

  test('TC_021: Verify cart item details', async () => {
    // Arrange
    const productName = 'Sauce Labs Backpack';
    const productDetails = await inventoryPage.getProductDetails(productName);
    await inventoryPage.addProductToCart(productName);
    
    // Act
    await inventoryPage.clickShoppingCart();
    const cartDetails = await cartPage.getCartItemDetails(productName);
    
    // Assert
    expect(cartDetails).not.toBeNull();
    expect(cartDetails.name).toBe(productDetails.name);
    expect(cartDetails.price).toBe(productDetails.price);
  });

  test('TC_022: Remove multiple items from cart', async () => {
    // Arrange
    await inventoryPage.addMultipleProductsToCart(3);
    await inventoryPage.clickShoppingCart();
    expect(await cartPage.getCartItemsCount()).toBe(3);
    
    // Act
    await cartPage.removeItemByIndex(0);
    await cartPage.removeItemByIndex(0);
    
    // Assert
    expect(await cartPage.getCartItemsCount()).toBe(1);
  });

  test('TC_023: Remove all items from cart', async () => {
    // Arrange
    await inventoryPage.addMultipleProductsToCart(3);
    await inventoryPage.clickShoppingCart();
    
    // Act
    await cartPage.removeAllItems();
    
    // Assert
    expect(await cartPage.isCartEmpty()).toBeTruthy();
    expect(await cartPage.getCartBadgeCount()).toBe(0);
  });

  test('TC_024: Verify cart item names', async () => {
    // Arrange
    const product1 = 'Sauce Labs Backpack';
    const product2 = 'Sauce Labs Bike Light';
    await inventoryPage.addProductToCart(product1);
    await inventoryPage.addProductToCart(product2);
    
    // Act
    await inventoryPage.clickShoppingCart();
    const cartItems = await cartPage.getCartItemNames();
    
    // Assert
    expect(cartItems).toContain(product1);
    expect(cartItems).toContain(product2);
  });

  test('TC_025: Verify cart item prices', async () => {
    // Arrange
    await inventoryPage.addProductToCartByIndex(0);
    const inventoryPrices = await inventoryPage.getProductPrices();
    
    // Act
    await inventoryPage.clickShoppingCart();
    const cartPrices = await cartPage.getCartItemPrices();
    
    // Assert
    expect(cartPrices[0]).toBe(inventoryPrices[0]);
  });

  test('TC_026: Calculate total cart value', async () => {
    // Arrange
    await inventoryPage.addProductToCartByIndex(0);
    await inventoryPage.addProductToCartByIndex(1);
    
    // Act
    await inventoryPage.clickShoppingCart();
    const totalValue = await cartPage.getTotalCartValue();
    
    // Assert
    expect(totalValue).toBeGreaterThan(0);
    const itemPrices = await cartPage.getCartItemPrices();
    const expectedTotal = itemPrices.reduce((sum, price) => sum + price, 0);
    expect(Math.abs(totalValue - expectedTotal)).toBeLessThan(0.01);
  });

  test('TC_027: Verify cart persistence after navigation', async () => {
    // Arrange
    await inventoryPage.addProductToCartByIndex(0);
    const initialCount = await inventoryPage.getCartBadgeCount();
    
    // Act
    await inventoryPage.clickShoppingCart();
    await cartPage.continueShopping();
    
    // Assert
    const currentCount = await inventoryPage.getCartBadgeCount();
    expect(currentCount).toBe(initialCount);
  });

  test('TC_028: Cart quantity display', async () => {
    // Arrange
    await inventoryPage.addProductToCartByIndex(0);
    
    // Act
    await inventoryPage.clickShoppingCart();
    const items = await cartPage.page.locator(cartPage.cartItems).all();
    
    // Assert
    expect(items.length).toBe(1);
    const quantity = await items[0].locator(cartPage.cartQuantity).textContent();
    expect(quantity).toBe('1');
  });

  test('TC_029: Navigate to checkout from cart', async () => {
    // Arrange
    await inventoryPage.addProductToCartByIndex(0);
    await inventoryPage.clickShoppingCart();
    
    // Act
    await cartPage.proceedToCheckout();
    
    // Assert
    await expect(cartPage.page).toHaveURL(/.*checkout-step-one.html/);
  });

  test('TC_030: Verify cart page elements', async () => {
    // Arrange
    await inventoryPage.addProductToCartByIndex(0);
    
    // Act
    await inventoryPage.clickShoppingCart();
    
    // Assert
    expect(await cartPage.isVisible(cartPage.continueShoppingButton)).toBeTruthy();
    expect(await cartPage.isVisible(cartPage.checkoutButton)).toBeTruthy();
    expect(await cartPage.getCartItemsCount()).toBeGreaterThan(0);
  });
});