"use client";

import React, { useState } from "react";
import Navbar from "@/components/Navbar";
import Sidebar from "@/components/SideBar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };
  return (
    <div className="flex flex-col h-screen w-screen overflow-hidden m-0 p-0">
      {/* Navbar - Top (Full Width) */}
      <Navbar toggleSidebar={toggleSidebar} />

      {/* Content Area Below Navbar */}
      <div className="flex flex-1 overflow-hidden w-full">
        {/* Sidebar - Left */}
        <Sidebar isOpen={sidebarOpen} />

        {/* Main Content - Right */}
        <main className="flex-1 overflow-y-auto p-2">{children}</main>
      </div>
    </div>
  );
}
