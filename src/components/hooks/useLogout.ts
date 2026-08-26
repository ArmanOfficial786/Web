// src/hooks/useLogout.ts
"use client";

import { useCallback, useState } from "react";
import { getSession, signOut } from "next-auth/react";
import authService from "@/services/Common/AuthService";

/**
 * Fixes "CredentialsSignin" on re-login after logout.
 *
 * signOut() only clears the NextAuth session cookie on the client — it
 * never tells the backend the token is no longer in use. If the backend
 * enforces a single active session per user/company, the old token stays
 * "active" server-side and the next authorize() call gets rejected.
 *
 * This hook calls the backend /api/Auth/logout endpoint with the current
 * bearer token first, then clears the client-side NextAuth session.
 */
export function useLogout() {
  const [loggingOut, setLoggingOut] = useState(false);

  const logout = useCallback(async (callbackUrl: string = "/") => {
    setLoggingOut(true);
    try {
      const session = await getSession();
      const accessToken = session?.accessToken;

      if (accessToken) {
        try {
          await authService.api.authLogoutCreate({
            headers: { Authorization: `Bearer ${accessToken}` },
          });
        } catch (err) {
          // Non-fatal: proceed to clear the client session even if the
          // backend call fails (e.g. token already expired/invalidated).
          console.error("Backend logout failed:", err);
        }
      }
    } finally {
      setLoggingOut(false);
      await signOut({ callbackUrl });
    }
  }, []);

  return { logout, loggingOut };
}
