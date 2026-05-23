"use client";

import { db } from "@/lib/db";

export type Profile = {
  id: string;
  displayName?: string;
  isAdmin: boolean;
  isActive: boolean;
  createdAt: string;
};

export type UseProfileResult = {
  isLoading: boolean;
  profile: Profile | null;
  error: Error | null;
};

/**
 * Returns the current signed-in user's linked profile, or null if signed out
 * or the profile hasn't been bootstrapped yet. Safe to call from any client
 * component.
 */
export function useProfile(): UseProfileResult {
  const auth = db.useAuth();
  const userId = auth.user?.id;

  const { isLoading, error, data } = db.useQuery(
    userId
      ? {
          profiles: {
            $: {
              where: { "user.id": userId },
              limit: 1,
            },
          },
        }
      : null
  );

  return {
    isLoading: auth.isLoading || isLoading,
    profile: (data?.profiles?.[0] as Profile | undefined) ?? null,
    error: (auth.error ?? error) as Error | null,
  };
}
