import type { AuthOptions, User } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { Api } from "../../../../../types/api/api";
import type { LoginRequest } from "../../../../../types/api/api";

const authApiUrl =
  process.env.NEXT_PUBLIC_AUTH_API_URL ?? process.env.NEXT_PUBLIC_API_URL;
const authApi = new Api({ baseURL: authApiUrl });

export const authOptions: AuthOptions = {
  callbacks: {
    async signIn({ user }) {
      if (user === null) {
        throw new Error("Invalid Credentials");
      }
      return true;
    },
    async redirect({ url, baseUrl }) {
      if (url.startsWith("/")) {
        return `${baseUrl}${url}`;
      }
      if (new URL(url).origin === baseUrl) {
        return url;
      }
      return `${baseUrl}/dashboard`;
    },
    async jwt({ token, user }) {
      if (user) {
        token.accessToken = user.token;
        token.user = {
          id: user.id,
          name: user.name,
          userName: user.userName,
          email: user.email,
        };
      }
      return token;
    },
    async session({ session, token }) {
      session.accessToken = token.accessToken as string;
      session.user = token.user as User;
      return session;
    },
  },
  providers: [
    Credentials({
      name: "Welcome Back",
      type: "credentials",
      credentials: {
        email: {
          label: "Email",
          type: "email",
          placeholder: "Enter your email",
        },
        password: {
          label: "Password",
          type: "password",
        },
        companyId: {
          label: "Company ID",
          type: "number",
        },
      },
      async authorize(credentials) {
        try {
          if (
            !credentials?.email ||
            !credentials.password ||
            !credentials.companyId
          ) {
            return null;
          }

          const loginPayload: LoginRequest = {
            email: credentials.email.trim(),
            password: credentials.password,
            companyId: Number(credentials.companyId),
          };
          const response = await authApi.api.authLoginCreate(loginPayload, {
            secure: false,
          });
          const loginResponse = response.data;

          if (!loginResponse.token || !loginResponse.userId) {
            return null;
          }

          return {
            id: String(loginResponse.userId),
            name: loginResponse.fullName,
            email: loginResponse.email ?? loginPayload.email,
            userName: loginResponse.email ?? loginPayload.email,
            token: loginResponse.token,
            companyName: loginResponse.companyName,
          } as User;
        } catch (err: unknown) {
          const error = err as {
            response?: { data?: { message?: string; title?: string } };
            message?: string;
          };
          const message =
            error.response?.data?.message ??
            error.response?.data?.title ??
            error.message ??
            "Authentication request failed";

          console.error(
            "Authorization error:",
            error.response?.data ?? error.message ?? err,
          );
          throw new Error(message);
        }
      },
    }),
  ],
  pages: {
    signIn: "/login",
  },
  cookies: {
    sessionToken: {
      name: "office-next-auth.session-token",
      options: {
        sameSite: "lax",
        path: "/",
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
      },
    },
    callbackUrl: {
      name: "office-next-auth.callback-url",
      options: {
        sameSite: "lax",
        path: "/",
      },
    },
    csrfToken: {
      name: "office-next-auth.csrf-token",
      options: {
        sameSite: "lax",
        path: "/",
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
      },
    },
  },
  session: {
    strategy: "jwt",
    maxAge: 30 * 60, // 30 minutes
  },
  secret: process.env.NEXTAUTH_SECRET,
};
