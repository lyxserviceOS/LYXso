// instrumentation.ts - Next.js Instrumentation for Sentry
export async function register() {
  if (process.env.NEXT_RUNTIME === "nodejs") {
    await import("./sentry.server.config");
  }

  if (process.env.NEXT_RUNTIME === "edge") {
    await import("./sentry.edge.config");
  }
}

export const onRequestError = async (
  err: Error,
  request: {
    path: string;
    method: string;
    headers: Headers;
  }
) => {
  // Custom error handling
  console.error("Next.js Request Error:", {
    path: request.path,
    method: request.method,
    error: err.message,
  });
};
