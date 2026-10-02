










"use client";

import * as React from "react";
import {
  ThemeProvider as MuiThemeProvider,
  createTheme,
} from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";

declare module "@mui/material/styles" {
  interface Palette {
    appBar: {
      bg: string;
      border: string;
    };
    sidebar: {
      bg: string;
      border: string;
    };
  }
  interface PaletteOptions {
    appBar?: {
      bg: string;
      border: string;
    };
    sidebar?: {
      bg: string;
      border: string;
    };
  }
}

const LIGHT_BG = "#f8fafc";
const LIGHT_PAPER = "#ffffff";
const DARK_BG = "#0f172a";
const DARK_PAPER = "#1e293b";

const theme = createTheme({
  cssVariables: {
    colorSchemeSelector: "class",
  },
  defaultColorScheme: "light",

  shape: { borderRadius: 8 },

  colorSchemes: {
    light: {
      palette: {
        mode: "light",
        primary: { main: "#3b82f6", light: "#60a5fa" },
        text: { primary: "#111827", secondary: "#6b7280", disabled: "#9ca3af" },
        background: { default: LIGHT_BG, paper: LIGHT_PAPER },
        divider: "rgba(0,0,0,0.08)",
        action: {
          hover: "rgba(0,0,0,0.05)",
          selected: "rgba(59,130,246,0.08)",
          selectedOpacity: 0.08,
        },
        appBar: { bg: LIGHT_PAPER, border: "rgba(0,0,0,0.08)" },
        sidebar: { bg: LIGHT_PAPER, border: "rgba(0,0,0,0.08)" },
      },
    },
    dark: {
      palette: {
        mode: "dark",
        primary: { main: "#3b82f6", light: "#60a5fa" },
        text: { primary: "#f1f5f9", secondary: "#94a3b8", disabled: "#64748b" },
        background: { default: DARK_BG, paper: DARK_PAPER },
        divider: "rgba(255,255,255,0.08)",
        action: {
          hover: "rgba(255,255,255,0.08)",
          selected: "rgba(59,130,246,0.18)",
          selectedOpacity: 0.18,
        },
        appBar: { bg: "rgba(15,23,42,0.88)", border: "rgba(255,255,255,0.08)" },
        sidebar: {
          bg: "rgba(15,23,42,0.92)",
          border: "rgba(255,255,255,0.08)",
        },
      },
    },
  },

  components: {

    MuiCssBaseline: {
      styleOverrides: () => ({
        "*, *::before, *::after": { boxSizing: "border-box" },
        html: {
          margin: 0,
          padding: 0,
          minHeight: "100vh",
          width: "100%",
          transition: "background 0.3s ease",
        },
        body: {
          margin: 0,
          padding: 0,
          minHeight: "100vh",
          width: "100%",
          background: "transparent",
        },
        "#__next": { minHeight: "100vh", background: "transparent" },

        "html.light": { background: LIGHT_BG },
        "html.dark": {
          background:
            "linear-gradient(135deg,#0f172a 0%,#1e3a8a 55%,#581c87 100%)",
          backgroundAttachment: "fixed",
        },

        ".MuiSelect-select, .MuiInputBase-input": {
          padding: "3px 8px",
          minHeight: "10px",
        },
        ".MuiSelect-select, .MuiInputBase-input, .MuiFormControlLabel-label, .MuiTypography-root":
          {
            lineHeight: 0.5,
          },
        ".MuiRadio-root, .MuiRadio-root svg": {
          display: "flex",
        },
      }),
    },

    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          minHeight: "32px",
          "& .MuiInputBase-input": {
            padding: "4px 10px",
            minHeight: "1.2em",
            lineHeight: 1.2,
            fontSize: "0.75rem",
          },
          "&::placeholder": {
            fontSize: "0.65rem",
            opacity: 0.7,
          },
          "& .MuiSelect-select": {
            padding: "4px 10px !important",
            minHeight: "auto",
            lineHeight: "0.75rem",
          },
        },
      },
    },

    MuiAppBar: {
      styleOverrides: {
        root: ({ theme: t }) => ({
          backgroundImage: "none",
          backgroundColor: t.vars.palette.appBar.bg,
          color: t.vars.palette.text.primary,
          borderBottom: `1px solid ${t.vars.palette.appBar.border}`,
          boxShadow:
            t.palette.mode === "dark"
              ? "0 1px 0 rgba(255,255,255,0.07)"
              : "0 1px 4px rgba(0,0,0,0.07)",
          backdropFilter: t.palette.mode === "dark" ? "blur(12px)" : "none",
        }),
      },
    },

    MuiDrawer: {
      styleOverrides: {
        paper: ({ theme: t }) => ({
          backgroundColor: t.vars.palette.sidebar.bg,
          color: t.vars.palette.text.primary,
          borderRight: `1px solid ${t.vars.palette.sidebar.border}`,
          backdropFilter: t.palette.mode === "dark" ? "blur(12px)" : "none",
          boxShadow:
            t.palette.mode === "dark"
              ? "0 10px 15px -3px rgba(0,0,0,0.35), 0 4px 6px -2px rgba(0,0,0,0.2)"
              : "2px 0 8px rgba(0,0,0,0.06)",
        }),
      },
    },

    MuiPaper: {
      styleOverrides: {
        root: ({ theme: t }) => ({
          backgroundImage: "none",
          ...(t.palette.mode === "dark" && {
            border: `1px solid ${t.vars.palette.divider}`,
          }),
        }),
        elevation: ({ theme: t }) => ({
          ...(t.palette.mode === "dark" && {
            boxShadow:
              "0 10px 15px -3px rgba(0,0,0,0.35), 0 4px 6px -2px rgba(0,0,0,0.2)",
          }),
        }),
      },
    },

    MuiCheckbox: {
      styleOverrides: {
        root: {
          "& .MuiSvgIcon-root": {
            fontSize: "1rem",
          },
        },
      },
    },
    MuiRadio: {
      styleOverrides: {
        root: {
          padding: "4px",
          "& .MuiSvgIcon-root": {
            fontSize: "1.2rem",
          },
        },
      },
    },
    MuiFormControlLabel: {
      styleOverrides: {
        label: {
          fontSize: "0.8rem",
        },
      },
    },


    MuiDialogTitle: {
      styleOverrides: {
        root: ({ theme: t }) => ({
          borderBottom: `1px solid ${t.vars.palette.divider}`,
        }),
      },
    },

    MuiTableHead: {
      styleOverrides: {
        root: ({ theme: t }) => ({
          "& .MuiTableCell-root": {
            backgroundColor:
              t.palette.mode === "dark" ? "#1e3a5f" : t.vars.palette.grey[100],
            color: t.vars.palette.text.primary,
            fontWeight: 600,
            borderBottom: `1px solid ${t.vars.palette.divider}`,
          },
          "& .MuiTableCell-stickyHeader": {
            backgroundColor:
              t.palette.mode === "dark" ? "#1e3a5f" : t.vars.palette.grey[100],
          },
        }),
      },
    },
    MuiTableBody: {
      styleOverrides: {
        root: ({ theme: t }) => ({
          "& .MuiTableCell-root": {
            color: t.vars.palette.text.primary,
            borderBottom: `1px solid ${t.vars.palette.divider}`,
          },
          "& .MuiTableRow-root:nth-of-type(odd) .MuiTableCell-root": {
            backgroundColor:
              t.palette.mode === "dark" ? "#1e293b" : "transparent",
          },
          "& .MuiTableRow-root:nth-of-type(even) .MuiTableCell-root": {
            backgroundColor:
              t.palette.mode === "dark" ? "#243347" : t.vars.palette.grey[50],
          },
          "& .MuiTableRow-root:hover .MuiTableCell-root": {
            backgroundColor:
              t.palette.mode === "dark"
                ? "#2d3f55"
                : t.vars.palette.action.hover,
          },
        }),
      },
    },
    MuiTableContainer: {
      styleOverrides: {
        root: ({ theme: t }) => ({
          border: `1px solid ${t.vars.palette.divider}`,
        }),
      },
    },

    MuiChip: {
      styleOverrides: {
        root: ({ theme: t }) => ({
          ...(t.palette.mode === "dark" && {
            backgroundColor: "#2c4a8b",
            color: t.vars.palette.text.primary,
          }),
        }),
      },
    },

    MuiPaginationItem: {
      styleOverrides: {
        root: ({ theme: t }) => ({
          color: t.vars.palette.text.primary,
          "&.Mui-selected": {
            backgroundColor: t.vars.palette.action.selected,
            color: t.vars.palette.primary.main,
          },
        }),
      },
    },

    MuiIconButton: {
      styleOverrides: {
        root: ({ theme: t }) => ({
          color: t.vars.palette.text.primary,
          "&:hover": { backgroundColor: t.vars.palette.action.hover },
        }),
      },
    },

    MuiButton: {
      styleOverrides: {
        root: ({ theme: t }) => ({
          ...(t.palette.mode === "dark" && {
            "&:hover": { backgroundColor: t.vars.palette.action.hover },
          }),
        }),
      },
    },
    MuiListItemButton: {
      styleOverrides: {
        root: ({ theme: t }) => ({
          borderRadius: t.shape.borderRadius,
          color: t.vars.palette.text.secondary,
          "&:hover": { backgroundColor: t.vars.palette.action.hover },
          "&.Mui-selected": {
            backgroundColor: t.vars.palette.action.selected,
            color: t.vars.palette.primary.main,
            "&:hover": {
              backgroundColor: t.vars.palette.action.selected,
            },
          },
        }),
      },
    },

    MuiMenuItem: {
      styleOverrides: {
        root: ({ theme: t }) => ({
          color: t.vars.palette.text.primary,
          "&:hover": { backgroundColor: t.vars.palette.action.hover },
          "&.Mui-selected": {
            backgroundColor: t.vars.palette.action.selected,
            "&:hover": { backgroundColor: t.vars.palette.action.selected },
          },
        }),
      },
    },
  },
});

export default function ThemeProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <MuiThemeProvider theme={theme} defaultMode="system">
      <CssBaseline enableColorScheme />
      {children}
    </MuiThemeProvider>
  );
}
