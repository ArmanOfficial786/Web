"use client";

import React, { useState } from "react";
import Navbar from "@/components/Dashboard/Navbar";
import Sidebar from "@/components/Dashboard/SideBar";
import ThemeProvider from "@/app/theme-Provider";
import ToastProvider from "@/utilis/ToastProvider";
import { ReportFormProvider } from "@/contexts/ReportFormContext";
import Box from "@mui/material/Box";

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
    <ThemeProvider>
      <ToastProvider />
      <ReportFormProvider>
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            height: "100vh",
            width: "100vw",
            overflow: "hidden",
            margin: 0,
            padding: 0,
          }}
        >
          {/* Navbar - Top (Full Width) */}
          <Navbar toggleSidebar={toggleSidebar} />

          {/* Content Area Below Navbar */}
          <Box
            sx={{
              display: "flex",
              flex: 1,
              overflow: "hidden",
              width: "100%",
            }}
          >
            {/* Sidebar - Left */}
            <Sidebar isOpen={sidebarOpen} />

            {/* Main Content - Right */}
            <Box
              component="main"
              sx={{
                flex: 1,
                overflowY: "auto",
                padding: 2,
              }}
            >
              {children}
            </Box>
          </Box>
        </Box>
      </ReportFormProvider>
    </ThemeProvider>
  );
}



