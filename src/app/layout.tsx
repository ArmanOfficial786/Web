// import type { Metadata } from "next";
// import { Inter } from "next/font/google";
// import "./globals.css";
// import { ToastContainer } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";
// import { LanguageProvider } from "@/contexts/LanguageContext";
// import Navbar from "@/components/Navbar";
// import ThemeProvider from "./theme-Provider";

// const inter = Inter({ subsets: ["latin"] });

// export const metadata: Metadata = {
//   title: "RDLC Report Viewer",
//   description:
//     "View and export RDLC Reports with pagination and download functionality",
// };

// export default function RootLayout({
//   children,
// }: {
//   children: React.ReactNode;
// }) {
//   return (
//     <html lang="en" suppressHydrationWarning >
//       <body className={inter.className} suppressHydrationWarning>
//         <ThemeProvider>
//           <ToastContainer
//             position="top-right"
//             autoClose={3000}
//             hideProgressBar={false}
//             newestOnTop={false}
//             closeOnClick
//             rtl={false}
//             pauseOnFocusLoss
//             draggable
//             pauseOnHover
//             theme="light"
//           />
//           <LanguageProvider>
//             {/* <Navbar /> */}
//             <main>{children}</main>
//           </LanguageProvider>
//         </ThemeProvider>
//       </body>
//     </html>
//   );
// }

import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
// import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { LanguageProvider } from "@/contexts/LanguageContext";
import ToastProvider from "@/utilis/ToastProvider";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "RDLC Report Viewer",
  description:
    "View and export RDLC Reports with pagination and download functionality",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning className="m-0 p-0">
      <body className={`${inter.className} m-0 p-0`} suppressHydrationWarning>
       {/* <ThemeProvider> */}
          {/* <ToastContainer
            position="top-right"
            autoClose={3000}
            hideProgressBar={false}
            newestOnTop={false}
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover

          /> */}
          <ToastProvider />
          <LanguageProvider>{children}</LanguageProvider>
       
      </body>
    </html>
  );
}
