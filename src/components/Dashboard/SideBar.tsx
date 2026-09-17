// // components/layout/Sidebar.tsx
// "use client";
// import React, { useState, useCallback, useRef, useEffect, memo } from "react";
// import { useRouter, usePathname } from "next/navigation";
// import {
//   Box,
//   Drawer,
//   List,
//   ListItemButton,
//   ListItemText,
//   Tooltip,
// } from "@mui/material";
// import type { SvgIconComponent } from "@mui/icons-material";
// import { MENU } from "./SidebarMenu";
// import { ParentWithReportsItem } from "./ParentWithReportsItem";

// const NAVBAR_HEIGHT = 60; // keep in sync with Navbar AppBar height
// const DEFAULT_WIDTH = 280;
// const MIN_WIDTH = 72; // rail collapse point — below this, snaps to icon-only
// const MAX_WIDTH = 440;
// const COLLAPSE_SNAP_THRESHOLD = 110; // drag below this and release → snaps to MIN_WIDTH

// interface SidebarProps {
//   isOpen: boolean; // true = expanded, false = collapsed icon-only rail
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
//       <Box
//         sx={{
//           color: "inherit",
//           minWidth: collapsed ? 0 : 36,
//           display: "flex",
//           justifyContent: "center",
//         }}
//       >
//         <Icon fontSize="small" />
//       </Box>
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

"use client";
import type { SvgIconComponent } from "@mui/icons-material";
import {
  Box,
  Drawer,
  List,
  ListItemButton,
  ListItemText,
  Tooltip,
} from "@mui/material";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React, { memo, useCallback, useEffect, useRef, useState } from "react";
import { ParentWithReportsItem } from "./ParentWithReportsItem";
import { MENU_TREE, NO_FOLDERS } from "./SidebarMenu";
import { usePrefetchOnIntent } from "./usePrefetchOnIntent";

const NAVBAR_HEIGHT = 60;
const DEFAULT_WIDTH = 280;
const MIN_WIDTH = 72;
const MAX_WIDTH = 440;
const COLLAPSE_SNAP_THRESHOLD = 110;

interface SidebarProps {
  isOpen: boolean;
}

// ── PlainMenuLink — real <Link>, prefetch on hover instead of on click ────
const PlainMenuLink = memo(function PlainMenuLink({
  icon: Icon,
  label,
  route,
  active,
  collapsed,
}: {
  icon: SvgIconComponent;
  label: string;
  route: string;
  active: boolean;
  collapsed: boolean;
}) {
  const prefetchProps = usePrefetchOnIntent(route);
  const button = (
    <ListItemButton
      component={Link}
      href={route}
      prefetch={false}
      {...prefetchProps}
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

export default function Sidebar({ isOpen }: SidebarProps) {
  const pathname = usePathname();
  const activeRoute = pathname ?? "";

  const [openParents, setOpenParents] = useState<Record<string, boolean>>({});
  const [openFolders, setOpenFolders] = useState<
    Record<string, Record<string, boolean>>
  >({});

  const [dragWidth, setDragWidth] = useState(DEFAULT_WIDTH);
  const [isDragging, setIsDragging] = useState(false);
  const draggingRef = useRef(false);
  const startXRef = useRef(0);
  const startWidthRef = useRef(DEFAULT_WIDTH);

  const width = isOpen ? dragWidth : MIN_WIDTH;
  const collapsed = width <= MIN_WIDTH + 8;

  const handleMouseDown = useCallback(
    (e: React.MouseEvent) => {
      if (!isOpen) return;
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
      setDragWidth(
        Math.min(MAX_WIDTH, Math.max(MIN_WIDTH, startWidthRef.current + delta)),
      );
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

  // Stable callbacks so ParentWithReportsItem's memo actually bails.
  const toggleParent = useCallback((label: string) => {
    setOpenParents((prev) => ({ ...prev, [label]: !prev[label] }));
  }, []);
  const toggleFolder = useCallback((folderKey: string) => {
    const sep = folderKey.indexOf("::");
    const parent = folderKey.slice(0, sep);
    const folder = folderKey.slice(sep + 2);
    setOpenFolders((prev) => {
      const current = prev[parent] ?? NO_FOLDERS;
      return { ...prev, [parent]: { ...current, [folder]: !current[folder] } };
    });
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
          {MENU_TREE.map((item) =>
            item.type === "link" ? (
              <PlainMenuLink
                key={item.route}
                icon={item.icon}
                label={item.label}
                route={item.route}
                active={activeRoute === item.route}
                collapsed={collapsed}
              />
            ) : (
              <ParentWithReportsItem
                key={item.label}
                item={item}
                activeRoute={activeRoute}
                collapsed={collapsed}
                isParentOpen={!!openParents[item.label]}
                foldersOpen={openFolders[item.label] ?? NO_FOLDERS}
                onToggleParent={toggleParent}
                onToggleFolder={toggleFolder}
              />
            ),
          )}
        </List>
      </Drawer>

      <ResizeHandle
        width={width}
        onMouseDown={handleMouseDown}
        isDragging={isDragging}
      />
    </>
  );
}
