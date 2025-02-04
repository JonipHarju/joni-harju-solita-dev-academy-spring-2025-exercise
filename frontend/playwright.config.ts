import { defineConfig, devices } from "@playwright/test";

// Tests are intentionally run sequentially in a single browser for this assignments sake
// The goal of this setup is to visibly demonstrate that the tests execute correctly in the browser,
// rather than optimizing for speed with parallel execution.

export default defineConfig({
  testDir: "./tests", // Store test files in the 'tests' folder
  fullyParallel: false, // Run tests in parallel
  reporter: "html", // Generates an HTML test report

  use: {
    headless: false, // Runs in visible mode (change to true  for non headless mode)
    trace: "on-first-retry", // Captures debugging info only if a test fails
    launchOptions: {
      slowMo: 1000, // Slow down each action by 1 second
    },
  },

  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] }, // Run tests only in Chrome
    },
  ],
});
