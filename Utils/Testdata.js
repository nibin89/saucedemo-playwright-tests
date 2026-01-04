const { faker } = require('@faker-js/faker');

/**
 * Test Data utility class
 * Provides test data for automation tests
 */
class TestData {
  /**
   * Get standard user credentials
   */
  static getStandardUser() {
    return {
      username: process.env.STANDARD_USER || 'standard_user',
      password: process.env.PASSWORD || 'secret_sauce'
    };
  }

  /**
   * Get locked out user credentials
   */
  static getLockedOutUser() {
    return {
      username: 'locked_out_user',
      password: 'secret_sauce'
    };
  }

  /**
   * Get problem user credentials
   */
  static getProblemUser() {
    return {
      username: 'problem_user',
      password: 'secret_sauce'
    };
  }

  /**
   * Get performance glitch user credentials
   */
  static getPerformanceGlitchUser() {
    return {
      username: 'performance_glitch_user',
      password: 'secret_sauce'
    };
  }

  /**
   * Get all valid users
   */
  static getAllValidUsers() {
    return [
      'standard_user',
      'problem_user',
      'performance_glitch_user',
      'error_user',
      'visual_user'
    ];
  }

  /**
   * Get checkout information
   */
  static getCheckoutInfo() {
    return {
      firstName: 'John',
      lastName: 'Doe',
      postalCode: '12345'
    };
  }

  /**
   * Get random checkout information using Faker
   */
  static getRandomCheckoutInfo() {
    return {
      firstName: faker.person.firstName(),
      lastName: faker.person.lastName(),
      postalCode: faker.location.zipCode()
    };
  }

  /**
   * Get multiple checkout info sets
   */
  static getMultipleCheckoutInfo(count = 3) {
    const data = [];
    for (let i = 0; i < count; i++) {
      data.push(this.getRandomCheckoutInfo());
    }
    return data;
  }

  /**
   * Get invalid checkout data
   */
  static getInvalidCheckoutInfo() {
    return [
      { firstName: '', lastName: 'Doe', postalCode: '12345', error: 'First Name is required' },
      { firstName: 'John', lastName: '', postalCode: '12345', error: 'Last Name is required' },
      { firstName: 'John', lastName: 'Doe', postalCode: '', error: 'Postal Code is required' }
    ];
  }

  /**
   * Get product names
   */
  static getProductNames() {
    return [
      'Sauce Labs Backpack',
      'Sauce Labs Bike Light',
      'Sauce Labs Bolt T-Shirt',
      'Sauce Labs Fleece Jacket',
      'Sauce Labs Onesie',
      'Test.allTheThings() T-Shirt (Red)'
    ];
  }

  /**
   * Get product prices
   */
  static getProductPrices() {
    return {
      'Sauce Labs Backpack': 29.99,
      'Sauce Labs Bike Light': 9.99,
      'Sauce Labs Bolt T-Shirt': 15.99,
      'Sauce Labs Fleece Jacket': 49.99,
      'Sauce Labs Onesie': 7.99,
      'Test.allTheThings() T-Shirt (Red)': 15.99
    };
  }

  /**
   * Get random product name
   */
  static getRandomProductName() {
    const products = this.getProductNames();
    return products[Math.floor(Math.random() * products.length)];
  }

  /**
   * Get multiple random products
   */
  static getRandomProducts(count) {
    const products = this.getProductNames();
    const shuffled = products.sort(() => 0.5 - Math.random());
    return shuffled.slice(0, count);
  }

  /**
   * Get expected error messages
   */
  static getErrorMessages() {
    return {
      invalidCredentials: 'Username and password do not match any user in this service',
      lockedOut: 'Sorry, this user has been locked out',
      usernameRequired: 'Username is required',
      passwordRequired: 'Password is required',
      firstNameRequired: 'Error: First Name is required',
      lastNameRequired: 'Error: Last Name is required',
      postalCodeRequired: 'Error: Postal Code is required'
    };
  }

  /**
   * Get sort options
   */
  static getSortOptions() {
    return {
      nameAZ: 'az',
      nameZA: 'za',
      priceLowHigh: 'lohi',
      priceHighLow: 'hilo'
    };
  }

  /**
   * Generate test user with Faker
   */
  static generateTestUser() {
    return {
      username: faker.internet.userName(),
      password: faker.internet.password(),
      email: faker.internet.email(),
      firstName: faker.person.firstName(),
      lastName: faker.person.lastName(),
      phone: faker.phone.number()
    };
  }

  /**
   * Generate test address
   */
  static generateAddress() {
    return {
      street: faker.location.streetAddress(),
      city: faker.location.city(),
      state: faker.location.state(),
      zipCode: faker.location.zipCode(),
      country: faker.location.country()
    };
  }

  /**
   * Get credit card test data
   */
  static getCreditCardData() {
    return {
      cardNumber: faker.finance.creditCardNumber(),
      cvv: faker.finance.creditCardCVV(),
      expiryDate: '12/25'
    };
  }

  /**
   * Generate random test data set
   */
  static generateRandomDataSet(count = 5) {
    const data = [];
    for (let i = 0; i < count; i++) {
      data.push({
        user: this.generateTestUser(),
        address: this.generateAddress(),
        checkout: this.getRandomCheckoutInfo(),
        products: this.getRandomProducts(Math.floor(Math.random() * 3) + 1)
      });
    }
    return data;
  }
}

module.exports = TestData;