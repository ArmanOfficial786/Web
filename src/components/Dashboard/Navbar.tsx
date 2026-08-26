"use client";

import React, { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useLanguage } from "@/contexts/LanguageContext";
import { useColorScheme } from "@mui/material/styles";
import { toast } from "react-toastify";
import {
  AppBar,
  Toolbar,
  IconButton,
  Typography,
  Box,
  Tooltip,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Breadcrumbs,
  Link,
  Button,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import NightsStayIcon from "@mui/icons-material/NightsStay";
import NightsStayOutlinedIcon from "@mui/icons-material/NightsStayOutlined";
import PersonIcon from "@mui/icons-material/Person";
import LogoutIcon from "@mui/icons-material/Logout";
import LanguageIcon from "@mui/icons-material/Language";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import { useLogout } from "@/components/hooks/useLogout";
import { getFolderSegment, MENU } from "./SidebarMenu";

interface NavBarProps {
  toggleSidebar: () => void;
}

// ── Helper to build breadcrumb from MENU ──────────────────────────────
function getBreadcrumbsFromMenu(
  pathname: string,
): Array<{ label: string; href?: string }> {
  // 1. Try to match a plain link
  for (const item of MENU) {
    if (item.type === "link" && pathname === item.route) {
      return [{ label: item.label, href: item.route }];
    }
  }

  // 2. Try to match a report leaf (inside a parent-reports node).
  //    The folder crumb is derived from the leaf's own route via
  //    getFolderSegment — no hardcoded parent/folder mapping, so any new
  //    folder added under any parent shows up automatically.
  for (const item of MENU) {
    if (item.type === "parent-reports") {
      for (const report of item.reports) {
        if (pathname === report.route) {
          return [
            { label: item.label }, // parent, non‑clickable
            { label: getFolderSegment(report.route) }, // folder, non-clickable
            { label: report.label, href: report.route }, // leaf, clickable
          ];
        }
      }
    }
  }

  // 3. Fallback: if route isn't in MENU, build from pathname segments
  const segments = pathname.split("/").filter(Boolean);
  if (segments.length === 0) {
    // root path "/" → just "Home"
    return [{ label: "Home" }];
  }
  const crumbs: Array<{ label: string; href?: string }> = [];
  let currentPath = "";
  for (const seg of segments) {
    currentPath += `/${seg}`;
    const label = seg
      .replace(/-/g, " ")
      .replace(/\b\w/g, (c) => c.toUpperCase());
    // Add href for all segments; the rendering will make the last one non‑clickable
    crumbs.push({ label, href: currentPath });
  }
  return crumbs;
}

const Navbar: React.FC<NavBarProps> = ({ toggleSidebar }) => {
  const router = useRouter();
  const pathname = usePathname();
  const { language, setLanguage, t } = useLanguage();
  const { mode, setMode } = useColorScheme();
  const [mounted, setMounted] = useState(false);
  const [langAnchor, setLangAnchor] = useState<null | HTMLElement>(null);
  const [userAnchor, setUserAnchor] = useState<null | HTMLElement>(null);
  const { logout, loggingOut } = useLogout();

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleLanguageChange = (lang: "en" | "np") => {
    setLanguage(lang);
    setLangAnchor(null);
  };

  const handleLogout = async () => {
    setUserAnchor(null);
    try {
      // Calls the backend /api/Auth/logout endpoint to release the
      // active-session lock, THEN clears the NextAuth client session.
      // Using plain signOut() here was the root cause of "CredentialsSignin"
      // failures on the next login attempt.
      await logout("/");
      toast.success("Logged out successfully");
    } catch (error) {
      console.error("Error during logout:", error);
    }
  };

  const toggleDarkMode = () => setMode(mode === "dark" ? "light" : "dark");

  const breadcrumbs = getBreadcrumbsFromMenu(pathname);

  if (!mounted) return null;

  return (
    <AppBar
      position="static"
      elevation={0}
      sx={{ height: 60, justifyContent: "center" }}
    >
      <Toolbar sx={{ justifyContent: "space-between", gap: 1, height: "100%" }}>
        {/* ── Left: Hamburger + Title ───────────────────────────────────── */}
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <Tooltip title="Toggle sidebar">
            <IconButton
              onClick={toggleSidebar}
              aria-label="Toggle sidebar"
              size="large"
            >
              <MenuIcon sx={{ fontSize: 32 }} />
            </IconButton>
          </Tooltip>
          <Typography
            variant="h6"
            noWrap
            sx={{ letterSpacing: 0, fontWeight: 700 }}
          >
            NexgenCosys Report
          </Typography>
        </Box>

        {/* ── Center: Breadcrumbs ───────────────────────────────────────── */}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            flexGrow: 1,
            mt: 5,
          }}
        >
          <Breadcrumbs separator="›" aria-label="breadcrumb">
            {breadcrumbs.map((crumb, idx) => {
              const isLast = idx === breadcrumbs.length - 1;
              // If href is present and not last → clickable link
              if (crumb.href && !isLast) {
                return (
                  <Link
                    key={crumb.href}
                    color="inherit"
                    href={crumb.href}
                    onClick={(e) => {
                      e.preventDefault();
                      router.push(crumb.href!);
                    }}
                    underline="hover"
                    sx={{ fontSize: "11px", cursor: "pointer" }}
                  >
                    {crumb.label}
                  </Link>
                );
              }
              // Otherwise (no href or last item) → plain text
              return (
                <Typography
                  key={idx}
                  color={isLast ? "text.primary" : "text.secondary"}
                  sx={{
                    fontWeight: isLast ? 500 : 400,
                    fontSize: "11px",
                  }}
                >
                  {crumb.label}
                </Typography>
              );
            })}
          </Breadcrumbs>
        </Box>

        {/* ── Right: Dark Mode + Language + User ───────────────────────── */}
        <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
          <Tooltip title={mode === "dark" ? "Light mode" : "Dark mode"}>
            <IconButton onClick={toggleDarkMode} aria-label="Toggle dark mode">
              {mode === "dark" ? (
                <NightsStayIcon />
              ) : (
                <NightsStayOutlinedIcon />
              )}
            </IconButton>
          </Tooltip>

          {/* Language Selector */}
          <Button
            onClick={(e) => setLangAnchor(e.currentTarget)}
            startIcon={<LanguageIcon />}
            endIcon={<KeyboardArrowDownIcon />}
            size="small"
            color="inherit"
            sx={{
              fontWeight: 600,
              fontSize: "0.875rem",
              textTransform: "none",
              px: 1.5,
              py: 0.75,
            }}
          >
            {language === "en" ? t("english") : t("nepali")}
          </Button>
          <Menu
            anchorEl={langAnchor}
            open={Boolean(langAnchor)}
            onClose={() => setLangAnchor(null)}
            anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
            transformOrigin={{ vertical: "top", horizontal: "right" }}
            slotProps={{
              paper: {
                elevation: 4,
                sx: { mt: 0.5, minWidth: 130, borderRadius: 1.5 },
              },
            }}
          >
            <MenuItem
              onClick={() => handleLanguageChange("en")}
              selected={language === "en"}
            >
              {t("english")}
            </MenuItem>
            <MenuItem
              onClick={() => handleLanguageChange("np")}
              selected={language === "np"}
            >
              {t("nepali")}
            </MenuItem>
          </Menu>

          {/* User Menu */}
          <Tooltip title="User menu">
            <IconButton
              onClick={(e) => setUserAnchor(e.currentTarget)}
              aria-label="User menu"
            >
              <PersonIcon sx={{ fontSize: 32 }} />
            </IconButton>
          </Tooltip>
          <Menu
            anchorEl={userAnchor}
            open={Boolean(userAnchor)}
            onClose={() => setUserAnchor(null)}
            anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
            transformOrigin={{ vertical: "top", horizontal: "right" }}
            slotProps={{
              paper: {
                elevation: 4,
                sx: { mt: 0.5, minWidth: 160, borderRadius: 1.5 },
              },
            }}
          >
            <MenuItem onClick={handleLogout} disabled={loggingOut}>
              <ListItemIcon>
                <LogoutIcon fontSize="small" />
              </ListItemIcon>
              <ListItemText>
                {loggingOut ? "Logging out..." : "Logout"}
              </ListItemText>
            </MenuItem>
          </Menu>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
