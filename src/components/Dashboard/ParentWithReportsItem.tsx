// // components/layout/ParentWithReportsItem.tsx
// "use client";
// import React, { useMemo, memo } from "react";
// import {
//   Box,
//   List,
//   ListItemButton,
//   ListItemText,
//   Collapse,
//   Tooltip,
// } from "@mui/material";
// import { ExpandLess, ExpandMore } from "@mui/icons-material";
// import type { LeafReport, ParentWithReports } from "./SidebarMenu";
// import { getFolderSegment } from "./SidebarMenu";

// // ── ReportsLeaf ──────────────────────────────────────────────────────────
// // Only ever rendered inside ParentWithReportsItem, so it lives here rather
// // than in the data file or Sidebar.tsx.
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

// // ── ParentWithReportsItem ─────────────────────────────────────────────────
// export const ParentWithReportsItem = memo(function ParentWithReportsItem({
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
//       <Box
//         sx={{
//           color: "inherit",
//           minWidth: collapsed ? 0 : 36,
//           display: "flex",
//           justifyContent: "center",
//         }}
//       >
//         <ParentIcon fontSize="small" />
//       </Box>
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

"use client";
import { ExpandLess, ExpandMore } from "@mui/icons-material";
import {
  Box,
  Collapse,
  List,
  ListItemButton,
  ListItemText,
  Tooltip,
} from "@mui/material";
import Link from "next/link";
import { memo } from "react";
import type { ParentItem } from "./SidebarMenu";
import { usePrefetchOnIntent } from "./usePrefetchOnIntent";

const ReportsLeaf = memo(function ReportsLeaf({
  label,
  route,
  active,
}: {
  label: string;
  route: string;
  active: boolean;
}) {
  const prefetchProps = usePrefetchOnIntent(route);
  return (
    <ListItemButton
      component={Link}
      href={route}
      prefetch={false}
      {...prefetchProps}
      selected={active}
      sx={{ mb: 0.5, py: 0.5, pl: 2 }}
    >
      <ListItemText
        slotProps={{
          primary: { sx: { fontWeight: 500, fontSize: "0.8125rem" } },
        }}
      >
        {label}
      </ListItemText>
    </ListItemButton>
  );
});

export const ParentWithReportsItem = memo(function ParentWithReportsItem({
  item,
  activeRoute,
  collapsed,
  isParentOpen,
  foldersOpen,
  onToggleParent,
  onToggleFolder,
}: {
  item: ParentItem;
  activeRoute: string;
  collapsed: boolean;
  isParentOpen: boolean;
  foldersOpen: Readonly<Record<string, boolean>>;
  onToggleParent: (label: string) => void;
  onToggleFolder: (folderKey: string) => void;
}) {
  const ParentIcon = item.icon;
  const anyLeafActive = item.folders.some((g) =>
    g.reports.some((r) => activeRoute === r.route),
  );

  const parentRow = (
    <ListItemButton
      onClick={() => onToggleParent(item.label)}
      selected={anyLeafActive}
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
        <ParentIcon fontSize="small" />
      </Box>
      {!collapsed && (
        <>
          <ListItemText
            slotProps={{
              primary: { sx: { fontWeight: 500, fontSize: "0.875rem" } },
            }}
          >
            {item.label}
          </ListItemText>
          {isParentOpen ? (
            <ExpandLess fontSize="small" />
          ) : (
            <ExpandMore fontSize="small" />
          )}
        </>
      )}
    </ListItemButton>
  );

  return (
    <Box>
      {collapsed ? (
        <Tooltip title={item.label} placement="right">
          {parentRow}
        </Tooltip>
      ) : (
        parentRow
      )}

      {!collapsed && (
        <Collapse in={isParentOpen} timeout={150} unmountOnExit>
          <Box sx={{ ml: 2 }}>
            {item.folders.map(({ folder, key, reports }) => {
              const isFolderOpen = !!foldersOpen[folder];
              const anyFolderLeafActive = reports.some(
                (r) => activeRoute === r.route,
              );

              return (
                <Box key={key}>
                  <ListItemButton
                    onClick={() => onToggleFolder(key)}
                    selected={anyFolderLeafActive}
                    sx={{ mb: 0.5, py: 0.75 }}
                  >
                    <ListItemText
                      slotProps={{
                        primary: {
                          sx: { fontWeight: 500, fontSize: "0.875rem" },
                        },
                      }}
                    >
                      {folder}
                    </ListItemText>
                    {isFolderOpen ? (
                      <ExpandLess fontSize="small" />
                    ) : (
                      <ExpandMore fontSize="small" />
                    )}
                  </ListItemButton>

                  <Collapse in={isFolderOpen} timeout={150} unmountOnExit>
                    <List component="div" disablePadding sx={{ ml: 1.5 }}>
                      {reports.map((r) => (
                        <ReportsLeaf
                          key={r.route}
                          label={r.label}
                          route={r.route}
                          active={activeRoute === r.route}
                        />
                      ))}
                    </List>
                  </Collapse>
                </Box>
              );
            })}
          </Box>
        </Collapse>
      )}
    </Box>
  );
});
