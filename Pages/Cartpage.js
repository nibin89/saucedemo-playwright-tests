const BasePage = require('./BasePage');

/**
 * CartPage - Page Object for Shopping Cart
 */
class CartPage extends BasePage {
  constructor(page) {
    super(page);
    
    // Locators
    this.cartContainer = '.cart_contents_container';
    this.cartItems = '.cart_item';
    this.cartItemName = '.inventory_item_name';
    this.cartItemDesc = '.inventory_item_desc';
    this.cartItemPrice = '.inventory_item_price';
    this.removeButton = '[id^="remove-"]';
    this.continueShoppingButton = '#continue-shopping';
    this.checkoutButton = '#checkout';
    this.cartQuantity = '.cart_quantity';
    this.cartBadge = '.shopping_cart_badge';
  }

  /**
   * Check if cart page is displayed
   * @returns {Promise<boolean>}
   */
  async isCartPageDisplayed() {
    await this.waitForElement(this.cartContainer);
    return await this.isVisible(this.cartContainer);
  }

  /**
   * Get all cart item names
   * @returns {Promise<string[]>}
   */
  async getCartItemNames() {
    return await this.getAllTexts(this.cartItemName);
  }

  /**
   * Get all cart item prices
   * @returns {Promise<number[]>}
   */
  async getCartItemPrices() {
    const priceTexts = await this.getAllTexts(this.cartItemPrice);
    return priceTexts.map(price => parseFloat(price.replace('$', '')));
  }

  /**
   * Get cart items count
   * @returns {Promise<number>}
   */
  async getCartItemsCount() {
    return await this.getCount(this.cartItems);
  }

  /**
   * Remove item from cart by name
   * @param {string} productName - Product name
   */
  async removeItemFromCart(productName) {
    const buttonId = `remove-${productName.toLowerCase().replace(/\s+/g, '-')}`;
    await this.click(`[id="${buttonId}"]`);
  }

  /**
   * Remove item from cart by index
   * @param {number} index - Item index (0-based)
   */
  async removeItemByIndex(index) {
    const buttons = await this.page.locator(this.removeButton).all();
    if (buttons[index]) {
      await buttons[index].click();
    }
  }

  /**
   * Remove all items from cart
   */
  async removeAllItems() {
    const count = await this.getCartItemsCount();
    for (let i = count - 1; i >= 0; i--) {
      await this.removeItemByIndex(i);
      await this.wait(300);
    }
  }

  /**
   * Click Continue Shopping button
   */
  async continueShopping() {
    await this.click(this.continueShoppingButton);
  }

  /**
   * Click Checkout button
   */
  async proceedToCheckout() {
    await this.click(this.checkoutButton);
  }

  /**
   * Check if cart is empty
   * @returns {Promise<boolean>}
   */
  async isCartEmpty() {
    const count = await this.getCartItemsCount();
    return count === 0;
  }

  /**
   * Get cart item details by name
   * @param {string} productName - Product name
   * @returns {Promise<Object|null>}
   */
  async getCartItemDetails(productName) {
    const items = await this.page.locator(this.cartItems).all();
    
    for (const item of items) {
      const name = await item.locator(this.cartItemName).textContent();
      
      if (name === productName) {
        const description = await item.locator(this.cartItemDesc).textContent();
        const price = await item.locator(this.cartItemPrice).textContent();
        const quantity = await item.locator(this.cartQuantity).textContent();
        
        return {
          name,
          description,
          price: parseFloat(price.replace('$', '')),
          quantity: parseInt(quantity)
        };
      }
    }
    return null;
  }

  /**
   * Verify item is in cart
   * @param {string} productName - Product name
   * @returns {Promise<boolean>}
   */
  async isItemInCart(productName) {
    const items = await this.getCartItemNames();
    return items.includes(productName);
  }

  /**
   * Get total cart value
   * @returns {Promise<number>}
   */
  async getTotalCartValue() {
    const prices = await this.getCartItemPrices();
    return prices.reduce((sum, price) => sum + price, 0);
  }

  /**
   * Get cart badge count from icon
   * @returns {Promise<number>}
   */
  async getCartBadgeCount() {
    if (await this.isVisible(this.cartBadge)) {
      const text = await this.getText(this.cartBadge);
      return parseInt(text);
    }
    return 0;
  }

  /**
   * Verify cart badge matches items count
   * @returns {Promise<boolean>}
   */
  async doesCartBadgeMatchItemsCount() {
    const itemsCount = await this.getCartItemsCount();
    const badgeCount = await this.getCartBadgeCount();
    return itemsCount === badgeCount;
  }
}

module.exports = CartPage;