// This file configures the initialization of Sentry on the server.
// The config you add here will be used whenever the server handles a request.
// https://docs.sentry.io/platforms/javascript/guides/nextjs/

import * as Sentry from "@sentry/nextjs";

Sentry.init({
  dsn: "https://12faf1934176f8a5bff98c3697f07397@o4512266897784832.ingest.de.sentry.io/4512266903355472",

  // Define how likely traces are sampled. Adjust this value in production, or use tracesSampler for greater control.
  tracesSampleRate: 1,

  // This app stores sensitive member data (RUT, blood type, allergies, medications,
  // medical conditions, emergency contacts) in request bodies across several routes —
  // disable default PII/body collection so an error report never leaks it to Sentry.
  // https://docs.sentry.io/platforms/javascript/guides/nextjs/configuration/options/#dataCollection
  dataCollection: {
    userInfo: false,
    httpBodies: [],
  },
});
