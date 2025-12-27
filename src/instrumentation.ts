'use server';

import * as Sentry from "@sentry/nextjs";

// Next.js App Router instrumentation entry point
// See: https://docs.sentry.io/platforms/javascript/guides/nextjs/manual-setup/#app-router-setup
export async function register() {
  Sentry.init({
    dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
    tracesSampleRate: 1.0,
    debug: false,
    // profilesSampleRate: 1.0,
  });
}
// Capture errors from Server Components, middleware, and proxies
export const onRequestError = Sentry.captureRequestError;