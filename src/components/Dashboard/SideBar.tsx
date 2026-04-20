"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";

interface SidebarProps {
  isOpen: boolean;
}

interface MenuItem {
  icon: string;
  label: string;
  hasSubmenu?: boolean;
}

interface SubMenuItem {
  icon: string;
  label: string;
}

export default function Sidebar({ isOpen }: SidebarProps) {
  const router = useRouter();
  const [isReportOpen, setIsReportOpen] = useState(false);
  const [activeMenu, setActiveMenu] = useState("");
  const [activeSubmenu, setActiveSubmenu] = useState("");

  const menuItems: MenuItem[] = [
    { icon: "📊", label: "Dashboard" },
    { icon: "📋", label: "Master" },
    { icon: "💳", label: "Member" },
    { icon: "📡", label: "Member A/C" },
    { icon: "📡", label: "Report", hasSubmenu: true },
    { icon: "📡", label: "Account" },
    { icon: "📡", label: "Loan" },
    { icon: "📡", label: "Share" },
  ];

  const subMenuItemsReports: SubMenuItem[] = [
    { icon: "📊", label: "Student Report" },
    { icon: "📊", label: "Member Report" },
    { icon: "📊", label: "MemberID Card Detail " },
    { icon: "📊", label: "Account Statement Report" },
    { icon: "📊", label: "SavingAcWiseBalance Report" },
  ];

  const handleMenuClick = (label: string, hasSubmenu?: boolean) => {
    if (hasSubmenu) {
      setIsReportOpen(!isReportOpen);
      setActiveMenu(label);
      setActiveSubmenu("");
    } else {
      setActiveMenu(label);
      setActiveSubmenu("");
      setIsReportOpen(false);

      // Navigate based on menu label
      const routeMap: { [key: string]: string } = {
        Dashboard: "/dashboard",
        Master: "/master",
        Member: "/member",
        "Member A/C": "/member-ac",
        Account: "/account",
        Loan: "/loan",
        Share: "/share",
      };

      if (routeMap[label]) {
        router.push(routeMap[label]);
      }
    }
  };

  const handleSubmenuClick = (label: string) => {
    setActiveSubmenu(label);
    setActiveMenu("Report");

    // Navigate based on submenu label
    const submenuRouteMap: { [key: string]: string } = {
      "Student Report": "/reports/studentReport",
      "Member Report": "/reports/memberReport",
      "MemberID Card Detail ": "/reports/MemberIDCardDetail",
      "Account Statement Report": "/reports/AccountStatementReport",
      "SavingAcWiseBalance Report": "/reports/SavingAcWiseBalanceReport",
    };

    if (submenuRouteMap[label]) {
      router.push(submenuRouteMap[label]);
    }
  };

  return (
    <aside
      className={`h-screen shadow-lg flex flex-col justify-start transition-all duration-400 ease-in-out ${
        isOpen ? "w-[20rem]" : "w-0"
      } overflow-hidden`}
    >
      {/* Main Menu */}
      <div className="flex flex-col font-sans mt-5">
        {menuItems.map((item, index) => (
          <div key={index}>
            <div
              onClick={() => handleMenuClick(item.label, item.hasSubmenu)}
              className={`flex items-center justify-between gap-3 px-4 py-3 rounded-lg mb-2 cursor-pointer transition-all ${
                activeMenu === item.label && !activeSubmenu
                  ? "bg-blue-400 text-white rounded-lg h-[40px]"
                  : "text-gray-400 hover:bg-slate-500 h-[40px]"
              }`}
            >
              <div className="flex items-center gap-3">
                <span className="text-xl">{item.icon}</span>
                <span className="font-medium">{item.label}</span>
              </div>
              {item.hasSubmenu && (
                <span
                  className={`text-2xl transition-transform duration-200 ${
                    isReportOpen ? "rotate-90" : ""
                  }`}
                >
                  ›
                </span>
              )}
            </div>
            {/* Submenu */}
            {item.hasSubmenu && isReportOpen && (
              <div className="ml-8 mb-2">
                {subMenuItemsReports.map((subItem, subIndex) => (
                  <div
                    key={subIndex}
                    onClick={() => handleSubmenuClick(subItem.label)}
                    className={`flex items-center gap-3 px-4 py-2 rounded-lg mb-1 cursor-pointer transition-all ${
                      activeSubmenu === subItem.label
                        ? "bg-blue-400 text-white"
                        : "text-gray-400 hover:bg-slate-500"
                    }`}
                  >
                    <span className="text-sm">{subItem.icon}</span>
                    <span className="font-medium text-sm">{subItem.label}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </aside>
  );
}
