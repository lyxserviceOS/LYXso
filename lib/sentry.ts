// lib/sentry.ts - Sentry utilities and helpers
import * as Sentry from "@sentry/nextjs";

/**
 * Capture an exception with additional context
 */
export function captureException(
  error: Error,
  context?: {
    tags?: Record<string, string>;
    extra?: Record<string, any>;
    user?: {
      id?: string;
      email?: string;
      orgId?: string;
    };
  }
) {
  Sentry.withScope((scope) => {
    if (context?.tags) {
      Object.entries(context.tags).forEach(([key, value]) => {
        scope.setTag(key, value);
      });
    }

    if (context?.extra) {
      Object.entries(context.extra).forEach(([key, value]) => {
        scope.setExtra(key, value);
      });
    }

    if (context?.user) {
      scope.setUser(context.user);
    }

    Sentry.captureException(error);
  });
}

/**
 * Capture a message with level and context
 */
export function captureMessage(
  message: string,
  level: "info" | "warning" | "error" = "info",
  context?: {
    tags?: Record<string, string>;
    extra?: Record<string, any>;
  }
) {
  Sentry.withScope((scope) => {
    if (context?.tags) {
      Object.entries(context.tags).forEach(([key, value]) => {
        scope.setTag(key, value);
      });
    }

    if (context?.extra) {
      Object.entries(context.extra).forEach(([key, value]) => {
        scope.setExtra(key, value);
      });
    }

    Sentry.captureMessage(message, level);
  });
}

/**
 * Set user context for all future events
 */
export function setUser(user: {
  id?: string;
  email?: string;
  username?: string;
  orgId?: string;
  orgName?: string;
}) {
  Sentry.setUser(user);
}

/**
 * Clear user context
 */
export function clearUser() {
  Sentry.setUser(null);
}

/**
 * Add breadcrumb for tracking user actions
 */
export function addBreadcrumb(
  message: string,
  category?: string,
  data?: Record<string, any>
) {
  Sentry.addBreadcrumb({
    message,
    category: category || "custom",
    level: "info",
    data,
    timestamp: Date.now() / 1000,
  });
}

/**
 * Track performance
 */
export function startTransaction(
  name: string,
  op: string
): any {
  // Sentry v8 uses startSpan instead of startTransaction
  if ('startSpan' in Sentry) {
    return (Sentry as any).startSpan({ name, op }, (span: any) => span);
  }
  // Fallback for older Sentry versions
  if ('startTransaction' in Sentry) {
    return (Sentry as any).startTransaction({ name, op });
  }
  return null;
}

/**
 * Wrap async function with error handling
 */
export function withErrorHandling<T extends (...args: any[]) => Promise<any>>(
  fn: T,
  context?: {
    tags?: Record<string, string>;
    functionName?: string;
  }
): T {
  return (async (...args: any[]) => {
    try {
      return await fn(...args);
    } catch (error) {
      captureException(error as Error, {
        tags: {
          ...context?.tags,
          function: context?.functionName || fn.name,
        },
        extra: {
          arguments: args,
        },
      });
      throw error;
    }
  }) as T;
}
