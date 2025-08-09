import { Page, Locator, expect } from '@playwright/test';

export class EmployeePage {
  readonly page: Page;
  readonly employeesHeading: Locator;
  readonly employeeCount: Locator;
  readonly tradeFilterButton: Locator;
  readonly employeeTypeFilterButton: Locator;
  readonly statusFilterButton: Locator;
  readonly searchButton: Locator;
  readonly settingsButton: Locator;
  readonly addEmployeeButton: Locator;
  readonly employeeTable: Locator;
  readonly tableHeaders: Locator;
  readonly tableRows: Locator;
  readonly tradeColumn: Locator;
  readonly paginationInfo: Locator;
  readonly nextPageButton: Locator;
  readonly previousPageButton: Locator;
  
  // Settings menu elements
  readonly settingsMenuButton: Locator;
  readonly settingsMenu: Locator;
  readonly systemIdColumnOption: Locator;
  readonly systemIdColumnHeader: Locator;
  readonly systemIdColumnCells: Locator;

  constructor(page: Page) {
    this.page = page;
    
    // Header elements
    this.employeesHeading = page.locator('h1:has-text("Employees")');
    this.employeeCount = page.locator('p.text-purple-500');
    this.settingsButton = page.locator('button:has-text("Settings")');
    
    // Filter buttons
    this.tradeFilterButton = page.locator('button[data-slot="popover-trigger"]:has-text("Trade")');
    this.employeeTypeFilterButton = page.locator('button[data-slot="popover-trigger"]:has-text("Employee Type")');
    this.statusFilterButton = page.locator('button[data-slot="popover-trigger"]:has-text("Status")');
    
    // Action buttons
    this.searchButton = page.locator('button:has(iconify-icon[icon*="search"])');
    this.addEmployeeButton = page.locator('button:has-text("Add Employee")');
    
    // Table elements
    this.employeeTable = page.locator('table[data-slot="table"]');
    this.tableHeaders = page.locator('thead th[data-slot="table-head"]');
    this.tableRows = page.locator('tbody tr[data-slot="table-row"]');
    this.tradeColumn = page.locator('tbody td[data-slot="table-cell"]:nth-child(6)');
    
    // Pagination elements
    this.paginationInfo = page.locator('nav[role="navigation"][aria-label="pagination"]');
    this.nextPageButton = page.locator('a:has-text("Next")');
    this.previousPageButton = page.locator('a:has-text("Previous")');
    
    // Settings menu elements - the settings button with dropdown menu trigger
    this.settingsMenuButton = page.locator('button[data-slot="dropdown-menu-trigger"]').first();
    this.settingsMenu = page.locator('[data-slot="dropdown-menu-content"], [role="menu"]');
    this.systemIdColumnOption = page.locator('[role="menuitem"]:has-text("System ID"), [data-value="system_id"], button:has-text("System ID")');
    this.systemIdColumnHeader = page.locator('th[data-slot="table-head"]:has-text("System ID")');
    this.systemIdColumnCells = page.locator('tbody td[data-slot="table-cell"]:nth-child(2)');
  }

  async waitForPageToLoad() {
    await expect(this.employeesHeading).toBeVisible();
    await expect(this.employeeTable).toBeVisible();
    await expect(this.tradeFilterButton).toBeVisible();
  }

  async clickTradeFilter() {
    await this.tradeFilterButton.click();
  }

  async selectTradeOption(tradeName: string) {
    // Wait for the popover to appear
    await this.page.waitForSelector('[role="dialog"], [data-state="open"]', { timeout: 5000 });
    
    // Click on the specific trade option
    const tradeOption = this.page.locator(`[role="option"]:has-text("${tradeName}"), button:has-text("${tradeName}"), [data-value="${tradeName}"]`);
    await tradeOption.first().click();
  }

  async filterByTrade(tradeName: string) {
    await this.clickTradeFilter();
    await this.selectTradeOption(tradeName);
    
    // Wait for the filter to be applied (table should reload)
    await this.page.waitForTimeout(1000); // Give time for filtering
    await expect(this.employeeTable).toBeVisible();
  }

  async getAllTradeColumnValues(): Promise<string[]> {
    await this.tradeColumn.first().waitFor({ state: 'visible' });
    const tradeElements = await this.tradeColumn.all();
    const trades: string[] = [];
    
    for (const element of tradeElements) {
      const tradeText = await element.textContent();
      if (tradeText) {
        trades.push(tradeText.trim());
      }
    }
    
    return trades;
  }

  async validateTradeColumnContains(expectedTrade: string) {
    const trades = await this.getAllTradeColumnValues();
    
    // Check if any of the trades contain the expected trade (case-insensitive)
    const hasExpectedTrade = trades.some(trade => 
      trade.toLowerCase().includes(expectedTrade.toLowerCase())
    );
    
    expect(hasExpectedTrade, 
      `Expected to find "${expectedTrade}" in trade column. Found trades: ${trades.join(', ')}`
    ).toBeTruthy();
    
    return trades;
  }

  async getEmployeeCount(): Promise<number> {
    const countText = await this.employeeCount.textContent();
    return parseInt(countText?.trim() || '0', 10);
  }

  async getTableRowCount(): Promise<number> {
    return await this.tableRows.count();
  }

  async verifyEmployeePageElements() {
    await expect(this.employeesHeading).toBeVisible();
    await expect(this.employeeCount).toBeVisible();
    await expect(this.tradeFilterButton).toBeVisible();
    await expect(this.employeeTypeFilterButton).toBeVisible();
    await expect(this.statusFilterButton).toBeVisible();
    await expect(this.addEmployeeButton).toBeVisible();
    await expect(this.employeeTable).toBeVisible();
  }

  async waitForFilterToApply() {
    // Wait for any loading states to complete
    await this.page.waitForTimeout(2000);
    await expect(this.employeeTable).toBeVisible();
  }

  async getEmployeeDetails(rowIndex: number = 0) {
    const row = this.tableRows.nth(rowIndex);
    await expect(row).toBeVisible();
    
    const name = await row.locator('td:nth-child(1)').textContent();
    const systemId = await row.locator('td:nth-child(2)').textContent();
    const employeeId = await row.locator('td:nth-child(3)').textContent();
    const employeeType = await row.locator('td:nth-child(4)').textContent();
    const phoneNumber = await row.locator('td:nth-child(5)').textContent();
    const trade = await row.locator('td:nth-child(6)').textContent();
    const status = await row.locator('td:nth-child(7)').textContent();
    
    return {
      name: name?.trim() || '',
      systemId: systemId?.trim() || '',
      employeeId: employeeId?.trim() || '',
      employeeType: employeeType?.trim() || '',
      phoneNumber: phoneNumber?.trim() || '',
      trade: trade?.trim() || '',
      status: status?.trim() || ''
    };
  }

  // Settings menu methods using best practices
  async clickSettingsButton() {
    await expect(this.settingsMenuButton).toBeVisible({ timeout: 5000 });
    await this.settingsMenuButton.click();
  }

  async waitForSettingsMenu() {
    await expect(this.settingsMenu).toBeVisible({ timeout: 10000 });
  }

  async toggleSystemIdColumn() {
    // Use getByText with exact match for reliable element selection
    const systemIdOption = this.settingsMenu.getByText('System ID', { exact: true });
    await expect(systemIdOption).toBeVisible({ timeout: 5000 });
    await systemIdOption.click();
  }

  async closeSettingsMenu() {
    // Use keyboard escape for reliable menu closing
    await this.page.keyboard.press('Escape');
    await expect(this.settingsMenu).toBeHidden({ timeout: 3000 });
  }

  async verifySystemIdColumnVisible() {
    await expect(this.systemIdColumnHeader).toBeVisible({ timeout: 5000 });
  }

  async verifySystemIdColumnHidden() {
    await expect(this.systemIdColumnHeader).toBeHidden({ timeout: 5000 });
  }

  async getSettingsMenuOptions(): Promise<string[]> {
    await this.waitForSettingsMenu();
    
    // Get all text content from the settings menu and extract column names
    const menuText = await this.settingsMenu.textContent();
    if (!menuText) return [];
    
    // Extract column names from the menu text
    const columnNames = ['Name', 'System ID', 'Employee ID', 'Employee Type', 'Phone Number', 'Trade', 'Status'];
    const foundOptions = columnNames.filter(column => menuText.includes(column));
    
    return foundOptions;
  }

  async getTableHeaders(): Promise<string[]> {
    const headers = await this.tableHeaders.all();
    const headerTexts: string[] = [];
    
    for (const header of headers) {
      const text = await header.textContent();
      if (text) {
        headerTexts.push(text.trim());
      }
    }
    
    return headerTexts;
  }
}
