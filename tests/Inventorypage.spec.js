const { test, expect } = require('@playwright/test');
const LoginPage = require('../Pages/LoginPage');
const InventoryPage = require('../Pages/InventoryPage');

test.describe('Product Inventory Tests', () => {
  let loginPage;
  let inventoryPage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    inventoryPage = new InventoryPage(page);
    
    // Login before each test
    await loginPage.goto();
    await loginPage.loginAsStandardUser();
    await expect(page).toHaveURL(/.*inventory.html/);
  });

  test('@smoke TC_007: Display all products', async () => {
    // Assert
    expect(await inventoryPage.isInventoryPageDisplayed()).toBeTruthy();
    const productCount = await inventoryPage.getProductCount();
    expect(productCount).toBe(6); // SauceDemo has 6 products
  });

  test('TC_008: Sort products A to Z', async () => {
    // Act
    await inventoryPage.sortProducts(inventoryPage.sortOptions.AZ);
    
    // Assert
    const isSorted = await inventoryPage.areProductsSortedAZ();
    expect(isSorted).toBeTruthy();
  });

  test('TC_009: Sort products Z to A', async () => {
    // Act
    await inventoryPage.sortProducts(inventoryPage.sortOptions.ZA);
    
    // Assert
    const isSorted = await inventoryPage.areProductsSortedZA();
    expect(isSorted).toBeTruthy();
  });

  test('TC_010: Sort by price low to high', async () => {
    // Act
    await inventoryPage.sortProducts(inventoryPage.sortOptions.LOW_HIGH);
    
    // Assert
    const isSorted = await inventoryPage.areProductsSortedLowToHigh();
    expect(isSorted).toBeTruthy();
  });

  test('TC_011: Sort by price high to low', async () => {
    // Act
    await inventoryPage.sortProducts(inventoryPage.sortOptions.HIGH_LOW);
    
    // Assert
    const isSorted = await inventoryPage.areProductsSortedHighToLow();
    expect(isSorted).toBeTruthy();
  });

  test('@smoke TC_012: Add product to cart', async () => {
    // Arrange
    const productName = 'Sauce Labs Backpack';
    const initialBadgeCount = await inventoryPage.getCartBadgeCount();
    
    // Act
    await inventoryPage.addProductToCart(productName);
    
    // Assert
    const newBadgeCount = await inventoryPage.getCartBadgeCount();
    expect(newBadgeCount).toBe(initialBadgeCount + 1);
    expect(await inventoryPage.isProductInCart(productName)).toBeTruthy();
  });

  test('TC_013: Remove product from inventory', async () => {
    // Arrange
    const productName = 'Sauce Labs Backpack';
    await inventoryPage.addProductToCart(productName);
    expect(await inventoryPage.isProductInCart(productName)).toBeTruthy();
    
    // Act
    await inventoryPage.removeProductFromCart(productName);
    
    // Assert
    expect(await inventoryPage.isProductInCart(productName)).toBeFalsy();
    const badgeCount = await inventoryPage.getCartBadgeCount();
    expect(badgeCount).toBe(0);
  });

  test('TC_014: Product details navigation', async () => {
    // Arrange
    const productName = 'Sauce Labs Backpack';
    
    // Act
    await inventoryPage.clickProduct(productName);
    
    // Assert
    await expect(inventoryPage.page).toHaveURL(/.*inventory-item.html/);
  });

  test('@regression TC_015: Add multiple products to cart', async () => {
    // Arrange
    const productsToAdd = 3;
    
    // Act
    await inventoryPage.addMultipleProductsToCart(productsToAdd);
    
    // Assert
    const badgeCount = await inventoryPage.getCartBadgeCount();
    expect(badgeCount).toBe(productsToAdd);
  });

  test('TC_016: Verify product names are displayed', async () => {
    // Act
    const productNames = await inventoryPage.getProductNames();
    
    // Assert
    expect(productNames.length).toBeGreaterThan(0);
    productNames.forEach(name => {
      expect(name).toBeTruthy();
      expect(name.length).toBeGreaterThan(0);
    });
  });

  test('TC_017: Verify product prices are displayed', async () => {
    // Act
    const prices = await inventoryPage.getProductPrices();
    
    // Assert
    expect(prices.length).toBeGreaterThan(0);
    prices.forEach(price => {
      expect(price).toBeGreaterThan(0);
    });
  });

  test('TC_018: Verify all products have add to cart button', async () => {
    // Act
    const productCount = await inventoryPage.getProductCount();
    const buttonCount = await inventoryPage.getCount(inventoryPage.addToCartButton);
    
    // Assert
    expect(buttonCount).toBe(productCount);
  });

  test('TC_019: Get product details', async () => {
    // Arrange
    const productName = 'Sauce Labs Backpack';
    
    // Act
    const details = await inventoryPage.getProductDetails(productName);
    
    // Assert
    expect(details).not.toBeNull();
    expect(details.name).toBe(productName);
    expect(details.price).toBeGreaterThan(0);
    expect(details.description).toBeTruthy();
  });

  test('TC_020: Cart badge updates correctly', async () => {
    // Arrange
    let expectedCount = 0;
    
    // Act & Assert - Add first product
    await inventoryPage.addProductToCartByIndex(0);
    expectedCount++;
    expect(await inventoryPage.getCartBadgeCount()).toBe(expectedCount);
    
    // Add second product
    await inventoryPage.addProductToCartByIndex(1);
    expectedCount++;
    expect(await inventoryPage.getCartBadgeCount()).toBe(expectedCount);
    
    // Remove first product
    await inventoryPage.page.locator(inventoryPage.removeButton).first().click();
    expectedCount--;
    expect(await inventoryPage.getCartBadgeCount()).toBe(expectedCount);
  });

  test('TC_021: Navigate to cart from inventory', async () => {
    // Arrange
    await inventoryPage.addProductToCartByIndex(0);
    
    // Act
    await inventoryPage.clickShoppingCart();
    
    // Assert
    await expect(inventoryPage.page).toHaveURL(/.*cart.html/);
  });

  test('TC_022: Verify sorting dropdown options', async () => {
    // Act
    const currentSort = await inventoryPage.getSelectedSortOption();
    
    // Assert
    expect(currentSort).toBeTruthy();
    
    // Test all sort options
    await inventoryPage.sortProducts(inventoryPage.sortOptions.AZ);
    expect(await inventoryPage.getSelectedSortOption()).toBe(inventoryPage.sortOptions.AZ);
    
    await inventoryPage.sortProducts(inventoryPage.sortOptions.ZA);
    expect(await inventoryPage.getSelectedSortOption()).toBe(inventoryPage.sortOptions.ZA);
    
    await inventoryPage.sortProducts(inventoryPage.sortOptions.LOW_HIGH);
    expect(await inventoryPage.getSelectedSortOption()).toBe(inventoryPage.sortOptions.LOW_HIGH);
    
    await inventoryPage.sortProducts(inventoryPage.sortOptions.HIGH_LOW);
    expect(await inventoryPage.getSelectedSortOption()).toBe(inventoryPage.sortOptions.HIGH_LOW);
  });
});