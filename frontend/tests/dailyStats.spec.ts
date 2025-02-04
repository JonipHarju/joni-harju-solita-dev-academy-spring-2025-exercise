import { test, expect } from "@playwright/test";

test.describe("Daily Stats Table UI Tests", () => {
  test.beforeEach(async ({ page }) => {
    // Go to the app's homepage before each test
    await page.goto("http://localhost:5173");
  });

  // test for the default view of the table on load
  test("should load and display data table", async ({ page }) => {
    await expect(page.locator("table")).toBeVisible();
    await expect(page.locator("tbody tr")).toHaveCount(10);
  });

  // use absurd value here to ensure our result wil lbe empty table
  test("should apply filters and update data", async ({ page }) => {
    await page.fill('input[placeholder="Min Production"]', "1000000000000"); // Extreme value to ensure no data matches
    await page.fill('input[placeholder="Max Production"]', "0"); // No valid data should match
    await page.click('button:has-text("Get Data")');

    await page.waitForTimeout(1000); // Ensure data updates

    // Check that results show "No data available" instead of just 0 rows
    await expect(page.locator("tbody tr")).toHaveCount(1); // Because of "No data available" row
    await expect(page.locator("tbody tr")).toContainText("No data available");
  });

  test("should sort data when clicking column headers", async ({ page }) => {
    const firstRowBefore = await page
      .locator("tbody tr:nth-child(1)")
      .innerText();
    await page.click('th:has-text("Total Production (MWh)")'); // Click to sort

    await page.waitForTimeout(1000); // Wait for sorting to apply

    const firstRowAfter = await page
      .locator("tbody tr:nth-child(1)")
      .innerText();

    // Ensure sorting actually changed the first row’s content
    expect(firstRowBefore).not.toEqual(firstRowAfter);
  });

  test("should open and close modal on row click", async ({ page }) => {
    await page.click("tbody tr:first-child button");
    await expect(page.locator("h2")).toContainText("Statistics for");

    // Close modal
    await page.click('button:has-text("✕")');
    await expect(page.locator("h2")).not.toBeVisible();
  });
  test("should navigate using pagination controls", async ({ page }) => {
    const nextButton = page.locator('button:has-text("Next")');
    const prevButton = page.locator('button:has-text("Previous")');

    await expect(nextButton).not.toBeDisabled();
    await nextButton.click();
    await expect(prevButton).not.toBeDisabled();
  });
});
