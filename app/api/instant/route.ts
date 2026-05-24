import { createInstantRouteHandler } from "@instantdb/react/nextjs";

const appId = process.env.NEXT_PUBLIC_INSTANT_APP_ID;

if (!appId) {
  throw new Error(
    "NEXT_PUBLIC_INSTANT_APP_ID is not set. Add it to .env and restart."
  );
}

export const { POST } = createInstantRouteHandler({
  appId,
});

