

















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
