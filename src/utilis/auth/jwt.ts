// utilis/auth/jwt.ts
export interface AuthClaims {
  userId?: string;
  officeIds?: string; // comma-separated, e.g. "2" or "2,5"
}

// ⚠️ Change this if your token is stored somewhere else.
export function getAuthToken(): string | null {
  if (typeof window === "undefined") return null;
  return window.localStorage.getItem("token");
}

function decodeJwtPayload(token: string): Record<string, unknown> | null {
  try {
    const part = token.split(".")[1];
    if (!part) return null;
    const base64 = part.replace(/-/g, "+").replace(/_/g, "/");
    const padded = base64.padEnd(
      base64.length + ((4 - (base64.length % 4)) % 4),
      "=",
    );
    const json = decodeURIComponent(
      atob(padded)
        .split("")
        .map((c) => "%" + c.charCodeAt(0).toString(16).padStart(2, "0"))
        .join(""),
    );
    return JSON.parse(json);
  } catch {
    return null;
  }
}

const pick = (
  claims: Record<string, unknown>,
  keys: string[],
): string | undefined => {
  for (const k of keys) {
    const v = claims[k];
    if (v !== undefined && v !== null && String(v) !== "") {
      return Array.isArray(v) ? v.join(",") : String(v);
    }
  }
  return undefined;
};

export function getAuthClaims(): AuthClaims {
  const token = getAuthToken();
  if (!token) return {};
  const claims = decodeJwtPayload(token);
  if (!claims) return {};
  return {
    userId: pick(claims, [
      "userId",
      "UserId",
      "nameid",
      "sub",
      "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier",
    ]),
    officeIds: pick(claims, ["officeIds", "OfficeIds", "officeId", "OfficeId"]),
  };
}
