const { defineConfig, devices } = require('@playwright/test');

module.exports = defineConfig({
  testDir: './tests',
  outputDir: './test-results',
  timeout: 15000,
  use: {
    baseURL: 'http://localhost:3000',
    screenshot: 'on',
  },
  webServer: {
    command: 'npx serve -l 3000 --no-clipboard',
    port: 3000,
    reuseExistingServer: true,
  },
  projects: [
    {
      name: 'iPhone-14',
      use: { ...devices['iPhone 14'], browserName: 'chromium' },
    },
    {
      name: 'iPhone-SE',
      use: { ...devices['iPhone SE'], browserName: 'chromium' },
    },
    {
      name: 'Pixel-7',
      use: { ...devices['Pixel 7'] },
    },
  ],
});
