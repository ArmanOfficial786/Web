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
        ".dark nav, .dark aside, .dark .card": {
          boxShadow:
            "0 10px 15px -3px rgba(0, 0, 0, 0.3), 0 4px 6px -2px rgba(0, 0, 0, 0.2)",
          border: "1px solid rgba(255, 255, 255, 0.1)",
          backdropFilter: "blur(10px)",
        },
        ".dark nav *, .dark aside *, .dark button, .dark h1, .dark div, .dark .label, .dark .span, .dark .card,.dark .select":
          {
            color: "#ffffff !important",
          },
        ".dark svg": {
          color: "#ffffff !important",
        },
        // Light mode shadows
        ".light nav, .light aside, .light .card": {
          boxShadow:
            "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
          border: "none",
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
