import * as Sentry from "@sentry/nextjs";

Sentry.init({
  dsn: "https://fcf6672ae70512db08b1f34a2c602b36@o4510452930904069.ingest.de.sentry.io/4510452934836304",

  // Enable logging
  enableLogs: true,

  // Adjust this value in production, or use tracesSampler for greater control
  tracesSampleRate: process.env.NODE_ENV === "production" ? 0.1 : 1.0,

  // Setting this option to true will print useful information to the console while you're setting up Sentry.
  debug: false,

  replaysOnErrorSampleRate: 1.0,

  // This sets the sample rate to be 10%. You may want this to be 100% while
  // in development and sample at a lower rate in production
  replaysSessionSampleRate: process.env.NODE_ENV === "production" ? 0.1 : 0.1,

  // You can remove this option if you're not planning to use the Sentry Session Replay feature:
  integrations: [
    Sentry.replayIntegration({
      // Additional Replay configuration goes in here, for example:
      maskAllText: true,
      blockAllMedia: true,
    }),
    // Send console.log, console.warn, and console.error calls as logs to Sentry
    Sentry.consoleIntegration({ levels: ["log", "warn", "error"] }),
  ],

  // Environment
  environment: process.env.NODE_ENV || "development",

  // Add custom tags
  initialScope: {
    tags: {
      app: "lyxso-frontend",
    },
  },

  // Ignore certain errors
  ignoreErrors: [
    // Browser extensions
    "top.GLOBALS",
    "ResizeObserver loop limit exceeded",
    "Non-Error promise rejection captured",
  ],

  // Filter sensitive data
  beforeSend(event, hint) {
    // Remove sensitive query parameters
    if (event.request?.url) {
      try {
        const url = new URL(event.request.url);
        const sensitiveParams = ["token", "password", "api_key", "secret"];
        sensitiveParams.forEach(param => {
          if (url.searchParams.has(param)) {
            url.searchParams.set(param, "[Filtered]");
          }
        });
        event.request.url = url.toString();
      } catch (e) {
        // Invalid URL, skip filtering
      }
    }

    // Filter sensitive headers
    if (event.request?.headers) {
      const sensitiveHeaders = ["authorization", "cookie", "x-api-key"];
      sensitiveHeaders.forEach(header => {
        if (event.request && event.request.headers && event.request.headers[header]) {
          event.request.headers[header] = "[Filtered]";
        }
      });
    }

    return event;
  },
});
