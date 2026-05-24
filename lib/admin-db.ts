import { init } from "@instantdb/admin";

import schema from "@/instant.schema";

const appId = process.env.NEXT_PUBLIC_INSTANT_APP_ID;
const adminToken = process.env.INSTANT_APP_ADMIN_TOKEN;

if (!appId) {
  throw new Error(
    "NEXT_PUBLIC_INSTANT_APP_ID is not set. Add it to .env and restart."
  );
}

if (!adminToken) {
  throw new Error(
    "INSTANT_APP_ADMIN_TOKEN is not set. Add it to .env for server billing flows."
  );
}

export const adminDb = init({
  appId,
  adminToken,
  schema,
});

