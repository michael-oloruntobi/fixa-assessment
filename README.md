# Playwright Test Suite for Employee Management

This repository contains Playwright end-to-end tests for the Employee Management features of the FixAHR web application.

## Project Structure

- `playwright.config.ts`  
  Main Playwright configuration file. Sets up test directory, browser projects, base URL, and environment variable loading.

- `tests/`  
  Contains all Playwright test files.
  - `filter_employee.spec.ts`  
    Tests for filtering employees by trade and validating the trade column.

- `pages/`  
  Page Object Model (POM) classes for encapsulating page interactions (e.g., `login.page.ts`, `employee.page.ts`).

- `.env`  
  Stores environment variables such as user credentials. **Do not commit real credentials to version control.**

## How to Run the Tests

1. **Install dependencies:**
   ```
   npm install
   ```

2. **Set up environment variables:**
   - Create a `.env` file in the root directory with the following sample content:
     ```
     USER_EMAIL=your-email@example.com
     PASSWORD=your-password
     ```
   - Replace with valid credentials for the staging environment.

3. **Run the tests:**
   ```
   npx playwright test
   ```

4. **View the HTML report:**
   ```
   npx playwright show-report
   ```

## Notes

- The tests are configured to run against the staging environment at `https://app.staging.fixahr.com`.
- You will need valid credentials to run the tests. Please contact the maintainer for sample details if you do not have access.
- The test suite uses Playwright's Page Object Model for maintainability and clarity.

## Contact

For access to sample credentials or further assistance, please reach out to the project maintainer.
