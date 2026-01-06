/*
Key Helper Functions:

Random Data Generation: Random strings, emails, numbers
Date/Time Utils: Timestamps, date formatting
Price/Currency: Format and parse prices
Screenshot & HTML: Save screenshots and HTML content
File Operations: Read/write JSON, CSV conversion
Retry Logic: Exponential backoff for flaky operations
Array/Object Utils: Sort, group, filter, deep clone
Validation: Email validation, equality checks
Test Reporting: Test summary, duration formatting
Logging: Timestamped logging
*/
/**
 * Helper Utilities
 * Common helper functions for test automation
 */

const fs = require('fs');
const path = require('path');

class Helpers {
  /**
   * Generate random string
   * @param {number} length - Length of string
   * @returns {string}
   */
  static generateRandomString(length = 10) {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < length; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  }

  /**
   * Generate random email
   * @returns {string}
   */
  static generateRandomEmail() {
    const randomStr = this.generateRandomString(8);
    return `test_${randomStr}@test.com`;
  }

  /**
   * Generate random number within range
   * @param {number} min - Minimum value
   * @param {number} max - Maximum value
   * @returns {number}
   */
  static generateRandomNumber(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  /**
   * Wait for specified time
   * @param {number} ms - Milliseconds to wait
   * @returns {Promise}
   */
  static async wait(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  /**
   * Get current timestamp
   * @returns {string}
   */
  static getTimestamp() {
    return new Date().toISOString().replace(/[:.]/g, '-');
  }

  /**
   * Format date to YYYY-MM-DD
   * @param {Date} date - Date object
   * @returns {string}
   */
  static formatDate(date = new Date()) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  /**
   * Format currency
   * @param {number} amount - Amount to format
   * @returns {string}
   */
  static formatCurrency(amount) {
    return `$${amount.toFixed(2)}`;
  }

  /**
   * Parse price string to number
   * @param {string} priceStr - Price string like "$29.99"
   * @returns {number}
   */
  static parsePrice(priceStr) {
    return parseFloat(priceStr.replace('$', '').replace(',', ''));
  }

  /**
   * Calculate percentage
   * @param {number} value - Current value
   * @param {number} total - Total value
   * @returns {number}
   */
  static calculatePercentage(value, total) {
    return ((value / total) * 100).toFixed(2);
  }

  /**
   * Take screenshot
   * @param {Page} page - Playwright page object
   * @param {string} name - Screenshot name
   */
  static async takeScreenshot(page, name) {
    const screenshotDir = path.join(process.cwd(), 'screenshots');
    if (!fs.existsSync(screenshotDir)) {
      fs.mkdirSync(screenshotDir, { recursive: true });
    }
    
    const filename = `${name}_${this.getTimestamp()}.png`;
    const filepath = path.join(screenshotDir, filename);
    await page.screenshot({ path: filepath, fullPage: true });
    console.log(`Screenshot saved: ${filepath}`);
    return filepath;
  }

  /**
   * Save HTML content
   * @param {Page} page - Playwright page object
   * @param {string} name - File name
   */
  static async saveHTML(page, name) {
    const htmlDir = path.join(process.cwd(), 'test-results', 'html');
    if (!fs.existsSync(htmlDir)) {
      fs.mkdirSync(htmlDir, { recursive: true });
    }
    
    const filename = `${name}_${this.getTimestamp()}.html`;
    const filepath = path.join(htmlDir, filename);
    const html = await page.content();
    fs.writeFileSync(filepath, html);
    console.log(`HTML saved: ${filepath}`);
    return filepath;
  }

  /**
   * Read JSON file
   * @param {string} filepath - Path to JSON file
   * @returns {Object}
   */
  static readJSON(filepath) {
    const fullPath = path.join(process.cwd(), filepath);
    const data = fs.readFileSync(fullPath, 'utf8');
    return JSON.parse(data);
  }

  /**
   * Write JSON file
   * @param {string} filepath - Path to JSON file
   * @param {Object} data - Data to write
   */
  static writeJSON(filepath, data) {
    const fullPath = path.join(process.cwd(), filepath);
    const dir = path.dirname(fullPath);
    
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    
    fs.writeFileSync(fullPath, JSON.stringify(data, null, 2));
    console.log(`JSON saved: ${fullPath}`);
  }

  /**
   * Convert array to CSV string
   * @param {Array} data - Array of objects
   * @returns {string}
   */
  static arrayToCSV(data) {
    if (!data || data.length === 0) return '';
    
    const headers = Object.keys(data[0]);
    const rows = data.map(obj => 
      headers.map(header => 
        JSON.stringify(obj[header] || '')
      ).join(',')
    );
    
    return [headers.join(','), ...rows].join('\n');
  }

  /**
   * Retry function with exponential backoff
   * @param {Function} fn - Function to retry
   * @param {number} maxRetries - Maximum retry attempts
   * @param {number} delay - Initial delay in ms
   * @returns {Promise}
   */
  static async retryWithBackoff(fn, maxRetries = 3, delay = 1000) {
    for (let i = 0; i < maxRetries; i++) {
      try {
        return await fn();
      } catch (error) {
        if (i === maxRetries - 1) throw error;
        const waitTime = delay * Math.pow(2, i);
        console.log(`Retry ${i + 1}/${maxRetries} after ${waitTime}ms...`);
        await this.wait(waitTime);
      }
    }
  }

  /**
   * Get environment variable with fallback
   * @param {string} key - Environment variable key
   * @param {string} defaultValue - Default value if not found
   * @returns {string}
   */
  static getEnv(key, defaultValue = '') {
    return process.env[key] || defaultValue;
  }

  /**
   * Deep clone object
   * @param {Object} obj - Object to clone
   * @returns {Object}
   */
  static deepClone(obj) {
    return JSON.parse(JSON.stringify(obj));
  }

  /**
   * Remove duplicates from array
   * @param {Array} arr - Input array
   * @returns {Array}
   */
  static removeDuplicates(arr) {
    return [...new Set(arr)];
  }

  /**
   * Sort array of objects by key
   * @param {Array} arr - Array of objects
   * @param {string} key - Key to sort by
   * @param {string} order - 'asc' or 'desc'
   * @returns {Array}
   */
  static sortByKey(arr, key, order = 'asc') {
    return arr.sort((a, b) => {
      if (order === 'asc') {
        return a[key] > b[key] ? 1 : -1;
      } else {
        return a[key] < b[key] ? 1 : -1;
      }
    });
  }

  /**
   * Group array of objects by key
   * @param {Array} arr - Array of objects
   * @param {string} key - Key to group by
   * @returns {Object}
   */
  static groupBy(arr, key) {
    return arr.reduce((result, item) => {
      const group = item[key];
      if (!result[group]) {
        result[group] = [];
      }
      result[group].push(item);
      return result;
    }, {});
  }

  /**
   * Calculate sum of array values
   * @param {Array} arr - Array of numbers
   * @returns {number}
   */
  static sum(arr) {
    return arr.reduce((total, num) => total + num, 0);
  }

  /**
   * Calculate average of array values
   * @param {Array} arr - Array of numbers
   * @returns {number}
   */
  static average(arr) {
    return arr.length > 0 ? this.sum(arr) / arr.length : 0;
  }

  /**
   * Validate email format
   * @param {string} email - Email to validate
   * @returns {boolean}
   */
  static isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  /**
   * Sanitize string for filename
   * @param {string} str - String to sanitize
   * @returns {string}
   */
  static sanitizeFilename(str) {
    return str.replace(/[^a-z0-9]/gi, '_').toLowerCase();
  }

  /**
   * Log with timestamp
   * @param {string} message - Message to log
   * @param {string} level - Log level (info, warn, error)
   */
  static log(message, level = 'info') {
    const timestamp = new Date().toISOString();
    const prefix = `[${timestamp}] [${level.toUpperCase()}]`;
    console.log(`${prefix} ${message}`);
  }

  /**
   * Compare two objects for equality
   * @param {Object} obj1 - First object
   * @param {Object} obj2 - Second object
   * @returns {boolean}
   */
  static isEqual(obj1, obj2) {
    return JSON.stringify(obj1) === JSON.stringify(obj2);
  }

  /**
   * Get difference between two arrays
   * @param {Array} arr1 - First array
   * @param {Array} arr2 - Second array
   * @returns {Array}
   */
  static arrayDifference(arr1, arr2) {
    return arr1.filter(item => !arr2.includes(item));
  }

  /**
   * Truncate string with ellipsis
   * @param {string} str - String to truncate
   * @param {number} maxLength - Maximum length
   * @returns {string}
   */
  static truncate(str, maxLength = 50) {
    if (str.length <= maxLength) return str;
    return str.substring(0, maxLength - 3) + '...';
  }

  /**
   * Create directory if not exists
   * @param {string} dirPath - Directory path
   */
  static ensureDirectory(dirPath) {
    if (!fs.existsSync(dirPath)) {
      fs.mkdirSync(dirPath, { recursive: true });
    }
  }

  /**
   * Get test execution summary
   * @param {Object} results - Test results object
   * @returns {Object}
   */
  static getTestSummary(results) {
    const total = results.passed + results.failed + results.skipped;
    const passRate = ((results.passed / total) * 100).toFixed(2);
    
    return {
      total,
      passed: results.passed,
      failed: results.failed,
      skipped: results.skipped,
      passRate: `${passRate}%`,
      duration: results.duration
    };
  }

  /**
   * Format test duration
   * @param {number} ms - Duration in milliseconds
   * @returns {string}
   */
  static formatDuration(ms) {
    const seconds = Math.floor(ms / 1000);
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    
    if (minutes > 0) {
      return `${minutes}m ${remainingSeconds}s`;
    }
    return `${seconds}s`;
  }
}

module.exports = Helpers;