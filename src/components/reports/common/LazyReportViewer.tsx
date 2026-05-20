"use client";

import React, { useEffect, useRef, useState, useCallback, memo } from "react";
import Box from "@mui/material/Box";
import Skeleton from "@mui/material/Skeleton";
import ReportNavigation, {
  type ReportFormat,
} from "@/components/reportForm/Common/ReportNavigation";
import { type Pagination } from "types/api/api";
import { DefaultPagination } from "@/utilis/Constants/reportConstants";

// ── Props ─────────────────────────────────────────────────────────────────────
export interface LazyReportViewerProps {
  pdfData: string;
  pagination?: Pagination;
  onPageChange: (page: number) => void;
  onDownload: (format: ReportFormat) => void | Promise<void>;
}

// ── Skeleton shown by <Suspense fallback> ─────────────────────────────────────
export function ReportViewerSkeleton() {
  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 1, mt: 1 }}>
      <Skeleton variant="rectangular" height={48} sx={{ borderRadius: 1 }} />
      <Skeleton variant="rectangular" height={1000} sx={{ borderRadius: 1 }} />
      <Skeleton variant="rectangular" height={48} sx={{ borderRadius: 1 }} />
    </Box>
  );
}

// ── Iframe placeholder shown before intersection fires ────────────────────────
function IframePlaceholder() {
  return <Skeleton variant="rectangular" width="100%" height={1000} />;
}

// ── Main component ────────────────────────────────────────────────────────────
function LazyReportViewer({
  pdfData,
  pagination = DefaultPagination,
  onPageChange,
  onDownload,
}: LazyReportViewerProps) {
  const currentPage = pagination.currentPage ?? 1;
  const totalPages = pagination.totalPages ?? 1;

  // ── IntersectionObserver gate — iframe only mounts once visible ───────────
  const sentinelRef = useRef<HTMLDivElement>(null);
  const [iframeReady, setIframeReady] = useState(false);

  useEffect(() => {
    setIframeReady(false);

    const el = sentinelRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIframeReady(true);
          observer.disconnect();
        }
      },
      { rootMargin: "200px 0px", threshold: 0 },
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [pdfData]);

  const iframeSrc = `${pdfData}#page=${currentPage}&toolbar=0&zoom=100`;

  const handlePageChange = useCallback(
    (page: number) => onPageChange(page),
    [onPageChange],
  );

  return (
    <Box sx={{ display: "flex", flexDirection: "column" }}>
      {/* ── TOP NAVIGATION ───────────────────────────────────────────────── */}
      <ReportNavigation
        pdfData={pdfData}
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={handlePageChange}
        onDownload={onDownload}
      />

      {/* ── REPORT VIEWER ────────────────────────────────────────────────── */}
      <Box ref={sentinelRef} sx={{ width: "100%", overflow: "auto" }}>
        {iframeReady ? (
          <Box
            sx={{
              position: "relative",
              height: "1500px",
              overflow: "hidden",
            }}
          >
            <iframe
              key={currentPage}
              src={iframeSrc}
              title="Report Viewer"
              style={{
                position: "absolute",
                top: "-40px",
                left: 0,
                width: "100%",
                height: "calc(100% + 40px)",
                border: "none",
              }}
            />
          </Box>
        ) : (
          <IframePlaceholder />
        )}
      </Box>

      {/* ── BOTTOM NAVIGATION ────────────────────────────────────────────── */}
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
