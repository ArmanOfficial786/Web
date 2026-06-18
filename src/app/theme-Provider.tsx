// // "use client";

// // import * as React from "react";
// // import {
// //   ThemeProvider as MuiThemeProvider,
// //   createTheme,
// // } from "@mui/material/styles";
// // import CssBaseline from "@mui/material/CssBaseline";

// // const theme = createTheme({
// //   cssVariables: {
// //     colorSchemeSelector: "class",
// //   },
// //   colorSchemes: {
// //     light: {
// //       palette: {
// //         mode: "light",
// //         text: {
// //           primary: "#000000",
// //         },
// //       },
// //     },
// //     dark: {
// //       palette: {
// //         mode: "dark",
// //         background: {
// //           default: "##f8fafc", // slate-950
// //           // slate-800
// //         },
// //         text: {
// //           primary: "#ffffff",
// //         },
// //       },
// //     },
// //   },
// //   components: {
// //     MuiCssBaseline: {
// //       styleOverrides: (theme) => ({
// //         "html, body": {
// //           margin: 0,
// //           padding: 0,
// //           minHeight: "100vh",
// //           width: "100%",
// //         },
// //         html: {
// //           ...(theme.palette.mode === "dark" && {
// //             background:
// //               "linear-gradient(to bottom right, #0f172a, #1e3a8a, #581c87) !important",
// //             minHeight: "100vh",
// //           }),
// //           ...(theme.palette.mode === "light" && {
// //             background: "#f8fafc !important",
// //           }),
// //         },
// //         body: {
// //           ...(theme.palette.mode === "dark" && {
// //             background:
// //               "linear-gradient(to bottom right,   #0f172a,  #1e3a8a,   #581c87 !important)",
// //             color: "#ffffff",
// //           }),
// //           ...(theme.palette.mode === "light" && {
// //             background: "#f8fafc !important",
// //             color: "#000000",
// //           }),
// //         },
// //         // body: {
// //         //   ".light &, .light & *": {
// //         //     color: "#000000 !important",
// //         //   },
// //         //   ".dark &, .dark & *": {
// //         //     color: "#ffffff !important",
// //         //     background:
// //         //       "linear-gradient(to bottom right,   #0f172a,  #1e3a8a,   #581c87 !important)",
// //         //   },
// //         // },
// //         // Add shadow and border to components in dark mode
// //         ".dark nav, .dark aside, .dark .card, .dark [class*='paper']": {
// //           boxShadow:
// //             "0 10px 15px -3px rgba(0, 0, 0, 0.3), 0 4px 6px -2px rgba(0, 0, 0, 0.2)",
// //           // border: "1px solid rgba(255, 255, 255, 0.1)",
// //         },
// //       }),
// //     },
// //   },
// // });

// // export default function ThemeProvider({
// //   children,
// // }: {
// //   children: React.ReactNode;
// // }) {
// //   return (
// //     <MuiThemeProvider theme={theme} defaultMode="system">
// //       <CssBaseline />
// //       {children}
// //     </MuiThemeProvider>
// //   );
// // }

// "use client";

// import * as React from "react";
// import {
//   ThemeProvider as MuiThemeProvider,
//   createTheme,
// } from "@mui/material/styles";
// import CssBaseline from "@mui/material/CssBaseline";
// import {
//   bgcolor,
//   display,
//   fontSize,
//   gap,
//   justifyContent,
//   minWidth,
// } from "@mui/system";

// const theme = createTheme({
//   cssVariables: {
//     colorSchemeSelector: "class",
//   },
//   colorSchemes: {
//     light: {
//       palette: {
//         mode: "light",
//         text: {
//           primary: "#000000",
//         },
//         background: {
//           default: "#f8fafc",
//           paper: "#ffffff",
//         },
//       },
//     },
//     dark: {
//       palette: {
//         mode: "dark",
//         text: {
//           primary: "#ffffff",
//         },
//         background: {
//           default: "#0f172a",
//           paper: "rgba(30, 41, 59, 0.7)",
//         },
//       },
//     },
//   },
//   components: {
//     MuiCssBaseline: {
//       styleOverrides: {
//         "*": {
//           margin: 0,
//           padding: 0,
//           boxSizing: "border-box",
//         },
//         html: {
//           margin: 0,
//           padding: 0,
//           minHeight: "100vh",
//           width: "100%",
//           transition: "background 0.3s ease",
//         },
//         "html.dark": {
//           background:
//             "linear-gradient(to bottom right, #0f172a, #1e3a8a, #581c87) !important",
//           backgroundAttachment: "fixed",
//         },
//         "html.light": {
//           background: "#f8fafc !important",
//         },

//         // Global styles for Select/Dropdown height
//         ".MuiSelect-select,.MuiInputBase-input": {
//           padding: "0px 10px !important", // Adjust vertical padding
//           minHeight: "30px !important",
//           display: "flex !important",
//           alignItems: "center !important",
//           lineHeight: "1 !important", // Control line height
//         },

//         // Control font size globally
//         ".MuiSelect-select, .MuiInputBase-input,.MuiFormControlLabel-label,.MuiButton-label, .MuiTypography-root,":
//           {
//             fontSize: "0.875rem !important", // 14px
//             lineHeight: "1.43 !important",
//           },
//         ".MuiRadio-root,.MuiRadio-root svg": {
//           fontSize: "0.875rem !important", // 14px
//           display: "flex",
//         },

//         body: {
//           margin: 0,
//           padding: 0,
//           minHeight: "100vh",
//           width: "100%",
//           background: "transparent !important",
//         },
//         "body.dark": {
//           color: "#ffffff",
//         },
//         "body.light": {
//           color: "#000000",
//         },
//         "#__next": {
//           minHeight: "100vh",
//           background: "transparent !important",
//         },
//         // Dark mode shadows and borders
//         ".dark nav,.dark .AppBar, .dark aside, .dark .card,.dark .MuiPaper-root ":
//           {
//             boxShadow:
//               "0 10px 15px -3px rgba(0, 0, 0, 0.3), 0 4px 6px -2px rgba(0, 0, 0, 0.2)",
//             border: "1px solid rgba(255, 255, 255, 0.1)",
//             backdropFilter: "blur(10px)",
//           },
//         " .dark aside *, .dark button, .dark h1, .dark div, .dark .label, .dark .span, .dark .card,.dark .select,.dark ":
//           {
//             color: "#ffffff !important",
//           },
//         ".dark nav svg, .dark aside svg": {
//           color: "#ffffff !important",
//         },
//         ".dark .MuiDialog-paper": {
//           backgroundColor: "#1e1e1e !important",
//           color: "#ffffff !important",
//         },
//         ".dark .MuiDialogTitle-root": {
//           backgroundColor: "#1e1e1e !important",
//           color: "#ffffff !important",
//           borderBottom: "1px solid #333 !important",
//         },
//         ".dark .MuiDialogContent-root": {
//           backgroundColor: "#1e1e1e !important",
//           color: "#ffffff !important",
//         },
//         ".dark .MuiTableContainer-root .MuiPaper-root": {
//           backgroundColor: "#1e1e1e !important",
//           boxShadow: "none !important",
//         },
//         ".dark .MuiTableHead-root .MuiTableCell-root": {
//           backgroundColor: "#1e3a5f !important",
//           color: "#ffffff !important",
//           borderBottom: "1px solid #333 !important",
//         },
//         ".dark .MuiTableBody-root .MuiTableRow-root .MuiTableCell-root": {
//           borderBottom: "1px solid #333 !important",
//           color: "#ffffff !important",
//         },
//         ".dark .MuiTableBody-root .MuiTableRow-root:nth-of-type(even) .MuiTableCell-root":
//           {
//             backgroundColor: "#2a2a2a !important",
//           },
//         ".dark .MuiTableBody-root .MuiTableRow-root:nth-of-type(odd) .MuiTableCell-root":
//           {
//             backgroundColor: "#1e1e1e !important",
//           },
//         ".dark .MuiTableBody-root .MuiTableRow-root:hover .MuiTableCell-root": {
//           backgroundColor: "#3a3a3a !important",
//         },
//         ".dark .MuiTableRow-root.MuiTableRow-head + .MuiTableRow-root .MuiTableCell-root":
//           {
//             backgroundColor: "#252525 !important",
//           },
//         ".dark .MuiTableCell-root .MuiInputBase-root": {
//           backgroundColor: "#2a2a2a !important",
//           color: "#ffffff !important",
//         },
//         ".dark .MuiTableCell-root .MuiOutlinedInput-notchedOutline": {
//           borderColor: "#555 !important",
//         },
//         ".dark .MuiChip-root": {
//           backgroundColor: "#2c4a7a !important",
//           color: "#ffffff !important",
//         },
//         ".dark .MuiChip-root .MuiChip-label": {
//           color: "#ffffff !important",
//         },
//         ".dark .MuiPaginationItem-root": {
//           color: "#ffffff !important",
//         },
//         ".dark .MuiPaginationItem-root.Mui-selected": {
//           backgroundColor: "#2c4a7a !important",
//           color: "#ffffff !important",
//         },
//         ".dark .MuiIconButton-root": {
//           color: "#ffffff !important",
//         },
//         ".dark .MuiIconButton-root:hover": {
//           backgroundColor: "#3a3a3a !important",
//         },
//         ".dark .MuiBox-root:has(> .MuiPagination-root)": {
//           backgroundColor: "#2a2a2a !important",
//         },
//         ".dark .MuiBox-root:has(> .MuiTypography-caption)": {
//           backgroundColor: "#2a2a2a !important",
//         },
//         ".dark .MuiBox-root:has(> .MuiTypography-caption) .MuiTypography-caption":
//           {
//             color: "#aaaaaa !important",
//           },
//         ".dark .MuiBox-root:has(> .MuiTypography-body2)": {
//           backgroundColor: "#2a2a2a !important",
//         },
//         ".dark .MuiBox-root:has(> .MuiTypography-body2) .MuiTypography-body2": {
//           color: "#ffffff !important",
//         },
//         // For the group-by hint bar
//         ".dark .MuiBox-root:has(> .MuiTypography-caption) + .MuiBox-root": {
//           backgroundColor: "#252525 !important",
//           borderBottom: "1px solid #333 !important",
//         },
//         // For the "Select" button
//         ".dark .MuiTableCell-root .MuiBox-root": {
//           backgroundColor: "#2c6fad !important",
//           "&:hover": {
//             backgroundColor: "#1a5a96 !important",
//           },
//         },
//         // For the sticky action cell background
//         ".dark .MuiTableCell-root[style*='position: sticky']": {
//           backgroundColor: "inherit !important",
//         },
//         ".dark .MuiTableBody-root .MuiTableRow-root .MuiTableCell-root[style*='position: sticky']":
//           {
//             backgroundColor: "inherit !important",
//           },
//         // Ensure table container borders are subtle
//         ".dark .MuiTableContainer-root": {
//           borderColor: "#333 !important",
//         },
//         // Light mode shadows
//         ".light nav, .light aside, .light .card,.light .AppBar": {
//           boxShadow:
//             "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
//           border: "none",
//         },
//         ".light .MuiPaper-root": {
//           backgroundColor: "#e0e0e0 !important", // gray.300 equivalent
//           color: "#000000 !important",
//         },
//         ".light nav *, .light aside *, .light button, .light h1, .light div, .light .p, .light .span,.light .card,.dark .label,":
//           {
//             color: "#000000 !important",
//           },
//         ".light svg": {
//           color: "#000000 !important",
//         },
//       },
//     },
//   },
// });

// export default function ThemeProvider({
//   children,
// }: {
//   children: React.ReactNode;
// }) {
//   return (
//     <MuiThemeProvider theme={theme} defaultMode="system">
//       <CssBaseline enableColorScheme />
//       {children}
//     </MuiThemeProvider>
//   );
// }
"use client";

import * as React from "react";
import {
  ThemeProvider as MuiThemeProvider,
  createTheme,
} from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";

// ─── Augment the palette so custom tokens are typed ───────────────────────
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

// ─── Design tokens ───────────────────────────────────────────────────────
const LIGHT_BG = "#f8fafc";
const LIGHT_PAPER = "#ffffff";
const DARK_BG = "#0f172a";
const DARK_PAPER = "#1e293b";

const theme = createTheme({
  cssVariables: {
    colorSchemeSelector: "class", // puts .light / .dark on <html>
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
        // Custom tokens — single source of truth for chrome surfaces.
        // Add to BOTH colorSchemes.light and colorSchemes.dark so MUI
        // generates a CSS variable pair that flips with the html class.
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
    // ───────────────────────────────────────────────────────────────────
    // GLOBAL RULE FOR THIS FILE:
    // Inside every styleOverrides callback, color values MUST read from
    // `t.vars.palette.*` — never `t.palette.*`. With cssVariables +
    // colorSchemeSelector:"class", `t.palette.*` is resolved ONCE at
    // theme-creation time to the defaultColorScheme's value and is
    // permanently frozen — it will NOT change when .light/.dark toggles
    // on <html>. `t.vars.palette.*` emits var(--mui-palette-...), which
    // DOES update live because the variable's definition (not the rule
    // using it) swaps with the class.
    // The only safe non-vars read is `t.palette.mode`, which is a plain
    // string evaluated fresh each time styleOverrides runs — not a color.
    // ───────────────────────────────────────────────────────────────────

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

        // Page background driven by the scheme class — no palette colors
        // needed here, these are literal gradient/flat backgrounds, fine
        // to hardcode since they aren't reused MUI component tokens.
        "html.light": { background: LIGHT_BG },
        "html.dark": {
          background:
            "linear-gradient(135deg,#0f172a 0%,#1e3a8a 55%,#581c87 100%)",
          backgroundAttachment: "fixed",
        },

        // Generic input/typography sizing — no color logic, safe as-is.
        ".MuiSelect-select, .MuiInputBase-input": {
          padding: "0 10px",
          minHeight: "30px",
          display: "flex",
          alignItems: "center",
          lineHeight: 1,
        },
        ".MuiSelect-select, .MuiInputBase-input, .MuiFormControlLabel-label, .MuiTypography-root":
          {
            fontSize: "0.875rem",
            lineHeight: 1.43,
          },
        ".MuiRadio-root, .MuiRadio-root svg": {
          fontSize: "0.875rem",
          display: "flex",
        },
      }),
    },

    // ── AppBar ────────────────────────────────────────────────────────
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

    // ── Drawer (Sidebar) ──────────────────────────────────────────────
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

    // ── Generic Paper (menus, cards, dialogs inherit from this) ────────
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

    // ── Dialog ──────────────────────────────────────────────────────
    MuiDialogTitle: {
      styleOverrides: {
        root: ({ theme: t }) => ({
          borderBottom: `1px solid ${t.vars.palette.divider}`,
        }),
      },
    },

    // ── Table ───────────────────────────────────────────────────────
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

    // ── Chip ────────────────────────────────────────────────────────
    MuiChip: {
      styleOverrides: {
        root: ({ theme: t }) => ({
          ...(t.palette.mode === "dark" && {
            backgroundColor: "#2c4a7a",
            color: t.vars.palette.text.primary,
          }),
        }),
      },
    },

    // ── Pagination ──────────────────────────────────────────────────
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

    // ── IconButton ──────────────────────────────────────────────────
    // Fixes: hamburger / dark-mode toggle / user icon staying black.
    MuiIconButton: {
      styleOverrides: {
        root: ({ theme: t }) => ({
          color: t.vars.palette.text.primary,
          "&:hover": { backgroundColor: t.vars.palette.action.hover },
        }),
      },
    },

    // ── Button ──────────────────────────────────────────────────────
    MuiButton: {
      styleOverrides: {
        root: ({ theme: t }) => ({
          "&:hover": { backgroundColor: t.vars.palette.action.hover },
        }),
      },
    },

    // ── ListItemButton (Sidebar links) ─────────────────────────────
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

    // ── Menu / MenuItem (language + user dropdown) ─────────────────
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
