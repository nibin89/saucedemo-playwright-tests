const BasePage = require('./BasePage');


/**
 * LoginPage - Page Object for Login functionality
 */
class LoginPage extends BasePage {
  constructor(page) {
    super(page);
    
    // Locators
    this.usernameInput = '#user-name';
    this.passwordInput = '#password';
    this.loginButton = '#login-button';
    this.errorMessage = '[data-test="error"]';
    this.errorButton = '.error-button';
    this.logoImage = '.login_logo';
    this.credentialsContainer = '.login_credentials';
  }

  /**
   * Navigate to login page
   */
  async goto() {
    await this.navigate('/');
  }

  /**
   * Perform login with credentials
   * @param {string} username - Username
   * @param {string} password - Password
   */
  async login(username, password) {
    await this.fill(this.usernameInput, username);
    await this.fill(this.passwordInput, password);
    await this.click(this.loginButton);
  }

  /**
   * Login with standard user
   */
  async loginAsStandardUser() {
    await this.login(
      process.env.STANDARD_USER || 'standard_user',
      process.env.PASSWORD || 'secret_sauce'
    );
  }

  /**
   * Login with locked out user
   */
  async loginAsLockedOutUser() {
    await this.login('locked_out_user', 'secret_sauce');
  }

  /**
   * Login with problem user
   */
  async loginAsProblemUser() {
    await this.login('problem_user', 'secret_sauce');
  }

  /**
   * Login with performance glitch user
   */
  async loginAsPerformanceGlitchUser() {
    await this.login('performance_glitch_user', 'secret_sauce');
  }

  /**
   * Get error message text
   * @returns {Promise<string>}
   */
  async getErrorMessage() {
    await this.waitForElement(this.errorMessage);
    return await this.getText(this.errorMessage);
  }

  /**
   * Check if error message is displayed
   * @returns {Promise<boolean>}
   */
  async isErrorDisplayed() {
    return await this.isVisible(this.errorMessage);
  }

  /**
   * Click on error close button
   */
  async closeError() {
    await this.click(this.errorButton);
  }

  /**
   * Check if login page is displayed
   * @returns {Promise<boolean>}
   */
  async isLoginPageDisplayed() {
    return await this.isVisible(this.loginButton);
  }

  /**
   * Get available usernames from the page
   * @returns {Promise<string[]>}
   */
  async getAvailableUsernames() {
    const text = await this.getText(this.credentialsContainer);
    // Extract usernames from the credentials text
    const usernames = text.match(/\w+_user/g) || [];
    return usernames;
  }

  /**
   * Clear login fields
   */
  async clearLoginFields() {
    await this.clear(this.usernameInput);
    await this.clear(this.passwordInput);
  }

  /**
   * Check if login button is enabled
   * @returns {Promise<boolean>}
   */
  async isLoginButtonEnabled() {
    return await this.isEnabled(this.loginButton);
  }

  /**
   * Get username input value
   * @returns {Promise<string>}
   */
  async getUsernameValue() {
    return await this.getAttribute(this.usernameInput, 'value');
  }

  /**
   * Get password input value
   * @returns {Promise<string>}
   */
  async getPasswordValue() {
    return await this.getAttribute(this.passwordInput, 'value');
  }
}

module.exports = LoginPage;