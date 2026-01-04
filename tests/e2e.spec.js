const { test, expect } = require('@playwright/test');
const LoginPage = require('../Pages/LoginPage');
const InventoryPage = require('../Pages/InventoryPage');
const CartPage = require('../Pages/Cartpage');
const CheckoutPage = require('../Pages/CheckoutPage');
const testData = require('../utils/testData');

test.describe('End-to-End Purchase Flow Tests', () => {
  let loginPage;
  let inventoryPage;
  let cartPage;
  let checkoutPage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    inventoryPage = new InventoryPage(page);
    cartPage = new CartPage(page);
    checkoutPage = new CheckoutPage(page);
    
    // Login before each test
    await loginPage.goto();
    await loginPage.loginAsStandardUser();
    await expect(page).toHaveURL(/.*inventory.html/);
  });

  test('@smoke @e2e TC_028: Complete purchase flow with single item', async () => {
    // Step 1: Add product to cart
    const productName = 'Sauce Labs Backpack';
    await inventoryPage.addProductToCart(productName);
    expect(await inventoryPage.getCartBadgeCount()).toBe(1);
    
    // Step 2: Go to cart
    await inventoryPage.clickShoppingCart();
    await expect(cartPage.page).toHaveURL(/.*cart.html/);
    expect(await cartPage.isItemInCart(productName)).toBeTruthy();
    
    // Step 3: Proceed to checkout
    await cartPage.proceedToCheckout();
    
    // Step 4: Fill checkout information
    const checkoutInfo = testData.getCheckoutInfo();
    await checkoutPage.completeStepOne(checkoutInfo);
    
    // Step 5: Verify overview and complete
    await checkoutPage.waitForElement(checkoutPage.finishButton);
    expect(await checkoutPage.verifyPriceCalculation()).toBeTruthy();
    await checkoutPage.clickFinish();
    
    // Step 6: Verify order completion
    expect(await checkoutPage.isOrderComplete()).toBeTruthy();
    expect(await checkoutPage.verifyOrderCompletion()).toBeTruthy();
  });

  test('@e2e TC_029: Complete purchase with multiple items', async () => {
    // Step 1: Add multiple products
    await inventoryPage.addProductToCart('Sauce Labs Backpack');
    await inventoryPage.addProductToCart('Sauce Labs Bike Light');
    await inventoryPage.addProductToCart('Sauce Labs Bolt T-Shirt');
    expect(await inventoryPage.getCartBadgeCount()).toBe(3);
    
    // Step 2: Navigate to cart
    await inventoryPage.clickShoppingCart();
    expect(await cartPage.getCartItemsCount()).toBe(3);
    
    // Step 3: Proceed to checkout
    await cartPage.proceedToCheckout();
    
    // Step 4: Complete checkout
    await checkoutPage.completeCheckout(testData.getCheckoutInfo());
    
    // Step 5: Verify completion
    expect(await checkoutPage.isOrderComplete()).toBeTruthy();
    const header = await checkoutPage.getCompleteHeader();
    expect(header).toContain('Thank you for your order');
  });

  test('@e2e TC_030: Add, remove, then purchase remaining items', async () => {
    // Step 1: Add three products
    await inventoryPage.addProductToCartByIndex(0);
    await inventoryPage.addProductToCartByIndex(1);
    await inventoryPage.addProductToCartByIndex(2);
    expect(await inventoryPage.getCartBadgeCount()).toBe(3);
    
    // Step 2: Go to cart
    await inventoryPage.clickShoppingCart();
    expect(await cartPage.getCartItemsCount()).toBe(3);
    
    // Step 3: Remove one item
    await cartPage.removeItemByIndex(1);
    expect(await cartPage.getCartItemsCount()).toBe(2);
    
    // Step 4: Proceed with remaining items
    await cartPage.proceedToCheckout();
    await checkoutPage.completeCheckout(testData.getCheckoutInfo());
    
    // Step 5: Verify
    expect(await checkoutPage.isOrderComplete()).toBeTruthy();
  });

  test('@e2e TC_031: Browse products, sort, add to cart, and checkout', async () => {
    // Step 1: Sort products by price
    await inventoryPage.sortProducts(inventoryPage.sortOptions.LOW_HIGH);
    expect(await inventoryPage.areProductsSortedLowToHigh()).toBeTruthy();
    
    // Step 2: Add lowest priced product
    await inventoryPage.addProductToCartByIndex(0);
    
    // Step 3: Sort by price high to low
    await inventoryPage.sortProducts(inventoryPage.sortOptions.HIGH_LOW);
    expect(await inventoryPage.areProductsSortedHighToLow()).toBeTruthy();
    
    // Step 4: Add highest priced product
    await inventoryPage.addProductToCartByIndex(0);
    expect(await inventoryPage.getCartBadgeCount()).toBe(2);
    
    // Step 5: Complete purchase
    await inventoryPage.clickShoppingCart();
    await cartPage.proceedToCheckout();
    await checkoutPage.completeCheckout(testData.getCheckoutInfo());
    
    // Step 6: Verify
    expect(await checkoutPage.verifyOrderCompletion()).toBeTruthy();
  });

  test('@e2e TC_032: Complete flow with continue shopping', async () => {
    // Step 1: Add product
    await inventoryPage.addProductToCartByIndex(0);
    
    // Step 2: Go to cart
    await inventoryPage.clickShoppingCart();
    
    // Step 3: Continue shopping
    await cartPage.continueShopping();
    await expect(inventoryPage.page).toHaveURL(/.*inventory.html/);
    
    // Step 4: Add another product
    await inventoryPage.addProductToCartByIndex(1);
    expect(await inventoryPage.getCartBadgeCount()).toBe(2);
    
    // Step 5: Complete purchase
    await inventoryPage.clickShoppingCart();
    await cartPage.proceedToCheckout();
    await checkoutPage.completeCheckout(testData.getCheckoutInfo());
    
    // Verify
    expect(await checkoutPage.isOrderComplete()).toBeTruthy();
  });

  test('@e2e TC_033: Verify price calculation in checkout', async () => {
    // Add products with known prices
    await inventoryPage.addProductToCart('Sauce Labs Backpack'); // $29.99
    await inventoryPage.addProductToCart('Sauce Labs Bike Light'); // $9.99
    
    // Navigate to checkout
    await inventoryPage.clickShoppingCart();
    await cartPage.proceedToCheckout();
    await checkoutPage.completeStepOne(testData.getCheckoutInfo());
    
    // Verify calculations
    const summary = await checkoutPage.getCheckoutSummary();
    expect(summary.items.length).toBe(2);
    
    // Calculate expected subtotal
    const expectedSubtotal = summary.prices.reduce((sum, price) => sum + price, 0);
    expect(Math.abs(summary.subtotal - expectedSubtotal)).toBeLessThan(0.01);
    
    // Verify total = subtotal + tax
    expect(await checkoutPage.verifyPriceCalculation()).toBeTruthy();
  });

  test('@e2e TC_034: Cancel checkout and return to cart', async () => {
    // Add product and start checkout
    await inventoryPage.addProductToCartByIndex(0);
    await inventoryPage.clickShoppingCart();
    await cartPage.proceedToCheckout();
    
    // Cancel checkout
    await checkoutPage.clickCancel();
    
    // Verify back on cart page
    await expect(cartPage.page).toHaveURL(/.*cart.html/);
    expect(await cartPage.getCartItemsCount()).toBe(1);
  });

  test('@e2e TC_035: Cancel from checkout overview', async () => {
    // Complete step one
    await inventoryPage.addProductToCartByIndex(0);
    await inventoryPage.clickShoppingCart();
    await cartPage.proceedToCheckout();
    await checkoutPage.completeStepOne(testData.getCheckoutInfo());
    
    // Cancel from overview
    await checkoutPage.clickBack();
    
    // Verify back on inventory page
    await expect(inventoryPage.page).toHaveURL(/.*inventory.html/);
  });

  test('@e2e TC_036: Complete order and return home', async () => {
    // Complete full purchase
    await inventoryPage.addProductToCartByIndex(0);
    await inventoryPage.clickShoppingCart();
    await cartPage.proceedToCheckout();
    await checkoutPage.completeCheckout(testData.getCheckoutInfo());
    
    // Return home
    await checkoutPage.clickBackHome();
    
    // Verify back on inventory
    await expect(inventoryPage.page).toHaveURL(/.*inventory.html/);
    
    // Verify cart is empty
    expect(await inventoryPage.getCartBadgeCount()).toBe(0);
  });

  test('@e2e TC_037: Purchase all products', async () => {
    // Add all 6 products
    const productCount = await inventoryPage.getProductCount();
    await inventoryPage.addMultipleProductsToCart(productCount);
    expect(await inventoryPage.getCartBadgeCount()).toBe(productCount);
    
    // Complete purchase
    await inventoryPage.clickShoppingCart();
    expect(await cartPage.getCartItemsCount()).toBe(productCount);
    
    await cartPage.proceedToCheckout();
    await checkoutPage.completeCheckout(testData.getCheckoutInfo());
    
    // Verify
    expect(await checkoutPage.verifyOrderCompletion()).toBeTruthy();
  });

  test('@e2e TC_038: Checkout with different user data', async () => {
    // Use random test data
    await inventoryPage.addProductToCartByIndex(0);
    await inventoryPage.clickShoppingCart();
    await cartPage.proceedToCheckout();
    
    // Use different checkout info
    const customInfo = {
      firstName: 'Jane',
      lastName: 'Smith',
      postalCode: '90210'
    };
    
    await checkoutPage.completeCheckout(customInfo);
    expect(await checkoutPage.isOrderComplete()).toBeTruthy();
  });
});