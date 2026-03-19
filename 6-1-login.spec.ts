import { test, expect } from '@playwright/test';

const BASE_URL = 'https://raider-test-site.onrender.com/index.php?rt=account/login';

test.describe('Login Test Suite', () => {

  test.beforeEach(async ({ page }) => {
    await page.goto(BASE_URL);
  });

  test('Should login successfully with valid credentials', async ({ page }) => {
    await page.fill('#loginFrm_loginname', '12341234');
    await page.fill('#loginFrm_password', '12341234');
    await page.click('button[title="Login"]');

    // Verify redirect after successful login
    await expect(page).toHaveURL(/account/);
  });

  test('Should show error for invalid password', async ({ page }) => {
    await page.fill('#loginFrm_loginname', '12341234');
    await page.fill('#loginFrm_password', '8888');
    await page.click('button[title="Login"]');

    const error = page.locator('.alert-error, .alert-danger');

    // Check error is visible
    await expect(error).toBeVisible();

    // Check error text (flexible match)
    await expect(error).toContainText(/incorrect|invalid|error/i);
  });

  test('Should not login with empty username', async ({ page }) => {
    await page.fill('#loginFrm_loginname', '');
    await page.fill('#loginFrm_password', '12341234');
    await page.click('button[title="Login"]');

    const usernameField = page.locator('#loginFrm_loginname');

    // Validate browser-side validation
    const isInvalid = await usernameField.evaluate(
      (el: HTMLInputElement) => !el.checkValidity()
    );

    expect(isInvalid).toBeTruthy();
  });

  test('Should not login with empty password', async ({ page }) => {
    await page.fill('#loginFrm_loginname', '12341234');
    await page.fill('#loginFrm_password', '');
    await page.click('button[title="Login"]');

    const passwordField = page.locator('#loginFrm_password');

    // Validate browser-side validation
    const isInvalid = await passwordField.evaluate(
      (el: HTMLInputElement) => !el.checkValidity()
    );

    expect(isInvalid).toBeTruthy();
  });

});
