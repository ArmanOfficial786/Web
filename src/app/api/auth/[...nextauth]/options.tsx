import axios from "axios";
import type { AuthOptions, User } from "next-auth";
import Credentials from "next-auth/providers/credentials";

// Mock user data
const mockUser = {
  success: true,
  user: {
    username: "arman@gmail.com",
    password: "malik@123",
    name: "Arman Malik",
    email: "arman@gmail.com",
    officeName: "Kathmandu",
  },
  token: "vtfk]OuYi1VrcXXIvar]M:$uZ&K0&h",
  message: "Successfully Logged in",
};

const authApiUrl = process.env.NEXT_PUBLIC_AUTH_API_URL;
const useMockAuth = process.env.NEXT_PUBLIC_USE_MOCK_AUTH === "true";

export const authOptions: AuthOptions = {
  callbacks: {
    async signIn({ user }) {
      if (user === null) {
        throw new Error("Invalid Credentials");
      }
      return true;
    },
    async jwt({ token, user }) {
      if (user) {
        token.accessToken = user.token;
        token.user = {
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
        username: {
          label: "Username",
          type: "text",
          placeholder: "Enter your username",
        },
        password: {
          label: "Password",
          type: "password",
        },
        branchId: {
          label: "Branch",
          type: "text",
        },
      },
      async authorize(credentials: any) {
        try {
          console.log("Auth Mode:", useMockAuth ? "MOCK" : "REAL API");

          // MOCK AUTHENTICATION
          if (useMockAuth) {
            console.log("Using Mock Authentication");

            // Simulate network delay
            await new Promise((resolve) => setTimeout(resolve, 1000));

            // Check credentials against mock user
            if (
              credentials.username === mockUser.user.username &&
              credentials.password === mockUser.user.password
            ) {
              console.log("Mock login successful");

              return {
                id: mockUser.user.username,
                name: mockUser.user.name,
                email: mockUser.user.email,
                userName: mockUser.user.username,
                password: credentials.password,
                token: mockUser.token,
                success: mockUser.success,
                message: mockUser.message,
                officeName: mockUser.user.officeName,
              } as User;
            }

            console.log("Mock login failed - invalid credentials");
            return null;
          }

          // REAL API AUTHENTICATION
          else {
            console.log("Using Real API Authentication");

            const axiosRes = await axios.post(
              `${authApiUrl}/security/auth/login`,
              {
                username: credentials.username,
                password: credentials.password,
                branchId: credentials.branchId,
              },
            );

            console.log("API Response:", axiosRes.data);

            const res = axiosRes.data;

            if (res.success) {
              console.log("API login successful");

              return {
                id: res.user?.userName || res.user?.username,
                name: res.user?.name,
                email: res.user?.email,
                userName: res.user?.userName || res.user?.username,
                password: credentials.password,
                token: res.token,
                success: res.success,
                message: res.message,
                officeName: res.user?.officeName,
              } as User;
            }

            console.log("API login failed");
            return null;
          }
        } catch (err) {
          console.error("Authorization error:", err);

          // If using real API and it fails, optionally fallback to mock
          if (!useMockAuth) {
            console.error("Real API authentication failed");
          }

          return null;
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
    maxAge: 30 * 24 * 60 * 60, // 60 seconds * 60 minutes * 24 hours * 30 days
  },
  secret: process.env.NEXTAUTH_SECRET,
};
