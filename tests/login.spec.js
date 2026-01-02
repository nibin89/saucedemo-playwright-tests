const { test, expect } = require ('@playwright/test');
const LoginPage = require('../Pages/LoginPage');
const InventoryPage = require('../Pages/InventoryPage');

test.describe('Login Functionality Tests', () => {
  let loginPage;
  let inventoryPage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    inventoryPage = new InventoryPage(page);
    await loginPage.goto();
  });

  test('@smoke TC_001: Valid user login with standard user', async () => {
    // Arrange - already on login page
    
    // Act
    await loginPage.loginAsStandardUser();
    
    // Assert
    await expect(inventoryPage.page).toHaveURL(/.*inventory.html/);
    expect(await inventoryPage.isInventoryPageDisplayed()).toBeTruthy();
  });

  test('TC_002: Invalid username login', async () => {
    // Arrange
    const invalidUsername = 'invalid_user';
    const validPassword = 'secret_sauce';
    
    // Act
    await loginPage.login(invalidUsername, validPassword);
    
    // Assert
    expect(await loginPage.isErrorDisplayed()).toBeTruthy();
    const errorMessage = await loginPage.getErrorMessage();
    expect(errorMessage).toContain('Username and password do not match');
  });

  test('TC_003: Invalid password login', async () => {
    // Arrange
    const validUsername = 'standard_user';
    const invalidPassword = 'wrong_password';
    
    // Act
    await loginPage.login(validUsername, invalidPassword);
    
    // Assert
    expect(await loginPage.isErrorDisplayed()).toBeTruthy();
    const errorMessage = await loginPage.getErrorMessage();
    expect(errorMessage).toContain('Username and password do not match');
  });

  test('TC_004: Empty credentials login', async () => {
    // Arrange - leave fields empty
    
    // Act
    await loginPage.click(loginPage.loginButton);
    
    // Assert
    expect(await loginPage.isErrorDisplayed()).toBeTruthy();
    const errorMessage = await loginPage.getErrorMessage();
    expect(errorMessage).toContain('Username is required');
  });

  test('TC_005: Locked out user login', async () => {
    // Arrange
    const lockedUsername = 'locked_out_user';
    const password = 'secret_sauce';
    
    // Act
    await loginPage.login(lockedUsername, password);
    
    // Assert
    expect(await loginPage.isErrorDisplayed()).toBeTruthy();
    const errorMessage = await loginPage.getErrorMessage();
    expect(errorMessage).toContain('this user has been locked out');
  });

  test('@smoke TC_006: User logout functionality', async () => {
    // Arrange - Login first
    await loginPage.loginAsStandardUser();
    await expect(inventoryPage.page).toHaveURL(/.*inventory.html/);
    
    // Act
    await inventoryPage.logout();
    
    // Assert
    await expect(loginPage.page).toHaveURL(/.*\//);
    expect(await loginPage.isLoginPageDisplayed()).toBeTruthy();
  });

  test('TC_007: Login with empty username', async () => {
    // Arrange
    const password = 'secret_sauce';
    
    // Act
    await loginPage.fill(loginPage.passwordInput, password);
    await loginPage.click(loginPage.loginButton);
    
    // Assert
    expect(await loginPage.isErrorDisplayed()).toBeTruthy();
    const errorMessage = await loginPage.getErrorMessage();
    expect(errorMessage).toContain('Username is required');
  });

  test('TC_008: Login with empty password', async () => {
    // Arrange
    const username = 'standard_user';
    
    // Act
    await loginPage.fill(loginPage.usernameInput, username);
    await loginPage.click(loginPage.loginButton);
    
    // Assert
    expect(await loginPage.isErrorDisplayed()).toBeTruthy();
    const errorMessage = await loginPage.getErrorMessage();
    expect(errorMessage).toContain('Password is required');
  });

  test('TC_009: Close error message', async () => {
    // Arrange - Trigger error
    await loginPage.click(loginPage.loginButton);
    expect(await loginPage.isErrorDisplayed()).toBeTruthy();
    
    // Act
    await loginPage.closeError();
    
    // Assert
    expect(await loginPage.isErrorDisplayed()).toBeFalsy();
  });

  test('TC_010: Login with problem user', async () => {
    // Arrange
    
    // Act
    await loginPage.loginAsProblemUser();
    
    // Assert
    await expect(inventoryPage.page).toHaveURL(/.*inventory.html/);
    expect(await inventoryPage.isInventoryPageDisplayed()).toBeTruthy();
  });

  test('TC_011: Login with performance glitch user', async () => {
    // Arrange
    
    // Act
    await loginPage.loginAsPerformanceGlitchUser();
    
    // Assert
    await expect(inventoryPage.page).toHaveURL(/.*inventory.html/);
    expect(await inventoryPage.isInventoryPageDisplayed()).toBeTruthy();
  });

  test('TC_012: Verify login button is enabled', async () => {
    // Assert
    expect(await loginPage.isLoginButtonEnabled()).toBeTruthy();
  });

  test('TC_013: Verify login page elements are displayed', async () => {
    // Assert
    expect(await loginPage.isVisible(loginPage.usernameInput)).toBeTruthy();
    expect(await loginPage.isVisible(loginPage.passwordInput)).toBeTruthy();
    expect(await loginPage.isVisible(loginPage.loginButton)).toBeTruthy();
    expect(await loginPage.isVisible(loginPage.logoImage)).toBeTruthy();
  });
});