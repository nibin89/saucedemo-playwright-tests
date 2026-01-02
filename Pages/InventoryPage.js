const BasePage = require('./BasePage');

/**
 * InventoryPage - Page Object for Product Inventory
 */
class InventoryPage extends BasePage {
  constructor(page) {
    super(page);
    
    // Locators
    this.inventoryContainer = '.inventory_container';
    this.inventoryItems = '.inventory_item';
    this.inventoryItemName = '.inventory_item_name';
    this.inventoryItemDesc = '.inventory_item_desc';
    this.inventoryItemPrice = '.inventory_item_price';
    this.addToCartButton = '.btn_inventory';
    this.removeButton = '[id^="remove-"]';
    this.shoppingCartBadge = '.shopping_cart_badge';
    this.shoppingCartLink = '.shopping_cart_link';
    this.sortDropdown = '.product_sort_container';
    this.burgerMenu = '#react-burger-menu-btn';
    this.logoutLink = '#logout_sidebar_link';
    this.inventoryItemImage = '.inventory_item_img';
    
    // Sort options
    this.sortOptions = {
      AZ: 'az',
      ZA: 'za',
      LOW_HIGH: 'lohi',
      HIGH_LOW: 'hilo'
    };
  }

  /**
   * Check if inventory page is displayed
   * @returns {Promise<boolean>}
   */
  async isInventoryPageDisplayed() {
    await this.waitForElement(this.inventoryContainer);
    return await this.isVisible(this.inventoryContainer);
  }

  /**
   * Get all product names
   * @returns {Promise<string[]>}
   */
  async getProductNames() {
    return await this.getAllTexts(this.inventoryItemName);
  }

  /**
   * Get all product prices
   * @returns {Promise<number[]>}
   */
  async getProductPrices() {
    const priceTexts = await this.getAllTexts(this.inventoryItemPrice);
    return priceTexts.map(price => parseFloat(price.replace('$', '')));
  }

  /**
   * Get product count
   * @returns {Promise<number>}
   */
  async getProductCount() {
    return await this.getCount(this.inventoryItems);
  }

  /**
   * Add product to cart by name
   * @param {string} productName - Product name
   */
  async addProductToCart(productName) {
    const buttonId = `add-to-cart-${productName.toLowerCase().replace(/\s+/g, '-')}`;
    await this.click(`[id="${buttonId}"]`);
  }

  /**
   * Add product to cart by index
   * @param {number} index - Product index (0-based)
   */
  async addProductToCartByIndex(index) {
    const buttons = await this.page.locator(this.addToCartButton).all();
    if (buttons[index]) {
      await buttons[index].click();
    }
  }

  /**
   * Add multiple products to cart
   * @param {number} count - Number of products to add
   */
  async addMultipleProductsToCart(count) {
    const buttons = await this.page.locator(this.addToCartButton).all();
    for (let i = 0; i < Math.min(count, buttons.length); i++) {
      await buttons[i].click();
    }
  }

  /**
   * Remove product from cart by name
   * @param {string} productName - Product name
   */
  async removeProductFromCart(productName) {
    const buttonId = `remove-${productName.toLowerCase().replace(/\s+/g, '-')}`;
    await this.click(`[id="${buttonId}"]`);
  }

  /**
   * Get cart badge count
   * @returns {Promise<number>}
   */
  async getCartBadgeCount() {
    if (await this.isVisible(this.shoppingCartBadge)) {
      const text = await this.getText(this.shoppingCartBadge);
      return parseInt(text);
    }
    return 0;
  }

  /**
   * Click on shopping cart
   */
  async clickShoppingCart() {
    await this.click(this.shoppingCartLink);
  }

  /**
   * Sort products
   * @param {string} option - Sort option (use this.sortOptions)
   */
  async sortProducts(option) {
    await this.selectDropdown(this.sortDropdown, option);
    await this.wait(500); // Wait for sorting to complete
  }

  /**
   * Get currently selected sort option
   * @returns {Promise<string>}
   */
  async getSelectedSortOption() {
    return await this.page.$eval(this.sortDropdown, el => el.value);
  }

  /**
   * Click on product by name
   * @param {string} productName - Product name
   */
  async clickProduct(productName) {
    const products = await this.page.locator(this.inventoryItemName).all();
    for (const product of products) {
      const text = await product.textContent();
      if (text === productName) {
        await product.click();
        break;
      }
    }
  }

  /**
   * Click on product by index
   * @param {number} index - Product index (0-based)
   */
  async clickProductByIndex(index) {
    const products = await this.page.locator(this.inventoryItemName).all();
    if (products[index]) {
      await products[index].click();
    }
  }

  /**
   * Get product details by name
   * @param {string} productName - Product name
   * @returns {Promise<Object>}
   */
  async getProductDetails(productName) {
    const items = await this.page.locator(this.inventoryItems).all();
    
    for (const item of items) {
      const name = await item.locator(this.inventoryItemName).textContent();
      
      if (name === productName) {
        const description = await item.locator(this.inventoryItemDesc).textContent();
        const price = await item.locator(this.inventoryItemPrice).textContent();
        
        return {
          name,
          description,
          price: parseFloat(price.replace('$', ''))
        };
      }
    }
    return null;
  }

  /**
   * Open burger menu
   */
  async openMenu() {
    await this.click(this.burgerMenu);
    await this.wait(500);
  }

  /**
   * Logout from application
   */
  async logout() {
    await this.openMenu();
    await this.click(this.logoutLink);
  }

  /**
   * Check if product is in cart (button shows "Remove")
   * @param {string} productName - Product name
   * @returns {Promise<boolean>}
   */
  async isProductInCart(productName) {
    const buttonId = `remove-${productName.toLowerCase().replace(/\s+/g, '-')}`;
    return await this.isVisible(`[id="${buttonId}"]`);
  }

  /**
   * Verify products are sorted alphabetically A-Z
   * @returns {Promise<boolean>}
   */
  async areProductsSortedAZ() {
    const names = await this.getProductNames();
    const sorted = [...names].sort();
    return JSON.stringify(names) === JSON.stringify(sorted);
  }

  /**
   * Verify products are sorted alphabetically Z-A
   * @returns {Promise<boolean>}
   */
  async areProductsSortedZA() {
    const names = await this.getProductNames();
    const sorted = [...names].sort().reverse();
    return JSON.stringify(names) === JSON.stringify(sorted);
  }

  /**
   * Verify products are sorted by price low to high
   * @returns {Promise<boolean>}
   */
  async areProductsSortedLowToHigh() {
    const prices = await this.getProductPrices();
    const sorted = [...prices].sort((a, b) => a - b);
    return JSON.stringify(prices) === JSON.stringify(sorted);
  }

  /**
   * Verify products are sorted by price high to low
   * @returns {Promise<boolean>}
   */
  async areProductsSortedHighToLow() {
    const prices = await this.getProductPrices();
    const sorted = [...prices].sort((a, b) => b - a);
    return JSON.stringify(prices) === JSON.stringify(sorted);
  }
}

module.exports = InventoryPage;