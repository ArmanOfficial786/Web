"use client";
import Sidebar from "@/components/SideBar";
import Dashboard from "@/components/Dashboard";

import React from "react";
import { useLanguage } from "@/contexts/LanguageContext";

export default function HomePage() {
  const { t } = useLanguage();
  return (
    <div className="flex h-screen bg-slate-900">{/* <Dashboard /> */}</div>
  );
}
