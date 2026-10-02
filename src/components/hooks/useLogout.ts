"use client";

import { useCallback, useState } from "react";
import { getSession, signOut } from "next-auth/react";
import authService from "@/services/Common/AuthService";

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
