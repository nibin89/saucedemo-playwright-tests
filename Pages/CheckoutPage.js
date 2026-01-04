const BasePage = require('./BasePage');

/**
 * CheckoutPage - Page Object for Checkout Process
 */
class CheckoutPage extends BasePage {
  constructor(page) {
    super(page);
    
    // Step One Locators (Information)
    this.firstNameInput = '#first-name';
    this.lastNameInput = '#last-name';
    this.postalCodeInput = '#postal-code';
    this.continueButton = '#continue';
    this.cancelButton = '#cancel';
    this.errorMessage = '[data-test="error"]';
    
    // Step Two Locators (Overview)
    this.cartItems = '.cart_item';
    this.cartItemName = '.inventory_item_name';
    this.cartItemPrice = '.inventory_item_price';
    this.summarySubtotal = '.summary_subtotal_label';
    this.summaryTax = '.summary_tax_label';
    this.summaryTotal = '.summary_total_label';
    this.finishButton = '#finish';
    this.backButton = '#cancel';
    this.paymentInfo = '.summary_value_label';
    this.shippingInfo = '.summary_value_label';
    
    // Complete Locators
    this.completeHeader = '.complete-header';
    this.completeText = '.complete-text';
    this.backHomeButton = '#back-to-products';
    this.ponyExpressImage = '.pony_express';
  }

  // ========== Step One: Information ==========

  /**
   * Fill checkout information
   * @param {string} firstName - First name
   * @param {string} lastName - Last name
   * @param {string} postalCode - Postal code
   */
  async fillCheckoutInformation(firstName, lastName, postalCode) {
    await this.fill(this.firstNameInput, firstName);
    await this.fill(this.lastNameInput, lastName);
    await this.fill(this.postalCodeInput, postalCode);
  }

  /**
   * Click Continue button
   */
  async clickContinue() {
    await this.click(this.continueButton);
  }

  /**
   * Complete step one (fill info and continue)
   * @param {Object} info - Checkout information
   */
  async completeStepOne(info) {
    await this.fillCheckoutInformation(
      info.firstName,
      info.lastName,
      info.postalCode
    );
    await this.clickContinue();
  }

  /**
   * Click Cancel button
   */
  async clickCancel() {
    await this.click(this.cancelButton);
  }

  /**
   * Get error message on step one
   * @returns {Promise<string>}
   */
  async getErrorMessage() {
    await this.waitForElement(this.errorMessage);
    return await this.getText(this.errorMessage);
  }

  /**
   * Check if error is displayed
   * @returns {Promise<boolean>}
   */
  async isErrorDisplayed() {
    return await this.isVisible(this.errorMessage);
  }

  // ========== Step Two: Overview ==========

  /**
   * Get all item names in checkout overview
   * @returns {Promise<string[]>}
   */
  async getCheckoutItemNames() {
    return await this.getAllTexts(this.cartItemName);
  }

  /**
   * Get all item prices in checkout overview
   * @returns {Promise<number[]>}
   */
  async getCheckoutItemPrices() {
    const priceTexts = await this.getAllTexts(this.cartItemPrice);
    return priceTexts.map(price => parseFloat(price.replace('$', '')));
  }

  /**
   * Get subtotal amount
   * @returns {Promise<number>}
   */
  async getSubtotal() {
    const text = await this.getText(this.summarySubtotal);
    const match = text.match(/\$(\d+\.?\d*)/);
    return match ? parseFloat(match[1]) : 0;
  }

  /**
   * Get tax amount
   * @returns {Promise<number>}
   */
  async getTax() {
    const text = await this.getText(this.summaryTax);
    const match = text.match(/\$(\d+\.?\d*)/);
    return match ? parseFloat(match[1]) : 0;
  }

  /**
   * Get total amount
   * @returns {Promise<number>}
   */
  async getTotal() {
    const text = await this.getText(this.summaryTotal);
    const match = text.match(/\$(\d+\.?\d*)/);
    return match ? parseFloat(match[1]) : 0;
  }

  /**
   * Verify price calculation
   * @returns {Promise<boolean>}
   */
  async verifyPriceCalculation() {
    const subtotal = await this.getSubtotal();
    const tax = await this.getTax();
    const total = await this.getTotal();
    
    // Round to 2 decimal places for comparison
    const expectedTotal = Math.round((subtotal + tax) * 100) / 100;
    const actualTotal = Math.round(total * 100) / 100;
    
    return expectedTotal === actualTotal;
  }

  /**
   * Get payment information
   * @returns {Promise<string>}
   */
  async getPaymentInfo() {
    const elements = await this.page.locator(this.paymentInfo).all();
    if (elements.length > 0) {
      return await elements[0].textContent();
    }
    return '';
  }

  /**
   * Get shipping information
   * @returns {Promise<string>}
   */
  async getShippingInfo() {
    const elements = await this.page.locator(this.shippingInfo).all();
    if (elements.length > 1) {
      return await elements[1].textContent();
    }
    return '';
  }

  /**
   * Click Finish button
   */
  async clickFinish() {
    await this.click(this.finishButton);
  }

  /**
   * Click Back button in overview
   */
  async clickBack() {
    await this.click(this.backButton);
  }

  // ========== Step Three: Complete ==========

  /**
   * Check if order is complete
   * @returns {Promise<boolean>}
   */
  async isOrderComplete() {
    await this.waitForElement(this.completeHeader);
    return await this.isVisible(this.completeHeader);
  }

  /**
   * Get completion header text
   * @returns {Promise<string>}
   */
  async getCompleteHeader() {
    return await this.getText(this.completeHeader);
  }

  /**
   * Get completion message text
   * @returns {Promise<string>}
   */
  async getCompleteText() {
    return await this.getText(this.completeText);
  }

  /**
   * Click Back Home button
   */
  async clickBackHome() {
    await this.click(this.backHomeButton);
  }

  /**
   * Check if pony express image is displayed
   * @returns {Promise<boolean>}
   */
  async isPonyExpressImageDisplayed() {
    return await this.isVisible(this.ponyExpressImage);
  }

  /**
   * Verify order completion
   * @returns {Promise<boolean>}
   */
  async verifyOrderCompletion() {
    const isComplete = await this.isOrderComplete();
    const header = await this.getCompleteHeader();
    const hasImage = await this.isPonyExpressImageDisplayed();
    
    return isComplete && 
           header.toLowerCase().includes('thank you') && 
           hasImage;
  }

  // ========== Complete Flow Methods ==========

  /**
   * Complete entire checkout process
   * @param {Object} info - Checkout information
   */
  async completeCheckout(info) {
    // Step One: Fill information
    await this.completeStepOne(info);
    
    // Step Two: Verify and finish
    await this.waitForElement(this.finishButton);
    await this.clickFinish();
    
    // Step Three: Wait for completion
    await this.waitForElement(this.completeHeader);
  }

  /**
   * Get checkout summary
   * @returns {Promise<Object>}
   */
  async getCheckoutSummary() {
    return {
      items: await this.getCheckoutItemNames(),
      prices: await this.getCheckoutItemPrices(),
      subtotal: await this.getSubtotal(),
      tax: await this.getTax(),
      total: await this.getTotal(),
      paymentInfo: await this.getPaymentInfo(),
      shippingInfo: await this.getShippingInfo()
    };
  }
}

module.exports = CheckoutPage;