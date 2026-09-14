import React from "react";

import "next-auth";

declare global {
  namespace JSX {
    interface IntrinsicElements {
      marquee: React.DetailedHTMLProps<
        React.HTMLAttributes<HTMLElement>,
        HTMLElement
      >;
    }
  }
}

declare module "next-auth" {
  interface User {
    id: string;
    name?: string | null;
    email?: string | null;
    userName?: string;
    password?: string;
    token?: string;
    success?: boolean;
    message?: string;
    officeName?: string;
    officeId?: number;
    branchName?: string | null;
  }

  interface Session {
    user: {
      id: string;
      name?: string | null;
      userName?: string;
      email?: string | null;
      officeId?: number;
      branchName?: string | null;
    };
    accessToken?: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    accessToken?: string;
    user?: {
      id: string;
      name?: string | null;
      userName?: string;
      email?: string | null;
      officeId?: number;
      branchName?: string | null;
    };
  }
}

export {};
