"use client";

import { useEffect } from "react";
import { db } from "@/lib/db";

/**
 * Invisible component. When mounted with an authenticated session that has
 * no profile yet, it creates the profile. Lives in the locale layout so it
 * always runs after the auth state is confirmed via db.useAuth().
 */
export function ProfileBootstrap() {
  const auth = db.useAuth();
  const { data } = db.useQuery(
    auth.user
      ? { profiles: { $: { where: { "user.id": auth.user.id }, limit: 1 } } }
      : null
  );

  useEffect(() => {
    if (!auth.user) return;
    if (!data) return;
    if (data.profiles.length > 0) return;

    db.transact(
      db.tx.profiles[auth.user.id]
        .update({ isActive: true, createdAt: new Date().toISOString() })
        .link({ user: auth.user.id })
    ).catch(() => {
      // silently retry on next render if it fails
    });
  }, [auth.user, data]);

  return null;
}
