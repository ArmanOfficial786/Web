"use client";

import React, { useEffect, useState, useRef } from "react";
import { createPortal } from "react-dom";
import { useRouter, usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import { useLanguage } from "@/contexts/LanguageContext";
import NightsStayIcon from "@mui/icons-material/NightsStay";
import NightsStayOutlinedIcon from "@mui/icons-material/NightsStayOutlined";
import PersonIcon from "@mui/icons-material/Person";
import LogoutIcon from "@mui/icons-material/Logout";
import MenuIcon from "@mui/icons-material/Menu";
import { useColorScheme } from "@mui/material/styles";
import { toast } from "react-toastify";

interface NavBarProps {
  toggleSidebar: () => void;
}

const Navbar: React.FC<NavBarProps> = ({ toggleSidebar }) => {
  const router = useRouter();
  const pathname = usePathname();
  const { language, setLanguage, t } = useLanguage();
  const [showLanguageMenu, setShowLanguageMenu] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);

  const { mode, setMode } = useColorScheme();
  const [mounted, setMounted] = useState(false);
  const languageButtonRef = useRef<HTMLDivElement>(null);
  const languageMenuRef = useRef<HTMLDivElement>(null); // Added this
  const userButtonRef = useRef<HTMLDivElement>(null);
  const userMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Close language menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        languageButtonRef.current &&
        !languageButtonRef.current.contains(event.target as Node) &&
        languageMenuRef.current &&
        !languageMenuRef.current.contains(event.target as Node)
      ) {
        setShowLanguageMenu(false);
      }
    };

    if (showLanguageMenu) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showLanguageMenu]);

  // Close user menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        userButtonRef.current &&
        !userButtonRef.current.contains(event.target as Node) &&
        userMenuRef.current &&
        !userMenuRef.current.contains(event.target as Node)
      ) {
        setShowUserMenu(false);
      }
    };

    if (showUserMenu) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showUserMenu]);

  const handleLanguageChange = (lang: "en" | "np") => {
    setLanguage(lang);
    setShowLanguageMenu(false);
  };

  const handleLogout = async () => {
    try {
      // Sign out using NextAuth - it will automatically clear cookies and redirect
      await signOut({
        callbackUrl: "/", // Your login page is at root based on middleware
        redirect: true,
      });
      toast.success("Logged out successfully");
    } catch (error) {
      console.error("Error during logout:", error);
    }
  };
  const toggleDarkMode = () => {
    setMode(mode === "dark" ? "light" : "dark");
  };

  if (!mounted) {
    return null;
  }

  return (
    <nav className="w-screen h-[80px] flex justify-around items-center shadow-lg">
      <span className="flex items-center gap-4">
        <button
          onClick={toggleSidebar}
          className="p-2 rounded-md hover:bg-gray-200 dark:hover:bg-slate-700 transition-colors"
          aria-label="Toggle sidebar"
        >
          <MenuIcon sx={{ fontSize: 35 }} />
        </button>
        <h1>RDLC Report</h1>
      </span>
      <div className="flex items-center gap-3 ml-10"></div>

      {/* Navigation Links */}
      <div className="flex justify-between items-center gap-10">
        <button
          onClick={() => router.push("/")}
          className={`px-3 py-2 rounded-md text-sm font-medium ${
            pathname === "/" ? "text-gray-500" : "text-black hover:bg-gray-200"
          }`}
        >
          {t("home")}
        </button>
        <button
          onClick={() => router.push("/about")}
          className={`px-3 py-2 rounded-md text-sm font-medium ${
            pathname === "/about"
              ? "text-gray-500"
              : "text-black hover:bg-gray-200"
          }`}
        >
          {t("about")}
        </button>
        <button
          onClick={() => router.push("/member-report")}
          className={`px-3 py-2 rounded-md text-sm font-medium ${
            pathname === "/member-report"
              ? "text-gray-500"
              : "text-black hover:bg-gray-200"
          }`}
        >
          {t("Contact")}
        </button>
      </div>

      {/* Language Selector, Dark Mode & User Menu */}
      <div className="flex justify-between gap-5 relative">
        <button
          onClick={toggleDarkMode}
          className="p-2 rounded-md"
          aria-label="Toggle dark mode"
        >
          {mode === "dark" ? (
            <NightsStayIcon className="text-black" />
          ) : (
            <NightsStayOutlinedIcon className="text-black" />
          )}
        </button>

        {/* Language Selector */}
        <div className="relative" ref={languageButtonRef}>
          <button
            onClick={() => setShowLanguageMenu(!showLanguageMenu)}
            className="flex items-center  py-4 rounded-md text-sm font-semibold"
          >
            <svg
              className="w-5 h-5 mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 5h12M9 3v2m1.048 9.5A18.22 18.22 0 0112 10.5c.806 0 1.588.084 2.352.25M21 12a9 9 0 01-9 9m0-18a9 9 0 019 9m-9-9v9m0 0l3-3m-3 3l-3-3"
              />
            </svg>
            {language === "en" ? t("english") : t("nepali")}
            <svg
              className="w-4 h-4 ml-1"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </button>

          {showLanguageMenu &&
            typeof document !== "undefined" &&
            createPortal(
              <div
                ref={languageMenuRef}
                className="fixed z-[9999] w-32 overflow-hidden rounded-md shadow-xl border bg-white dark:bg-slate-800"
                style={{
                  top: languageButtonRef.current
                    ? `${languageButtonRef.current.getBoundingClientRect().bottom + 2}px`
                    : "0px",
                  right: languageButtonRef.current
                    ? `${window.innerWidth - languageButtonRef.current.getBoundingClientRect().right - 20}px`
                    : "0px",
                }}
              >
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    handleLanguageChange("en");
                  }}
                  className="block px-4 py-2 text-sm w-full text-left transition-colors hover:bg-gray-300 dark:hover:bg-slate-600"
                >
                  {t("english")}
                </button>
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    handleLanguageChange("np");
                  }}
                  className="block px-4 py-2 text-sm w-full text-left transition-colors hover:bg-gray-300 dark:hover:bg-slate-600"
                >
                  {t("nepali")}
                </button>
              </div>,
              document.body,
            )}
        </div>

        {/* User Menu */}
        <div className="relative" ref={userButtonRef}>
          <button
            onClick={() => setShowUserMenu(!showUserMenu)}
            className="p-2 rounded-md hover:bg-gray-200 dark:hover:bg-slate-700 transition-colors"
            aria-label="User menu"
          >
            <PersonIcon sx={{ fontSize: 32 }} />
          </button>

          {showUserMenu &&
            typeof document !== "undefined" &&
            createPortal(
              <div
                ref={userMenuRef}
                className="fixed z-[9999] w-40 overflow-hidden rounded-md shadow-xl border bg-white dark:bg-slate-800"
                style={{
                  top: userButtonRef.current
                    ? `${userButtonRef.current.getBoundingClientRect().bottom + 2}px`
                    : "0px",
                  right: userButtonRef.current
                    ? `${window.innerWidth - userButtonRef.current.getBoundingClientRect().right - 30}px`
                    : "0px",
                }}
              >
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    console.log("=== LOGOUT BUTTON CLICKED ===");
                    handleLogout();
                  }}
                  className="flex items-center gap-2 px-4 py-2 text-sm w-full text-left transition-colors hover:bg-gray-300 dark:hover:bg-slate-600"
                >
                  <LogoutIcon sx={{ fontSize: 18 }} />
                  Logout
                </button>
              </div>,
              document.body,
            )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
