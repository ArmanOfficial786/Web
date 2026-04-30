"use client";

import React from "react";
import LoginForm from "@/components/auth/Login";
import NavMarquee from "@/utilis/NavMarquee";

export default function HomePage() {
  return (
    <div className="w-full h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-purple-900">
      {/* Navbar at top */}
      <div className="fixed top-0 left-0 w-full z-50 ">
        <NavMarquee />
      </div>

      {/* Centered Login Form */}
      <div className="flex h-full items-center justify-center">
        <LoginForm />
      </div>
    </div>
  );
}
