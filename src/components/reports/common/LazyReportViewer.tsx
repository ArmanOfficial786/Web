// "use client";

// import React, { useEffect, useRef, useState, useCallback, memo } from "react";
// import Box from "@mui/material/Box";
// import Skeleton from "@mui/material/Skeleton";
// import ReportNavigation, {
//   type ReportFormat,
// } from "@/components/reportForm/Common/ReportNavigation";
// import { type Pagination } from "types/api/api";
// import { DefaultPagination } from "@/utilis/Constants/reportConstants";

// // ── Props ─────────────────────────────────────────────────────────────────────
// export interface LazyReportViewerProps {
//   pdfData: string;
//   pagination?: Pagination;
//   onPageChange: (page: number) => void;
//   onDownload: (format: ReportFormat) => void | Promise<void>;
// }

// // ── Skeleton shown by <Suspense fallback> ─────────────────────────────────────
// export function ReportViewerSkeleton() {
//   return (
//     <Box sx={{ display: "flex", flexDirection: "column", gap: 1, mt: 1 }}>
//       <Skeleton variant="rectangular" height={48} sx={{ borderRadius: 1 }} />
//       <Skeleton variant="rectangular" height={1000} sx={{ borderRadius: 1 }} />
//       <Skeleton variant="rectangular" height={48} sx={{ borderRadius: 1 }} />
//     </Box>
//   );
// }

// // ── Iframe placeholder shown before intersection fires ────────────────────────
// function IframePlaceholder() {
//   return <Skeleton variant="rectangular" width="100%" height={1000} />;
// }

// // ── Main component ────────────────────────────────────────────────────────────
// function LazyReportViewer({
//   pdfData,
//   pagination = DefaultPagination,
//   onPageChange,
//   onDownload,
// }: LazyReportViewerProps) {
//   const currentPage = pagination.currentPage ?? 1;
//   const totalPages = pagination.totalPages ?? 1;

//   // ── IntersectionObserver gate — iframe only mounts once visible ───────────
//   const sentinelRef = useRef<HTMLDivElement>(null);
//   const [iframeReady, setIframeReady] = useState(false);

//   useEffect(() => {
//     setIframeReady(false);

//     const el = sentinelRef.current;
//     if (!el) return;

//     const observer = new IntersectionObserver(
//       ([entry]) => {
//         if (entry.isIntersecting) {
//           setIframeReady(true);
//           observer.disconnect();
//         }
//       },
//       { rootMargin: "200px 0px", threshold: 0 },
//     );

//     observer.observe(el);
//     return () => observer.disconnect();
//   }, [pdfData]);

//   const iframeSrc = `${pdfData}#page=${currentPage}&toolbar=0&zoom=100`;

//   const handlePageChange = useCallback(
//     (page: number) => onPageChange(page),
//     [onPageChange],
//   );

//   return (
//     <Box sx={{ display: "flex", flexDirection: "column" }}>
//       {/* ── TOP NAVIGATION ───────────────────────────────────────────────── */}
//       <ReportNavigation
//         pdfData={pdfData}
//         currentPage={currentPage}
//         totalPages={totalPages}
//         onPageChange={handlePageChange}
//         onDownload={onDownload}
//       />

//       {/* ── REPORT VIEWER ────────────────────────────────────────────────── */}
//       <Box ref={sentinelRef} sx={{ width: "100%", overflow: "auto" }}>
//         {iframeReady ? (
//           <Box
//             sx={{
//               position: "relative",
//               height: "1500px",
//               overflow: "hidden",
//             }}
//           >
//             <iframe
//               key={currentPage}
//               src={iframeSrc}
//               title="Report Viewer"
//               style={{
//                 position: "absolute",
//                 top: "-40px",
//                 left: 0,
//                 width: "100%",
//                 height: "calc(100% + 40px)",
//                 border: "none",
//               }}
//             />
//           </Box>
//         ) : (
//           <IframePlaceholder />
//         )}
//       </Box>

//       {/* ── BOTTOM NAVIGATION ────────────────────────────────────────────── */}
//       <ReportNavigation
//         pdfData={pdfData}
//         currentPage={currentPage}
//         totalPages={totalPages}
//         onPageChange={handlePageChange}
//         onDownload={onDownload}
//       />
//     </Box>
//   );
// }

// export default memo(LazyReportViewer);

// "use client";

// import React, { useEffect, useRef, useState, useCallback, memo } from "react";
// import Box from "@mui/material/Box";
// import Skeleton from "@mui/material/Skeleton";
// import ReportNavigation, {
//   type ReportFormat,
// } from "@/components/reportForm/Common/ReportNavigation";
// import { type Pagination } from "types/api/api";
// import { DefaultPagination } from "@/utilis/Constants/reportConstants";

// export interface LazyReportViewerProps {
//   /** Incremented by the parent only when a brand-new report is submitted.
//    *  Progressive PDF updates do NOT increment this, so the iframe never
//    *  unmounts / flickers while polling. */
//   reportKey: number;
//   pdfData: string;
//   pagination?: Pagination;
//   onPageChange: (page: number) => void;
//   onDownload: (format: ReportFormat) => void | Promise<void>;
// }

// export function ReportViewerSkeleton() {
//   return (
//     <Box sx={{ display: "flex", flexDirection: "column", gap: 1, mt: 1 }}>
//       <Skeleton variant="rectangular" height={48} sx={{ borderRadius: 1 }} />
//       <Skeleton variant="rectangular" height={1000} sx={{ borderRadius: 1 }} />
//       <Skeleton variant="rectangular" height={48} sx={{ borderRadius: 1 }} />
//     </Box>
//   );
// }

// function IframePlaceholder() {
//   return <Skeleton variant="rectangular" width="100%" height={1000} />;
// }

// function LazyReportViewer({
//   reportKey,
//   pdfData,
//   pagination = DefaultPagination,
//   onPageChange,
//   onDownload,
// }: LazyReportViewerProps) {
//   const currentPage = pagination.currentPage ?? 1;
//   const totalPages = pagination.totalPages ?? 1;

//   // ── iframeReady: gate that prevents the iframe from mounting until visible.
//   // It resets ONLY when reportKey changes (new report), NOT when pdfData
//   // changes (progressive merge update). This prevents the skeleton flash
//   // every time a new chunk is polled.
//   const [iframeReady, setIframeReady] = useState(false);
//   const sentinelRef = useRef<HTMLDivElement>(null);

//   useEffect(() => {
//     // New report submitted → reset the visibility gate and re-observe
//     setIframeReady(false);
//   }, [reportKey]); // ← reportKey only, NOT pdfData

//   useEffect(() => {
//     if (iframeReady) return; // already visible, nothing to do

//     const el = sentinelRef.current;
//     if (!el) return;

//     const observer = new IntersectionObserver(
//       ([entry]) => {
//         if (entry.isIntersecting) {
//           setIframeReady(true);
//           observer.disconnect();
//         }
//       },
//       { rootMargin: "200px 0px", threshold: 0 },
//     );

//     observer.observe(el);
//     return () => observer.disconnect();
//   }, [iframeReady]); // re-runs when iframeReady becomes false (i.e. after reset)

//   const iframeSrc = `${pdfData}#page=${currentPage}&toolbar=0&zoom=100`;

//   const handlePageChange = useCallback(
//     (page: number) => onPageChange(page),
//     [onPageChange],
//   );

//   return (
//     <Box sx={{ display: "flex", flexDirection: "column" }}>
//       {/* TOP navigation — always rendered; shows live totalPages as chunks merge */}
//       <ReportNavigation
//         pdfData={pdfData}
//         currentPage={currentPage}
//         totalPages={totalPages}
//         onPageChange={handlePageChange}
//         onDownload={onDownload}
//       />

//       {/* IFRAME — gated by intersection observer; not reset on progressive updates */}
//       <Box ref={sentinelRef} sx={{ width: "100%", overflow: "auto" }}>
//         {iframeReady ? (
//           <Box
//             sx={{ position: "relative", height: "1500px", overflow: "hidden" }}
//           >
//             <iframe
//               // key changes only when currentPage changes, not when pdfData updates
//               key={currentPage}
//               src={iframeSrc}
//               title="Report Viewer"
//               style={{
//                 position: "absolute",
//                 top: "-40px",
//                 left: 0,
//                 width: "100%",
//                 height: "calc(100% + 40px)",
//                 border: "none",
//               }}
//             />
//           </Box>
//         ) : (
//           <IframePlaceholder />
//         )}
//       </Box>

//       {/* BOTTOM navigation */}
//       <ReportNavigation
//         pdfData={pdfData}
//         currentPage={currentPage}
//         totalPages={totalPages}
//         onPageChange={handlePageChange}
//         onDownload={onDownload}
//       />
//     </Box>
//   );
// }

// export default memo(LazyReportViewer);

// File: components/reports/common/LazyReportViewer.tsx

"use client";

import React, { useEffect, useRef, useState, useCallback, memo } from "react";
import Box from "@mui/material/Box";
import Skeleton from "@mui/material/Skeleton";
import ReportNavigation, {
  type ReportFormat,
} from "@/components/reportForm/Common/ReportNavigation";
import { type Pagination } from "types/api/api";
import { DefaultPagination } from "@/utilis/Constants/reportConstants";
import ProgressivePdfViewer, {
  ProgressivePdfViewerHandle,
} from "@/components/reportForm/Common/ProgressivePdfViwer";

export interface LazyReportViewerProps {
  reportKey: number;
  pdfData: string;
  pagination?: Pagination;
  onPageChange: (page: number) => void;
  onDownload: (format: ReportFormat) => void | Promise<void>;
}

export function ReportViewerSkeleton() {
  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 1, mt: 1 }}>
      <Skeleton variant="rectangular" height={48} sx={{ borderRadius: 1 }} />
      <Skeleton variant="rectangular" height={1000} sx={{ borderRadius: 1 }} />
      <Skeleton variant="rectangular" height={48} sx={{ borderRadius: 1 }} />
    </Box>
  );
}

function LazyReportViewer({
  reportKey,
  pdfData,
  pagination = DefaultPagination,
  onPageChange,
  onDownload,
}: LazyReportViewerProps) {
  const currentPage = pagination.currentPage ?? 1;
  const totalPages = pagination.totalPages ?? 1;

  const [viewerReady, setViewerReady] = useState(false);
  const sentinelRef = useRef<HTMLDivElement>(null);
  const viewerRef = useRef<ProgressivePdfViewerHandle>(null);

  const prevPdfDataRef = useRef<string>(pdfData);
  const isInitialRenderRef = useRef(true);

  // Reset when new report is submitted
  useEffect(() => {
    setViewerReady(false);
    isInitialRenderRef.current = true;
  }, [reportKey]);

  // Intersection Observer for initial lazy loading
  useEffect(() => {
    if (viewerReady) return;

    const el = sentinelRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setViewerReady(true);
          observer.disconnect();
        }
      },
      { rootMargin: "200px 0px", threshold: 0 },
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [viewerReady, reportKey]);

  // 🔥 SILENT append when pdfData changes
  useEffect(() => {
    if (!viewerReady || !viewerRef.current) return;

    if (pdfData !== prevPdfDataRef.current) {
      // Don't update ref immediately - let the append complete first
      viewerRef.current.appendPages(pdfData).then(() => {
        prevPdfDataRef.current = pdfData;
      });
    }
  }, [pdfData, viewerReady]);

  // Scroll to current page
  useEffect(() => {
    if (viewerRef.current && currentPage > 0) {
      viewerRef.current.scrollToPage(currentPage);
    }
  }, [currentPage]);

  const handlePageChange = useCallback(
    (page: number) => onPageChange(page),
    [onPageChange],
  );

  return (
    <Box sx={{ display: "flex", flexDirection: "column" }}>
      {/* TOP navigation */}
      <ReportNavigation
        pdfData={pdfData}
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={handlePageChange}
        onDownload={onDownload}
      />

      {/* VIEWER - Only show skeleton on initial load, never during updates */}
      <Box
        ref={sentinelRef}
        sx={{
          width: "100%",
          height: "100vh",
          overflow: "hidden",
          position: "relative",
          backgroundColor: "#f5f5f5",
        }}
      >
        {viewerReady ? (
          <ProgressivePdfViewer
            ref={viewerRef}
            initialBlobUrl={pdfData}
            onPageChange={handlePageChange}
          />
        ) : (
          <Skeleton variant="rectangular" width="100%" height={1000} />
        )}
      </Box>

      {/* BOTTOM navigation */}
      <ReportNavigation
        pdfData={pdfData}
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={handlePageChange}
        onDownload={onDownload}
      />
    </Box>
  );
}

export default memo(LazyReportViewer);
