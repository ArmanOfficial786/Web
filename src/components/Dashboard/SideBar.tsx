// // components/layout/Sidebar.tsx
// "use client";
// import React, {
//   useState,
//   useCallback,
//   useRef,
//   useEffect,
//   useMemo,
//   memo,
// } from "react";
// import { useRouter, usePathname } from "next/navigation";
// import {
//   Box,
//   Drawer,
//   List,
//   ListItemButton,
//   ListItemIcon,
//   ListItemText,
//   Collapse,
//   Tooltip,
// } from "@mui/material";
// import {
//   Dashboard as DashboardIcon,
//   Assignment as MasterIcon,
//   CreditCard as MemberIcon,
//   AccountBalanceWallet as MemberAcIcon,
//   AccountBalance as AccountIcon,
//   RequestQuote as LoanIcon,
//   PieChart as ShareIcon,
//   ExpandLess,
//   ExpandMore,
// } from "@mui/icons-material";
// import type { SvgIconComponent } from "@mui/icons-material";

// const NAVBAR_HEIGHT = 60; // keep in sync with Navbar AppBar height
// const DEFAULT_WIDTH = 280;
// const MIN_WIDTH = 72; // rail collapse point — below this, snaps to icon-only
// const MAX_WIDTH = 440;
// const COLLAPSE_SNAP_THRESHOLD = 110; // drag below this and release → snaps to MIN_WIDTH
// const DEFAULT_FOLDER_LABEL = "Reports"; // fallback when a route has no folder segment

// interface SidebarProps {
//   isOpen: boolean; // true = expanded, false = collapsed icon-only rail
// }

// // ── Data model ──────────────────────────────────────────────────────────
// interface LeafReport {
//   label: string;
//   route: string;
// }
// interface ParentWithReports {
//   type: "parent-reports";
//   icon: SvgIconComponent;
//   label: string;
//   reports: LeafReport[];
// }
// interface PlainLink {
//   type: "link";
//   icon: SvgIconComponent;
//   label: string;
//   route: string;
// }
// type MenuNode = PlainLink | ParentWithReports;

// const MENU: MenuNode[] = [
//   {
//     type: "link",
//     icon: DashboardIcon,
//     label: "Dashboard",
//     route: "/dashboard",
//   },
//   { type: "link", icon: MasterIcon, label: "Master", route: "/master" },

//   {
//     type: "parent-reports",
//     icon: MemberIcon,
//     label: "Member",
//     reports: [
//       { label: "Member ID Card", route: "/Member/reports/MemberIDCardDetail" },
//       {
//         label: "Member Registration",
//         route: "/Member/reports/MemberRegistrationReport",
//       },
//       {
//         label: "MemberAllDetailsReport",
//         route: "/Member/reports/MemberAllDetailsReport",
//       },
//       {
//         label: "MemberDetailSummaryReport",
//         route: "/Member/reports/MemberDetailSummaryReport",
//       },
//       {
//         label: "MemberBloodGroupReport",
//         route: "/Member/reports/MemberBloodGroupReport",
//       },
//       {
//         label: "MemberBasicDetailReport",
//         route: "/Member/reports/MemberBasicDetailReport",
//       },
//     ],
//   },

//   {
//     type: "parent-reports",
//     icon: MemberAcIcon,
//     label: "Member A/C",
//     reports: [
//       {
//         label: "DepositStatementReport",
//         route: "/MemberAc/SavingAcWiseReport/DepositStatementReport",
//       },
//       {
//         label: "SavingAcWiseBalanceReport",
//         route: "/MemberAc/SavingAcWiseReport/SavingAcWiseBalanceReport",
//       },
//       {
//         label: "SavingTypeWiseBalanceReport",
//         route: "/MemberAc/SavingAcWiseReport/SavingTypeWiseBalance",
//       },
//       {
//         label: "SavingTypeWiseIndividualBalance",
//         route: "/MemberAc/SavingAcWiseReport/SavingTypeWiseIndividualBalance",
//       },
//       {
//         label: "SMSCategoryReport",
//         route: "/MemberAc/SavingAcWiseReport/SMSCategoryReport",
//       },
//       {
//         label: "DepositeUnverifiedReport",
//         route: "/MemberAc/SavingAcWiseReport/DepositeUnverifiedReport",
//       },
//       {
//         label: "MemberAccountDeactiveReport",
//         route: "/MemberAc/SavingAcWiseReport/MemberAccountDeactiveReport",
//       },
//       {
//         label: "Active/Inactive Member List Report",
//         route: "/MemberAc/SavingAcWiseReport/MemberAccountDetailNoReport",
//       },
//       {
//         label: "DepositWithdrawMaximumAmountRangeReport",
//         route:
//           "/MemberAc/SavingAcWiseReport/DepositWithdrawMaximumAmountRangeReport",
//       },
//       {
//         label: "MemberPenaltyDepositWithdrawReport",
//         route:
//           "/MemberAc/SavingAcWiseReport/MemberPenaltyDepositWithdrawReport",
//       },
//       {
//         label: "MemberSummaryReport",
//         route: "/MemberAc/SavingAcWiseReport/MemberSummaryReport",
//       },
//       {
//         label: "MemberAccountDetailReport",
//         route: "/MemberAc/SavingAcWiseReport/MemberAccountDetailReport",
//       },
//     ],
//   },

//   {
//     type: "parent-reports",
//     icon: AccountIcon,
//     label: "Account",
//     reports: [
//       {
//         label: "AccountStatementReport",
//         route: "/Account/reports/AccountStatementReport",
//       },
//       {
//         label: "BalanceSheetReport",
//         route: "/Account/reports/BalanceSheetReport",
//       },
//       {
//         label: "ProfitLossAccountReport",
//         route: "/Account/reports/ProfitLossAccountReport",
//       },
//       {
//         label: "SummaryTrailBalanceReport",
//         route: "/Account/reports/SummaryTrailBalanceReport",
//       },
//       {
//         label: "CashFlowDetailsReport",
//         route: "/Account/reports/CashFlowDetailsReport",
//       },
//       {
//         label: "CostOfFundAnalysis Report",
//         route: "/Account/reports/CostOfFundAnalysisReport",
//       },
//       {
//         label: "Cash Day Book Report",
//         route: "/Account/reports/CashDayBookReport",
//       },
//       {
//         label: "DetailTrailBalanceReport",
//         route: "/Account/reports/DetailTrailBalanceReport",
//       },
//       {
//         label: "MonthlyReport",
//         route: "/Account/reports/MonthlyReport",
//       },
//       {
//         label: "RatioAnalysis Report",
//         route: "/Account/reports/RatioAnalysisReport",
//       },
//     ],
//   },

//   { type: "link", icon: LoanIcon, label: "Loan", route: "/loan" },
//   { type: "link", icon: ShareIcon, label: "Share", route: "/share" },
// ];

// // ── Dynamic folder derivation ────────────────────────────────────────────
// // A report route is expected to look like: /<Parent>/<Folder>/<ReportName>
// // The "folder" segment is derived directly from the route itself — never
// // hardcoded — so adding a brand-new sub-folder under any parent (e.g.
// // "/MemberAc/LoanAcWiseReport/...") is picked up automatically by both the
// // Sidebar's grouping and the Navbar's breadcrumb without touching this file.
// export function getFolderSegment(route: string): string {
//   const segments = route.split("/").filter(Boolean);
//   // Need at least 3 segments (Parent / Folder / Report) to have a folder.
//   if (segments.length < 3) return DEFAULT_FOLDER_LABEL;
//   const folder = segments[segments.length - 2];
//   if (!folder) return DEFAULT_FOLDER_LABEL;
//   // Capitalize only the first letter so "reports" → "Reports" while an
//   // already-PascalCase folder like "SavingAcWiseReport" stays untouched.
//   return folder.charAt(0).toUpperCase() + folder.slice(1);
// }

// interface FolderGroup {
//   folder: string;
//   reports: LeafReport[];
// }

// // Groups a parent's reports by their derived folder segment, preserving
// // first-seen order. A parent can therefore show 1..N folder groups —
// // no assumption is made that a parent has exactly one folder.
// function groupReportsByFolder(reports: LeafReport[]): FolderGroup[] {
//   const order: string[] = [];
//   const map = new Map<string, LeafReport[]>();
//   for (const r of reports) {
//     const folder = getFolderSegment(r.route);
//     if (!map.has(folder)) {
//       map.set(folder, []);
//       order.push(folder);
//     }
//     map.get(folder)!.push(r);
//   }
//   return order.map((folder) => ({ folder, reports: map.get(folder)! }));
// }

// // ── PlainMenuLink ────────────────────────────────────────────────────────
// const PlainMenuLink = memo(function PlainMenuLink({
//   icon: Icon,
//   label,
//   active,
//   collapsed,
//   onClick,
// }: {
//   icon: SvgIconComponent;
//   label: string;
//   active: boolean;
//   collapsed: boolean;
//   onClick: () => void;
// }) {
//   const button = (
//     <ListItemButton
//       onClick={onClick}
//       selected={active}
//       sx={{ mb: 0.5, justifyContent: collapsed ? "center" : "flex-start" }}
//     >
//       <ListItemIcon
//         sx={{
//           color: "inherit",
//           minWidth: collapsed ? 0 : 36,
//           justifyContent: "center",
//         }}
//       >
//         <Icon fontSize="small" />
//       </ListItemIcon>
//       {!collapsed && (
//         <ListItemText
//           slotProps={{
//             primary: { sx: { fontWeight: 500, fontSize: "0.875rem" } },
//           }}
//         >
//           {label}
//         </ListItemText>
//       )}
//     </ListItemButton>
//   );

//   return collapsed ? (
//     <Tooltip title={label} placement="right">
//       {button}
//     </Tooltip>
//   ) : (
//     button
//   );
// });

// // ── ReportsLeaf ──────────────────────────────────────────────────────────
// const ReportsLeaf = memo(function ReportsLeaf({
//   label,
//   active,
//   onClick,
// }: {
//   label: string;
//   active: boolean;
//   onClick: () => void;
// }) {
//   return (
//     <ListItemButton
//       onClick={onClick}
//       selected={active}
//       sx={{ mb: 0.5, py: 0.5, pl: 2 }}
//     >
//       <ListItemText
//         slotProps={{
//           primary: { sx: { fontWeight: 500, fontSize: "0.8125rem" } },
//         }}
//       >
//         {label}
//       </ListItemText>
//     </ListItemButton>
//   );
// });

// // ── ParentWithReportsItem ─────────────────────────────────────────────────
// const ParentWithReportsItem = memo(function ParentWithReportsItem({
//   item,
//   activeRoute,
//   collapsed,
//   isParentOpen,
//   openFolders,
//   onToggleParent,
//   onToggleFolder,
//   onNavigate,
// }: {
//   item: ParentWithReports;
//   activeRoute: string;
//   collapsed: boolean;
//   isParentOpen: boolean;
//   openFolders: Record<string, boolean>;
//   onToggleParent: () => void;
//   onToggleFolder: (folderKey: string) => void;
//   onNavigate: (route: string) => void;
// }) {
//   const ParentIcon = item.icon;
//   const anyLeafActive = item.reports.some((r) => activeRoute === r.route);
//   const folderGroups = useMemo(
//     () => groupReportsByFolder(item.reports),
//     [item.reports],
//   );

//   const parentRow = (
//     <ListItemButton
//       onClick={onToggleParent}
//       selected={anyLeafActive}
//       sx={{ mb: 0.5, justifyContent: collapsed ? "center" : "flex-start" }}
//     >
//       <ListItemIcon
//         sx={{
//           color: "inherit",
//           minWidth: collapsed ? 0 : 36,
//           justifyContent: "center",
//         }}
//       >
//         <ParentIcon fontSize="small" />
//       </ListItemIcon>
//       {!collapsed && (
//         <>
//           <ListItemText
//             slotProps={{
//               primary: { sx: { fontWeight: 500, fontSize: "0.875rem" } },
//             }}
//           >
//             {item.label}
//           </ListItemText>
//           {isParentOpen ? (
//             <ExpandLess fontSize="small" />
//           ) : (
//             <ExpandMore fontSize="small" />
//           )}
//         </>
//       )}
//     </ListItemButton>
//   );

//   return (
//     <Box>
//       {collapsed ? (
//         <Tooltip title={item.label} placement="right">
//           {parentRow}
//         </Tooltip>
//       ) : (
//         parentRow
//       )}

//       {!collapsed && (
//         <Collapse in={isParentOpen} timeout={150} unmountOnExit>
//           <Box sx={{ ml: 2 }}>
//             {folderGroups.map(({ folder, reports }) => {
//               const folderKey = `${item.label}::${folder}`;
//               const isFolderOpen = !!openFolders[folderKey];
//               const anyFolderLeafActive = reports.some(
//                 (r) => activeRoute === r.route,
//               );

//               return (
//                 <Box key={folderKey}>
//                   <ListItemButton
//                     onClick={() => onToggleFolder(folderKey)}
//                     selected={anyFolderLeafActive}
//                     sx={{ mb: 0.5, py: 0.75 }}
//                   >
//                     <ListItemText
//                       slotProps={{
//                         primary: {
//                           sx: { fontWeight: 500, fontSize: "0.875rem" },
//                         },
//                       }}
//                     >
//                       {folder}
//                     </ListItemText>
//                     {isFolderOpen ? (
//                       <ExpandLess fontSize="small" />
//                     ) : (
//                       <ExpandMore fontSize="small" />
//                     )}
//                   </ListItemButton>

//                   <Collapse in={isFolderOpen} timeout={150} unmountOnExit>
//                     <List component="div" disablePadding sx={{ ml: 1.5 }}>
//                       {reports.map((r) => (
//                         <ReportsLeaf
//                           key={r.route}
//                           label={r.label}
//                           active={activeRoute === r.route}
//                           onClick={() => onNavigate(r.route)}
//                         />
//                       ))}
//                     </List>
//                   </Collapse>
//                 </Box>
//               );
//             })}
//           </Box>
//         </Collapse>
//       )}
//     </Box>
//   );
// });

// // ── ResizeHandle ───────────────────────────────────────────────────────────
// // position: fixed and completely detached from the drawer paper's own box,
// // so it never inherits the paper's scroll/flow behavior. It tracks the
// // live `width` via `left` on every render — cheap since width only changes
// // during drag or on isOpen toggle.
// const ResizeHandle = memo(function ResizeHandle({
//   width,
//   onMouseDown,
//   isDragging,
// }: {
//   width: number;
//   onMouseDown: (e: React.MouseEvent) => void;
//   isDragging: boolean;
// }) {
//   return (
//     <Box
//       onMouseDown={onMouseDown}
//       sx={{
//         position: "fixed",
//         top: NAVBAR_HEIGHT,
//         left: width - 3,
//         width: 6,
//         height: `calc(100vh - ${NAVBAR_HEIGHT}px)`,
//         cursor: "col-resize",
//         zIndex: (t) => t.zIndex.drawer + 1,
//         "&:hover": { bgcolor: "primary.main", opacity: 0.4 },
//         ...(isDragging && { bgcolor: "primary.main", opacity: 0.5 }),
//       }}
//     />
//   );
// });

// // ── Sidebar ───────────────────────────────────────────────────────────────
// export default function Sidebar({ isOpen }: SidebarProps) {
//   const router = useRouter();
//   const pathname = usePathname();
//   const activeRoute = pathname ?? "";

//   const [openParents, setOpenParents] = useState<Record<string, boolean>>({});
//   // Keyed by `${parentLabel}::${folder}` — supports any number of folders
//   // per parent, unlike a single boolean-per-parent toggle.
//   const [openFolders, setOpenFolders] = useState<Record<string, boolean>>({});

//   // Draggable width — independent of (but reset by) the isOpen toggle.
//   const [dragWidth, setDragWidth] = useState(DEFAULT_WIDTH);
//   const [isDragging, setIsDragging] = useState(false);
//   const draggingRef = useRef(false);
//   const startXRef = useRef(0);
//   const startWidthRef = useRef(DEFAULT_WIDTH);

//   // isOpen=false forces the rail down to MIN_WIDTH regardless of drag state.
//   // isOpen=true restores whatever width the user last dragged to.
//   const width = isOpen ? dragWidth : MIN_WIDTH;
//   const collapsed = width <= MIN_WIDTH + 8; // icon-only rendering threshold

//   const handleMouseDown = useCallback(
//     (e: React.MouseEvent) => {
//       if (!isOpen) return; // don't allow drag while forced-collapsed
//       draggingRef.current = true;
//       startXRef.current = e.clientX;
//       startWidthRef.current = dragWidth;
//       setIsDragging(true);
//       e.preventDefault();
//     },
//     [dragWidth, isOpen],
//   );

//   useEffect(() => {
//     function onMouseMove(e: MouseEvent) {
//       if (!draggingRef.current) return;
//       const delta = e.clientX - startXRef.current;
//       const next = Math.min(
//         MAX_WIDTH,
//         Math.max(MIN_WIDTH, startWidthRef.current + delta),
//       );
//       setDragWidth(next);
//     }
//     function onMouseUp() {
//       if (!draggingRef.current) return;
//       draggingRef.current = false;
//       setIsDragging(false);
//       setDragWidth((w) => (w <= COLLAPSE_SNAP_THRESHOLD ? MIN_WIDTH : w));
//     }
//     window.addEventListener("mousemove", onMouseMove);
//     window.addEventListener("mouseup", onMouseUp);
//     return () => {
//       window.removeEventListener("mousemove", onMouseMove);
//       window.removeEventListener("mouseup", onMouseUp);
//     };
//   }, []);

//   const navigate = useCallback((r: string) => router.push(r), [router]);

//   const toggleParent = useCallback((label: string) => {
//     setOpenParents((prev) => ({ ...prev, [label]: !prev[label] }));
//   }, []);

//   const toggleFolder = useCallback((folderKey: string) => {
//     setOpenFolders((prev) => ({ ...prev, [folderKey]: !prev[folderKey] }));
//   }, []);

//   return (
//     <>
//       <Drawer
//         variant="persistent"
//         open
//         anchor="left"
//         sx={{
//           width,
//           flexShrink: 0,
//           whiteSpace: "nowrap",
//           transition: isDragging
//             ? "none"
//             : (t) =>
//                 t.transitions.create("width", {
//                   easing: t.transitions.easing.sharp,
//                   duration: 200,
//                 }),
//           "& .MuiDrawer-paper": {
//             width,
//             boxSizing: "border-box",
//             overflowX: "hidden",
//             overflowY: "auto",
//             // ── unchanged from the original: no `position` override here,
//             // so MUI's default fixed positioning for the persistent
//             // variant stays intact and this stays pinned regardless of
//             // how tall the menu list gets / whether it's scrolling.
//             top: NAVBAR_HEIGHT,
//             height: `calc(100vh - ${NAVBAR_HEIGHT}px)`,
//             transition: isDragging
//               ? "none"
//               : (t) =>
//                   t.transitions.create("width", {
//                     easing: t.transitions.easing.sharp,
//                     duration: 200,
//                   }),
//           },
//         }}
//       >
//         <List sx={{ mt: 1, px: collapsed ? 0.5 : 1.5 }}>
//           {MENU.map((item) => {
//             if (item.type === "link") {
//               return (
//                 <PlainMenuLink
//                   key={item.route}
//                   icon={item.icon}
//                   label={item.label}
//                   active={activeRoute === item.route}
//                   collapsed={collapsed}
//                   onClick={() => navigate(item.route)}
//                 />
//               );
//             }

//             return (
//               <ParentWithReportsItem
//                 key={item.label}
//                 item={item}
//                 activeRoute={activeRoute}
//                 collapsed={collapsed}
//                 isParentOpen={!!openParents[item.label]}
//                 openFolders={openFolders}
//                 onToggleParent={() => toggleParent(item.label)}
//                 onToggleFolder={toggleFolder}
//                 onNavigate={navigate}
//               />
//             );
//           })}
//         </List>
//       </Drawer>

//       {/* Rendered outside the Drawer so it's never affected by the
//           paper's own overflow/scroll box. */}
//       <ResizeHandle
//         width={width}
//         onMouseDown={handleMouseDown}
//         isDragging={isDragging}
//       />
//     </>
//   );
// }
// export { MENU };

// components/layout/Sidebar.tsx
"use client";
import React, { useState, useCallback, useRef, useEffect, memo } from "react";
import { useRouter, usePathname } from "next/navigation";
import {
  Box,
  Drawer,
  List,
  ListItemButton,
  ListItemText,
  Tooltip,
} from "@mui/material";
import type { SvgIconComponent } from "@mui/icons-material";
import { MENU } from "./SidebarMenu";
import { ParentWithReportsItem } from "./ParentWithReportsItem";

const NAVBAR_HEIGHT = 60; // keep in sync with Navbar AppBar height
const DEFAULT_WIDTH = 280;
const MIN_WIDTH = 72; // rail collapse point — below this, snaps to icon-only
const MAX_WIDTH = 440;
const COLLAPSE_SNAP_THRESHOLD = 110; // drag below this and release → snaps to MIN_WIDTH

interface SidebarProps {
  isOpen: boolean; // true = expanded, false = collapsed icon-only rail
}

// ── PlainMenuLink ────────────────────────────────────────────────────────
const PlainMenuLink = memo(function PlainMenuLink({
  icon: Icon,
  label,
  active,
  collapsed,
  onClick,
}: {
  icon: SvgIconComponent;
  label: string;
  active: boolean;
  collapsed: boolean;
  onClick: () => void;
}) {
  const button = (
    <ListItemButton
      onClick={onClick}
      selected={active}
      sx={{ mb: 0.5, justifyContent: collapsed ? "center" : "flex-start" }}
    >
      <Box
        sx={{
          color: "inherit",
          minWidth: collapsed ? 0 : 36,
          display: "flex",
          justifyContent: "center",
        }}
      >
        <Icon fontSize="small" />
      </Box>
      {!collapsed && (
        <ListItemText
          slotProps={{
            primary: { sx: { fontWeight: 500, fontSize: "0.875rem" } },
          }}
        >
          {label}
        </ListItemText>
      )}
    </ListItemButton>
  );

  return collapsed ? (
    <Tooltip title={label} placement="right">
      {button}
    </Tooltip>
  ) : (
    button
  );
});

// ── ResizeHandle ───────────────────────────────────────────────────────────
// position: fixed and completely detached from the drawer paper's own box,
// so it never inherits the paper's scroll/flow behavior. It tracks the
// live `width` via `left` on every render — cheap since width only changes
// during drag or on isOpen toggle.
const ResizeHandle = memo(function ResizeHandle({
  width,
  onMouseDown,
  isDragging,
}: {
  width: number;
  onMouseDown: (e: React.MouseEvent) => void;
  isDragging: boolean;
}) {
  return (
    <Box
      onMouseDown={onMouseDown}
      sx={{
        position: "fixed",
        top: NAVBAR_HEIGHT,
        left: width - 3,
        width: 6,
        height: `calc(100vh - ${NAVBAR_HEIGHT}px)`,
        cursor: "col-resize",
        zIndex: (t) => t.zIndex.drawer + 1,
        "&:hover": { bgcolor: "primary.main", opacity: 0.4 },
        ...(isDragging && { bgcolor: "primary.main", opacity: 0.5 }),
      }}
    />
  );
});

// ── Sidebar ───────────────────────────────────────────────────────────────
export default function Sidebar({ isOpen }: SidebarProps) {
  const router = useRouter();
  const pathname = usePathname();
  const activeRoute = pathname ?? "";

  const [openParents, setOpenParents] = useState<Record<string, boolean>>({});
  // Keyed by `${parentLabel}::${folder}` — supports any number of folders
  // per parent, unlike a single boolean-per-parent toggle.
  const [openFolders, setOpenFolders] = useState<Record<string, boolean>>({});

  // Draggable width — independent of (but reset by) the isOpen toggle.
  const [dragWidth, setDragWidth] = useState(DEFAULT_WIDTH);
  const [isDragging, setIsDragging] = useState(false);
  const draggingRef = useRef(false);
  const startXRef = useRef(0);
  const startWidthRef = useRef(DEFAULT_WIDTH);

  // isOpen=false forces the rail down to MIN_WIDTH regardless of drag state.
  // isOpen=true restores whatever width the user last dragged to.
  const width = isOpen ? dragWidth : MIN_WIDTH;
  const collapsed = width <= MIN_WIDTH + 8; // icon-only rendering threshold

  const handleMouseDown = useCallback(
    (e: React.MouseEvent) => {
      if (!isOpen) return; // don't allow drag while forced-collapsed
      draggingRef.current = true;
      startXRef.current = e.clientX;
      startWidthRef.current = dragWidth;
      setIsDragging(true);
      e.preventDefault();
    },
    [dragWidth, isOpen],
  );

  useEffect(() => {
    function onMouseMove(e: MouseEvent) {
      if (!draggingRef.current) return;
      const delta = e.clientX - startXRef.current;
      const next = Math.min(
        MAX_WIDTH,
        Math.max(MIN_WIDTH, startWidthRef.current + delta),
      );
      setDragWidth(next);
    }
    function onMouseUp() {
      if (!draggingRef.current) return;
      draggingRef.current = false;
      setIsDragging(false);
      setDragWidth((w) => (w <= COLLAPSE_SNAP_THRESHOLD ? MIN_WIDTH : w));
    }
    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseup", onMouseUp);
    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseup", onMouseUp);
    };
  }, []);

  const navigate = useCallback((r: string) => router.push(r), [router]);

  const toggleParent = useCallback((label: string) => {
    setOpenParents((prev) => ({ ...prev, [label]: !prev[label] }));
  }, []);

  const toggleFolder = useCallback((folderKey: string) => {
    setOpenFolders((prev) => ({ ...prev, [folderKey]: !prev[folderKey] }));
  }, []);

  return (
    <>
      <Drawer
        variant="persistent"
        open
        anchor="left"
        sx={{
          width,
          flexShrink: 0,
          whiteSpace: "nowrap",
          transition: isDragging
            ? "none"
            : (t) =>
                t.transitions.create("width", {
                  easing: t.transitions.easing.sharp,
                  duration: 200,
                }),
          "& .MuiDrawer-paper": {
            width,
            boxSizing: "border-box",
            overflowX: "hidden",
            overflowY: "auto",
            // ── unchanged from the original: no `position` override here,
            // so MUI's default fixed positioning for the persistent
            // variant stays intact and this stays pinned regardless of
            // how tall the menu list gets / whether it's scrolling.
            top: NAVBAR_HEIGHT,
            height: `calc(100vh - ${NAVBAR_HEIGHT}px)`,
            transition: isDragging
              ? "none"
              : (t) =>
                  t.transitions.create("width", {
                    easing: t.transitions.easing.sharp,
                    duration: 200,
                  }),
          },
        }}
      >
        <List sx={{ mt: 1, px: collapsed ? 0.5 : 1.5 }}>
          {MENU.map((item) => {
            if (item.type === "link") {
              return (
                <PlainMenuLink
                  key={item.route}
                  icon={item.icon}
                  label={item.label}
                  active={activeRoute === item.route}
                  collapsed={collapsed}
                  onClick={() => navigate(item.route)}
                />
              );
            }

            return (
              <ParentWithReportsItem
                key={item.label}
                item={item}
                activeRoute={activeRoute}
                collapsed={collapsed}
                isParentOpen={!!openParents[item.label]}
                openFolders={openFolders}
                onToggleParent={() => toggleParent(item.label)}
                onToggleFolder={toggleFolder}
                onNavigate={navigate}
              />
            );
          })}
        </List>
      </Drawer>

      {/* Rendered outside the Drawer so it's never affected by the
          paper's own overflow/scroll box. */}
      <ResizeHandle
        width={width}
        onMouseDown={handleMouseDown}
        isDragging={isDragging}
      />
    </>
  );
}
