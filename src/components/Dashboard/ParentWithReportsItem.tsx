









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
