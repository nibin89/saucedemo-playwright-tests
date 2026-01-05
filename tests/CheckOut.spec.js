const { test, expect } = require('@playwright/test');
const LoginPage = require('../Pages/LoginPage');
const InventoryPage = require('../Pages/InventoryPage');
const CartPage = require('../Pages/Cartpage');
const CheckoutPage = require('../Pages/CheckoutPage');
const TestData = require('../utils/testData');

test.describe('Checkout Process Tests', () => {
  let loginPage;
  let inventoryPage;
  let cartPage;
  let checkoutPage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    inventoryPage = new InventoryPage(page);
    cartPage = new CartPage(page);
    checkoutPage = new CheckoutPage(page);
    
    // Login, add product, and navigate to checkout
    await loginPage.goto();
    await loginPage.loginAsStandardUser();
    await inventoryPage.addProductToCartByIndex(0);
    await inventoryPage.clickShoppingCart();
    await cartPage.proceedToCheckout();
  });

  test('@smoke TC_021: Complete checkout with valid information', async () => {
    // Arrange
    const checkoutInfo = TestData.getCheckoutInfo();
    
    // Act
    await checkoutPage.fillCheckoutInformation(
      checkoutInfo.firstName,
      checkoutInfo.lastName,
      checkoutInfo.postalCode
    );
    await checkoutPage.clickContinue();
    
    // Assert
    await expect(checkoutPage.page).toHaveURL(/.*checkout-step-two.html/);
    expect(await checkoutPage.isVisible(checkoutPage.finishButton)).toBeTruthy();
  });

  test('TC_022: Checkout with empty first name', async () => {
    // Act
    await checkoutPage.fillCheckoutInformation('', 'Doe', '12345');
    await checkoutPage.clickContinue();
    
    // Assert
    expect(await checkoutPage.isErrorDisplayed()).toBeTruthy();
    const error = await checkoutPage.getErrorMessage();
    expect(error).toContain('First Name is required');
  });

  test('TC_023: Checkout with empty last name', async () => {
    // Act
    await checkoutPage.fillCheckoutInformation('John', '', '12345');
    await checkoutPage.clickContinue();
    
    // Assert
    expect(await checkoutPage.isErrorDisplayed()).toBeTruthy();
    const error = await checkoutPage.getErrorMessage();
    expect(error).toContain('Last Name is required');
  });

  test('TC_024: Checkout with empty postal code', async () => {
    // Act
    await checkoutPage.fillCheckoutInformation('John', 'Doe', '');
    await checkoutPage.clickContinue();
    
    // Assert
    expect(await checkoutPage.isErrorDisplayed()).toBeTruthy();
    const error = await checkoutPage.getErrorMessage();
    expect(error).toContain('Postal Code is required');
  });

  test('@smoke TC_025: Order confirmation validation', async () => {
    // Arrange
    const checkoutInfo = TestData.getCheckoutInfo();
    
    // Act
    await checkoutPage.completeStepOne(checkoutInfo);
    await checkoutPage.clickFinish();
    
    // Assert
    expect(await checkoutPage.isOrderComplete()).toBeTruthy();
    const header = await checkoutPage.getCompleteHeader();
    expect(header).toContain('Thank you for your order');
  });

  test('TC_026: Price calculation validation', async () => {
    // Arrange
    const checkoutInfo = TestData.getCheckoutInfo();
    
    // Act
    await checkoutPage.completeStepOne(checkoutInfo);
    
    // Assert
    const subtotal = await checkoutPage.getSubtotal();
    const tax = await checkoutPage.getTax();
    const total = await checkoutPage.getTotal();
    
    expect(subtotal).toBeGreaterThan(0);
    expect(tax).toBeGreaterThan(0);
    expect(total).toBeGreaterThan(0);
    expect(await checkoutPage.verifyPriceCalculation()).toBeTruthy();
  });

  test('TC_027: Cancel checkout from step one', async () => {
    // Act
    await checkoutPage.clickCancel();
    
    // Assert
    await expect(checkoutPage.page).toHaveURL(/.*cart.html/);
  });

  test('TC_028: Verify checkout overview displays items', async () => {
    // Arrange
    const checkoutInfo = TestData.getCheckoutInfo();
    
    // Act
    await checkoutPage.completeStepOne(checkoutInfo);
    const items = await checkoutPage.getCheckoutItemNames();
    
    // Assert
    expect(items.length).toBeGreaterThan(0);
  });

  test('TC_029: Verify payment information is displayed', async () => {
    // Arrange
    const checkoutInfo = TestData.getCheckoutInfo();
    
    // Act
    await checkoutPage.completeStepOne(checkoutInfo);
    const paymentInfo = await checkoutPage.getPaymentInfo();
    
    // Assert
    expect(paymentInfo).toBeTruthy();
    expect(paymentInfo.length).toBeGreaterThan(0);
  });

  test('TC_030: Verify shipping information is displayed', async () => {
    // Arrange
    const checkoutInfo = TestData.getCheckoutInfo();
    
    // Act
    await checkoutPage.completeStepOne(checkoutInfo);
    const shippingInfo = await checkoutPage.getShippingInfo();
    
    // Assert
    expect(shippingInfo).toBeTruthy();
    expect(shippingInfo.length).toBeGreaterThan(0);
  });

  test('TC_031: Back to products from completion page', async () => {
    // Arrange
    const checkoutInfo = TestData.getCheckoutInfo();
    await checkoutPage.completeCheckout(checkoutInfo);
    
    // Act
    await checkoutPage.clickBackHome();
    
    // Assert
    await expect(checkoutPage.page).toHaveURL(/.*inventory.html/);
  });

  test('TC_032: Verify pony express image on completion', async () => {
    // Arrange
    const checkoutInfo = TestData.getCheckoutInfo();
    
    // Act
    await checkoutPage.completeCheckout(checkoutInfo);
    
    // Assert
    expect(await checkoutPage.isPonyExpressImageDisplayed()).toBeTruthy();
  });

  test('TC_033: Verify complete message text', async () => {
    // Arrange
    const checkoutInfo = TestData.getCheckoutInfo();
    
    // Act
    await checkoutPage.completeCheckout(checkoutInfo);
    const completeText = await checkoutPage.getCompleteText();
    
    // Assert
    expect(completeText).toBeTruthy();
    expect(completeText.length).toBeGreaterThan(0);
  });

  test('TC_034: Get full checkout summary', async () => {
    // Arrange
    const checkoutInfo = TestData.getCheckoutInfo();
    
    // Act
    await checkoutPage.completeStepOne(checkoutInfo);
    const summary = await checkoutPage.getCheckoutSummary();
    
    // Assert
    expect(summary.items).toBeDefined();
    expect(summary.prices).toBeDefined();
    expect(summary.subtotal).toBeGreaterThan(0);
    expect(summary.tax).toBeGreaterThan(0);
    expect(summary.total).toBeGreaterThan(0);
  });

  test('TC_035: Multiple items price calculation', async ({ page }) => {
    // Arrange - Add multiple items
    await page.goBack();
    await page.goBack();
    await inventoryPage.addProductToCartByIndex(1);
    await inventoryPage.addProductToCartByIndex(2);
    await inventoryPage.clickShoppingCart();
    await cartPage.proceedToCheckout();
    
    const checkoutInfo = TestData.getCheckoutInfo();
    
    // Act
    await checkoutPage.completeStepOne(checkoutInfo);
    
    // Assert
    const items = await checkoutPage.getCheckoutItemNames();
    expect(items.length).toBe(3);
    expect(await checkoutPage.verifyPriceCalculation()).toBeTruthy();
  });

  test('TC_036: Verify all required fields', async () => {
    // Act - Try to continue without filling anything
    await checkoutPage.clickContinue();
    
    // Assert
    expect(await checkoutPage.isErrorDisplayed()).toBeTruthy();
  });

  test('TC_037: Cancel from checkout overview', async () => {
    // Arrange
    const checkoutInfo = TestData.getCheckoutInfo();
    await checkoutPage.completeStepOne(checkoutInfo);
    
    // Act
    await checkoutPage.clickBack();
    
    // Assert
    await expect(checkoutPage.page).toHaveURL(/.*inventory.html/);
  });

  test('TC_038: Verify order completion flow', async () => {
    // Arrange
    const checkoutInfo = TestData.getCheckoutInfo();
    
    // Act
    await checkoutPage.completeCheckout(checkoutInfo);
    
    // Assert
    expect(await checkoutPage.verifyOrderCompletion()).toBeTruthy();
  });

  test('@regression TC_039: Data-driven checkout test', async () => {
    // Arrange
    const checkoutDataSets = [
      { firstName: 'Alice', lastName: 'Smith', postalCode: '10001' },
      { firstName: 'Bob', lastName: 'Johnson', postalCode: '90210' },
      { firstName: 'Charlie', lastName: 'Brown', postalCode: '60601' }
    ];
    
    // Test with first dataset
    const data = checkoutDataSets[0];
    
    // Act
    await checkoutPage.fillCheckoutInformation(
      data.firstName,
      data.lastName,
      data.postalCode
    );
    await checkoutPage.clickContinue();
    
    // Assert
    await expect(checkoutPage.page).toHaveURL(/.*checkout-step-two.html/);
  });

  test('TC_040: Verify finish button is present', async () => {
    // Arrange
    const checkoutInfo = TestData.getCheckoutInfo();
    
    // Act
    await checkoutPage.completeStepOne(checkoutInfo);
    
    // Assert
    expect(await checkoutPage.isVisible(checkoutPage.finishButton)).toBeTruthy();
    expect(await checkoutPage.isEnabled(checkoutPage.finishButton)).toBeTruthy();
  });
});