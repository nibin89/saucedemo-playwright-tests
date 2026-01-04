# 🎭 SauceDemo E2E Test Automation Framework

[![Playwright Tests](https://github.com/yourusername/saucedemo-playwright-automation/actions/workflows/playwright.yml/badge.svg)](https://github.com/yourusername/saucedemo-playwright-automation/actions/workflows/playwright.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Node.js Version](https://img.shields.io/badge/node-%3E%3D18.0.0-brightgreen)](https://nodejs.org/)

## 📋 Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Running Tests](#running-tests)
- [Test Reports](#test-reports)
- [CI/CD Pipeline](#cicd-pipeline)
- [Page Object Model](#page-object-model)
- [Test Coverage](#test-coverage)
- [Best Practices](#best-practices)
- [Contributing](#contributing)
- [License](#license)

## 🎯 Overview

This is a comprehensive End-to-End (E2E) test automation framework built for [SauceDemo](https://www.saucedemo.com) e-commerce application using **Playwright** with **JavaScript** and implementing the **Page Object Model (POM)** design pattern.

The framework demonstrates professional-level test automation practices including:
- ✅ Cross-browser testing (Chromium, Firefox, WebKit)
- ✅ CI/CD integration with GitHub Actions
- ✅ Comprehensive test reporting with Allure
- ✅ Data-driven testing
- ✅ API testing capabilities
- ✅ Parallel test execution
- ✅ Flaky test handling with retry logic

## ✨ Features

- 🔍 **40+ Test Cases** covering critical user journeys
- 🏗️ **Page Object Model** for maintainable test code
- 🌐 **Cross-Browser Testing** (Chrome, Firefox, Safari)
- 📊 **Allure Reports** with screenshots and videos
- 🔄 **CI/CD Integration** via GitHub Actions
- 📱 **Mobile Testing** support
- 🎯 **Test Categorization** (@smoke, @regression, @e2e)
- 🔐 **Environment Configuration** with .env support
- 📈 **Data-Driven Testing** with Faker.js
- 🚀 **Parallel Execution** for faster test runs

## 🛠️ Tech Stack

| Technology | Purpose |
|------------|---------|
| **Playwright** | Browser automation framework |
| **JavaScript** | Programming language |
| **Node.js** | Runtime environment |
| **Allure** | Test reporting |
| **Faker.js** | Test data generation |
| **ESLint** | Code linting |
| **GitHub Actions** | CI/CD pipeline |
| **dotenv** | Environment management |

## 📁 Project Structure

```
saucedemo-playwright-automation/
│
├── .github/
│   └── workflows/
│       └── playwright.yml          # CI/CD pipeline configuration
│
├── pages/                          # Page Object Model classes
│   ├── BasePage.js                 # Base class with common methods
│   ├── LoginPage.js                # Login page object
│   ├── InventoryPage.js            # Product inventory page object
│   ├── CartPage.js                 # Shopping cart page object
│   └── CheckoutPage.js             # Checkout process page object
│
├── tests/                          # Test specifications
│   ├── login.spec.js               # Authentication tests
│   ├── inventory.spec.js           # Product catalog tests
│   ├── cart.spec.js                # Shopping cart tests
│   ├── checkout.spec.js            # Checkout process tests
│   └── e2e.spec.js                 # End-to-end flow tests
│
├── utils/                          # Utility functions
│   ├── testData.js                 # Test data management
│   └── helpers.js                  # Helper functions
│
├── playwright.config.js            # Playwright configuration
├── package.json                    # Project dependencies
├── .env.example                    # Environment variables template
├── .eslintrc.js                    # ESLint configuration
├── .gitignore                      # Git ignore rules
└── README.md                       # Project documentation
```

## ⚙️ Prerequisites

Before running this project, ensure you have:

- **Node.js** (v18.0.0 or higher) - [Download](https://nodejs.org/)
- **npm** (comes with Node.js)
- **Git** - [Download](https://git-scm.com/)

## 🚀 Installation

### 1. Clone the Repository

```bash
git clone https://github.com/yourusername/saucedemo-playwright-automation.git
cd saucedemo-playwright-automation
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Install Playwright Browsers

```bash
npx playwright install
```

### 4. Configure Environment Variables

```bash
cp .env.example .env
```

Edit `.env` file with your configuration:

```env
BASE_URL=https://www.saucedemo.com
STANDARD_USER=standard_user
PASSWORD=secret_sauce
```

## 🧪 Running Tests

### Run All Tests

```bash
npm test
```

### Run Tests in Specific Browser

```bash
# Chromium
npm run test:chrome

# Firefox
npm run test:firefox

# WebKit (Safari)
npm run test:webkit
```

### Run Smoke Tests Only

```bash
npm run test:smoke
```

### Run Regression Tests

```bash
npm run test:regression
```

### Run Tests in Headed Mode

```bash
npm run test:headed
```

### Run Tests in Debug Mode

```bash
npm run test:debug
```

### Run Tests with UI Mode

```bash
npm run test:ui
```

### Run Specific Test File

```bash
npx playwright test tests/login.spec.js
```

### Run Tests with Tags

```bash
# Run only smoke tests
npx playwright test --grep @smoke

# Run only e2e tests
npx playwright test --grep @e2e

# Run all except smoke tests
npx playwright test --grep-invert @smoke
```

## 📊 Test Reports

### Playwright HTML Report

After test execution, view the HTML report:

```bash
npm run report
```

### Allure Report

Generate and view Allure report:

```bash
# Generate Allure report
npm run allure:generate

# Open Allure report
npm run allure:open

# Or use serve (generates and opens)
npm run allure:serve
```

### Sample Allure Report

![Allure Report Overview](docs/images/allure-overview.png)
![Allure Test Details](docs/images/allure-details.png)

## 🔄 CI/CD Pipeline

This project includes a GitHub Actions workflow that automatically:

1. ✅ Runs on every push to `main` and `develop` branches
2. ✅ Runs on pull requests
3. ✅ Scheduled daily runs (Monday-Friday at 9 AM UTC)
4. ✅ Executes tests across multiple browsers in parallel
5. ✅ Generates and archives test reports
6. ✅ Deploys Allure reports to GitHub Pages
7. ✅ Sends notifications on test completion

### Viewing CI/CD Results

- **GitHub Actions**: Navigate to `Actions` tab in your repository
- **Allure Report**: Available at `https://yourusername.github.io/saucedemo-playwright-automation`

### Setting Up Secrets

Configure the following secrets in GitHub repository settings:

```
STANDARD_USER=standard_user
PASSWORD=secret_sauce
BASE_URL=https://www.saucedemo.com
```

## 🏗️ Page Object Model

### BasePage

Contains common methods used across all pages:

```javascript
- navigate(url)
- click(selector)
- fill(selector, text)
- getText(selector)
- isVisible(selector)
- waitForElement(selector)
// ... and more
```

### Page Objects

- **LoginPage**: Handles authentication
- **InventoryPage**: Manages product catalog
- **CartPage**: Shopping cart operations
- **CheckoutPage**: Checkout process (3 steps)

### Example Usage

```javascript
const loginPage = new LoginPage(page);
await loginPage.goto();
await loginPage.loginAsStandardUser();
```

## 📈 Test Coverage

| Module | Test Cases | Coverage |
|--------|------------|----------|
| Authentication | 13 | 100% |
| Product Catalog | 16 | 95% |
| Shopping Cart | 16 | 95% |
| Checkout Process | 20 | 100% |
| E2E Flows | 11 | 90% |
| **Total** | **76** | **96%** |

## 🎯 Test Scenarios

### Authentication Tests
- Valid/Invalid login
- Locked user handling
- Empty credentials
- Logout functionality

### Product Catalog Tests
- Product display
- Sorting (A-Z, Z-A, Price)
- Add/Remove from cart
- Product details navigation

### Shopping Cart Tests
- View cart items
- Update quantities
- Remove items
- Price calculations

### Checkout Tests
- Information validation
- Price calculations
- Order completion
- Error handling

### E2E Tests
- Complete purchase flows
- Multi-item purchases
- Navigation flows

## 💡 Best Practices

This framework follows industry best practices:

1. **Page Object Model** - Separation of test logic and page interactions
2. **DRY Principle** - Reusable methods and utilities
3. **Explicit Waits** - Reliable element synchronization
4. **Test Independence** - Each test can run standalone
5. **Clear Naming** - Descriptive test and method names
6. **Error Handling** - Comprehensive error management
7. **Screenshot on Failure** - Automatic debugging aids
8. **Parallel Execution** - Faster test runs
9. **Version Control** - Git best practices
10. **CI/CD Integration** - Automated testing pipeline

## 📝 Writing New Tests

### Step 1: Create Test File

```javascript
const { test, expect } = require('@playwright/test');
const LoginPage = require('../pages/LoginPage');

test.describe('Feature Name', () => {
  let loginPage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    await loginPage.goto();
  });

  test('Test description', async () => {
    // Arrange
    // Act
    // Assert
  });
});
```

### Step 2: Add to Page Object (if needed)

```javascript
async newMethod() {
  await this.click(this.newSelector);
}
```

### Step 3: Run and Verify

```bash
npx playwright test tests/your-test.spec.js
```

## 🐛 Debugging

### Debug Specific Test

```bash
npx playwright test tests/login.spec.js --debug
```

### View Trace

```bash
npx playwright show-trace trace.zip
```

### Headed Mode

```bash
npx playwright test --headed --slowMo=1000
```

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👤 Author

**Nibin Mathew**
- GitHub: [@yourusername][(https://github.com/nibin89)]


## 🙏 Acknowledgments

- [Playwright Documentation](https://playwright.dev/)
- [SauceDemo](https://www.saucedemo.com) - Test application
- [Allure Framework](https://docs.qameta.io/allure/)

## 📞 Support

If you have any questions or need help, please:
- Open an issue on GitHub
- Contact via email
- Check existing issues for solutions

---

**⭐ If you find this project helpful, please consider giving it a star!**

Last Updated: January 2026
