import { defineConfig } from "cypress";

export default defineConfig({
  component: {
    devServer: {
      framework: "angular",
      bundler: "webpack",
    },
    specPattern: "**/*.cy.ts",
  },

  e2e: {
    baseUrl: 'http://localhost:4200', // Angular app running URL
    setupNodeEvents(on, config) {
      // Custom event listeners if needed
    },
    supportFile: 'cypress/support/e2e.ts', // Path to support file
    video: true, // Enable video recording
    screenshotsFolder: 'cypress/screenshots', // Save failed test screenshots
    //videoUploadOnPasses: false, // Only upload failed test videos
  },
});
