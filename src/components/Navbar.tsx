// "use client";

// import React, { useEffect, useState } from "react";
// import { useRouter, usePathname } from "next/navigation";
// import { useLanguage } from "@/contexts/LanguageContext";
// import NightsStayIcon from "@mui/icons-material/NightsStay";
// import NightsStayOutlinedIcon from "@mui/icons-material/NightsStayOutlined";
// import MenuIcon from "@mui/icons-material/Menu";
// import { useColorScheme } from "@mui/material/styles";

// interface NavBarProps {
//   toggleSidebar: () => void;
// }
// const Navbar: React.FC<NavBarProps> = ({ toggleSidebar }) => {
//   const router = useRouter();
//   const pathname = usePathname();
//   const { language, setLanguage, t } = useLanguage();
//   const [showLanguageMenu, setShowLanguageMenu] = useState(false);
//   const { mode, setMode } = useColorScheme();
//   const [mounted, setMounted] = useState(false);

//   useEffect(() => {
//     setMounted(true);
//   }, []);

//   const handleLanguageChange = (lang: "en" | "np") => {
//     setLanguage(lang);
//     setShowLanguageMenu(false);
//   };

//   const toggleDarkMode = () => {
//     setMode(mode === "dark" ? "light" : "dark");
//   };

//   if (!mounted) {
//     return null;
//   }

//   return (
//     <nav className=" w-screen h-[80px] flex justify-around items-center  shadow-lg ">
//       <span className="flex items-center gap-4">
//         <button
//           onClick={toggleSidebar}
//           className="p-2 rounded-md hover:bg-gray-200 dark:hover:bg-slate-700 transition-colors"
//           aria-label="Toggle sidebar"
//         >
//           <MenuIcon sx={{ fontSize: 35 }} />
//         </button>
//         <h1>RDLC Report</h1>
//       </span>
//       <div className="flex  items-center gap-3 ml-10 bg-amber-400"></div>
//       {/* Navigation Links */}
//       <div className="flex justify-between items-center gap-10 ">
//         <button
//           onClick={() => router.push("/")}
//           className={`px-3 py-2 rounded-md text-sm font-medium ${
//             pathname === "/" ? " text-gray-500" : "text-black hover:bg-gray-200"
//           }`}
//         >
//           {t("home")}
//         </button>
//         <button
//           onClick={() => router.push("/about")}
//           className={`px-3 py-2 rounded-md text-sm font-medium ${
//             pathname === "/about"
//               ? "text-gray-500"
//               : "text-black hover:bg-gray-200"
//           }`}
//         >
//           {t("about")}
//         </button>
//         <button
//           onClick={() => router.push("/member-report")}
//           className={`px-3 py-2 rounded-md text-sm font-medium ${
//             pathname === "/member-report"
//               ? " text-gray-500"
//               : "text-black hover:bg-gray-200"
//           }`}
//         >
//           {t("memberReport")}
//         </button>
//       </div>

//       {/* Language Selector */}
//       <div className="flex justify-between gap-5">
//         <button
//           onClick={toggleDarkMode}
//           className="p-2 rounded-md hover:bg-gray-200 transition-colors"
//           aria-label="Toggle dark mode"
//         >
//           {mode === "dark" ? (
//             <NightsStayIcon className="text-black" />
//           ) : (
//             <NightsStayOutlinedIcon className="text-black" />
//           )}
//         </button>
//         <button
//           onClick={() => setShowLanguageMenu(!showLanguageMenu)}
//           className="flex items-center px-3 py-2 rounded-md text-sm font-medium text-black hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-100 focus:ring-blue-500"
//         >
//           <svg
//             className="w-5 h-5 mr-2"
//             fill="none"
//             stroke="currentColor"
//             viewBox="0 0 24 24"
//           >
//             <path
//               strokeLinecap="round"
//               strokeLinejoin="round"
//               strokeWidth={2}
//               d="M3 5h12M9 3v2m1.048 9.5A18.22 18.22 0 0112 10.5c.806 0 1.588.084 2.352.25M21 12a9 9 0 01-9 9m0-18a9 9 0 019 9m-9-9v9m0 0l3-3m-3 3l-3-3"
//             />
//           </svg>
//           {language === "en" ? t("english") : t("nepali")}
//           <svg
//             className="w-4 h-4 ml-1"
//             fill="none"
//             stroke="currentColor"
//             viewBox="0 0 24 24"
//           >
//             <path
//               strokeLinecap="round"
//               strokeLinejoin="round"
//               strokeWidth={2}
//               d="M19 9l-7 7-7-7"
//             />
//           </svg>
//         </button>
//         {showLanguageMenu && (
//           <div className=" mt-2 w-32 bg-white rounded-md shadow-lg z-50">
//             <div className="py-1">
//               <button
//                 onClick={() => handleLanguageChange("en")}
//                 className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
//               >
//                 {t("english")}
//               </button>
//               <button
//                 onClick={() => handleLanguageChange("np")}
//                 className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
//               >
//                 {t("nepali")}
//               </button>
//             </div>
//           </div>
//         )}
//       </div>
//     </nav>
//   );
// };

// export default Navbar;
"use client";

import React, { useEffect, useState, useRef } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useLanguage } from "@/contexts/LanguageContext";
import NightsStayIcon from "@mui/icons-material/NightsStay";
import NightsStayOutlinedIcon from "@mui/icons-material/NightsStayOutlined";
import MenuIcon from "@mui/icons-material/Menu";
import { useColorScheme } from "@mui/material/styles";

interface NavBarProps {
  toggleSidebar: () => void;
}

const Navbar: React.FC<NavBarProps> = ({ toggleSidebar }) => {
  const router = useRouter();
  const pathname = usePathname();
  const { language, setLanguage, t } = useLanguage();
  const [showLanguageMenu, setShowLanguageMenu] = useState(false);
  const { mode, setMode } = useColorScheme();
  const [mounted, setMounted] = useState(false);
  const languageButtonRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        languageButtonRef.current &&
        !languageButtonRef.current.contains(event.target as Node)
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

  const handleLanguageChange = (lang: "en" | "np") => {
    setLanguage(lang);
    setShowLanguageMenu(false);
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
      <div className="flex items-center gap-3 ml-10 bg-amber-400"></div>

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
          {t("memberReport")}
        </button>
      </div>

      {/* Language Selector & Dark Mode */}
      <div className="flex justify-between gap-5 relative">
        <button
          onClick={toggleDarkMode}
          className="p-2 rounded-md "
          aria-label="Toggle dark mode"
        >
          {mode === "dark" ? (
            <NightsStayIcon className="text-black" />
          ) : (
            <NightsStayOutlinedIcon className="text-black" />
          )}
        </button>

        <div className="relative " ref={languageButtonRef}>
          <button
            onClick={() => setShowLanguageMenu(!showLanguageMenu)}
            className="flex items-center px-3 py-2 rounded-md text-sm font-medium "
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

          {showLanguageMenu && (
            <div className="card absolute top-full mt-2 right-0 w-32 z-[100] overflow-hidden rounded-md">
              <div className="py-1 ">
                <button
                  onClick={() => handleLanguageChange("en")}
                  className="block px-4 py-2 text-sm w-full text-left transition-colors hover:bg-gray-100 dark:hover:bg-slate-600"
                >
                  {t("english")}
                </button>
                <button
                  onClick={() => handleLanguageChange("np")}
                  className="block px-4 py-2 text-sm w-full text-left transition-colors hover:bg-gray-100 dark:hover:bg-slate-600"
                >
                  {t("nepali")}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
