import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/login.page';
import { EmployeePage } from '../pages/employee.page';
import { testUrls } from './test-data';

test.describe('Table Management', () => {
  let loginPage: LoginPage;
  let employeePage: EmployeePage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    employeePage = new EmployeePage(page);
    
    // Login before each test
    await loginPage.goto();
    await loginPage.waitForPageToLoad();
    await loginPage.login(process.env.USER_EMAIL as string, process.env.PASSWORD as string);
    await loginPage.waitForLoginToComplete();
    await page.goto(testUrls.employeeManagement);
    await employeePage.waitForPageToLoad();
  });

  test('Manage System ID column visibility through settings menu', async ({ page }) => {
    // Verify the employee page loaded correctly
    await employeePage.verifyEmployeePageElements();
    
    // Verify System ID column is initially visible
    const systemIdHeader = page.locator('th[data-slot="table-head"]:has-text("System ID")');
    await expect(systemIdHeader).toBeVisible();
    console.log('✓ System ID column is initially visible');
    
    // Find the settings button using a more reliable selector
    const settingsButton = page.locator('button[data-slot="dropdown-menu-trigger"]');
    await expect(settingsButton).toBeVisible({ timeout: 5000 });
    await settingsButton.click();
    console.log('✓ Clicked settings button');
    
    // Wait for settings menu to appear using proper Playwright wait conditions
    const settingsMenu = page.locator('[data-radix-popper-content-wrapper]').first();
    
    await expect(settingsMenu).toBeVisible({ timeout: 10000 });
    console.log('✓ Settings menu appeared');
    
    // Find and click System ID option using best practices
    const systemIdOption = settingsMenu.getByText('System ID', { exact: true });
    await expect(systemIdOption).toBeVisible({ timeout: 5000 });
    console.log('✓ Found System ID option');
    
    // Click to hide the column
    await systemIdOption.click();
    console.log('✓ Toggled System ID column off');
    
    // Wait for column to be hidden using proper assertion
    await expect(systemIdHeader).toBeHidden({ timeout: 5000 });
    console.log('✓ System ID column is now hidden');
    
    // Close the settings menu
    await page.keyboard.press('Escape');
    await expect(settingsMenu).toBeHidden({ timeout: 3000 });
    
    // Reopen settings menu to toggle column back on
    await settingsButton.click();
    await expect(settingsMenu).toBeVisible({ timeout: 5000 });
    console.log('✓ Settings menu reopened successfully');
    
    // Click System ID option again to show the column
    const systemIdOptionAgain = settingsMenu.getByText('System ID', { exact: true });
    await expect(systemIdOptionAgain).toBeVisible({ timeout: 5000 });
    await systemIdOptionAgain.click();
    console.log('✓ Toggled System ID column back on');
    
    // Close the menu and wait for column to reappear
    await page.keyboard.press('Escape');
    await expect(settingsMenu).toBeHidden({ timeout: 3000 });
    
    // Verify System ID column is visible again
    await expect(systemIdHeader).toBeVisible({ timeout: 5000 });
    console.log('✓ System ID column is visible again');
    
    // Verify table structure is intact
    const tableHeaders = await page.locator('th[data-slot="table-head"]').allTextContents();
    console.log(`Current table headers: ${tableHeaders.join(', ')}`);
    
    // Ensure we still have employee data in the table
    const rowCount = await page.locator('tbody tr[data-slot="table-row"]').count();
    expect(rowCount).toBeGreaterThan(0);
    console.log(`✓ Table contains ${rowCount} employee records`);
  });
});
