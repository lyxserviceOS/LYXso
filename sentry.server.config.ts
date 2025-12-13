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
      app: "lyxso-server",
    },
  },

  // Integrations
  integrations: [
    // Send console.log, console.warn, and console.error calls as logs to Sentry
    Sentry.consoleIntegration({ levels: ["log", "warn", "error"] }),
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
      const headers = event.request.headers;
      const sensitiveHeaders = ["authorization", "cookie", "x-api-key"];
      sensitiveHeaders.forEach(header => {
        if (headers[header]) {
          headers[header] = "[Filtered]";
        }
      });
    }

    return event;
  },
});
