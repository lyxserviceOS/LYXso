import * as Sentry from "@sentry/nextjs";

Sentry.init({
  dsn: "https://fcf6672ae70512db08b1f34a2c602b36@o4510452930904069.ingest.de.sentry.io/4510452934836304",

  // Enable logging
  enableLogs: true,

  // Adjust this value in production, or use tracesSampler for greater control
  tracesSampleRate: process.env.NODE_ENV === "production" ? 0.1 : 1.0,

  // Setting this option to true will print useful information to the console while you're setting up Sentry.
  debug: false,

  // Environment
  environment: process.env.NODE_ENV || "development",

  // Add custom tags
  initialScope: {
    tags: {
      app: "lyxso-edge",
    },
  },
});
