// "use client";
// import React, { useState } from "react";
// import { useRouter } from "next/navigation";

// interface SidebarProps {
//   isOpen: boolean;
// }

// interface MenuItem {
//   icon: string;
//   label: string;
//   hasSubmenu?: boolean;
// }

// interface SubMenuItem {
//   icon: string;
//   label: string;
// }

// export default function Sidebar({ isOpen }: SidebarProps) {
//   const router = useRouter();
//   const [isReportOpen, setIsReportOpen] = useState(false);
//   const [activeMenu, setActiveMenu] = useState("");
//   const [activeSubmenu, setActiveSubmenu] = useState("");

//   const menuItems: MenuItem[] = [
//     { icon: "📊", label: "Dashboard" },
//     { icon: "📋", label: "Master" },
//     { icon: "💳", label: "Member" },
//     { icon: "📡", label: "Member A/C" },
//     { icon: "📡", label: "Report", hasSubmenu: true },
//     { icon: "📡", label: "Account" },
//     { icon: "📡", label: "Loan" },
//     { icon: "📡", label: "Share" },
//   ];

//   const subMenuItemsReports: SubMenuItem[] = [
//     { icon: "📊", label: "Member Registration Report" },
//     { icon: "📊", label: "MemberID Card Detail " },
//     { icon: "📊", label: "Account Statement Report" },
//     { icon: "📊", label: "SavingAcWiseBalance Report" },
//   ];

//   const handleMenuClick = (label: string, hasSubmenu?: boolean) => {
//     if (hasSubmenu) {
//       setIsReportOpen(!isReportOpen);
//       setActiveMenu(label);
//       setActiveSubmenu("");
//     } else {
//       setActiveMenu(label);
//       setActiveSubmenu("");
//       setIsReportOpen(false);

//       // Navigate based on menu label
//       const routeMap: { [key: string]: string } = {
//         Dashboard: "/dashboard",
//         Master: "/master",
//         Member: "/member",
//         "Member A/C": "/member-ac",
//         Account: "/account",
//         Loan: "/loan",
//         Share: "/share",
//       };

//       if (routeMap[label]) {
//         router.push(routeMap[label]);
//       }
//     }
//   };

//   const handleSubmenuClick = (label: string) => {
//     setActiveSubmenu(label);
//     setActiveMenu("Report");

//     // Navigate based on submenu label
//     const submenuRouteMap: { [key: string]: string } = {
//       "Member Registration Report": "/reports/MemberRegistrationReport",
//       "MemberID Card Detail ": "/reports/MemberIDCardDetail",
//       "Account Statement Report": "/reports/AccountStatementReport",
//       "SavingAcWiseBalance Report": "/reports/SavingAcWiseBalanceReport",
//     };

//     if (submenuRouteMap[label]) {
//       router.push(submenuRouteMap[label]);
//     }
//   };

//   return (
//     <aside
//       className={`h-screen shadow-lg flex flex-col justify-start transition-all duration-400 ease-in-out ${
//         isOpen ? "w-[20rem]" : "w-0"
//       } overflow-hidden`}
//     >
//       {/* Main Menu */}
//       <div className="flex flex-col font-sans mt-5">
//         {menuItems.map((item, index) => (
//           <div key={index}>
//             <div
//               onClick={() => handleMenuClick(item.label, item.hasSubmenu)}
//               className={`flex items-center justify-between gap-3 px-4 py-3 rounded-lg mb-2 cursor-pointer transition-all ${
//                 activeMenu === item.label && !activeSubmenu
//                   ? "bg-blue-400 text-white rounded-lg h-[40px]"
//                   : "text-gray-400 hover:bg-slate-500 h-[40px]"
//               }`}
//             >
//               <div className="flex items-center gap-3">
//                 <span className="text-xl">{item.icon}</span>
//                 <span className="font-medium">{item.label}</span>
//               </div>
//               {item.hasSubmenu && (
//                 <span
//                   className={`text-2xl transition-transform duration-200 ${
//                     isReportOpen ? "rotate-90" : ""
//                   }`}
//                 >
//                   ›
//                 </span>
//               )}
//             </div>
//             {/* Submenu */}
//             {item.hasSubmenu && isReportOpen && (
//               <div className="ml-8 mb-2">
//                 {subMenuItemsReports.map((subItem, subIndex) => (
//                   <div
//                     key={subIndex}
//                     onClick={() => handleSubmenuClick(subItem.label)}
//                     className={`flex items-center gap-3 px-4 py-2 rounded-lg mb-1 cursor-pointer transition-all ${
//                       activeSubmenu === subItem.label
//                         ? "bg-blue-400 text-white"
//                         : "text-gray-400 hover:bg-slate-500"
//                     }`}
//                   >
//                     <span className="text-sm">{subItem.icon}</span>
//                     <span className="font-medium text-sm">{subItem.label}</span>
//                   </div>
//                 ))}
//               </div>
//             )}
//           </div>
//         ))}
//       </div>
//     </aside>
//   );
// }

"use client";
import React, { useState, useCallback, memo } from "react";
import { useRouter, usePathname } from "next/navigation";
import {
  Box,
  Drawer,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Collapse,
} from "@mui/material";
import {
  Dashboard as DashboardIcon,
  Assignment as MasterIcon,
  CreditCard as MemberIcon,
  AccountBalanceWallet as MemberAcIcon,
  AccountBalance as AccountIcon,
  RequestQuote as LoanIcon,
  PieChart as ShareIcon,
  AccountBalanceWallet as MemberAccountIcon,
  ExpandLess,
  ExpandMore,
} from "@mui/icons-material";
import type { SvgIconComponent } from "@mui/icons-material";

const NAVBAR_HEIGHT = 60; // keep in sync with Navbar AppBar height
const DRAWER_WIDTH = 280;

interface SidebarProps {
  isOpen: boolean;
}

// ── Data model ──────────────────────────────────────────────────────────
// Plain links (no nested reports) vs. parents-with-reports (icon only on
// the parent row; "Reports" sub-row and leaf links render with no icon).
interface LeafReport {
  label: string;
  route: string;
}
interface ParentWithReports {
  type: "parent-reports";
  icon: SvgIconComponent;
  label: string;
  reports: LeafReport[];
}
interface PlainLink {
  type: "link";
  icon: SvgIconComponent;
  label: string;
  route: string;
}
type MenuNode = PlainLink | ParentWithReports;

// ── ROUTE NOTES ───────────────────────────────────────────────────────
const MENU: MenuNode[] = [
  {
    type: "link",
    icon: DashboardIcon,
    label: "Dashboard",
    route: "/dashboard",
  },
  { type: "link", icon: MasterIcon, label: "Master", route: "/master" },

  {
    type: "parent-reports",
    icon: MemberIcon,
    label: "Member",
    reports: [
      { label: "Member ID Card", route: "/Member/reports/MemberIDCardDetail" },
      {
        label: "Member Registration",
        route: "/Member/reports/MemberRegistrationReport",
      },

      { label: "MemberAllDetails", route: "/Member/reports/MemberAllDetail" },
    ],
  },

  // ⚠️ PLACEHOLDER — replace label/route below with the real Member A/C
  // report once you confirm its exact folder path (e.g.
  // /MemberAC/reports/<LeafFolderName> or /member-ac/reports/...).
  {
    type: "parent-reports",
    icon: MemberAcIcon,
    label: "Member A/C",
    reports: [
      {
        label: "SavingAcWiseBalanceReport",
        route: "/MemberAc/reports/SavingAcWiseBalanceReport",
      },
    ],
  },

  {
    type: "parent-reports",
    icon: MemberAccountIcon,
    label: "Member Account",
    reports: [
      {
        label: "Account Statement",
        route: "/MemberAccount/reports/AccountStatement",
      },
    ],
  },

  {
    type: "parent-reports",
    icon: AccountIcon,
    label: "Account",
    reports: [
      {
        label: "AccountStatementReport",
        route: "/Account/reports/AccountStatementReport",
      },
    ],
  },

  { type: "link", icon: LoanIcon, label: "Loan", route: "/loan" },
  { type: "link", icon: ShareIcon, label: "Share", route: "/share" },
];

// ── PlainMenuLink ────────────────────────────────────────────────────────
// Top-level link with icon. Color/hover/selected all come from the
// theme's MuiListItemButton styleOverrides — no mode branching here.
const PlainMenuLink = memo(function PlainMenuLink({
  icon: Icon,
  label,
  active,
  onClick,
}: {
  icon: SvgIconComponent;
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <ListItemButton onClick={onClick} selected={active} sx={{ mb: 0.5 }}>
      <ListItemIcon sx={{ color: "inherit", minWidth: 36 }}>
        <Icon fontSize="small" />
      </ListItemIcon>
      <ListItemText
        primaryTypographyProps={{ fontWeight: 500, fontSize: "0.875rem" }}
      >
        {label}
      </ListItemText>
    </ListItemButton>
  );
});

// ── ReportsLeaf ──────────────────────────────────────────────────────────
// No icon at all — just indented text, per the new design.
const ReportsLeaf = memo(function ReportsLeaf({
  label,
  active,
  onClick,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <ListItemButton
      onClick={onClick}
      selected={active}
      sx={{ mb: 0.5, py: 0.5, pl: 2 }}
    >
      <ListItemText
        primaryTypographyProps={{ fontWeight: 500, fontSize: "0.8125rem" }}
      >
        {label}
      </ListItemText>
    </ListItemButton>
  );
});

// ── ParentWithReportsItem ─────────────────────────────────────────────────
// Top-level row KEEPS its icon (e.g. "Member"). It expands to reveal a
// single inner "Reports" row — this label is intentionally the literal
// string "Reports", matching the actual `reports` folder on disk
// (e.g. Member/reports/MemberIDCardDetail) — NOT a repeat of the parent
// label. The "Reports" row has no icon, and expanding it reveals the
// icon-less leaf report links.
const ParentWithReportsItem = memo(function ParentWithReportsItem({
  item,
  activeRoute,
  isParentOpen,
  isReportsOpen,
  onToggleParent,
  onToggleReports,
  onNavigate,
}: {
  item: ParentWithReports;
  activeRoute: string;
  isParentOpen: boolean;
  isReportsOpen: boolean;
  onToggleParent: () => void;
  onToggleReports: () => void;
  onNavigate: (route: string) => void;
}) {
  const ParentIcon = item.icon;
  const anyLeafActive = item.reports.some((r) => activeRoute === r.route);

  return (
    <Box>
      {/* Parent row — icon, e.g. "Member" / "Member Account" / "Account" */}
      <ListItemButton
        onClick={onToggleParent}
        selected={anyLeafActive}
        sx={{ mb: 0.5 }}
      >
        <ListItemIcon sx={{ color: "inherit", minWidth: 36 }}>
          <ParentIcon fontSize="small" />
        </ListItemIcon>
        <ListItemText
          primaryTypographyProps={{ fontWeight: 500, fontSize: "0.875rem" }}
        >
          {item.label}
        </ListItemText>
        {isParentOpen ? (
          <ExpandLess fontSize="small" />
        ) : (
          <ExpandMore fontSize="small" />
        )}
      </ListItemButton>

      <Collapse in={isParentOpen} timeout={150} unmountOnExit>
        <Box sx={{ ml: 2 }}>
          {/* Inner "Reports" row — literal folder name, NO icon */}
          <ListItemButton
            onClick={onToggleReports}
            selected={anyLeafActive}
            sx={{ mb: 0.5, py: 0.75 }}
          >
            <ListItemText
              primaryTypographyProps={{ fontWeight: 500, fontSize: "0.875rem" }}
            >
              Reports
            </ListItemText>
            {isReportsOpen ? (
              <ExpandLess fontSize="small" />
            ) : (
              <ExpandMore fontSize="small" />
            )}
          </ListItemButton>

          <Collapse in={isReportsOpen} timeout={150} unmountOnExit>
            <List component="div" disablePadding sx={{ ml: 1.5 }}>
              {item.reports.map((r) => (
                <ReportsLeaf
                  key={r.route}
                  label={r.label}
                  active={activeRoute === r.route}
                  onClick={() => onNavigate(r.route)}
                />
              ))}
            </List>
          </Collapse>
        </Box>
      </Collapse>
    </Box>
  );
});

// ── Sidebar ───────────────────────────────────────────────────────────────
export default function Sidebar({ isOpen }: SidebarProps) {
  const router = useRouter();
  const pathname = usePathname();
  const activeRoute = pathname ?? "";

  // Track open/closed per parent label, and per inner-reports label,
  // independently — so expanding "Member" doesn't affect "Account", etc.
  const [openParents, setOpenParents] = useState<Record<string, boolean>>({});
  const [openReports, setOpenReports] = useState<Record<string, boolean>>({});

  const navigate = useCallback((r: string) => router.push(r), [router]);

  const toggleParent = useCallback((label: string) => {
    setOpenParents((prev) => ({ ...prev, [label]: !prev[label] }));
  }, []);

  const toggleReports = useCallback((label: string) => {
    setOpenReports((prev) => ({ ...prev, [label]: !prev[label] }));
  }, []);

  return (
    <Drawer
      variant="persistent"
      open={isOpen}
      anchor="left"
      sx={{
        width: isOpen ? DRAWER_WIDTH : 0,
        flexShrink: 0,
        transition: (t) => t.transitions.create("width", { duration: 300 }),
        "& .MuiDrawer-paper": {
          width: DRAWER_WIDTH,
          boxSizing: "border-box",
          overflowX: "hidden",
          // bgcolor/border/shadow are set globally by ThemeProvider's
          // MuiDrawer styleOverrides — do not hardcode colors here.
          top: NAVBAR_HEIGHT,
          height: `calc(100vh - ${NAVBAR_HEIGHT}px)`,
        },
      }}
    >
      <List sx={{ mt: 1, px: 1.5 }}>
        {MENU.map((item) => {
          if (item.type === "link") {
            return (
              <PlainMenuLink
                key={item.route}
                icon={item.icon}
                label={item.label}
                active={activeRoute === item.route}
                onClick={() => navigate(item.route)}
              />
            );
          }

          // type === "parent-reports"
          return (
            <ParentWithReportsItem
              key={item.label}
              item={item}
              activeRoute={activeRoute}
              isParentOpen={!!openParents[item.label]}
              isReportsOpen={!!openReports[item.label]}
              onToggleParent={() => toggleParent(item.label)}
              onToggleReports={() => toggleReports(item.label)}
              onNavigate={navigate}
            />
          );
        })}
      </List>
    </Drawer>
  );
}
export { MENU };
