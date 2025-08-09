import { Page, Locator, expect } from '@playwright/test';

export class LoginPage {
  readonly page: Page;
  readonly emailInput: Locator;
  readonly passwordInput: Locator;
  readonly loginButton: Locator;
  readonly forgotPasswordLink: Locator;
  readonly passwordToggleButton: Locator;
  readonly fixaLogo: Locator;
  readonly welcomeHeading: Locator;

  constructor(page: Page) {
    this.page = page;
    
    this.emailInput = page.locator('input[name="email"]');
    this.passwordInput = page.locator('input[name="password"]');
    this.loginButton = page.locator('button[type="submit"]:has-text("Login to Fixa")');
    this.forgotPasswordLink = page.locator('a[href="/forgot-password"]:has-text("Forgot password?")');
    this.passwordToggleButton = page.locator('button:has(iconify-icon)').last();
    this.fixaLogo = page.locator('text=Fixa logo').or(page.locator('[alt*="Fixa"]')).first();
    this.welcomeHeading = page.locator('text=Welcome to Fixa!');
  }

  async goto() {
    await this.page.goto('/login');
  }

  async login(email: string, password: string) {
    await this.emailInput.fill(email);
    await this.passwordInput.fill(password);
    await this.loginButton.click();
  }

  async waitForPageToLoad() {
    await expect(this.welcomeHeading).toBeVisible();
    await expect(this.emailInput).toBeVisible();
    await expect(this.passwordInput).toBeVisible();
    await expect(this.loginButton).toBeVisible();
  }

  async verifyLoginPageElements() {
    await expect(this.emailInput).toBeVisible();
    await expect(this.passwordInput).toBeVisible();
    await expect(this.loginButton).toBeVisible();
    await expect(this.forgotPasswordLink).toBeVisible();
    await expect(this.welcomeHeading).toBeVisible();
    
    await expect(this.emailInput).toHaveAttribute('placeholder', 'Johndoe@mycompanyemail.com');
    await expect(this.passwordInput).toHaveAttribute('placeholder', '*********');
    
    await expect(this.passwordInput).toHaveAttribute('type', 'password');
  }

  async togglePasswordVisibility() {
    await this.passwordToggleButton.click();
  }

  async clickForgotPassword() {
    await this.forgotPasswordLink.click();
  }

  async waitForLoginToComplete() {
    await this.page.waitForURL(/^(?!.*\/login).*$/, { timeout: 10000 });
  }

  async verifyLoginError() {
    const errorElement = this.page.locator('[data-error="true"], .error, [class*="error"]').first();
    return await errorElement.isVisible({ timeout: 3000 }).catch(() => false);
  }
}
