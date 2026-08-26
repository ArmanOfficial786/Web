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
