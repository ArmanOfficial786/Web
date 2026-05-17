// "use client";

// import * as React from "react";
// import {
//   ThemeProvider as MuiThemeProvider,
//   createTheme,
// } from "@mui/material/styles";
// import CssBaseline from "@mui/material/CssBaseline";

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
//       },
//     },
//     dark: {
//       palette: {
//         mode: "dark",
//         background: {
//           default: "##f8fafc", // slate-950
//           // slate-800
//         },
//         text: {
//           primary: "#ffffff",
//         },
//       },
//     },
//   },
//   components: {
//     MuiCssBaseline: {
//       styleOverrides: (theme) => ({
//         "html, body": {
//           margin: 0,
//           padding: 0,
//           minHeight: "100vh",
//           width: "100%",
//         },
//         html: {
//           ...(theme.palette.mode === "dark" && {
//             background:
//               "linear-gradient(to bottom right, #0f172a, #1e3a8a, #581c87) !important",
//             minHeight: "100vh",
//           }),
//           ...(theme.palette.mode === "light" && {
//             background: "#f8fafc !important",
//           }),
//         },
//         body: {
//           ...(theme.palette.mode === "dark" && {
//             background:
//               "linear-gradient(to bottom right,   #0f172a,  #1e3a8a,   #581c87 !important)",
//             color: "#ffffff",
//           }),
//           ...(theme.palette.mode === "light" && {
//             background: "#f8fafc !important",
//             color: "#000000",
//           }),
//         },
//         // body: {
//         //   ".light &, .light & *": {
//         //     color: "#000000 !important",
//         //   },
//         //   ".dark &, .dark & *": {
//         //     color: "#ffffff !important",
//         //     background:
//         //       "linear-gradient(to bottom right,   #0f172a,  #1e3a8a,   #581c87 !important)",
//         //   },
//         // },
//         // Add shadow and border to components in dark mode
//         ".dark nav, .dark aside, .dark .card, .dark [class*='paper']": {
//           boxShadow:
//             "0 10px 15px -3px rgba(0, 0, 0, 0.3), 0 4px 6px -2px rgba(0, 0, 0, 0.2)",
//           // border: "1px solid rgba(255, 255, 255, 0.1)",
//         },
//       }),
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
//       <CssBaseline />
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
import {
  bgcolor,
  display,
  fontSize,
  gap,
  justifyContent,
  minWidth,
} from "@mui/system";

const theme = createTheme({
  cssVariables: {
    colorSchemeSelector: "class",
  },
  colorSchemes: {
    light: {
      palette: {
        mode: "light",
        text: {
          primary: "#000000",
        },
        background: {
          default: "#f8fafc",
          paper: "#ffffff",
        },
      },
    },
    dark: {
      palette: {
        mode: "dark",
        text: {
          primary: "#ffffff",
        },
        background: {
          default: "#0f172a",
          paper: "rgba(30, 41, 59, 0.7)",
        },
      },
    },
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        "*": {
          margin: 0,
          padding: 0,
          boxSizing: "border-box",
        },
        html: {
          margin: 0,
          padding: 0,
          minHeight: "100vh",
          width: "100%",
          transition: "background 0.3s ease",
        },
        "html.dark": {
          background:
            "linear-gradient(to bottom right, #0f172a, #1e3a8a, #581c87) !important",
          backgroundAttachment: "fixed",
        },
        "html.light": {
          background: "#f8fafc !important",
        },

        // Global styles for Select/Dropdown height
        ".MuiSelect-select,.MuiInputBase-input": {
          padding: "0px 10px !important", // Adjust vertical padding
          minHeight: "30px !important",
          display: "flex !important",
          alignItems: "center !important",
          lineHeight: "1 !important", // Control line height
        },

        // Control font size globally
        ".MuiSelect-select, .MuiInputBase-input,.MuiFormControlLabel-label,.MuiButton-label, .MuiTypography-root,":
          {
            fontSize: "0.875rem !important", // 14px
            lineHeight: "1.43 !important",
          },
        ".MuiRadio-root,.MuiRadio-root svg": {
          fontSize: "0.875rem !important", // 14px
          display: "flex",
        },

        body: {
          margin: 0,
          padding: 0,
          minHeight: "100vh",
          width: "100%",
          background: "transparent !important",
        },
        "body.dark": {
          color: "#ffffff",
        },
        "body.light": {
          color: "#000000",
        },
        "#__next": {
          minHeight: "100vh",
          background: "transparent !important",
        },
        // Dark mode shadows and borders
        ".dark nav, .dark aside, .dark .card,.dark .MuiPaper-root ": {
          boxShadow:
            "0 10px 15px -3px rgba(0, 0, 0, 0.3), 0 4px 6px -2px rgba(0, 0, 0, 0.2)",
          border: "1px solid rgba(255, 255, 255, 0.1)",
          backdropFilter: "blur(10px)",
        },
        " .dark aside *, .dark button, .dark h1, .dark div, .dark .label, .dark .span, .dark .card,.dark .select,.dark ":
          {
            color: "#ffffff !important",
          },
        ".dark nav svg, .dark aside svg": {
          color: "#ffffff !important",
        },
        ".dark .MuiDialog-paper": {
          backgroundColor: "#1e1e1e !important",
          color: "#ffffff !important",
        },
        ".dark .MuiDialogTitle-root": {
          backgroundColor: "#1e1e1e !important",
          color: "#ffffff !important",
          borderBottom: "1px solid #333 !important",
        },
        ".dark .MuiDialogContent-root": {
          backgroundColor: "#1e1e1e !important",
          color: "#ffffff !important",
        },
        ".dark .MuiTableContainer-root .MuiPaper-root": {
          backgroundColor: "#1e1e1e !important",
          boxShadow: "none !important",
        },
        ".dark .MuiTableHead-root .MuiTableCell-root": {
          backgroundColor: "#1e3a5f !important",
          color: "#ffffff !important",
          borderBottom: "1px solid #333 !important",
        },
        ".dark .MuiTableBody-root .MuiTableRow-root .MuiTableCell-root": {
          borderBottom: "1px solid #333 !important",
          color: "#ffffff !important",
        },
        ".dark .MuiTableBody-root .MuiTableRow-root:nth-of-type(even) .MuiTableCell-root":
          {
            backgroundColor: "#2a2a2a !important",
          },
        ".dark .MuiTableBody-root .MuiTableRow-root:nth-of-type(odd) .MuiTableCell-root":
          {
            backgroundColor: "#1e1e1e !important",
          },
        ".dark .MuiTableBody-root .MuiTableRow-root:hover .MuiTableCell-root": {
          backgroundColor: "#3a3a3a !important",
        },
        ".dark .MuiTableRow-root.MuiTableRow-head + .MuiTableRow-root .MuiTableCell-root":
          {
            backgroundColor: "#252525 !important",
          },
        ".dark .MuiTableCell-root .MuiInputBase-root": {
          backgroundColor: "#2a2a2a !important",
          color: "#ffffff !important",
        },
        ".dark .MuiTableCell-root .MuiOutlinedInput-notchedOutline": {
          borderColor: "#555 !important",
        },
        ".dark .MuiChip-root": {
          backgroundColor: "#2c4a7a !important",
          color: "#ffffff !important",
        },
        ".dark .MuiChip-root .MuiChip-label": {
          color: "#ffffff !important",
        },
        ".dark .MuiPaginationItem-root": {
          color: "#ffffff !important",
        },
        ".dark .MuiPaginationItem-root.Mui-selected": {
          backgroundColor: "#2c4a7a !important",
          color: "#ffffff !important",
        },
        ".dark .MuiIconButton-root": {
          color: "#ffffff !important",
        },
        ".dark .MuiIconButton-root:hover": {
          backgroundColor: "#3a3a3a !important",
        },
        ".dark .MuiBox-root:has(> .MuiPagination-root)": {
          backgroundColor: "#2a2a2a !important",
        },
        ".dark .MuiBox-root:has(> .MuiTypography-caption)": {
          backgroundColor: "#2a2a2a !important",
        },
        ".dark .MuiBox-root:has(> .MuiTypography-caption) .MuiTypography-caption":
          {
            color: "#aaaaaa !important",
          },
        ".dark .MuiBox-root:has(> .MuiTypography-body2)": {
          backgroundColor: "#2a2a2a !important",
        },
        ".dark .MuiBox-root:has(> .MuiTypography-body2) .MuiTypography-body2": {
          color: "#ffffff !important",
        },
        // For the group-by hint bar
        ".dark .MuiBox-root:has(> .MuiTypography-caption) + .MuiBox-root": {
          backgroundColor: "#252525 !important",
          borderBottom: "1px solid #333 !important",
        },
        // For the "Select" button
        ".dark .MuiTableCell-root .MuiBox-root": {
          backgroundColor: "#2c6fad !important",
          "&:hover": {
            backgroundColor: "#1a5a96 !important",
          },
        },
        // For the sticky action cell background
        ".dark .MuiTableCell-root[style*='position: sticky']": {
          backgroundColor: "inherit !important",
        },
        ".dark .MuiTableBody-root .MuiTableRow-root .MuiTableCell-root[style*='position: sticky']":
          {
            backgroundColor: "inherit !important",
          },
        // Ensure table container borders are subtle
        ".dark .MuiTableContainer-root": {
          borderColor: "#333 !important",
        },
        // Light mode shadows
        ".light nav, .light aside, .light .card,": {
          boxShadow:
            "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
          border: "none",
        },
        ".light .MuiPaper-root": {
          backgroundColor: "#e0e0e0 !important", // gray.300 equivalent
          color: "#000000 !important",
        },
        ".light nav *, .light aside *, .light button, .light h1, .light div, .light .p, .light .span,.light .card,.dark .label,":
          {
            color: "#000000 !important",
          },
        ".light svg": {
          color: "#000000 !important",
        },
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
