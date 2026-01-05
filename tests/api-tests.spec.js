const { test, expect } = require('@playwright/test');

/**
 * API Testing Examples
 * Note: SauceDemo doesn't have a public API, so these are mock/demonstration tests
 * showing how to integrate API testing in the framework
 */

test.describe('API Tests (Mock/Demo)', () => {
  
  test('TC_032: GET - Fetch products API (Mock)', async ({ request }) => {
    // This is a demonstration of how API testing would work
    // In real scenario, you would call actual API endpoints
    
    // Example: Mock API call
    const mockApiUrl = 'https://jsonplaceholder.typicode.com/posts';
    
    const response = await request.get(mockApiUrl);
    
    // Assert
    expect(response.ok()).toBeTruthy();
    expect(response.status()).toBe(200);
    
    const data = await response.json();
    expect(Array.isArray(data)).toBeTruthy();
    expect(data.length).toBeGreaterThan(0);
  });

  test('TC_033: POST - Login API (Mock)', async ({ request }) => {
    // Mock POST request demonstration
    const mockApiUrl = 'https://jsonplaceholder.typicode.com/posts';
    
    const response = await request.post(mockApiUrl, {
      data: {
        username: 'standard_user',
        password: 'secret_sauce'
      }
    });
    
    // Assert
    expect(response.ok()).toBeTruthy();
    expect(response.status()).toBe(201);
    
    const data = await response.json();
    expect(data).toHaveProperty('id');
  });

  test('TC_034: API response validation', async ({ request }) => {
    // Demonstrate response validation
    const mockApiUrl = 'https://jsonplaceholder.typicode.com/posts/1';
    
    const response = await request.get(mockApiUrl);
    
    // Assert response structure
    expect(response.ok()).toBeTruthy();
    const data = await response.json();
    
    // Validate response structure
    expect(data).toHaveProperty('userId');
    expect(data).toHaveProperty('id');
    expect(data).toHaveProperty('title');
    expect(data).toHaveProperty('body');
    
    // Validate data types
    expect(typeof data.userId).toBe('number');
    expect(typeof data.id).toBe('number');
    expect(typeof data.title).toBe('string');
    expect(typeof data.body).toBe('string');
  });

  test('TC_035: API error handling', async ({ request }) => {
    // Test error handling
    const mockApiUrl = 'https://jsonplaceholder.typicode.com/posts/999999';
    
    const response = await request.get(mockApiUrl);
    
    // Assert 404 response
    expect(response.status()).toBe(404);
  });

  test('TC_036: API with headers', async ({ request }) => {
    // Demonstrate API call with custom headers
    const mockApiUrl = 'https://jsonplaceholder.typicode.com/posts';
    
    const response = await request.get(mockApiUrl, {
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      }
    });
    
    expect(response.ok()).toBeTruthy();
    
    // Verify response headers
    const contentType = response.headers()['content-type'];
    expect(contentType).toContain('application/json');
  });

  test('TC_037: API performance test', async ({ request }) => {
    // Measure API response time
    const mockApiUrl = 'https://jsonplaceholder.typicode.com/posts';
    
    const startTime = Date.now();
    const response = await request.get(mockApiUrl);
    const endTime = Date.now();
    
    const responseTime = endTime - startTime;
    
    // Assert
    expect(response.ok()).toBeTruthy();
    expect(responseTime).toBeLessThan(3000); // Response should be under 3 seconds
    
    console.log(`API Response Time: ${responseTime}ms`);
  });

  test('TC_038: API request interceptor demo', async ({ page }) => {
    // Demonstrate request interception
    
    // Listen to all network requests
    page.on('request', request => {
      console.log(`Request: ${request.method()} ${request.url()}`);
    });
    
    // Listen to all network responses
    page.on('response', response => {
      console.log(`Response: ${response.status()} ${response.url()}`);
    });
    
    await page.goto('https://www.saucedemo.com/inventory.html');
    
    // Wait for network to be idle
    await page.waitForLoadState('networkidle');
  });

  test('TC_039: Mock API response', async ({ page }) => {
    // Demonstrate mocking API responses
    
    await page.route('**/api/products', async route => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify([
          { id: 1, name: 'Test Product', price: 29.99 },
          { id: 2, name: 'Another Product', price: 39.99 }
        ])
      });
    });
    
    // Now when page makes API call, it will get mocked response
    // This is useful for testing edge cases
  });

  test('TC_040: API data-driven test', async ({ request }) => {
    // Data-driven API testing
    const testData = [
      { id: 1, expectedStatus: 200 },
      { id: 2, expectedStatus: 200 },
      { id: 3, expectedStatus: 200 }
    ];
    
    for (const data of testData) {
      const response = await request.get(
        `https://jsonplaceholder.typicode.com/posts/${data.id}`
      );
      
      expect(response.status()).toBe(data.expectedStatus);
      
      const body = await response.json();
      expect(body.id).toBe(data.id);
    }
  });
});

/**
 * Integration Tests - API + UI
 * These tests demonstrate how to combine API and UI testing
 */
test.describe('API + UI Integration Tests', () => {
  
  test('TC_041: Setup test data via API, verify in UI', async ({ page, request }) => {
    // Step 1: Setup data via API (mock demonstration)
    // In real scenario, you would create test data via API
    
    // Step 2: Navigate to UI
    await page.goto('https://www.saucedemo.com');
    
    // Step 3: Login
    await page.fill('#user-name', 'standard_user');
    await page.fill('#password', 'secret_sauce');
    await page.click('#login-button');
    
    // Step 4: Verify data in UI
    await page.waitForURL('**/inventory.html');
    expect(page.url()).toContain('inventory.html');
  });

  test('TC_042: Perform UI action, verify via API', async ({ page, request }) => {
    // Step 1: Perform UI action
    await page.goto('https://www.saucedemo.com');
    await page.fill('#user-name', 'standard_user');
    await page.fill('#password', 'secret_sauce');
    await page.click('#login-button');
    
    await page.waitForURL('**/inventory.html');
    
    // Add product to cart
    await page.click('[id="add-to-cart-sauce-labs-backpack"]');
    
    // Step 2: In real scenario, verify cart via API call
    // const response = await request.get('https://api.example.com/cart');
    // const cart = await response.json();
    // expect(cart.items).toHaveLength(1);
    
    // For demo, verify in UI
    const badge = await page.locator('.shopping_cart_badge').textContent();
    expect(badge).toBe('1');
  });

  test('TC_043: Compare API vs UI data', async ({ page, request }) => {
    // Navigate to inventory
    await page.goto('https://www.saucedemo.com');
    await page.fill('#user-name', 'standard_user');
    await page.fill('#password', 'secret_sauce');
    await page.click('#login-button');
    await page.waitForURL('**/inventory.html');
    
    // Get product count from UI
    const productCount = await page.locator('.inventory_item').count();
    
    // In real scenario, fetch from API and compare
    // const apiResponse = await request.get('https://api.example.com/products');
    // const apiProducts = await apiResponse.json();
    // expect(apiProducts.length).toBe(productCount);
    
    expect(productCount).toBe(6); // SauceDemo has 6 products
  });
});